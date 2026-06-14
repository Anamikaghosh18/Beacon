from langchain_core.tools import tool
import json

# Segments are injected at runtime from the database via strategist API.
# This tool is kept for LangGraph compatibility but returns the injected list.


@tool
def get_customer_segments(query: str, segments_json: str = "[]") -> str:
    """Retrieve customer segments. segments_json is populated from the database at request time."""
    try:
        segments = json.loads(segments_json) if segments_json else []
    except json.JSONDecodeError:
        segments = []
    return json.dumps(segments)


@tool
def get_channel_performance(channel: str) -> str:
    """Retrieve marketing channel performance benchmarks (industry averages)."""

    performance = {
        "email": {
            "delivery_rate": 0.99,
            "open_rate": 0.22,
            "click_rate": 0.05,
            "cost_per_msg": 0.001,
        },
        "push": {
            "delivery_rate": 0.97,
            "open_rate": 0.35,
            "click_rate": 0.12,
            "cost_per_msg": 0.0,
        },
        "whatsapp": {
            "delivery_rate": 0.98,
            "open_rate": 0.65,
            "click_rate": 0.25,
            "cost_per_msg": 0.05,
        },
        "sms": {
            "delivery_rate": 0.95,
            "open_rate": 0.90,
            "click_rate": 0.10,
            "cost_per_msg": 0.02,
        },
    }

    return json.dumps(performance.get(channel.lower(), performance["email"]))
