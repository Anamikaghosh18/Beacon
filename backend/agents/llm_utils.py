import json
import re


def parse_llm_json(content: str) -> dict:
    """Parse JSON from LLM output, stripping optional markdown code fences."""
    if not content or not content.strip():
        raise ValueError("Empty LLM response")

    text = content.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if match:
        text = match.group(1).strip()

    return json.loads(text)
