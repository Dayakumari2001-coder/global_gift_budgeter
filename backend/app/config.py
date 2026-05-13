
"""Module to handle application configration settings."""
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings loaded from environment variables."""

    #Database Configurtion
    DATABASE_URL = os.getenv("DATABASE_URL")

    # API Configuration
    API_TITLE = "Global Gift Budgeter API"
    API_VERSION = "1.0.0"
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"

    # Exchange Rate API Configuration
    EXCHANGE_RATE_API_KEY = os.getenv("EXCHANGE_RATE_API_KEY", "")
    EXCHANGE_RATE_API_URL = "https://V6.exchangerate-api.com/v6{EXCHANGE_RATE_API_KEY}/latest/USD"

    # CORS Configuration
    ALLOWED_ORIGINS = [
        "http://localhost:8000",
        "http://localhost:5173",
        "http://127.0.0.1:8000",
        "http://127.0.0.1:5173",
    ]

settings = Settings()
