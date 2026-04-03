from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime


class Enquiry(Base):
    __tablename__ = "enquiries"

    id           = Column(Integer, primary_key=True)
    package_id   = Column(Integer, ForeignKey("packages.id", ondelete="SET NULL"), nullable=True)
    name         = Column(String, nullable=False)
    email        = Column(String, nullable=False)
    phone        = Column(String)
    subject      = Column(String)
    message      = Column(String, nullable=False)
    package_name = Column(String)   # denormalized; kept for display when package is deleted
    created_at   = Column(String, default=lambda: str(datetime.utcnow()))

    # Relationships
    package = relationship("Package", back_populates="enquiries")

    def __repr__(self):
        return f"<Enquiry(id={self.id}, email={self.email})>"
