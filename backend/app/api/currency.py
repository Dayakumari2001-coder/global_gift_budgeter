"""This module handle fetching available currencies from exchange rates table."""
from app.models import ExchangeRate
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from app.database import get_db

router = APIRouter(
    prefix="/api/currencies",
    tags=["Currencies"]
)

@router.get("/available")
def get_available_currencies(
    db:Session=Depends(get_db)
):
    """Fetch available currencies from exchange rates table."""
    currencies=db.query(
        ExchangeRate.to_currency
    ).distinct().all()

    return[
        currency[0]
        for currency in currencies
    ]
