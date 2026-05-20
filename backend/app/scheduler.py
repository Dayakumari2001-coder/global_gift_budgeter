"""This module contains the scheduler logic for the application."""
from apscheduler.schedulers.background import (BackgroundScheduler)
from .database import SESSIONLOCAL
from app.api.currency_refresh import refresh_rates

scheduler = BackgroundScheduler()

def scheduled_currency_refresh():
    """Scheduled task to refresh currency rates."""
    db = SESSIONLOCAL()
    try:
        refresh_rates(db)
    finally:
        db.close()

def start_scheduler():
    """Start the scheduler and add the currency refresh job."""
    scheduler.add_job(
        scheduled_currency_refresh,
        "interval",
        hours=12
    )
    scheduler.start()
