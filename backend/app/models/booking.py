from sqlalchemy import Column, Integer, String, JSON
from app.db.base import Base
from datetime import datetime


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    package_id = Column(Integer)

    # Denormalized display fields (set at creation time)
    package_title = Column(String)
    user_name = Column(String)

    status = Column(String, default="confirmed")   # confirmed | cancelled
    total_price = Column(Integer)
    booking_date = Column(String)
    travel_date = Column(String)
    num_people = Column(Integer)
    special_requests = Column(String)
    payment_status = Column(String, default="pending")  # paid | pending
    payment_method = Column(String)

    # Selections made at booking time
    hotel_id = Column(String)
    transport_id = Column(String)
    selected_addons = Column(JSON)   # list[str] of addon IDs

    created_at = Column(String, default=lambda: str(datetime.utcnow()))
    updated_at = Column(String, default=lambda: str(datetime.utcnow()))

    def __repr__(self):
        return f"<Booking(id={self.id}, user_id={self.user_id}, package_id={self.package_id}, status={self.status})>"
