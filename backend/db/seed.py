import asyncio
from datetime import datetime, timezone, timedelta

from backend.core.config import get_settings
from backend.core.database import AsyncSessionLocal, engine, Base, init_db
from backend.models import Customer, Segment
from backend.services.segment_evaluator import evaluate_segment

MOCK_SEGMENTS = [
    {
        "name": "Your Best Buyers",
        "description": "Customers who buy often and spend the most.",
        "rules": {"total_spent_gte": 500, "order_count_gte": 2},
    },
    {
        "name": "Gone Quiet",
        "description": "Customers with no recent activity in 90+ days.",
        "rules": {"inactive_days_gte": 90},
    },
    {
        "name": "High Spenders",
        "description": "Customers with lifetime spend above $1,000.",
        "rules": {"total_spent_gte": 1000},
    },
]

MOCK_CUSTOMERS = [
    {
        "name": "Priya M.",
        "email": "priya@example.com",
        "phone": "+919876543210",
        "total_spent": 1200.0,
        "order_count": 5,
        "last_order_at": datetime.now(timezone.utc) - timedelta(days=10),
    },
    {
        "name": "Rahul S.",
        "email": "rahul@example.com",
        "phone": "+919876543211",
        "total_spent": 400.0,
        "order_count": 2,
        "last_order_at": datetime.now(timezone.utc) - timedelta(days=45),
    },
    {
        "name": "Anita K.",
        "email": "anita@example.com",
        "phone": "+919876543212",
        "total_spent": 2500.0,
        "order_count": 8,
        "last_order_at": datetime.now(timezone.utc) - timedelta(days=5),
    },
    {
        "name": "James W.",
        "email": "james@example.com",
        "phone": "+14155550100",
        "total_spent": 150.0,
        "order_count": 1,
        "last_order_at": datetime.now(timezone.utc) - timedelta(days=120),
    },
    {
        "name": "Sofia L.",
        "email": "sofia@example.com",
        "phone": "+34600111222",
        "total_spent": 890.0,
        "order_count": 4,
        "last_order_at": datetime.now(timezone.utc) - timedelta(days=20),
    },
]


async def reset_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        print("Database schema created.")


async def seed_db():
    async with AsyncSessionLocal() as session:
        segments = []
        for seg_data in MOCK_SEGMENTS:
            segment = Segment(**seg_data)
            session.add(segment)
            segments.append(segment)

        await session.flush()

        for cust_data in MOCK_CUSTOMERS:
            customer = Customer(**cust_data)
            session.add(customer)

        await session.flush()

        for segment in segments:
            await evaluate_segment(session, segment)

        await session.commit()
        print(f"Seeded {len(MOCK_CUSTOMERS)} customers and {len(segments)} segments.")


async def main():
    settings = get_settings()
    init_db(settings.DATABASE_URL)
    await reset_db()
    await seed_db()
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
