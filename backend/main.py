"""This module contains the backend logic for the main application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import(
    users,
    wishlists,
    wishlist_items,
    wishlist_summary,
    currency_rates,
    currency_convert,
    currency_refresh
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(wishlists.router)
app.include_router(wishlist_items.router)
app.include_router(wishlist_summary.router)
app.include_router(currency_rates.router)
app.include_router(currency_convert.router)
app.include_router(currency_refresh.router)

@app.get("/")
async def root():
    """Greet the user."""
    return {"message": "Welcome to the Global Gift Budgeter API!"}
