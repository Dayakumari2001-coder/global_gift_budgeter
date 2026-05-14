"""This file handles:create, get, update, delete wishlist"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Wishlist
from app.schemas import (
    WishlistCreate,
    WishlistUpdate,
    WishlistResponse
)

router = APIRouter(
    prefix="/api/wishlists",
    tags=["Wishlists"]
)

@router.post("/", response_model=WishlistResponse)
def create_wishlist(wishlist_data: WishlistCreate, db: Session = Depends(get_db)):
    """create new wishlist."""
    user = db.query(User).filter(
        User.id == wishlist_data.user_id
    ).first()
    if not user:
        raise HTTPException(status_code=404,detail="User not found")

    new_wishlist = Wishlist(
        user_id=wishlist_data.user_id,
        wishlist_name=wishlist_data.wishlist_name,
        description=wishlist_data.description
    )

    db.add(new_wishlist)
    db.commit()
    db.refresh(new_wishlist)

    return new_wishlist

@router.get("/user/{user_id}")
def get_user_wishlists(user_id: int, db: Session = Depends(get_db)):
    """get all wishlists of user."""
    wishlists = db.query(Wishlist).filter(
        Wishlist.user_id == user_id
    ).all()
    return wishlists

@router.get("/{wishlist_id}")
def get_wishlist(wishlist_id: int, db: Session = Depends(get_db)):
    """get single wishlist"""
    wishlist = db.query(Wishlist).filter(
        Wishlist.id == wishlist_id
    ).first()

    if not wishlist:
        raise HTTPException(
            status_code=404,
            detail="Wishlist not found"
        )

    return wishlist

@router.put("/{wishlist_id}")
def update_wishlist(wishlist_id: int, wishlist_data: WishlistUpdate,
    db: Session = Depends(get_db)):
    """update wishlist with help of wishlist_id."""
    wishlist = db.query(Wishlist).filter(
        Wishlist.id == wishlist_id
    ).first()

    if not wishlist:
        raise HTTPException(status_code=404,detail="Wishlist not found")

    wishlist.wishlist_name = wishlist_data.wishlist_name
    wishlist.description = wishlist_data.description

    db.commit()
    db.refresh(wishlist)

    return wishlist

@router.delete("/{wishlist_id}")
def delete_wishlist(wishlist_id: int, db: Session = Depends(get_db)):
    """delete wishlist"""
    wishlist = db.query(Wishlist).filter(
        Wishlist.id == wishlist_id
    ).first()

    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")

    db.delete(wishlist)
    db.commit()

    return {"message": "Wishlist deleted"}
