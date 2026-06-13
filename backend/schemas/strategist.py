from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class StrategistRequest(BaseModel):
    user_id: str
    prompt: str

class StrategistResponse(BaseModel):
    id: str
    status: str
    prompt: str
    audience_match: Optional[Dict[str, Any]] = None
    channel_rec: Optional[Dict[str, Any]] = None
    message_draft: Optional[Dict[str, Any]] = None
    projected: Optional[Dict[str, Any]] = None
