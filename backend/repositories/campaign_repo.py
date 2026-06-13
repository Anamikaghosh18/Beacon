from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from sqlalchemy.orm import selectinload
from typing import List, Optional, Tuple
from uuid import UUID
from models.campaign import Campaign
from models.communication import Communication, CommunicationEvent, Conversion

class CampaignRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self, skip: int = 0, limit: int = 20) -> Tuple[List[Campaign], int]:
        result = await self.session.execute(
            select(Campaign).order_by(Campaign.created_at.desc()).offset(skip).limit(limit)
        )
        total = await self.session.execute(select(func.count(Campaign.id)))
        return result.scalars().all(), total.scalar() or 0

    async def get_by_id(self, campaign_id: UUID) -> Optional[Campaign]:
        result = await self.session.execute(
            select(Campaign).where(Campaign.id == campaign_id)
        )
        return result.scalars().first()

    async def create(self, campaign: Campaign) -> Campaign:
        self.session.add(campaign)
        await self.session.flush()
        return campaign

    async def update(self, campaign: Campaign) -> Campaign:
        await self.session.merge(campaign)
        await self.session.flush()
        return campaign
