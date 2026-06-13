from langchain_core.prompts import ChatPromptTemplate

def get_channel_agent(llm):
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Channel Selection Agent for Beacon. Given an audience and campaign goal, recommend the best channel (whatsapp, email, sms) based on engagement and cost. Return a JSON object with 'channel', 'reason', and 'expected_roi'."),
        ("user", "Audience: {audience}\nGoal: {input}")
    ])
    
    agent = prompt | llm
    return agent
