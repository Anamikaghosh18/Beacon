from backend.core.database import Base

from backend.models.customer import Customer, Order
from backend.models.segment import Segment, SegmentCustomer
from backend.models.campaign import Campaign
from backend.models.communication import Communication, CommunicationEvent, Conversion
from backend.models.ai import AIRecommendation, CampaignInsight