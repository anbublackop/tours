from pydantic import BaseModel

class TourCreate(BaseModel):
    name: str
    location: str
    price: float
    duration_days: int