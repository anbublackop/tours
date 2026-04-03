from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime



class Package(Base):
    __tablename__ = "packages"

    id = Column(Integer, primary_key=True)

    # FK to destinations
    destination_id = Column(Integer, ForeignKey("destinations.id", ondelete="SET NULL"), nullable=True)

    # FK to package_categories
    category_id = Column(Integer, ForeignKey("package_categories.id", ondelete="SET NULL"), nullable=True)

    # Core listing fields
    title = Column(String)
    name = Column(String)           # keep for backwards compat; same as title
    country = Column(String)        # india | nepal | south-korea | thailand | china | sri-lanka
    category = Column(String)       # e.g. "Wildlife Safari"
    state = Column(String)          # nullable; e.g. "Rajasthan"
    description = Column(String)
    price = Column(Integer)         # base price per person (INR)
    original_price = Column(Integer)
    duration = Column(String)       # e.g. "7D/6N"
    duration_days = Column(Integer)
    location = Column(String)
    image = Column(String)          # URL
    rating = Column(String)         # e.g. "4.8"
    reviews_count = Column(Integer, default=0)
    highlights = Column(JSON)       # list[str]

    # Rich detail fields
    itinerary    = Column(JSON)   # list[{day, title, description, meals, overnight, image_url}]
    hotels       = Column(JSON)   # list[{id, name, category, pricePerNight, rating, amenities}]
    transport    = Column(JSON)   # list[{id, type, description, price}]
    addons       = Column(JSON)   # list[{id, name, description, price, icon}]
    inclusions   = Column(JSON)   # list[str]
    exclusions   = Column(JSON)   # list[str]
    booking_rules = Column(JSON)  # list[str]
    travel_rules  = Column(JSON)  # list[str]

    # Legacy / misc
    available_dates = Column(String)
    max_group_size  = Column(Integer)
    created_at = Column(String, default=lambda: str(datetime.utcnow()))
    updated_at = Column(String, default=lambda: str(datetime.utcnow()))

    # Relationships
    destination      = relationship("Destination",    back_populates="packages")
    package_category = relationship("PackageCategory", back_populates="packages")
    bookings         = relationship("Booking",         back_populates="package", lazy="dynamic")
    reviews          = relationship("Review",          back_populates="package", lazy="dynamic")
    enquiries        = relationship("Enquiry",         back_populates="package", lazy="dynamic")

    def __repr__(self):
        return f"<Package(id={self.id}, title={self.title}, country={self.country})>"
