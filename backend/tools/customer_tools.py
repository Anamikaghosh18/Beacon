from langchain_core.tools import tool
import json

@tool
def get_customer_segments(query: str) -> str:
    segments = [
        {"name": "Your Best Buyers", "description": "Customers who buy often and spend the most.", "customer_count": 1240},
        {"name": "Gone Quiet", "description": "Customers who haven't visited or purchased in 90+ days.", "customer_count": 8400},
        {"name": "Festival Shoppers", "description": "Customers who bought during last Diwali/Holi.", "customer_count": 4500}
    ]
    return json.dumps(segments)

@tool
def get_channel_performance(channel: str) -> str:
    
    performance = {
        "whatsapp": {"delivery_rate": 0.98, "open_rate": 0.65, "click_rate": 0.25, "cost_per_msg": 0.05},
        "email": {"delivery_rate": 0.99, "open_rate": 0.22, "click_rate": 0.05, "cost_per_msg": 0.001},
        "sms": {"delivery_rate": 0.95, "open_rate": 0.90, "click_rate": 0.10, "cost_per_msg": 0.02}
    }
    return json.dumps(performance.get(channel.lower(), {}))
