from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000


settings = Settings()
