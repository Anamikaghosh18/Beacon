from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from backend.core.database import get_db
from backend.core.auth import get_current_user
from backend.schemas.dashboard import KPIResponse, FunnelResponse
from backend.models.customer import Customer
from backend.models.segment import Segment
from backend.models.campaign import Campaign
from backend.models.communication import CommunicationEvent
from backend.services.metrics_service import get_platform_funnel, get_total_revenue_influenced

router = APIRouter()


@router.get("/kpis", response_model=KPIResponse)
async def get_kpis(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    total_customers_q = await db.execute(select(func.count(Customer.id)))
    active_segments_q = await db.execute(select(func.count(Segment.id)))
    campaigns_sent_q = await db.execute(
        select(func.count(Campaign.id)).where(Campaign.status != "draft")
    )
    messages_sent_q = await db.execute(
        select(func.count(CommunicationEvent.id)).where(
            CommunicationEvent.event_type == "sent"
        )
    )

    revenue = await get_total_revenue_influenced(db)

    return KPIResponse(
        total_customers=total_customers_q.scalar() or 0,
        active_segments=active_segments_q.scalar() or 0,
        campaigns_sent=messages_sent_q.scalar() or campaigns_sent_q.scalar() or 0,
        revenue_influenced=revenue,
    )


@router.get("/funnel", response_model=FunnelResponse)
async def get_funnel(
    days: int = 30,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    funnel = await get_platform_funnel(db, days=days)
    return FunnelResponse(funnel=funnel)
