from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id       = Column(Integer, primary_key=True)
    name     = Column(String)
    email    = Column(String, unique=True, index=True)
    age      = Column(Integer)
    phone    = Column(String)
    password = Column(String)
    is_admin = Column(Integer, default=0)

    # Relationships
    bookings       = relationship("Booking",      back_populates="user",  lazy="dynamic")
    reviews        = relationship("Review",       back_populates="user",  lazy="dynamic")
    refresh_tokens = relationship("RefreshToken", back_populates="user",  lazy="dynamic")

    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, email={self.email}, is_admin={self.is_admin})>"