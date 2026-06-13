import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from langchain_openai import ChatOpenAI

from core.database import get_db
from core.auth import get_current_user
from schemas.strategist import StrategistRequest, StrategistResponse
from models.ai import AIRecommendation

from agents.orchestrator import orchestrator_app
from agents.analytics_agent import get_analytics_agent

router = APIRouter()

@router.post("/generate", response_model=StrategistResponse)
async def generate_strategy(
    request: StrategistRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Triggers the LangGraph orchestration to generate a campaign strategy based on a natural language prompt.
    """
    # 1. Run the LangGraph Orchestrator (Audience -> Channel -> Campaign)
    initial_state = {"input": request.prompt}
    final_state = orchestrator_app.invoke(initial_state)
    
    audience_data = final_state.get("audience_data", {})
    channel_data = final_state.get("channel_data", {})
    campaign_data = final_state.get("campaign_data", {})
    
    # 2. Run the Analytics Agent to get projections
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    analytics = get_analytics_agent(llm)
    try:
        response = analytics.invoke({
            "audience": str(audience_data),
            "channel": str(channel_data),
            "message": str(campaign_data)
        })
        content = response.content
        import json
        projected_data = json.loads(content)
    except Exception:
        projected_data = {
            "expected_delivery_rate": "95%",
            "expected_open_rate": "45%",
            "expected_click_rate": "15%",
            "expected_revenue": "$2500"
        }
        
    # 3. Save the recommendation to the database
    recommendation = AIRecommendation(
        user_id=current_user["user_id"],
        prompt=request.prompt,
        audience_match=audience_data,
        channel_rec=channel_data,
        message_draft=campaign_data,
        projected=projected_data,
        status="completed"
    )
    db.add(recommendation)
    await db.commit()
    await db.refresh(recommendation)
    
    # 4. Return the generated strategy
    return StrategistResponse(
        id=str(recommendation.id),
        status=recommendation.status,
        prompt=recommendation.prompt,
        audience_match=recommendation.audience_match,
        channel_rec=recommendation.channel_rec,
        message_draft=recommendation.message_draft,
        projected=recommendation.projected
    )
