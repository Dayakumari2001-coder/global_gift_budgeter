""" This file handles database configuration and MySQL connection setup using SQLAlchemy"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, scoped_session
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=False, pool_pre_ping=True
)

SESSIONLOCAL = scoped_session(sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
))

# BASE CLASS
Base = declarative_base()

def get_db():
    """database dependancy"""
    db = SESSIONLOCAL()
    try:
        yield db
    finally:
        db.close()
