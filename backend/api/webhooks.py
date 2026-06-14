from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional, Any

from backend.core.database import get_db
from backend.models.communication import Communication, CommunicationEvent, Conversion

router = APIRouter()

ONESIGNAL_EVENT_MAP = {
    "sent": "sent",
    "delivered": "delivered",
    "opened": "opened",
    "clicked": "clicked",
    "failed": "failed",
    "conversion": "converted",
}


class DeliveryStatusWebhook(BaseModel):
    communication_id: UUID
    event_type: str
    occurred_at: datetime
    metadata: dict = {}


async def _process_delivery_event(
    db: AsyncSession,
    comm: Communication,
    event_type: str,
    occurred_at: datetime,
    metadata: dict,
):
    valid_statuses = ["sent", "delivered", "failed"]
    if event_type in valid_statuses:
        comm.status = event_type
        if event_type == "sent":
            comm.sent_at = occurred_at
        elif event_type == "delivered":
            comm.delivered_at = occurred_at
        elif event_type == "failed":
            comm.failed_at = occurred_at
            comm.failure_reason = metadata.get("reason", "Unknown")

    event = CommunicationEvent(
        communication_id=comm.id,
        campaign_id=comm.campaign_id,
        customer_id=comm.customer_id,
        event_type=event_type,
        metadata_=metadata,
        occurred_at=occurred_at,
    )
    db.add(event)

    if event_type == "converted":
        revenue = metadata.get("revenue", 0.0)
        db.add(
            Conversion(
                campaign_id=comm.campaign_id,
                customer_id=comm.customer_id,
                communication_id=comm.id,
                revenue=revenue,
                converted_at=occurred_at,
            )
        )


@router.post("/delivery-status", status_code=status.HTTP_200_OK)
async def delivery_status(
    payload: DeliveryStatusWebhook,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Communication).where(Communication.id == payload.communication_id)
    )
    comm = result.scalars().first()

    if not comm:
        raise HTTPException(status_code=404, detail="Communication not found")

    await _process_delivery_event(
        db, comm, payload.event_type, payload.occurred_at, payload.metadata
    )
    await db.commit()
    return {"success": True}


@router.post("/onesignal", status_code=status.HTTP_200_OK)
async def onesignal_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Receives OneSignal delivery/engagement webhooks.
    Maps notification ID back to Communication via external_message_id.
    """
    body: Any = await request.json()
    notification_id = body.get("notification_id") or body.get("id")
    event_kind = (body.get("kind") or body.get("event") or "").lower()

    event_type = ONESIGNAL_EVENT_MAP.get(event_kind)
    if not event_type or not notification_id:
        return {"success": True, "skipped": True}

    result = await db.execute(
        select(Communication).where(
            Communication.external_message_id == str(notification_id)
        )
    )
    comm = result.scalars().first()
    if not comm:
        return {"success": True, "skipped": True}

    await _process_delivery_event(
        db,
        comm,
        event_type,
        datetime.now(timezone.utc),
        body,
    )
    await db.commit()
    return {"success": True}
