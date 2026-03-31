from asyncio.log import logger
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user, hash_password, require_admin
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead

router = APIRouter()


@router.get("", response_model=list[UserRead])
def list_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Admin only — list all users."""
    return db.query(User).all()


@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    """Authenticated — return the current user's profile."""
    return current_user


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Public — register a new user account."""
    try:
        db_user = User(
            name=user.name,
            email=user.email,
            password=hash_password(user.password),
            age=user.age,
            phone=user.phone,
            is_admin=user.is_admin,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        logger.info(f"Error creating user: {e}")
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists with this email")
    return db_user
