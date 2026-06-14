from langchain_core.prompts import ChatPromptTemplate

try:
    from backend.agents.gemini_llm import get_gemini_llm
except ModuleNotFoundError:
    get_gemini_llm = None


class FallbackAgent:
    def invoke(self, inputs):
        segments = inputs.get("segments", "[]")
        return type("R", (), {
            "content": (
                '{"segment_name": "Your Best Buyers", "segment_id": null, '
                '"reason": "Fallback — configure GEMINI_API_KEY for AI matching", '
                '"estimated_count": 0}'
            )
        })


def get_audience_agent(llm):
    if llm is None or get_gemini_llm is None:
        return FallbackAgent()

    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            "You are the Audience AI Agent for Beacon, a multi-tenant campaign platform. "
            "Match the user's prompt to the best customer segment from this list:\n{segments}\n\n"
            "Each segment has: id, name, description, customer_count.\n"
            "If the user specifies a count (e.g. 'top 100'), set estimated_count to the "
            "minimum of that number and the segment's customer_count.\n"
            "Return ONLY JSON with: segment_name, segment_id (UUID string from the list), "
            "reason, estimated_count (integer).",
        ),
        ("user", "{input}"),
    ])
    chain = prompt | llm

    class AudienceAgent:
        def invoke(self, inputs):
            return chain.invoke(inputs)

    return AudienceAgent()
