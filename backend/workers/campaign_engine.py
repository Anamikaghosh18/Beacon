import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from core.database import AsyncSessionLocal
from models.campaign import Campaign
from models.segment import SegmentCustomer
from models.communication import Communication

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def process_queued_campaign(db: AsyncSession, campaign: Campaign):
    logger.info(f"Processing queued campaign: {campaign.id}")
    
    # 1. Get all customer IDs for the segment
    if not campaign.segment_id:
        logger.warning(f"Campaign {campaign.id} has no segment_id. Skipping fan-out.")
        campaign.status = "failed"
        await db.commit()
        return

    result = await db.execute(
        select(SegmentCustomer.customer_id)
        .where(SegmentCustomer.segment_id == campaign.segment_id)
    )
    customer_ids = result.scalars().all()
    
    logger.info(f"Found {len(customer_ids)} customers for campaign {campaign.id}")
    
    # 2. Fan-out: Create a Communication record for each customer
    communications = []
    for cid in customer_ids:
        comm = Communication(
            campaign_id=campaign.id,
            customer_id=cid,
            channel=campaign.channel,
            status="pending"
        )
        communications.append(comm)
    
    if communications:
        db.add_all(communications)
        
    # 3. Update campaign status to 'sending'
    campaign.status = "sending"
    campaign.audience_count = len(communications)
    
    # 4. Commit transaction
    await db.commit()
    logger.info(f"Campaign {campaign.id} is now 'sending' with {len(communications)} communications created.")

async def campaign_engine_loop():
    logger.info("Starting Campaign Engine Worker...")
    while True:
        try:
            async with AsyncSessionLocal() as db:
                # Find queued campaigns
                result = await db.execute(
                    select(Campaign).where(Campaign.status == "queued").limit(10)
                )
                campaigns = result.scalars().all()
                
                for campaign in campaigns:
                    await process_queued_campaign(db, campaign)
                    
        except Exception as e:
            logger.error(f"Error in campaign engine loop: {e}")
            
        await asyncio.sleep(5) # Poll every 5 seconds

if __name__ == "__main__":
    asyncio.run(campaign_engine_loop())
