""" This file handles:total budget, summary view"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db

router = APIRouter(
    prefix="/api/summary",
    tags=["Wishlist Summary"]
)

@router.get("/{wishlist_id}")
def get_wishlist_total(wishlist_id: int, db: Session = Depends(get_db)):
    """get total budget"""
    result = db.execute(
        text(
            "CALL get_wishlist_total(:wishlist_id)"
        ),{"wishlist_id": wishlist_id}
    )
    data = result.fetchone()
    return data

@router.get("/")
def get_all_summary(db: Session = Depends(get_db)):
    """get all summary of wishlist"""
    result = db.execute(
        text("SELECT * FROM v_wishlist_summary")
    )
    summaries = result.mappings().all()
    return summaries
