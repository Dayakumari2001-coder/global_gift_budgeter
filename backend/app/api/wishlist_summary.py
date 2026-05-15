""" This file handles:total budget, summary view"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db
from app.auth import get_current_user
from app.models import User

router = APIRouter(
    prefix="/api/summary",
    tags=["Wishlist Summary"]
)

@router.get("/{wishlist_id}")
def get_wishlist_total(wishlist_id: int, db: Session = Depends(get_db)):
    """get total budget"""
    query = text("""
        SELECT
            w.id AS wishlist_id,
            w.wishlist_name,
            u.name AS user_name,
            u.home_currency,
            COUNT(wi.id) AS total_items,
            COALESCE(
                SUM(wi.converted_price),
                0
            ) AS total_budget
        FROM wishlists w
        JOIN users u
            ON w.user_id = u.id
        LEFT JOIN wishlist_items wi
            ON w.id = wi.wishlist_id
        WHERE w.id = :wishlist_id
        GROUP BY
            w.id,
            w.wishlist_name,
            u.name,
            u.home_currency
    """)
    result = db.execute(
        query,
        {"wishlist_id": wishlist_id}
    )
    data = result.mappings().first()

    if not data:
        return {
            "message": "Wishlist not found"
        }
    return dict(data)

@router.get("/")
def get_all_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """get all summary of wishlist"""
    result = db.execute(text("""
                             SELECT * FROM v_wishlist_summary WHERE user_id = :user_id
                        """),
                            {"user_id": current_user.id}
                    )
    summaries = result.mappings().all()
    return summaries
