import asyncio
import logging
import random
from datetime import datetime, timezone

import httpx
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.core.config import settings
from backend.core.database import AsyncSessionLocal
from backend.models.communication import Communication
from backend.models.campaign import Campaign
from backend.models.customer import Customer
from backend.services.onesignal_service import onesignal_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

WEBHOOK_URL = f"{settings.API_BASE_URL}{settings.API_V1_STR}/webhooks/delivery-status"


async def fire_webhook(
    client: httpx.AsyncClient, comm_id: str, event_type: str, metadata: dict = None
):
    payload = {
        "communication_id": str(comm_id),
        "event_type": event_type,
        "occurred_at": datetime.now(timezone.utc).isoformat(),
        "metadata": metadata or {},
    }
    try:
        response = await client.post(WEBHOOK_URL, json=payload)
        response.raise_for_status()
    except Exception as e:
        logger.error("Failed to fire webhook for %s: %s", comm_id, e)


async def simulate_delivery_flow(comm_id: str):
    """Simulate delivery when OneSignal credentials are not configured."""
    async with httpx.AsyncClient() as client:
        await asyncio.sleep(0.1)
        await fire_webhook(client, comm_id, "sent")

        await asyncio.sleep(0.5)
        if random.random() >= 0.95:
            await fire_webhook(client, comm_id, "failed", {"reason": "Invalid contact"})
            return

        await fire_webhook(client, comm_id, "delivered")

        await asyncio.sleep(2)
        if random.random() >= 0.40:
            return

        await fire_webhook(client, comm_id, "opened")

        await asyncio.sleep(3)
        if random.random() >= 0.25:
            return

        await fire_webhook(client, comm_id, "clicked")

        await asyncio.sleep(5)
        if random.random() < 0.08:
            revenue = round(random.uniform(20.0, 150.0), 2)
            await fire_webhook(client, comm_id, "converted", {"revenue": revenue})


async def send_via_onesignal(db: AsyncSession, comm: Communication):
    result = await db.execute(
        select(Communication)
        .where(Communication.id == comm.id)
        .options(selectinload(Communication.campaign), selectinload(Communication.customer))
    )
    comm = result.scalars().first()
    if not comm:
        return

    campaign: Campaign = comm.campaign
    customer: Customer = comm.customer

    send_result = await onesignal_service.send_message(
        channel=comm.channel,
        recipient_email=customer.email,
        recipient_phone=customer.phone,
        recipient_onesignal_id=customer.onesignal_id,
        subject=campaign.subject_line,
        body=campaign.message_body or "You have a new message from us.",
        customer_external_id=customer.external_id or str(customer.id),
    )

    if send_result.get("external_id"):
        comm.external_message_id = send_result["external_id"]

    if send_result.get("success"):
        comm.status = "sent"
        comm.sent_at = datetime.now(timezone.utc)
        await db.commit()

        async with httpx.AsyncClient() as client:
            await fire_webhook(client, str(comm.id), "sent")

        if send_result.get("mode") == "simulated":
            asyncio.create_task(simulate_delivery_flow(str(comm.id)))
    else:
        comm.status = "failed"
        comm.failed_at = datetime.now(timezone.utc)
        comm.failure_reason = send_result.get("error", "OneSignal delivery failed")
        await db.commit()


async def process_pending_communications():
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Communication.id).where(Communication.status == "pending").limit(20)
        )
        comm_ids = result.scalars().all()

        if not comm_ids:
            return

        await db.execute(
            update(Communication)
            .where(Communication.id.in_(comm_ids))
            .values(status="processing")
        )
        await db.commit()

        for cid in comm_ids:
            async with AsyncSessionLocal() as send_db:
                comm_result = await send_db.execute(
                    select(Communication).where(Communication.id == cid)
                )
                comm = comm_result.scalars().first()
                if comm:
                    await send_via_onesignal(send_db, comm)


async def channel_service_loop():
    logger.info(
        "Channel delivery worker started (OneSignal: %s)",
        "enabled" if onesignal_service.enabled else "simulated mode",
    )
    while True:
        try:
            await process_pending_communications()
        except Exception as e:
            logger.error("Error in channel service loop: %s", e)
        await asyncio.sleep(3)


def start_channel_worker():
    asyncio.create_task(channel_service_loop())
