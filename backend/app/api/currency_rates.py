"""his file handles:get all rates, create rate, delete rate, get single rate"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ExchangeRate
from app.schemas import ExchangeRateCreate


router = APIRouter(
    prefix="/api/currency-rates",
    tags=["Currency Rates"]
)

# GET SINGLE RATE
@router.get("/{from_currency}/{to_currency}")
def get_rate(from_currency: str, to_currency: str, db: Session = Depends(get_db)):
    """get single rate"""
    rate = db.query(ExchangeRate).filter(
        ExchangeRate.from_currency == from_currency.upper(),
        ExchangeRate.to_currency == to_currency.upper()
    ).first()

    if not rate:
        raise HTTPException(status_code=404, detail="Exchange rate not found")
    return rate

# GET ALL RATES
@router.get("/")
def get_all_rates(db: Session = Depends(get_db)):
    """get all rates"""
    rates = db.query(ExchangeRate).all()
    return rates

# CREATE RATE
@router.post("/")
def create_rate(rate_data: ExchangeRateCreate,db: Session = Depends(get_db)):
    """ create rate"""
    existing_rate = db.query(ExchangeRate).filter(
        ExchangeRate.from_currency == rate_data.from_currency.upper(),
        ExchangeRate.to_currency == rate_data.to_currency.upper()
    ).first()

    if existing_rate:
        raise HTTPException(
            status_code=400,
            detail="Rate already exists"
        )
    new_rate = ExchangeRate(
        frng_currency=rate_data.target_currency.upper(),
        base_currency=rate_data.base_currency.upper(),
        rate=rate_data.rate
    )

    db.add(new_rate)
    db.commit()
    db.refresh(new_rate)

    return new_rate

@router.delete("/{from_currency}/{to_currency}")
def delete_rate(from_currency: str, to_currency: str,
    db: Session = Depends(get_db)
):
    """delete rate"""
    rate = db.query(ExchangeRate).filter(
        ExchangeRate.target_currency == from_currency.upper(),
        ExchangeRate.base_currency == to_currency.upper()
    ).first()
    if not rate:
        raise HTTPException(status_code=404, detail="Rate not found")
    db.delete(rate)
    db.commit()

    return {
        "message": "Rate deleted"
    }
