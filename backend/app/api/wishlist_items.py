"""This file handles:add, get, update, delete items"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from decimal import Decimal

from app.database import get_db
from app.models import (User, Wishlist, WishlistItem,ExchangeRate)
from app.schemas import (WishlistItemCreate, WishlistItemUpdate)

router = APIRouter(
    prefix="/api/items",
    tags=["Wishlist Items"]
)
@router.post("/{wishlist_id}")
def add_item(wishlist_id: int,item_data: WishlistItemCreate,db: Session = Depends(get_db)):
    """add item in wishlist."""
    wishlist = db.query(Wishlist).filter(
        Wishlist.id == wishlist_id
    ).first()

    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")

    user = db.query(User).filter(
        User.id == wishlist.user_id
    ).first()

    home_currency = user.home_currency
    foreign_currency = item_data.foreign_currency.upper()

    if foreign_currency == home_currency:
        converted_price = item_data.foreign_price
    else:
        from_rate = db.query(ExchangeRate).filter(
            ExchangeRate.from_currency == "USD",
            ExchangeRate.to_currency == foreign_currency
        ).first()

        to_rate = db.query(ExchangeRate).filter(
            ExchangeRate.from_currency == "USD",
            ExchangeRate.to_currency == home_currency
        ).first()

        if not from_rate or not to_rate:
            raise HTTPException(
                status_code=404,
                detail="Currency not found in exchange_rate data."
            )
        rate = (
            to_rate.rate / from_rate.rate
        )
        converted_price = Decimal(str(item_data.foreign_price)) * rate

    new_item = WishlistItem(
        wishlist_id=wishlist_id,
        item_name=item_data.item_name,
        description=item_data.description,
        foreign_price=item_data.foreign_price,
        foreign_currency=foreign_currency,
        converted_price=round(converted_price, 2)
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

# GET ITEMS
@router.get("/{wishlist_id}")
def get_items(wishlist_id: int, db: Session = Depends(get_db)):
    """get itms from wishlist"""
    items = db.query(WishlistItem).filter(
        WishlistItem.wishlist_id == wishlist_id
    ).all()

    return items

# UPDATE ITEM
@router.put("/{item_id}")
def update_item(item_id: int, item_data: WishlistItemUpdate, db: Session = Depends(get_db)):
    """update item in wishlist"""
    item = db.query(WishlistItem).filter(
        WishlistItem.id == item_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.item_name = item_data.item_name
    item.description = item_data.description
    item.foreign_price = item_data.foreign_price
    item.foreign_currency = item_data.foreign_currency

    db.commit()
    db.refresh(item)

    return item

# DELETE ITEM
@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    """delete item"""
    item = db.query(WishlistItem).filter(
        WishlistItem.id == item_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()

    return {"message": "Item deleted"}
