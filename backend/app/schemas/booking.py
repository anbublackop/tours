from pydantic import BaseModel
from typing import Optional


class BookingCreate(BaseModel):
    package_id: int
    travel_date: str
    num_people: int
    special_requests: Optional[str] = None
    payment_method: str  # e.g. 'credit_card', 'paypal'


class BookingRead(BaseModel):
    id: int
    user_id: int
    package_id: int
    status: str
    total_price: int
    booking_date: str
    travel_date: str
    num_people: int
    special_requests: Optional[str] = None
    payment_status: str
    payment_method: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
