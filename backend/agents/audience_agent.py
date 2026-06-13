from langchain_core.prompts import ChatPromptTemplate
try:
    from agents.gemini_llm import get_gemini_llm
except ModuleNotFoundError:
    get_gemini_llm = None
from tools.customer_tools import get_customer_segments
import json

class FallbackAgent:
    def invoke(self, inputs):
        return type("R", (), {"content": '{"segment_name": "Your Best Buyers", "reason": "Fallback due to missing Gemini LLM or API key", "estimated_count": 1240}'})

def get_audience_agent(llm):
    if llm is None or get_gemini_llm is None:
        return FallbackAgent()

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Audience AI Agent for Beacon. Your job is to match a user's prompt to the best available customer segment. Use the tools provided to find segments. Return a JSON object with 'segment_name', 'reason', and 'estimated_count'."),
        ("user", "{input}")
    ])
    
    agent = prompt | llm.bind_tools([get_customer_segments])
    return agent
