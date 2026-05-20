"""This file handles user login, registration and profile related function."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.currency_refresh import refresh_rates
from ..database import get_db
from ..models import User
from ..schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
    Token
)
from ..auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

@router.post("/register", response_model=UserResponse)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """register"""
    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(status_code=400,detail="Email already exists")
    hashed_password = hash_password(user_data.password)

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        home_currency=user_data.home_currency.upper()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):
    """login"""
    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    valid_password = verify_password(user_data.password,user.password_hash)

    if not valid_password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token = create_access_token(data={"user_id": user.id})
    refresh_rates(db)  # Refresh rates on login to ensure user gets the latest rates
    return{
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "home_currency":
                user.home_currency
        }
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """current user"""
    return current_user
