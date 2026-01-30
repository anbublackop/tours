from fastapi import APIRouter
from app.schemas.user import UserCreate

router = APIRouter()

@router.get("/")
def get_users():
    return [
        {"name": "Alice", "email": "alice@example.com", "age": 30},
        {"name": "Bob", "email": "bob@example.com", "age": 25}
    ]

@router.post("/users")
def create_user(user: UserCreate):
    return {
        "name": user.name, "email": user.email, "age": user.age
    }
