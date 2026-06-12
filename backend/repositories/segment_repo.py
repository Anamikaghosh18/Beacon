from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from uuid import UUID
from models.segment import Segment

class SegmentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self) -> List[Segment]:
        result = await self.session.execute(select(Segment))
        return result.scalars().all()

    async def get_by_id(self, segment_id: UUID) -> Optional[Segment]:
        result = await self.session.execute(select(Segment).where(Segment.id == segment_id))
        return result.scalars().first()

    async def create(self, segment: Segment) -> Segment:
        self.session.add(segment)
        await self.session.flush()
        return segment

    async def update(self, segment: Segment) -> Segment:
        await self.session.merge(segment)
        await self.session.flush()
        return segment
