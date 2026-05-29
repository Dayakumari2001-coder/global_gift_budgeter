"""This module handles user profile management."""
from fastapi import (APIRouter,Depends,HTTPException)
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import (
    User,
    Wishlist,
    WishlistItem
)
from ..auth import get_current_user
from ..schemas import UserUpdate
from passlib.context import CryptContext
from .currency_rates import get_rate


router = APIRouter(
    prefix="/api/profile",
    tags=["Profile"]
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

@router.put("/currency")
def update_currency(
    new_currency: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user's home currency and recalculate wishlist item prices."""
    new_currency = new_currency.upper()
    # UPDATE USER CURRENCY
    current_user.home_currency = new_currency

    db.commit()

    # GET USER WISHLISTS
    wishlists = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id
    ).all()

    # RECALCULATE ITEMS
    for wishlist in wishlists:
        items = db.query( WishlistItem ).filter(
            WishlistItem.wishlist_id == wishlist.id
        ).all()

        for item in items:
            # SAME CURRENCY
            if item.foreign_currency == new_currency:
                item.converted_price = item.foreign_price
            else:
                rate = get_rate(
                    item.foreign_currency,
                    new_currency,
                    db
                )
                item.converted_price = round(
                    item.foreign_price* rate, 2)
    db.commit()

    return {
        "message":"Currency updated",
        "currency": new_currency
    }

@router.put("/update")
def update_profile(
    profile_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User =
        Depends(get_current_user)
):
    """Update User's profile"""
    # EMAIL EXISTS CHECK
    existing_user = db.query(
        User
    ).filter(
        User.email ==profile_data.email,
        User.id != current_user.id
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail= "Email already exists"
        )
    current_user.name = profile_data.name
    current_user.email =  profile_data.email
    if profile_data.password:
        hashed_password = (
            pwd_context.hash(
                profile_data.password
            )
        )
        current_user.password = hashed_password
    db.commit()
    db.refresh(current_user)

    return {
        "message":
            "Profile updated successfully",
        "user": {
            "id":
                current_user.id,
            "name":
                current_user.name,
            "email":
                current_user.email,
            "home_currency":
                current_user.home_currency
        }
    }
