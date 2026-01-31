from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserCreate, UserRead
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.db.session import get_db
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=list[UserRead])
def get_users():
    return [
        {"name": "Alice", "email": "alice@example.com", "age": 30},
        {"name": "Bob", "email": "bob@example.com", "age": 25}
    ]

@router.post(
    "",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    # Check if email exists
    # existing_user = db.query(User).filter(User.email == user.email).first()
    # if existing_user:
    #     raise HTTPException(
    #         status_code=400,
    #         detail="Email already registered",
    #     )

    db_user = User(
        name=user.name,
        email=user.email,
        # hashed_password=hash_password(user.password),
        password=user.password,
        age=user.age
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

# @router.get("/{id}", response_model=UserRead)
# def get_user(id: int):
#     return db_user  # ORM object