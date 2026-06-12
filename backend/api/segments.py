from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from core.database import get_db
from core.auth import get_current_user
from schemas.segment import SegmentCreate, SegmentResponse, SegmentListResponse
from services.segment_service import SegmentService

router = APIRouter()

@router.get("", response_model=SegmentListResponse)
async def list_segments(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SegmentService(db)
    segments = await service.get_all_segments()
    return {"items": segments}

@router.post("", response_model=SegmentResponse, status_code=201)
async def create_segment(
    segment_in: SegmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SegmentService(db)
    new_segment = await service.create_segment(segment_in)
    await db.commit()
    return new_segment

@router.get("/{segment_id}", response_model=SegmentResponse)
async def get_segment(
    segment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SegmentService(db)
    segment = await service.get_segment(segment_id)
    if not segment:
        raise HTTPException(status_code=404, detail="Segment not found")
    return segment
