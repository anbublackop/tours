"""Password reset endpoints — forgot-password and reset-password."""
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.email import send_password_reset_email
from app.core.security import hash_password
from app.db.session import get_db
from app.models.password_reset_token import PasswordResetToken
from app.models.user import User
from app.schemas.password_reset import ForgotPasswordRequest, MessageResponse, ResetPasswordRequest

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

_SAFE_MSG = "If that email is registered, a reset link has been sent."


@router.post(
    "/forgot-password",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
)
@limiter.limit("5/minute")
def forgot_password(
    request: Request,
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    """Public — request a password reset link.

    Always returns the same message to prevent user enumeration.
    """
    user = db.query(User).filter(User.email == payload.email).first()

    if user:
        # Invalidate any existing unused tokens for this user
        (
            db.query(PasswordResetToken)
            .filter(
                PasswordResetToken.user_id == user.id,
                PasswordResetToken.is_used.is_(False),
            )
            .update({"is_used": True})
        )
        db.commit()

        token = secrets.token_urlsafe(32)
        expires = datetime.now(timezone.utc) + timedelta(hours=1)

        reset_token = PasswordResetToken(
            user_id=user.id,
            token=token,
            expires_at=expires,
        )
        db.add(reset_token)
        db.commit()

        send_password_reset_email(user.email, token)

    return {"message": _SAFE_MSG}


@router.post(
    "/reset-password",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
)
@limiter.limit("10/minute")
def reset_password(
    request: Request,
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    """Public — reset password using a valid token."""
    if len(payload.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 8 characters.",
        )

    token_record = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token == payload.token,
            PasswordResetToken.is_used.is_(False),
        )
        .first()
    )

    if not token_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or already-used reset link.",
        )

    expires_aware = token_record.expires_at.replace(tzinfo=timezone.utc)
    if expires_aware < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset link has expired. Please request a new one.",
        )

    user = db.query(User).filter(User.id == token_record.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.password = hash_password(payload.new_password)
    token_record.is_used = True
    db.commit()

    return {"message": "Password reset successfully. You can now log in."}
