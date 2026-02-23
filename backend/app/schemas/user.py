from typing import Optional
from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    email: str
    age: int | None = None
    phone: str | None = None
    is_admin: int | None = 0

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    age: int | None = None
    phone: str | None = None
    is_admin: int | None = 0

class UserDelete(BaseModel):
    id: int