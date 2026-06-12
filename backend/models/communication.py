import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class Communication(Base):
    __tablename__ = "communications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=False, index=True)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False, index=True)
    channel = Column(String(50), nullable=False)
    status = Column(String(50), default="pending", index=True)
    sent_at = Column(DateTime(timezone=True))
    delivered_at = Column(DateTime(timezone=True))
    failed_at = Column(DateTime(timezone=True))
    failure_reason = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    campaign = relationship("Campaign", back_populates="communications")
    customer = relationship("Customer")
    events = relationship("CommunicationEvent", back_populates="communication", cascade="all, delete-orphan")

class CommunicationEvent(Base):
    __tablename__ = "communication_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    communication_id = Column(UUID(as_uuid=True), ForeignKey("communications.id"), nullable=False)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=False, index=True)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    event_type = Column(String(50), nullable=False, index=True)
    metadata_ = Column("metadata", JSONB, default={})
    occurred_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)

    communication = relationship("Communication", back_populates="events")

class Conversion(Base):
    __tablename__ = "conversions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=False, index=True)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    communication_id = Column(UUID(as_uuid=True), ForeignKey("communications.id"))
    revenue = Column(Numeric(12, 2), nullable=False)
    converted_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    campaign = relationship("Campaign", back_populates="conversions")
