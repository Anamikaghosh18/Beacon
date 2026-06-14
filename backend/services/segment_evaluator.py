"""Evaluate segment rules against customers and maintain segment membership."""

from datetime import datetime, timezone, timedelta
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from sqlalchemy import select, delete, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.customer import Customer
from backend.models.segment import Segment, SegmentCustomer

DEFAULT_SEGMENTS = [
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
    {
        "name": "New Customers",
        "description": "Recently acquired customers with fewer than 2 orders.",
        "rules": {"order_count_lte": 1},
    },
]


def _customer_matches_rules(customer: Customer, rules: dict) -> bool:
    if not rules:
        return True

    now = datetime.now(timezone.utc)
    total_spent = float(customer.total_spent or 0)
    order_count = customer.order_count or 0

    if "total_spent_gte" in rules and total_spent < float(rules["total_spent_gte"]):
        return False
    if "total_spent_lte" in rules and total_spent > float(rules["total_spent_lte"]):
        return False
    if "order_count_gte" in rules and order_count < int(rules["order_count_gte"]):
        return False
    if "order_count_lte" in rules and order_count > int(rules["order_count_lte"]):
        return False

    if "inactive_days_gte" in rules:
        threshold = int(rules["inactive_days_gte"])
        reference = customer.last_order_at or customer.created_at
        if reference:
            if reference.tzinfo is None:
                reference = reference.replace(tzinfo=timezone.utc)
            days_inactive = (now - reference).days
            if days_inactive < threshold:
                return False
        else:
            return False

    if "has_phone" in rules and rules["has_phone"] and not customer.phone:
        return False
    if "has_email" in rules and rules["has_email"] and not customer.email:
        return False

    return True


async def evaluate_segment(session: AsyncSession, segment: Segment) -> int:
    """Recompute segment membership and counts. Returns customer_count."""
    result = await session.execute(select(Customer))
    customers = result.scalars().all()

    matching = [c for c in customers if _customer_matches_rules(c, segment.rules or {})]

    await session.execute(
        delete(SegmentCustomer).where(SegmentCustomer.segment_id == segment.id)
    )

    for customer in matching:
        session.add(SegmentCustomer(segment_id=segment.id, customer_id=customer.id))

    segment.customer_count = len(matching)
    segment.revenue_total = Decimal(
        sum(float(c.total_spent or 0) for c in matching)
    )
    await session.flush()
    return segment.customer_count


async def refresh_all_segments(session: AsyncSession) -> None:
    result = await session.execute(select(Segment))
    segments = result.scalars().all()
    for segment in segments:
        await evaluate_segment(session, segment)


async def ensure_default_segments(session: AsyncSession) -> List[Segment]:
    """Create default segments if none exist."""
    count = await session.execute(select(func.count(Segment.id)))
    if (count.scalar() or 0) > 0:
        return []

    created = []
    for seg_data in DEFAULT_SEGMENTS:
        segment = Segment(
            name=seg_data["name"],
            description=seg_data["description"],
            rules=seg_data["rules"],
            is_dynamic=True,
        )
        session.add(segment)
        created.append(segment)

    await session.flush()
    for segment in created:
        await evaluate_segment(session, segment)
    return created


async def get_segment_customers(
    session: AsyncSession, segment_id: UUID, limit: Optional[int] = None
) -> List[Customer]:
    query = (
        select(Customer)
        .join(SegmentCustomer, SegmentCustomer.customer_id == Customer.id)
        .where(SegmentCustomer.segment_id == segment_id)
    )
    if limit:
        query = query.limit(limit)
    result = await session.execute(query)
    return list(result.scalars().all())
