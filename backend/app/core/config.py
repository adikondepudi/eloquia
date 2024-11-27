from pydantic_settings import BaseSettings
from typing import List, Set
import os
from pathlib import Path

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Speech Fluency Platform"
    
    # JWT Settings
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    SQLALCHEMY_DATABASE_URI: str
    
    # File Storage
    UPLOAD_DIR: Path = Path("data/uploads")
    PROCESSED_DIR: Path = Path("data/processed")
    ANALYSIS_DIR: Path = Path("data/analysis")
    MAX_AUDIO_SIZE_MB: int = 50
    FILE_RETENTION_DAYS: int = 30
    ALLOWED_AUDIO_TYPES: Set[str] = {
        "audio/wav",
        "audio/x-wav",
        "audio/mp3",
        "audio/mpeg"
    }
    
    # ML Model
    MODEL_PATH: Path = Path("ml_model/model.pkl")
    
    # Rate Limiting
    UPLOAD_RATE_LIMIT: int = 10  # uploads per minute
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.PROCESSED_DIR, exist_ok=True)
os.makedirs(settings.ANALYSIS_DIR, exist_ok=True)