from asyncio.log import logger
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserCreate, UserRead
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.db.session import get_db
from app.models.user import User

router = APIRouter()

@router.get(
    "", 
    response_model=list[UserRead], 
    status_code=status.HTTP_200_OK
)
def get_users(db: Session = Depends(get_db)):
    try:
        users = db.query(User).all()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post(
    "",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    try:
        db_user = User(
            name=user.name,
            email=user.email,
            password=hash_password(user.password),
            age=user.age,
            is_admin=user.is_admin
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        logger.info(f"Error creating user: {e}")
        raise HTTPException(
            status_code=409,
            detail="User already exists with this email"
        )
    return db_user
