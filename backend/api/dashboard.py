from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from core.database import get_db
from core.auth import get_current_user
from schemas.dashboard import KPIResponse, FunnelResponse
from models.customer import Customer
from models.segment import Segment
from models.campaign import Campaign

router = APIRouter()

@router.get("/kpis", response_model=KPIResponse)
async def get_kpis(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    total_customers_q = await db.execute(select(func.count(Customer.id)))
    active_segments_q = await db.execute(select(func.count(Segment.id)))
    campaigns_sent_q = await db.execute(select(func.count(Campaign.id)).where(Campaign.status != 'draft'))
    
    # Normally revenue influenced is computed via Conversion table
    
    return KPIResponse(
        total_customers=total_customers_q.scalar() or 0,
        active_segments=active_segments_q.scalar() or 0,
        campaigns_sent=campaigns_sent_q.scalar() or 0,
        revenue_influenced=1240500.00 
    )

@router.get("/funnel", response_model=FunnelResponse)
async def get_funnel(
    days: int = 30,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Mock funnel data
    return FunnelResponse(
        funnel=[
            { "stage": "Sent",      "count": 125000 },
            { "stage": "Delivered",  "count": 120000 },
            { "stage": "Opened",     "count": 45000 },
            { "stage": "Clicked",    "count": 12000 },
            { "stage": "Bought",     "count": 3400 }
        ]
    )
