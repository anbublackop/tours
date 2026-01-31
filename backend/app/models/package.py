from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Package(Base):
    __tablename__ = "packages"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    price = Column(Integer)
    duration_days = Column(Integer)
    location = Column(String)
    available_dates = Column(String)  # Store as string for simplicity
    max_group_size = Column(Integer)
    created_at = Column(String)  # Store as string for simplicity
    updated_at = Column(String)  # Store as string for simplicity
    def __repr__(self):
        return f"<Package(id={self.id}, name={self.name}, location={self.location}, price={self.price})>"
