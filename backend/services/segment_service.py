from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID
from backend.models.segment import Segment
from backend.repositories.segment_repo import SegmentRepository
from backend.schemas.segment import SegmentCreate
from backend.services.segment_evaluator import evaluate_segment, ensure_default_segments


class SegmentService:
    def __init__(self, session: AsyncSession):
        self.repo = SegmentRepository(session)
        self.session = session

    async def get_all_segments(self) -> List[Segment]:
        return await self.repo.get_all()

    async def get_segment(self, segment_id: UUID) -> Segment:
        return await self.repo.get_by_id(segment_id)

    async def create_segment(self, data: SegmentCreate) -> Segment:
        new_segment = Segment(
            name=data.name,
            description=data.description,
            rules=data.rules,
            is_dynamic=data.is_dynamic,
            customer_count=0,
            revenue_total=0.0,
            trend_pct=0.0,
        )
        segment = await self.repo.create(new_segment)
        await evaluate_segment(self.session, segment)
        return segment

    async def ensure_defaults(self) -> List[Segment]:
        return await ensure_default_segments(self.session)
