# app/api/v1/api.py
from fastapi import APIRouter

from app.api.v1 import packages, users, auth, bookings, reviews

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth")
api_router.include_router(packages.router, prefix="/packages")
api_router.include_router(users.router, prefix="/users")
api_router.include_router(bookings.router, prefix="/bookings")
api_router.include_router(reviews.router, prefix="/reviews")

@api_router.get("/")
async def read_root():
    return {"message": "Welcome to the Travel Booking API v1"}