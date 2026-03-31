from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str


class ReviewRead(BaseModel):
    id: int
    user_id: int
    email: str
    rating: int
    comment: str

    class Config:
        from_attributes = True
