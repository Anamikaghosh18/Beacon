from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID
import math

from backend.core.database import get_db
from backend.core.auth import get_current_user
from backend.schemas.campaign import (
    CampaignCreate,
    CampaignResponse,
    CampaignListResponse,
    CampaignMetricsResponse,
    CampaignTimelineResponse,
    TimelineStage,
)
from backend.services.campaign_service import CampaignService
from backend.services.metrics_service import get_campaign_metrics
from backend.models.communication import Communication, CommunicationEvent

router = APIRouter()


@router.get("", response_model=CampaignListResponse)
async def list_campaigns(
    page: int = 1,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CampaignService(db)
    campaigns, total = await service.list_campaigns(page=page, limit=limit)

    pages = math.ceil(total / limit) if limit > 0 else 0
    return CampaignListResponse(
        items=campaigns,
        total=total,
        page=page,
        pages=pages,
    )


@router.post("", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def create_campaign(
    data: CampaignCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CampaignService(db)
    campaign = await service.create_campaign(data, user_id=current_user["user_id"])
    await db.commit()
    return campaign


@router.get("/{campaign_id}", response_model=CampaignResponse)
async def get_campaign(
    campaign_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CampaignService(db)
    campaign = await service.get_campaign(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@router.get("/{campaign_id}/metrics", response_model=CampaignMetricsResponse)
async def get_campaign_metrics_endpoint(
    campaign_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CampaignService(db)
    campaign = await service.get_campaign(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    metrics = await get_campaign_metrics(db, campaign_id)
    return metrics


@router.get("/{campaign_id}/timeline", response_model=CampaignTimelineResponse)
async def get_campaign_timeline(
    campaign_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    from sqlalchemy import select, func

    service = CampaignService(db)
    campaign = await service.get_campaign(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    comm_result = await db.execute(
        select(Communication.id).where(Communication.campaign_id == campaign_id)
    )
    comm_ids = [row[0] for row in comm_result.all()]

    event_counts = {}
    if comm_ids:
        events_result = await db.execute(
            select(CommunicationEvent.event_type, func.count(CommunicationEvent.id))
            .where(CommunicationEvent.communication_id.in_(comm_ids))
            .group_by(CommunicationEvent.event_type)
        )
        event_counts = {row[0]: row[1] for row in events_result.all()}

    def stage_status(event_type: str, total_comms: int) -> str:
        count = event_counts.get(event_type, 0)
        if count == 0:
            return "pending"
        if count >= total_comms:
            return "complete"
        return "partial"

    total_comms = campaign.audience_count or len(comm_ids)
    stages: List[TimelineStage] = [
        TimelineStage(name="Created", status="complete"),
        TimelineStage(
            name="Launched",
            status="complete" if campaign.status != "draft" else "pending",
        ),
        TimelineStage(name="Sending", status=stage_status("sent", total_comms)),
        TimelineStage(name="Delivered", status=stage_status("delivered", total_comms)),
        TimelineStage(name="Opened", status=stage_status("opened", total_comms)),
        TimelineStage(name="Clicked", status=stage_status("clicked", total_comms)),
        TimelineStage(name="Converted", status=stage_status("converted", total_comms)),
    ]
    return CampaignTimelineResponse(stages=stages)


@router.post("/{campaign_id}/launch", status_code=status.HTTP_202_ACCEPTED)
async def launch_campaign(
    campaign_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CampaignService(db)
    try:
        campaign = await service.launch_campaign(campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        await db.commit()
        return {
            "status": "launched",
            "id": str(campaign.id),
            "audience_count": campaign.audience_count,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
