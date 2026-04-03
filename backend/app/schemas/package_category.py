from pydantic import BaseModel
from typing import Optional


class PackageCategoryCreate(BaseModel):
    slug: str
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None


class PackageCategoryRead(BaseModel):
    id: int
    slug: str
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None

    model_config = {"from_attributes": True}
