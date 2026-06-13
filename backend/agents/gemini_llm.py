from __future__ import annotations

from typing import Any

from google.ai.generativelanguage_v1beta.services.generative_service.client import GenerativeServiceClient
from google.ai.generativelanguage_v1beta.types import Content
from google.api_core.client_options import ClientOptions
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage
from langchain_core.outputs.chat_generation import ChatGeneration
from langchain_core.outputs.chat_result import ChatResult

from core.config import settings


def _message_to_content(message: BaseMessage) -> Content:
    if isinstance(message, SystemMessage):
        role = "system"
    elif isinstance(message, HumanMessage):
        role = "user"
    else:
        role = "assistant"

    return Content(role=role, parts=[str(message.content or "")])


def _response_text(response: Any) -> str:
    if response is None or not getattr(response, "candidates", None):
        return ""

    candidate = response.candidates[0]
    if not getattr(candidate, "content", None):
        return ""

    content = candidate.content
    text_parts: list[str] = []
    for part in getattr(content, "parts", []):
        if hasattr(part, "text") and getattr(part, "text", None) is not None:
            text_parts.append(part.text)
        else:
            text_parts.append(str(part))

    return "".join(text_parts).strip()


class GeminiChatModel(BaseChatModel):
    model: str = "models/gemini-1.5"
    temperature: float = 0.0
    api_key: str | None = None

    @property
    def _llm_type(self) -> str:
        return "gemini"

    @property
    def _identifying_params(self) -> dict[str, Any]:
        return {"model": self.model, "temperature": self.temperature}

    def _get_client(self) -> GenerativeServiceClient:
        if self.api_key:
            return GenerativeServiceClient(client_options=ClientOptions(api_key=self.api_key))
        return GenerativeServiceClient()

    def _generate(
        self,
        messages: list[BaseMessage],
        stop: list[str] | None = None,
        run_manager: Any | None = None,
        **kwargs: Any,
    ) -> ChatResult:
        contents = [_message_to_content(message) for message in messages]
        generation_config = kwargs.pop("generation_config", {}) or {}
        generation_config["temperature"] = self.temperature
        if stop:
            generation_config["stop_sequences"] = stop
        if generation_config:
            kwargs["generation_config"] = generation_config

        client = self._get_client()
        response = client.generate_content(model=self.model, contents=contents, **kwargs)
        text = _response_text(response)
        ai_message = AIMessage(content=text)
        generation = ChatGeneration(message=ai_message, text=text)

        return ChatResult(
            generations=[generation],
            llm_output={"provider": "gemini", "model": self.model},
        )


def get_gemini_llm(model: str | None = None, temperature: float = 0.0) -> GeminiChatModel:
    api_key = settings.GEMINI_API_KEY or settings.GOOGLE_API_KEY
    return GeminiChatModel(
        model=model or "models/gemini-1.5",
        temperature=temperature,
        api_key=api_key,
    )
