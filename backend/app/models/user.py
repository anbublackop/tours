from sqlalchemy import Column, Integer, String
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    age = Column(Integer)
    password = Column(String)  # This should store hashed passwords
    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, email={self.email})>"
