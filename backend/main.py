"""This module contains the backend logic for the main application."""
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    """Greet the user."""
    return {"message": "Welcome to the Global Gift Budgeter API!"}
