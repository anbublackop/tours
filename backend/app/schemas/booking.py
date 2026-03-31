from pydantic import BaseModel
from typing import Optional


class BookingCreate(BaseModel):
    package_id: int
    travel_date: str
    num_people: int
    special_requests: Optional[str] = None
    payment_method: str = "credit_card"
    hotel_id: Optional[str] = None
    transport_id: Optional[str] = None
    selected_addons: Optional[list[str]] = None


class BookingRead(BaseModel):
    id: int
    user_id: int
    package_id: int
    package_title: Optional[str] = None
    user_name: Optional[str] = None
    status: str
    total_price: int
    booking_date: str
    travel_date: str
    num_people: int
    special_requests: Optional[str] = None
    payment_status: str
    payment_method: str
    hotel_id: Optional[str] = None
    transport_id: Optional[str] = None
    selected_addons: Optional[list] = None
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
