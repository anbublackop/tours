from sqlalchemy import Column, Integer, String
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    age = Column(Integer)
    phone = Column(String)  # New field for phone number
    password = Column(String)  # This should store hashed passwords
    is_admin = Column(Integer, default=0)  # 0 for regular users, 1 for admins
    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, email={self.email}, is_admin={self.is_admin})>"