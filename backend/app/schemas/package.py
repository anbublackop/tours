from pydantic import BaseModel
from typing import Optional, Any


class PackageCreate(BaseModel):
    title: str
    country: str
    category: str
    destination_id: Optional[int] = None
    category_id: Optional[int] = None
    state: Optional[str] = None
    description: Optional[str] = None
    price: int
    original_price: Optional[int] = None
    duration: str
    duration_days: int
    location: str
    image: Optional[str] = None
    rating: Optional[str] = None
    reviews_count: Optional[int] = 0
    highlights: Optional[list] = None
    itinerary: Optional[list] = None
    hotels: Optional[list] = None
    transport: Optional[list] = None
    addons: Optional[list] = None
    inclusions: Optional[list] = None
    exclusions: Optional[list] = None
    booking_rules: Optional[list] = None
    travel_rules: Optional[list] = None
    available_dates: Optional[str] = None
    max_group_size: Optional[int] = None


class PackageUpdate(BaseModel):
    title: Optional[str] = None
    country: Optional[str] = None
    category: Optional[str] = None
    destination_id: Optional[int] = None
    category_id: Optional[int] = None
    state: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    original_price: Optional[int] = None
    duration: Optional[str] = None
    duration_days: Optional[int] = None
    location: Optional[str] = None
    image: Optional[str] = None
    rating: Optional[str] = None
    reviews_count: Optional[int] = None
    highlights: Optional[list] = None
    itinerary: Optional[list] = None
    hotels: Optional[list] = None
    transport: Optional[list] = None
    addons: Optional[list] = None
    inclusions: Optional[list] = None
    exclusions: Optional[list] = None
    booking_rules: Optional[list] = None
    travel_rules: Optional[list] = None
    available_dates: Optional[str] = None
    max_group_size: Optional[int] = None


class PackageListRead(BaseModel):
    """Lightweight schema for listing pages (index, packages grid)."""
    id: int
    destination_id: Optional[int] = None
    category_id: Optional[int] = None
    title: str
    country: str
    category: Optional[str] = None
    state: Optional[str] = None
    duration: str
    duration_days: Optional[int] = None
    price: int
    original_price: Optional[int] = None
    location: Optional[str] = None
    image: Optional[str] = None
    rating: Optional[str] = None
    reviews_count: Optional[int] = None
    highlights: Optional[list] = None
    is_active: Optional[int] = 1

    model_config = {"from_attributes": True}


class PackageRead(PackageListRead):
    """Full schema for package detail page."""
    description: Optional[str] = None
    itinerary: Optional[list] = None
    hotels: Optional[list] = None
    transport: Optional[list] = None
    addons: Optional[list] = None
    inclusions: Optional[list] = None
    exclusions: Optional[list] = None
    booking_rules: Optional[list] = None
    travel_rules: Optional[list] = None
    available_dates: Optional[str] = None
    max_group_size: Optional[int] = None
