from pydantic import BaseModel
from typing import Optional


class DestinationCreate(BaseModel):
    slug: str
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    banner_url: Optional[str] = None
    is_featured: bool = True


class DestinationRead(BaseModel):
    id: int
    slug: str
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    banner_url: Optional[str] = None
    is_featured: bool
    created_at: str

    model_config = {"from_attributes": True}
