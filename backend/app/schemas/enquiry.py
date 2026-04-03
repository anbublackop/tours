from pydantic import BaseModel
from typing import Optional


class EnquiryCreate(BaseModel):
    package_id: Optional[int] = None
    name: str
    email: str
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str
    package_name: Optional[str] = None


class EnquiryRead(BaseModel):
    id: int
    package_id: Optional[int] = None
    name: str
    email: str
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str
    package_name: Optional[str] = None
    created_at: str

    model_config = {"from_attributes": True}
