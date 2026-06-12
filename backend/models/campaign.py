import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    channel = Column(String(50), nullable=False)
    status = Column(String(50), default="draft", index=True)
    segment_id = Column(UUID(as_uuid=True), ForeignKey("segments.id"))
    audience_name = Column(String(255))
    audience_count = Column(Integer, default=0)
    message_body = Column(Text)
    subject_line = Column(String(500))
    scheduled_at = Column(DateTime(timezone=True))
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    created_by = Column(String(255)) # Clerk user_id
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    segment = relationship("Segment", back_populates="campaigns")
    communications = relationship("Communication", back_populates="campaign", cascade="all, delete-orphan")
    conversions = relationship("Conversion", back_populates="campaign", cascade="all, delete-orphan")
    insights = relationship("CampaignInsight", back_populates="campaign", cascade="all, delete-orphan")
