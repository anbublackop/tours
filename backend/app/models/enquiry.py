from sqlalchemy import Column, Integer, String
from app.db.base import Base
from datetime import datetime


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String)
    subject = Column(String)          # nullable; set from Enquiry page, not modal
    message = Column(String, nullable=False)
    package_name = Column(String)     # nullable; pre-filled when enquiring about a package
    created_at = Column(String, default=lambda: str(datetime.utcnow()))

    def __repr__(self):
        return f"<Enquiry(id={self.id}, email={self.email})>"
