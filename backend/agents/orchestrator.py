import logging
from typing import TypedDict, Sequence

from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END

from backend.agents.gemini_llm import get_gemini_llm
from backend.agents.llm_utils import parse_llm_json
from backend.agents.audience_agent import get_audience_agent
from backend.agents.channel_agent import get_channel_agent
from backend.agents.campaign_agent import get_campaign_agent

logger = logging.getLogger(__name__)

AUDIENCE_FALLBACK = {
    "segment_name": "Your Best Buyers",
    "segment_id": None,
    "reason": "Fallback due to audience agent error",
    "estimated_count": 0,
}
CHANNEL_FALLBACK = {
    "channel": "email",
    "reason": "Fallback due to channel agent error",
    "expected_roi": "200%",
}
CAMPAIGN_FALLBACK = {
    "subject": "We have something special for you",
    "body": "Hi there! We wanted to reach out with a personalized offer just for you.",
}


class AgentState(TypedDict):
    input: str
    segments_data: str
    audience_data: dict
    channel_data: dict
    campaign_data: dict
    messages: Sequence[BaseMessage]


def audience_node(state: AgentState):
    try:
        llm = get_gemini_llm(temperature=0)
        agent = get_audience_agent(llm)
        response = agent.invoke({
            "input": state["input"],
            "segments": state.get("segments_data", "[]"),
        })
        data = parse_llm_json(response.content)
    except Exception:
        logger.exception("Audience agent failed")
        data = AUDIENCE_FALLBACK

    return {"audience_data": data}


def channel_node(state: AgentState):
    try:
        llm = get_gemini_llm(temperature=0)
        agent = get_channel_agent(llm)
        response = agent.invoke({
            "input": state["input"],
            "audience": str(state["audience_data"]),
        })
        data = parse_llm_json(response.content)
    except Exception:
        logger.exception("Channel agent failed")
        data = CHANNEL_FALLBACK

    return {"channel_data": data}


def campaign_node(state: AgentState):
    try:
        llm = get_gemini_llm(temperature=0.7)
        agent = get_campaign_agent(llm)
        response = agent.invoke({
            "input": state["input"],
            "audience": str(state["audience_data"]),
            "channel": str(state["channel_data"]),
        })
        data = parse_llm_json(response.content)
    except Exception:
        logger.exception("Campaign agent failed")
        data = CAMPAIGN_FALLBACK

    return {"campaign_data": data}


workflow = StateGraph(AgentState)

workflow.add_node("audience", audience_node)
workflow.add_node("channel", channel_node)
workflow.add_node("campaign", campaign_node)

workflow.set_entry_point("audience")
workflow.add_edge("audience", "channel")
workflow.add_edge("channel", "campaign")
workflow.add_edge("campaign", END)

orchestrator_app = workflow.compile()
