from pydantic import BaseModel

class PackageCreate(BaseModel):
    name: str
    location: str
    price: float
    duration_days: int