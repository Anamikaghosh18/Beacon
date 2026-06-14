from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from backend.core.database import get_db
from backend.core.auth import get_current_user
from backend.models.communication import CommunicationEvent
from backend.models.campaign import Campaign
from backend.models.customer import Customer

router = APIRouter()

EVENT_LABELS = {
    "sent": "Message Sent",
    "delivered": "Message Delivered",
    "opened": "Message Opened",
    "clicked": "Link Clicked",
    "converted": "Sale Recorded",
    "failed": "Delivery Failed",
}


class EventItem(BaseModel):
    id: str
    type: str
    campaign: str
    user: str
    time: str
    event_type: str


class EventListResponse(BaseModel):
    items: List[EventItem]
    total: int


@router.get("", response_model=EventListResponse)
async def list_events(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(
        select(CommunicationEvent, Campaign.name, Customer.name)
        .join(Campaign, Campaign.id == CommunicationEvent.campaign_id)
        .join(Customer, Customer.id == CommunicationEvent.customer_id)
        .order_by(CommunicationEvent.occurred_at.desc())
        .limit(limit)
    )
    rows = result.all()

    items = []
    for event, campaign_name, customer_name in rows:
        occurred: datetime = event.occurred_at
        items.append(
            EventItem(
                id=str(event.id),
                type=EVENT_LABELS.get(event.event_type, event.event_type.title()),
                campaign=campaign_name or "Unknown Campaign",
                user=customer_name or "Unknown Customer",
                time=occurred.strftime("%b %d, %H:%M") if occurred else "",
                event_type=event.event_type,
            )
        )

    return EventListResponse(items=items, total=len(items))
