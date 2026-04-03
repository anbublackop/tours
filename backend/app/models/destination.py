from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime


class Destination(Base):
    __tablename__ = "destinations"

    id          = Column(Integer, primary_key=True)
    slug        = Column(String, unique=True, nullable=False)   # e.g. "india", "south-korea"
    name        = Column(String, nullable=False)                # e.g. "India"
    description = Column(String)
    image_url   = Column(String)   # card thumbnail (home page grid)
    banner_url  = Column(String)   # full-width banner (packages list page)
    is_featured = Column(Boolean, default=True)
    created_at  = Column(String, default=lambda: str(datetime.utcnow()))

    # Relationships
    packages = relationship("Package", back_populates="destination", lazy="dynamic")

    def __repr__(self):
        return f"<Destination(id={self.id}, slug={self.slug})>"
