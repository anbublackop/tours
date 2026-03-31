from pydantic import BaseModel
from typing import Optional


class PackageCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: int
    duration_days: int
    location: str
    available_dates: Optional[str] = None
    max_group_size: Optional[int] = None


class PackageUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    duration_days: Optional[int] = None
    location: Optional[str] = None
    available_dates: Optional[str] = None
    max_group_size: Optional[int] = None


class PackageRead(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: int
    duration_days: int
    location: str
    available_dates: Optional[str] = None
    max_group_size: Optional[int] = None

    class Config:
        from_attributes = True
