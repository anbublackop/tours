from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    email = Column(String, unique=True)
    rating = Column(Integer)
    comment = Column(String)
    
