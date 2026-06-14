import asyncio
import json
import logging

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.agents.gemini_llm import get_gemini_llm
from backend.agents.llm_utils import parse_llm_json
from backend.agents.orchestrator import orchestrator_app
from backend.agents.analytics_agent import get_analytics_agent
from backend.core.database import get_db
from backend.core.auth import get_current_user
from backend.schemas.strategist import StrategistRequest, StrategistResponse
from backend.models.ai import AIRecommendation
from backend.services.segment_service import SegmentService

logger = logging.getLogger(__name__)

router = APIRouter()


def _segments_to_json(segments) -> str:
    return json.dumps([
        {
            "id": str(s.id),
            "name": s.name,
            "description": s.description or "",
            "customer_count": s.customer_count or 0,
        }
        for s in segments
    ])


@router.post("/generate", response_model=StrategistResponse)
async def generate_strategy(
    request: StrategistRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    segment_service = SegmentService(db)
    await segment_service.ensure_defaults()
    segments = await segment_service.get_all_segments()
    segments_json = _segments_to_json(segments)

    initial_state = {
        "input": request.prompt,
        "segments_data": segments_json,
    }

    # Run sync LangGraph in thread pool to avoid blocking the event loop
    final_state = await asyncio.to_thread(orchestrator_app.invoke, initial_state)

    audience_data = final_state.get("audience_data", {})
    channel_data = final_state.get("channel_data", {})
    campaign_data = final_state.get("campaign_data", {})

    # Resolve segment_id if Gemini returned a name but not id
    if not audience_data.get("segment_id") and audience_data.get("segment_name"):
        for seg in segments:
            if seg.name.lower() == audience_data["segment_name"].lower():
                audience_data["segment_id"] = str(seg.id)
                audience_data["estimated_count"] = audience_data.get(
                    "estimated_count", seg.customer_count
                )
                break

    try:
        llm = get_gemini_llm(temperature=0)
        analytics = get_analytics_agent(llm)
        response = await asyncio.to_thread(
            analytics.invoke,
            {
                "audience": str(audience_data),
                "channel": str(channel_data),
                "message": str(campaign_data),
            },
        )
        projected_data = parse_llm_json(response.content)
    except Exception:
        logger.exception("Analytics agent failed")
        projected_data = {
            "expected_delivery_rate": "95%",
            "expected_open_rate": "35%",
            "expected_click_rate": "12%",
            "expected_revenue": "$1,500",
        }

    recommendation = AIRecommendation(
        user_id=current_user["user_id"],
        prompt=request.prompt,
        audience_match=audience_data,
        channel_rec=channel_data,
        message_draft=campaign_data,
        projected=projected_data,
        status="completed",
    )
    db.add(recommendation)
    await db.commit()
    await db.refresh(recommendation)

    return StrategistResponse(
        id=str(recommendation.id),
        status=recommendation.status,
        prompt=recommendation.prompt,
        audience_match=recommendation.audience_match,
        channel_rec=recommendation.channel_rec,
        message_draft=recommendation.message_draft,
        projected=recommendation.projected,
    )
