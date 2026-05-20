"""This module contains the backend logic for the main application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.scheduler import start_scheduler
from app.api import(
    users,
    wishlists,
    wishlist_items,
    wishlist_summary,
    currency,
    currency_rates,
    currency_convert,
    currency_refresh
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(wishlists.router)
app.include_router(wishlist_items.router)
app.include_router(wishlist_summary.router)
app.include_router(currency.router)
app.include_router(currency_rates.router)
app.include_router(currency_convert.router)
app.include_router(currency_refresh.router)

@app.get("/")
async def root():
    """Greet the user."""
    return {"message": "Welcome to the Global Gift Budgeter API!"}

@app.on_event("startup")
def startup_event():
    """Start the scheduler when the application starts."""
    print("Starting scheduler...")
    start_scheduler()
