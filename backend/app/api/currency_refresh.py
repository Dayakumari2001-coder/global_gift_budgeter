"""This file handles:fetch latest rates from API ,update database"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

import requests

from app.database import get_db
from app.models import ExchangeRate
from app.config import settings

router = APIRouter(
    prefix="/api/currency-refresh",
    tags=["Currency Refresh"]
)

@router.post("/all")
def refresh_rates(db: Session = Depends(get_db)):
    """Fetch latest rates from API and update database."""
    try:
        url = settings.EXCHANGE_RATE_API_URL
        response = requests.get(url, timeout=10)
        data = response.json()
        rates = data.get( "conversion_rates")
        if not rates:
            raise HTTPException(status_code=500, detail="Invalid API response" )
        
        updated_count = 0

        for currency, rate_value in rates.items():
            existing_rate = db.query(
                ExchangeRate
            ).filter(
                ExchangeRate.from_currency == "USD",
                ExchangeRate.to_currency == currency
            ).first()

            if existing_rate:
                existing_rate.rate = rate_value
                existing_rate.last_updated = (
                    datetime.utcnow()
                )
            else:
                new_rate = ExchangeRate(
                    from_currency="USD",
                    to_currency=currency,
                    rate=rate_value,
                    last_updated=
                        datetime.utcnow()
                )
                db.add(new_rate)
            updated_count += 1

        db.commit()
        return {
            "message":"All currencies updated",
            "total":
                updated_count
        }

    except Exception as exe:
        raise HTTPException(
            status_code=500,
            detail=
                f"Failed: {str(exe)}"
        )from exe
