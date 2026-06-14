from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Tuple, Optional
from uuid import UUID
import logging

from backend.models.campaign import Campaign
from backend.models.customer import Customer
from backend.models.communication import Communication
from backend.repositories.campaign_repo import CampaignRepository
from backend.repositories.segment_repo import SegmentRepository
from backend.schemas.campaign import CampaignCreate
from backend.services.segment_evaluator import get_segment_customers

logger = logging.getLogger(__name__)

CHANNEL_CONTACT_FIELD = {
    "email": "email",
    "push": "onesignal_id",
    "sms": "phone",
    "whatsapp": "phone",
}


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
        audience_name = None
        audience_count = 0
        if data.segment_id:
            segment = await SegmentRepository(self.session).get_by_id(data.segment_id)
            if segment:
                audience_name = segment.name
                audience_count = segment.customer_count or 0

        campaign = Campaign(
            name=data.name,
            channel=data.channel,
            segment_id=data.segment_id,
            audience_name=audience_name,
            audience_count=audience_count,
            message_body=data.message_body,
            subject_line=data.subject_line,
            scheduled_at=data.scheduled_at,
            created_by=user_id,
            status="draft",
        )
        return await self.repo.create(campaign)

    def _customer_reachable(self, customer: Customer, channel: str) -> bool:
        channel = channel.lower()
        if channel == "email":
            return bool(customer.email)
        if channel == "push":
            return bool(customer.onesignal_id or customer.external_id)
        if channel in ("sms", "whatsapp"):
            return bool(customer.phone)
        return bool(customer.email)

    async def _resolve_audience(self, campaign: Campaign) -> List[Customer]:
        if campaign.segment_id:
            customers = await get_segment_customers(self.session, campaign.segment_id)
        else:
            result = await self.session.execute(select(Customer))
            customers = list(result.scalars().all())

        return [c for c in customers if self._customer_reachable(c, campaign.channel)]

    async def launch_campaign(self, campaign_id: UUID) -> Optional[Campaign]:
        campaign = await self.repo.get_by_id(campaign_id)
        if not campaign:
            return None

        if campaign.status != "draft":
            raise ValueError("Only draft campaigns can be launched")

        audience = await self._resolve_audience(campaign)
        if not audience:
            raise ValueError(
                "No reachable customers for this campaign. "
                "Import customer data or assign a segment with matching contacts."
            )

        for customer in audience:
            self.session.add(
                Communication(
                    campaign_id=campaign.id,
                    customer_id=customer.id,
                    channel=campaign.channel,
                    status="pending",
                )
            )

        campaign.status = "launched"
        campaign.started_at = datetime.now(timezone.utc)
        campaign.audience_count = len(audience)
        return await self.repo.update(campaign)
