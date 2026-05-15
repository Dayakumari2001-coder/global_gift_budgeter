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

@router.post("/{to_currency}")
def refresh_rate(to_currency: str, db: Session = Depends(get_db)):
    """refresh rate"""
    to_currency = to_currency.upper()
    try:
        url = settings.EXCHANGE_RATE_API_URL
        response = requests.get(url, timeout=5)
        data = response.json()
        rate_value = data["conversion_rates"].get( to_currency)

        if not rate_value:
            raise HTTPException( status_code=404, detail="Currency not supported")
        existing_rate = db.query(
            ExchangeRate
        ).filter(
            ExchangeRate.from_currency =="USD",
            ExchangeRate.to_currency ==to_currency
        ).first()

        if existing_rate:
            existing_rate.rate = rate_value
            existing_rate.last_updated = datetime.utcnow()
        else:
            existing_rate = ExchangeRate(
                from_currency="USD",
                to_currency=to_currency,
                rate=rate_value
            )
            db.add(existing_rate)
        db.commit()
        db.refresh(existing_rate)

        return {"message": "Rate updated","rate": existing_rate.rate}
    except Exception as exe:
        raise HTTPException( status_code=500, detail="Failed to refresh rate")from exe
