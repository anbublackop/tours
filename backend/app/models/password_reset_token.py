from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.base import Base


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id         = Column(Integer, primary_key=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token      = Column(String, nullable=False, unique=True, index=True)
    expires_at = Column(DateTime, nullable=False)
    is_used    = Column(Boolean, default=False, nullable=False)
    created_at = Column(String, default=lambda: str(datetime.utcnow()))

    user = relationship("User", back_populates="password_reset_tokens")
