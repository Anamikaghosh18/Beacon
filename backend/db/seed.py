import asyncio
from core.database import AsyncSessionLocal, engine, Base
from models import * 

# Mock data
MOCK_SEGMENTS = [
    {"name": "Your Best Buyers", "description": "Customers who buy often and spend the most.", "customer_count": 1240, "revenue_total": 450000, "trend_pct": 12},
    {"name": "Gone Quiet", "description": "Customers who haven't visited or purchased in 90+ days.", "customer_count": 8400, "revenue_total": 20000, "trend_pct": -2},
]

MOCK_CUSTOMERS = [
    {"name": "Priya M.", "email": "priya@example.com", "total_spent": 1200.0, "order_count": 5},
    {"name": "Rahul S.", "email": "rahul@example.com", "total_spent": 400.0, "order_count": 2},
]

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        print("Database schema created.")

async def seed_db():
    async with AsyncSessionLocal() as session:
        for seg_data in MOCK_SEGMENTS:
            segment = Segment(**seg_data)
            session.add(segment)

        for cust_data in MOCK_CUSTOMERS:
            customer = Customer(**cust_data)
            session.add(customer)
            
        await session.commit()
        print("Database seeded with mock data.")

async def main():
    await init_db()
    await seed_db()
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
