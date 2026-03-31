from pydantic import BaseModel
from typing import Optional


class EnquiryCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str
    package_name: Optional[str] = None


class EnquiryRead(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str
    package_name: Optional[str] = None
    created_at: str

    class Config:
        from_attributes = True
