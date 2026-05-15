"""This file handles users login ,registration and authantication """
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from .database import get_db
from .models import User

# SECRET KEY
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# PASSWORD HASHING
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# LOGIN TOKEN URL
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")

# HASH PASSWORD
def hash_password(password: str):
    """hash password"""
    password = password.strip()
    # bcrypt max length = 72 bytes
    password = password[:72]
    return pwd_context.hash(password)

# VERIFY PASSWORD
def verify_password(plain_password,hashed_password):
    """verify password"""
    plain_password = plain_password.strip()
    plain_password = plain_password[:72]
    return pwd_context.verify(
        plain_password,
        hashed_password
    )

# CREATE ACCESS TOKEN
def create_access_token(data: dict):
    """create access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire })
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# GET CURRENT USER
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """get currenct user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication"
    )
    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError as exe:
        raise credentials_exception from exe

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise credentials_exception
    return user
