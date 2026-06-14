from langchain_core.prompts import ChatPromptTemplate

def get_channel_agent(llm):
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Channel Selection Agent for Beacon, a multi-tenant campaign platform "
         "used by SaaS, ecommerce, and other businesses. Given an audience and campaign goal, "
         "recommend the best channel: email, push, sms, or whatsapp. Consider contact data "
         "(email for email, phone for sms/whatsapp, push subscription for push). "
         "Return ONLY JSON with 'channel', 'reason', and 'expected_roi'."),
        ("user", "Audience: {audience}\nGoal: {input}")
    ])
    
    agent = prompt | llm
    return agent
