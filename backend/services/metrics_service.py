"""Aggregate campaign and platform metrics from communication events."""

from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.communication import Communication, CommunicationEvent, Conversion
from backend.models.campaign import Campaign


async def get_campaign_metrics(session: AsyncSession, campaign_id: UUID) -> dict:
    comms_result = await session.execute(
        select(Communication).where(Communication.campaign_id == campaign_id)
    )
    comms = comms_result.scalars().all()
    total = len(comms)

    if total == 0:
        return {
            "delivery_rate": 0.0,
            "open_rate": 0.0,
            "click_rate": 0.0,
            "conversion_rate": 0.0,
            "revenue": 0.0,
            "total_sent": 0,
            "total_delivered": 0,
            "total_opened": 0,
            "total_clicked": 0,
            "total_converted": 0,
            "delivered": 0,
            "opened": 0,
            "clicked": 0,
            "converted": 0,
            "avg_order": 0.0,
        }

    comm_ids = [c.id for c in comms]
    events_result = await session.execute(
        select(CommunicationEvent.event_type, func.count(CommunicationEvent.id))
        .where(CommunicationEvent.communication_id.in_(comm_ids))
        .group_by(CommunicationEvent.event_type)
    )
    event_counts = {row[0]: row[1] for row in events_result.all()}

    sent = event_counts.get("sent", 0)
    delivered = event_counts.get("delivered", 0)
    opened = event_counts.get("opened", 0)
    clicked = event_counts.get("clicked", 0)
    converted = event_counts.get("converted", 0)

    revenue_result = await session.execute(
        select(func.coalesce(func.sum(Conversion.revenue), 0)).where(
            Conversion.campaign_id == campaign_id
        )
    )
    revenue = float(revenue_result.scalar() or 0)

    base = sent or total
    avg_order = revenue / converted if converted > 0 else 0.0

    return {
        "delivery_rate": round((delivered / base) * 100, 1) if base else 0.0,
        "open_rate": round((opened / delivered) * 100, 1) if delivered else 0.0,
        "click_rate": round((clicked / opened) * 100, 1) if opened else 0.0,
        "conversion_rate": round((converted / clicked) * 100, 1) if clicked else 0.0,
        "revenue": revenue,
        "total_sent": sent,
        "total_delivered": delivered,
        "total_opened": opened,
        "total_clicked": clicked,
        "total_converted": converted,
        "delivered": delivered,
        "opened": opened,
        "clicked": clicked,
        "converted": converted,
        "avg_order": round(avg_order, 2),
    }


async def get_platform_funnel(session: AsyncSession, days: int = 30) -> list:
    events_result = await session.execute(
        select(CommunicationEvent.event_type, func.count(CommunicationEvent.id))
        .group_by(CommunicationEvent.event_type)
    )
    counts = {row[0]: row[1] for row in events_result.all()}

    sent = counts.get("sent", 0)
    if sent == 0:
        return [
            {"stage": "Sent", "count": 0},
            {"stage": "Delivered", "count": 0},
            {"stage": "Opened", "count": 0},
            {"stage": "Clicked", "count": 0},
            {"stage": "Bought", "count": 0},
        ]

    return [
        {"stage": "Sent", "count": sent},
        {"stage": "Delivered", "count": counts.get("delivered", 0)},
        {"stage": "Opened", "count": counts.get("opened", 0)},
        {"stage": "Clicked", "count": counts.get("clicked", 0)},
        {"stage": "Bought", "count": counts.get("converted", 0)},
    ]


async def get_total_revenue_influenced(session: AsyncSession) -> float:
    result = await session.execute(select(func.coalesce(func.sum(Conversion.revenue), 0)))
    return float(result.scalar() or 0)
