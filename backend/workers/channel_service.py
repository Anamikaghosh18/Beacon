import asyncio
import logging
import random
import httpx
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from core.database import AsyncSessionLocal
from models.communication import Communication

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

WEBHOOK_URL = "http://localhost:8000/api/webhooks/delivery-status"

async def fire_webhook(client: httpx.AsyncClient, comm_id: str, event_type: str, metadata: dict = None):
    payload = {
        "communication_id": str(comm_id),
        "event_type": event_type,
        "occurred_at": datetime.now(timezone.utc).isoformat(),
        "metadata": metadata or {}
    }
    try:
        response = await client.post(WEBHOOK_URL, json=payload)
        response.raise_for_status()
        logger.debug(f"Webhook {event_type} fired for {comm_id}")
    except Exception as e:
        logger.error(f"Failed to fire webhook for {comm_id}: {e}")

async def simulate_delivery_flow(comm_id: str):
    logger.info(f"Starting simulation for communication {comm_id}")
    async with httpx.AsyncClient() as client:
        # 1. Simulate Sent (100ms)
        await asyncio.sleep(0.1)
        await fire_webhook(client, comm_id, "sent")
        
        # 2. Simulate Delivered or Failed (500ms)
        await asyncio.sleep(0.5)
        is_delivered = random.random() < 0.95 # 95% delivery rate
        
        if not is_delivered:
            await fire_webhook(client, comm_id, "failed", {"reason": "Bounce / Invalid Number"})
            return # Stop simulation if failed
            
        await fire_webhook(client, comm_id, "delivered")
        
        # 3. Simulate Opened (2s)
        await asyncio.sleep(2)
        is_opened = random.random() < 0.40 # 40% open rate
        
        if not is_opened:
            return
            
        await fire_webhook(client, comm_id, "opened")
        
        # 4. Simulate Clicked (3s)
        await asyncio.sleep(3)
        is_clicked = random.random() < 0.25 # 25% click-to-open rate
        
        if not is_clicked:
            return
            
        await fire_webhook(client, comm_id, "clicked")
        
        # 5. Simulate Converted (5s)
        await asyncio.sleep(5)
        is_converted = random.random() < 0.08 # 8% conversion rate from clicks
        
        if is_converted:
            revenue = round(random.uniform(20.0, 150.0), 2)
            await fire_webhook(client, comm_id, "converted", {"revenue": revenue})


async def channel_service_loop():
    logger.info("Starting Channel Service Worker...")
    while True:
        try:
            async with AsyncSessionLocal() as db:
                # Find pending communications
                result = await db.execute(
                    select(Communication.id).where(Communication.status == "pending").limit(20)
                )
                comm_ids = result.scalars().all()
                
                if comm_ids:
                    await db.execute(
                        update(Communication)
                        .where(Communication.id.in_(comm_ids))
                        .values(status="processing")
                    )
                    await db.commit()
                    
                    # Fire off async tasks to simulate the delivery flow
                    for cid in comm_ids:
                        asyncio.create_task(simulate_delivery_flow(cid))
                        
        except Exception as e:
            logger.error(f"Error in channel service loop: {e}")
            
        await asyncio.sleep(3) # Poll every 3 seconds

if __name__ == "__main__":
    asyncio.run(channel_service_loop())
