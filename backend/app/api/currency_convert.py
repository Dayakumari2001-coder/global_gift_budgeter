"""This file handles:currency conversion logic"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ExchangeRate

router = APIRouter(
    prefix="/api/convert",
    tags=["Currency Convert"]
)

@router.get("/")
def convert_currency(
    amount: float,
    from_currency: str,
    to_currency: str,
    db: Session = Depends(get_db)
):
    """covert currency"""
    if amount <= 0:
        raise HTTPException(status_code=400,
            detail="Amount must be greater than 0"
        )
    from_currency = from_currency.upper()
    to_currency = to_currency.upper()

    if from_currency == to_currency:
        return {
            "original_amount": amount,
            "converted_amount": amount,
            "currency": to_currency
        }

    rate = db.query(ExchangeRate).filter(
        ExchangeRate.from_currency == from_currency,
        ExchangeRate.to_currency == to_currency
    ).first()

    if not rate:
        raise HTTPException(status_code=404, detail="Exchange rate not found")
    converted_amount = amount * rate.rate
    return {
        "original_amount": amount,
        "from_currency": from_currency,
        "to_currency": to_currency,
        "exchange_rate": rate.rate,
        "converted_amount": round(converted_amount, 2)
    }
