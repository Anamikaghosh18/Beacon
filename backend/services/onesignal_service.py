"""OneSignal delivery for email, push, SMS, and WhatsApp channels."""

import logging
from typing import Optional

import httpx

from backend.core.config import settings

logger = logging.getLogger(__name__)

ONESIGNAL_API = "https://api.onesignal.com/notifications"

CHANNEL_MAP = {
    "email": "email",
    "push": "push",
    "sms": "sms",
    "whatsapp": "sms",
}


class OneSignalService:
    def __init__(self):
        self.app_id = settings.ONESIGNAL_APP_ID
        self.api_key = settings.ONESIGNAL_REST_API_KEY
        self.enabled = bool(self.app_id and self.api_key)

    async def send_message(
        self,
        channel: str,
        recipient_email: Optional[str],
        recipient_phone: Optional[str],
        recipient_onesignal_id: Optional[str],
        subject: Optional[str],
        body: str,
        customer_external_id: Optional[str] = None,
    ) -> dict:
        """
        Send a message via OneSignal. Returns {success, external_id, mode}.
        Falls back to simulated mode when credentials are not configured.
        """
        if not self.enabled:
            return {"success": True, "external_id": None, "mode": "simulated"}

        channel = channel.lower()
        target_channel = CHANNEL_MAP.get(channel, "email")

        payload = {
            "app_id": self.app_id,
            "target_channel": target_channel,
            "contents": {"en": body},
        }

        if subject:
            payload["headings"] = {"en": subject}
            payload["email_subject"] = subject

        if target_channel == "email" and recipient_email:
            payload["include_email_tokens"] = [recipient_email]
        elif target_channel == "push":
            if recipient_onesignal_id:
                payload["include_subscription_ids"] = [recipient_onesignal_id]
            elif customer_external_id:
                payload["include_aliases"] = {"external_id": [customer_external_id]}
            else:
                return {"success": False, "error": "No push subscription for customer", "mode": "onesignal"}
        elif target_channel == "sms":
            if not recipient_phone:
                return {"success": False, "error": "No phone number for SMS/WhatsApp", "mode": "onesignal"}
            payload["include_phone_numbers"] = [recipient_phone]
            if channel == "whatsapp":
                payload["isWhatsApp"] = True

        headers = {
            "Authorization": f"Key {self.api_key}",
            "Content-Type": "application/json",
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(ONESIGNAL_API, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                return {
                    "success": True,
                    "external_id": data.get("id"),
                    "mode": "onesignal",
                }
        except httpx.HTTPStatusError as e:
            logger.error("OneSignal API error: %s %s", e.response.status_code, e.response.text)
            return {"success": False, "error": e.response.text, "mode": "onesignal"}
        except Exception as e:
            logger.error("OneSignal send failed: %s", e)
            return {"success": False, "error": str(e), "mode": "onesignal"}


onesignal_service = OneSignalService()
