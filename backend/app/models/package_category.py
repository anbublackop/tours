from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base


class PackageCategory(Base):
    __tablename__ = "package_categories"

    id          = Column(Integer, primary_key=True)
    slug        = Column(String, unique=True, nullable=False)  # e.g. "wildlife-safari"
    name        = Column(String, nullable=False)               # e.g. "Wildlife Safari"
    description = Column(String)
    icon        = Column(String)  # emoji, e.g. "🦁"

    # Relationships
    packages = relationship("Package", back_populates="package_category", lazy="dynamic")

    def __repr__(self):
        return f"<PackageCategory(id={self.id}, slug={self.slug})>"
