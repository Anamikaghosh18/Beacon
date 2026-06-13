from langchain_google_genai import ChatGoogleGenerativeAI
from core.config import settings


def get_gemini_llm(
    model: str = "gemini-2.5-flash",
    temperature: float = 0.0,
):
    return ChatGoogleGenerativeAI(
        model=model,
        temperature=temperature,
        google_api_key=settings.GEMINI_API_KEY,
    )