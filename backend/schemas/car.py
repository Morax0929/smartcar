from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CarCreate(BaseModel):
    name: str
    brand: str
    category: str
    price_per_day: float
    image_url: Optional[str] = None
    description: Optional[str] = None
    year: Optional[int] = None

class CarResponse(BaseModel):
    id: int
    name: str
    brand: str
    category: str
    price_per_day: float
    image_url: Optional[str]
    description: Optional[str]
    is_available: bool
    year: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    car_id: int
    rating: float
    comment: str

class ReviewResponse(BaseModel):
    id: int
    car_id: int
    user_name: str
    rating: float
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True
