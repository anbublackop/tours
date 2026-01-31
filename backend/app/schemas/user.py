from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    email: str
    age: int

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    age: int | None = None

class UserDelete(BaseModel):
    id: int