from langchain_core.prompts import ChatPromptTemplate

class FallbackAnalyticsAgent:
    def invoke(self, inputs):
        return type("R", (), {"content": '{"expected_delivery_rate": "95%", "expected_open_rate": "45%", "expected_click_rate": "15%", "expected_revenue": "$2500"}'})

def get_analytics_agent(llm):
    if llm is None:
        return FallbackAnalyticsAgent()

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Analytics Agent for Beacon. Given an audience, channel, and message draft, project the engagement metrics. Return a JSON object with 'expected_delivery_rate', 'expected_open_rate', 'expected_click_rate', 'expected_revenue'."),
        ("user", "Audience: {audience}\nChannel: {channel}\nMessage: {message}")
    ])
    
    agent = prompt | llm
    return agent
