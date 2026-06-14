from langchain_google_genai import ChatGoogleGenerativeAI
from backend.core.config import settings


def get_gemini_llm(
    model: str = "gemini-2.5-flash",
    temperature: float = 0.0,
):
    api_key = settings.GEMINI_API_KEY or settings.GOOGLE_API_KEY
    if not api_key:
        raise ValueError("GEMINI_API_KEY or GOOGLE_API_KEY must be set")

    return ChatGoogleGenerativeAI(
        model=model,
        temperature=temperature,
        google_api_key=api_key,
    )