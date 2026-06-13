from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID
import math

from core.database import get_db
from core.auth import get_current_user
from schemas.campaign import CampaignCreate, CampaignResponse, CampaignListResponse
from services.campaign_service import CampaignService

router = APIRouter()

@router.get("", response_model=CampaignListResponse)
async def list_campaigns(
    page: int = 1,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = CampaignService(db)
    campaigns, total = await service.list_campaigns(page=page, limit=limit)
    
    pages = math.ceil(total / limit) if limit > 0 else 0
    return CampaignListResponse(
        items=campaigns,
        total=total,
        page=page,
        pages=pages
    )

@router.post("", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def create_campaign(
    data: CampaignCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = CampaignService(db)
    campaign = await service.create_campaign(data, user_id=current_user["user_id"])
    await db.commit()
    return campaign

@router.get("/{campaign_id}", response_model=CampaignResponse)
async def get_campaign(
    campaign_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = CampaignService(db)
    campaign = await service.get_campaign(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.post("/{campaign_id}/launch", status_code=status.HTTP_202_ACCEPTED)
async def launch_campaign(
    campaign_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = CampaignService(db)
    try:
        campaign = await service.launch_campaign(campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        await db.commit()
        return {"status": "launched", "id": campaign.id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
