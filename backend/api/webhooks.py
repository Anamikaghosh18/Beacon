from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

from core.database import get_db
from models.communication import Communication, CommunicationEvent, Conversion

router = APIRouter()

class DeliveryStatusWebhook(BaseModel):
    communication_id: UUID
    event_type: str # 'sent', 'delivered', 'failed', 'opened', 'clicked', 'converted'
    occurred_at: datetime
    metadata: dict = {}

@router.post("/delivery-status", status_code=status.HTTP_200_OK)
async def delivery_status(
    payload: DeliveryStatusWebhook,
    db: AsyncSession = Depends(get_db)
):
    """
    Webhook receiver for Channel Service delivery callbacks.
    Updates the communication status and logs an event.
    """
    result = await db.execute(select(Communication).where(Communication.id == payload.communication_id))
    comm = result.scalars().first()
    
    if not comm:
        raise HTTPException(status_code=404, detail="Communication not found")

    # Update the status based on event type
    valid_statuses = ['sent', 'delivered', 'failed']
    if payload.event_type in valid_statuses:
        comm.status = payload.event_type
        if payload.event_type == 'sent':
            comm.sent_at = payload.occurred_at
        elif payload.event_type == 'delivered':
            comm.delivered_at = payload.occurred_at
        elif payload.event_type == 'failed':
            comm.failed_at = payload.occurred_at
            comm.failure_reason = payload.metadata.get("reason", "Unknown")

    # Log the event
    event = CommunicationEvent(
        communication_id=comm.id,
        campaign_id=comm.campaign_id,
        customer_id=comm.customer_id,
        event_type=payload.event_type,
        metadata_=payload.metadata,
        occurred_at=payload.occurred_at
    )
    db.add(event)

    # Handle conversions
    if payload.event_type == 'converted':
        revenue = payload.metadata.get("revenue", 0.0)
        conversion = Conversion(
            campaign_id=comm.campaign_id,
            customer_id=comm.customer_id,
            communication_id=comm.id,
            revenue=revenue,
            converted_at=payload.occurred_at
        )
        db.add(conversion)

    await db.commit()
    return {"success": True}
