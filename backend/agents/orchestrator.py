from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END
try:
    from langchain_openai import ChatOpenAI
except ModuleNotFoundError:
    ChatOpenAI = None
from langchain_core.messages import HumanMessage, AIMessage

class FallbackChatOpenAI:
    def __init__(self, *args, **kwargs):
        pass

    def __call__(self, *args, **kwargs):
        return self

    def invoke(self, *args, **kwargs):
        return type("R", (), {"content": "{}"})

from agents.audience_agent import get_audience_agent
from agents.channel_agent import get_channel_agent
from agents.campaign_agent import get_campaign_agent

class AgentState(TypedDict):
    input: str
    audience_data: dict
    channel_data: dict
    campaign_data: dict
    messages: Sequence[BaseMessage]

# Node functions
def audience_node(state: AgentState):
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0) if ChatOpenAI else None
    agent = get_audience_agent(llm)
    try:
        response = agent.invoke({"input": state["input"]})
        content = response.content
    except Exception:
        content = '{"segment_name": "Your Best Buyers", "reason": "Fallback due to no API Key or missing dependency", "estimated_count": 1240}'
        
    import json
    try:
        data = json.loads(content)
    except:
        data = {"segment_name": "Your Best Buyers", "reason": "Fallback parsing error", "estimated_count": 1240}
        
    return {"audience_data": data}

def channel_node(state: AgentState):
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0) if ChatOpenAI else None
    agent = get_channel_agent(llm)
    try:
        response = agent.invoke({
            "input": state["input"],
            "audience": str(state["audience_data"])
        })
        content = response.content
    except Exception:
        content = '{"channel": "whatsapp", "reason": "Fallback due to no API Key or missing dependency", "expected_roi": "300%"}'
        
    import json
    try:
        data = json.loads(content)
    except:
        data = {"channel": "whatsapp", "reason": "Fallback parsing error", "expected_roi": "300%"}
        
    return {"channel_data": data}

def campaign_node(state: AgentState):
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7) if ChatOpenAI else None
    agent = get_campaign_agent(llm)
    try:
        response = agent.invoke({
            "input": state["input"],
            "audience": str(state["audience_data"]),
            "channel": str(state["channel_data"])
        })
        content = response.content
    except Exception:
        content = '{"subject": "Special Offer Just For You!", "body": "Hey there! We noticed you love our products. Here is a 20% discount code: VIP20."}'
        
    import json
    try:
        data = json.loads(content)
    except:
        data = {"subject": "Fallback Subject", "body": "Fallback body content."}
        
    return {"campaign_data": data}

# Build the Graph
workflow = StateGraph(AgentState)

workflow.add_node("audience", audience_node)
workflow.add_node("channel", channel_node)
workflow.add_node("campaign", campaign_node)

workflow.set_entry_point("audience")
workflow.add_edge("audience", "channel")
workflow.add_edge("channel", "campaign")
workflow.add_edge("campaign", END)

orchestrator_app = workflow.compile()
