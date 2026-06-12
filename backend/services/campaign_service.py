from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Tuple, Optional
from uuid import UUID
import json
import logging

from models.campaign import Campaign
from models.segment import SegmentCustomer, Segment
from models.communication import Communication
from repositories.campaign_repo import CampaignRepository
from schemas.campaign import CampaignCreate

logger = logging.getLogger(__name__)

class CampaignService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = CampaignRepository(session)

    async def list_campaigns(self, page: int = 1, limit: int = 20) -> Tuple[List[Campaign], int]:
        skip = (page - 1) * limit
        return await self.repo.get_all(skip=skip, limit=limit)

    async def get_campaign(self, campaign_id: UUID) -> Optional[Campaign]:
        return await self.repo.get_by_id(campaign_id)

    async def create_campaign(self, data: CampaignCreate, user_id: str) -> Campaign:
        # Fetch segment if provided to get audience_name
        audience_name = None
        if data.segment_id:
            from repositories.segment_repo import SegmentRepository
            segment = await SegmentRepository(self.session).get_by_id(data.segment_id)
            if segment:
                audience_name = segment.name

        campaign = Campaign(
            name=data.name,
            channel=data.channel,
            segment_id=data.segment_id,
            audience_name=audience_name,
            message_body=data.message_body,
            subject_line=data.subject_line,
            scheduled_at=data.scheduled_at,
            created_by=user_id,
            status="draft"
        )
        return await self.repo.create(campaign)

    async def launch_campaign(self, campaign_id: UUID) -> Optional[Campaign]:
        campaign = await self.repo.get_by_id(campaign_id)
        if not campaign:
            return None
            
        if campaign.status != "draft":
            raise ValueError("Only draft campaigns can be launched")

        campaign.status = "queued"
        return await self.repo.update(campaign)
