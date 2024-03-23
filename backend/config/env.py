from typing import Optional
from pydantic import BaseSettings

class Settings(BaseSettings):
    DB_URL: Optional[str] = None
    secret_key: str
    face_recognition_instances = {}
    class Config:
        env_file = ".env"


settings = Settings()
