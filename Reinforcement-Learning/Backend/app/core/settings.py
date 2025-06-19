import os
from functools import lru_cache
from pydantic_settings import BaseSettings
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
env_path = Path(".") / ".env"
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    # App Info
    APP_NAME: str = os.environ.get("APP_NAME", "Numeraxial Platform")
    DEBUG: bool = bool(os.environ.get("DEBUG", True))
    
    # Database
    DATABASE_URL: str = os.environ.get("DATABASE_URL", "postgresql://numeraxial_user:dev_password_123@localhost:5432/numeraxial")
    
    # Security
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "your-secret-key-change-in-production")
    JWT_SECRET_KEY: str = os.environ.get("JWT_SECRET_KEY", "your-jwt-secret-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Membership Tier Limits
    FREE_TIER_MONTHLY_ANALYSES: int = 5
    FREE_TIER_MONTHLY_TRAININGS: int = 2
    PRO_TIER_MONTHLY_ANALYSES: int = -1  # -1 = unlimited
    PRO_TIER_MONTHLY_TRAININGS: int = -1  # -1 = unlimited

    JWT_SECRET_KEY: str = os.environ.get("JWT_SECRET_KEY", "your-super-secret-jwt-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

@lru_cache()
def get_settings() -> Settings:
    return Settings()