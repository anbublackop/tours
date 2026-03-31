from sqlalchemy import Column, Integer, String, JSON
from app.db.base import Base
from datetime import datetime


class Package(Base):
    __tablename__ = "packages"

    id = Column(Integer, primary_key=True)

    # Core listing fields
    title = Column(String)
    name = Column(String)           # keep for backwards compat; same as title
    country = Column(String)        # india | nepal | south-korea | thailand | china | sri-lanka
    category = Column(String)       # e.g. "Wildlife Safari"
    state = Column(String)          # nullable; e.g. "Rajasthan"
    description = Column(String)
    price = Column(Integer)         # base price per person (INR)
    original_price = Column(Integer)  # nullable; for discount display
    duration = Column(String)       # e.g. "7D/6N"
    duration_days = Column(Integer)
    location = Column(String)
    image = Column(String)          # URL
    rating = Column(String)         # e.g. "4.8"
    reviews_count = Column(Integer, default=0)
    highlights = Column(JSON)       # list[str]

    # Rich detail fields (JSON blobs matching frontend shapes)
    itinerary = Column(JSON)        # list[{day, title, description, meals, overnight}]
    hotels = Column(JSON)           # list[{id, name, category, pricePerNight, rating, amenities}]
    transport = Column(JSON)        # list[{id, type, description, price}]
    addons = Column(JSON)           # list[{id, name, description, price, icon}]
    inclusions = Column(JSON)       # list[str]
    exclusions = Column(JSON)       # list[str]
    booking_rules = Column(JSON)    # list[str]
    travel_rules = Column(JSON)     # list[str]

    # Legacy / misc
    available_dates = Column(String)
    max_group_size = Column(Integer)
    created_at = Column(String, default=lambda: str(datetime.utcnow()))
    updated_at = Column(String, default=lambda: str(datetime.utcnow()))

    def __repr__(self):
        return f"<Package(id={self.id}, title={self.title}, country={self.country})>"
