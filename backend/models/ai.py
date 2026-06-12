import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False) # Clerk user_id
    prompt = Column(Text, nullable=False)
    audience_match = Column(JSONB)
    channel_rec = Column(JSONB)
    message_draft = Column(JSONB)
    projected = Column(JSONB)
    status = Column(String(50), default="pending")
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    campaign = relationship("Campaign")

class CampaignInsight(Base):
    __tablename__ = "campaign_insights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=False, index=True)
    insight_type = Column(String(50), nullable=False)
    title = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    campaign = relationship("Campaign", back_populates="insights")
