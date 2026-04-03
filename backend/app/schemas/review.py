from pydantic import BaseModel, Field
from typing import Optional


class ReviewCreate(BaseModel):
    package_id: Optional[int] = None
    rating: int = Field(..., ge=1, le=5)
    comment: str


class ReviewRead(BaseModel):
    id: int
    user_id: Optional[int] = None
    package_id: Optional[int] = None
    email: str
    rating: int
    comment: str

    model_config = {"from_attributes": True}
