from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Review(Base):
    __tablename__ = "reviews"

    id         = Column(Integer, primary_key=True)
    user_id    = Column(Integer, ForeignKey("users.id",    ondelete="SET NULL"), nullable=True)
    package_id = Column(Integer, ForeignKey("packages.id", ondelete="CASCADE"),  nullable=True)
    email      = Column(String, unique=True)
    rating     = Column(Integer)
    comment    = Column(String)

    # Relationships
    user    = relationship("User",    back_populates="reviews")
    package = relationship("Package", back_populates="reviews")
    
