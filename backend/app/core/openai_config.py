from openai import AsyncOpenAI, APIError, AuthenticationError
import asyncio
from .config import settings


if not settings.OPENAI_API_KEY or not settings.OPENAI_API_KEY.startswith(("sk-")):
    raise ValueError("Invalid OpenAI API key format. API key should start with 'sk-'")


client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def get_chat_completion(messages: list, stream: bool = True):
    """
    Get chat completion from OpenAI API
    """
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            stream=stream,
            temperature=0.7,
            max_tokens=1000,
        )
        return response
    except asyncio.CancelledError as cancel_error:
        print("Request cancelled by client")
        raise cancel_error
    except AuthenticationError as auth_error:
        print(f"OpenAI auth error: {str(auth_error)}")
        raise auth_error
    except APIError as api_error:
        print(f"OpenAI API error: {str(api_error)}")
        raise api_error
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise e


__all__ = ["get_chat_completion"]
