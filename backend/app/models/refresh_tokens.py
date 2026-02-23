from sqlalchemy import Column, Integer, String
from app.db.base import Base
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from datetime import datetime
from app.core.config import settings

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    token = Column(String, nullable=False)
    expires_at = Column(String, default=lambda: str(settings.refresh_token_expire_days))
    is_revoked = Column(Boolean, default=False)
    created_at = Column(String, default=lambda: str(datetime.now()))  # Store as string for simplicity
