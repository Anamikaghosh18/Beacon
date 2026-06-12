from pydantic import BaseModel
from typing import List

class KPIResponse(BaseModel):
    total_customers: int
    active_segments: int
    campaigns_sent: int
    revenue_influenced: float

class FunnelStage(BaseModel):
    stage: str
    count: int

class FunnelResponse(BaseModel):
    funnel: List[FunnelStage]
