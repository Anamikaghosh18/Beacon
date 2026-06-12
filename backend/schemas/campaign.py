from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class CampaignBase(BaseModel):
    name: str
    channel: str
    segment_id: Optional[UUID] = None
    message_body: Optional[str] = None
    subject_line: Optional[str] = None
    scheduled_at: Optional[datetime] = None

class CampaignCreate(CampaignBase):
    pass

class CampaignResponse(CampaignBase):
    id: UUID
    status: str
    audience_name: Optional[str] = None
    audience_count: int = 0
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class CampaignListResponse(BaseModel):
    items: List[CampaignResponse]
    total: int
    page: int
    pages: int

class CampaignMetricsResponse(BaseModel):
    delivery_rate: float
    open_rate: float
    click_rate: float
    conversion_rate: float
    revenue: float
    total_sent: int
    total_delivered: int
    total_opened: int
    total_clicked: int
    total_converted: int

class TimelineStage(BaseModel):
    name: str
    status: str  # complete, partial, pending
    time: Optional[str] = None

class CampaignTimelineResponse(BaseModel):
    stages: List[TimelineStage]
