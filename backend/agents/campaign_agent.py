from langchain_core.prompts import ChatPromptTemplate

def get_campaign_agent(llm):
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Campaign Strategist Agent for Beacon. Given a prompt, audience, and channel, write the actual message copy. Ensure the tone is engaging and suitable for the channel. Return a JSON object with 'subject' (if applicable) and 'body'."),
        ("user", "Prompt: {input}\nAudience: {audience}\nChannel: {channel}")
    ])
    
    agent = prompt | llm
    return agent
