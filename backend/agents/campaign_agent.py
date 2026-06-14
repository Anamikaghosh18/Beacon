from langchain_core.prompts import ChatPromptTemplate

def get_campaign_agent(llm):
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Campaign Copy Agent for Beacon. Write personalized message copy "
         "for any business type (SaaS, ecommerce, subscriptions, etc.). Match tone to the channel. "
         "Return ONLY JSON with 'subject' (for email/push, else empty string) and 'body'."),
        ("user", "Prompt: {input}\nAudience: {audience}\nChannel: {channel}")
    ])
    
    agent = prompt | llm
    return agent
