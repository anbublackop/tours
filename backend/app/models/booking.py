from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    package_id = Column(Integer)
    status = Column(String)  # e.g., 'confirmed', 'cancelled'
    total_price = Column(Integer)
    booking_date = Column(String)  # Store as string for simplicity
    travel_date = Column(String)  # Store as string for simplicity
    num_people = Column(Integer)
    special_requests = Column(String)
    payment_status = Column(String)  # e.g., 'paid', 'pending'
    payment_method = Column(String)  # e.g., 'credit_card', 'paypal'
    created_at = Column(String)  # Store as string for simplicity
    updated_at = Column(String)  # Store as string for simplicity
    def __repr__(self):
        return f"<Booking(id={self.id}, user_id={self.user_id}, package_id={self.package_id}, status={self.status})>"
