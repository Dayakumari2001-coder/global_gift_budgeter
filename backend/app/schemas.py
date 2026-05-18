"""This file contains: request validation, response validation, Pydantic schemas for FastAPI"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# =====================================================
# USER SCHEMAS
# =====================================================
class UserCreate(BaseModel):
    """user register with their name,email, passward, home currency."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    home_currency: str = Field(..., min_length=3, max_length=3)

class UserLogin(BaseModel):
    """user login"""
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserResponse(BaseModel):
    """user response"""
    id: int
    name: str
    email: str
    home_currency: str
    created_at: datetime

    class ConfigDict:
        """model_configration"""
        from_attributes = True

class UserUpdate(BaseModel):
    """user can update name, home currency """
    name: Optional[str] = None
    home_currency: Optional[str] = Field(None, min_length=3, max_length=3)

class Token(BaseModel):
    """token"""
    access_token: str
    token_type: str

# =====================================================
# WISHLIST SCHEMAS
# =====================================================
class WishlistCreate(BaseModel):
    """creatte wishlist"""
    wishlist_name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] | None = None

class WishlistUpdate(BaseModel):
    """update wishlist"""
    wishlist_name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] | None = None

class WishlistResponse(BaseModel):
    """wishlist response"""
    id: int
    user_id: int
    wishlist_name: str
    description: Optional[str] | None
    created_at: datetime
    updated_at: datetime

    class ConfigDict:
        """model configration"""
        from_attributes = True

# =====================================================
# WISHLIST ITEM SCHEMAS
# =====================================================
class WishlistItemCreate(BaseModel):
    """create item"""
    item_name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    foreign_price: float = Field(..., gt=0)
    foreign_currency: str = Field(..., min_length=3, max_length=3)

class WishlistItemUpdate(BaseModel):
    """udpdate item"""
    item_name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    foreign_price: float = Field(..., gt=0)
    foreign_currency: str = Field(..., min_length=3, max_length=3)

class WishlistItemResponse(BaseModel):
    """item response"""
    id: int
    wishlist_id: int
    item_name: str
    description: Optional[str]
    foreign_price: float
    foreign_currency: str
    converted_price: float
    created_at: datetime
    updated_at: datetime

    class ConfigDict:
        """model configration"""
        from_attributes = True

# =====================================================
# EXCHANGE RATE SCHEMAS
# =====================================================
class ExchangeRateCreate(BaseModel):
    """create exchange rate """
    from_currency: str = Field(..., min_length=3, max_length=3)
    to_currency: str = Field(..., min_length=3, max_length=3)
    rate: float = Field(..., gt=0)

class ExchangeRateResponse(BaseModel):
    """exchange rate response"""
    id: int
    from_currency: str
    to_currency: str
    rate: float
    last_updated: datetime
    class ConfigDict:
        """model configration"""
        from_attributes = True

class ConversionResponse(BaseModel):
    """currency conversion response"""
    original_amount: float
    from_currency: str
    to_currency: str
    converted_amount: float
    rate: float
    last_updated: datetime

class WishlistSummaryResponse(BaseModel):
    """summary response of the wishlist."""
    wishlist_id: int
    wishlist_name: str
    user_name: str
    home_currency: str
    total_items: int
    total_budget: float
