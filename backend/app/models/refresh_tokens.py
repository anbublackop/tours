from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime
from app.core.config import settings


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id         = Column(Integer, primary_key=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token      = Column(String, nullable=False)
    expires_at = Column(String, default=lambda: str(settings.refresh_token_expire_days))
    is_revoked = Column(Boolean, default=False)
    created_at = Column(String, default=lambda: str(datetime.now()))

    # Relationships
    user = relationship("User", back_populates="refresh_tokens")
