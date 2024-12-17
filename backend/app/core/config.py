from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    OPENAI_API_KEY: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
