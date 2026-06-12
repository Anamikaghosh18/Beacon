import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class Segment(Base):
    __tablename__ = "segments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    rules = Column(JSONB, nullable=False, default={})
    customer_count = Column(Integer, default=0)
    revenue_total = Column(Numeric(12, 2), default=0)
    trend_pct = Column(Numeric(5, 2), default=0)
    is_dynamic = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    customers = relationship("SegmentCustomer", back_populates="segment", cascade="all, delete-orphan")
    campaigns = relationship("Campaign", back_populates="segment")

class SegmentCustomer(Base):
    __tablename__ = "segment_customers"

    segment_id = Column(UUID(as_uuid=True), ForeignKey("segments.id", ondelete="CASCADE"), primary_key=True, index=True)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="CASCADE"), primary_key=True)
    added_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    segment = relationship("Segment", back_populates="customers")
    customer = relationship("Customer", back_populates="segment_memberships")
