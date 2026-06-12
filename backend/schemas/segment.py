from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID

class SegmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    rules: Dict[str, Any] = {}
    is_dynamic: bool = True

class SegmentCreate(SegmentBase):
    pass

class SegmentResponse(SegmentBase):
    id: UUID
    customer_count: int
    revenue_total: float
    trend_pct: float

    class Config:
        from_attributes = True

class SegmentListResponse(BaseModel):
    items: List[SegmentResponse]
