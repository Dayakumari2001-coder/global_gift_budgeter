"""this file handing:data"""
from sqlalchemy import (
    Column,
    Integer,
    String,
    DECIMAL,
    ForeignKey,
    TIMESTAMP,
    func
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    """user table"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False,index=True)
    password_hash = Column(String(255), nullable=False)
    home_currency = Column(String(3), nullable=False, default="USD", index=True)
    created_at = Column(TIMESTAMP, server_default=func.now.fetch_value())

    wishlists = relationship("Wishlist",back_populates="user",cascade="all, delete")


class Wishlist(Base):
    """wishlist table"""
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    wishlist_name = Column( String(255), nullable=False, index=True)
    description = Column( String(500))

    created_at = Column( TIMESTAMP, server_default=func.now())
    updated_at = Column( TIMESTAMP, server_default=func.now(),
                        onupdate=func.now())

    user = relationship("User",back_populates="wishlists")
    items = relationship("WishlistItem", back_populates="wishlist",cascade="all, delete")

class WishlistItem(Base):
    """wishlist items table"""
    __tablename__ = "wishlist_items"

    id = Column(Integer,primary_key=True,index=True)
    wishlist_id = Column(Integer,ForeignKey("wishlists.id", ondelete="CASCADE"),nullable=False)
    item_name = Column(String(255),nullable=False)
    description = Column( String(500))
    foreign_price = Column( DECIMAL(10, 2), nullable=False)
    foreign_currency = Column( String(3), nullable=False, index=True)
    converted_price = Column( DECIMAL(10, 2))

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(),
                        onupdate=func.now())

    wishlist = relationship("Wishlist", back_populates="items")

class ExchangeRate(Base):
    """exchange rates table"""
    __tablename__ = "exchange_rates"

    id = Column(Integer, primary_key=True, index=True)
    from_currency = Column(String(3), nullable=False, index=True)
    to_currency = Column( String(3), nullable=False, index=True)
    rate = Column(DECIMAL(10, 6), nullable=False)
    last_updated = Column(TIMESTAMP, server_default=func.now(),
                          onupdate=func.now())
