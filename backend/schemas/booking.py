from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BookingCreate(BaseModel):
    car_id: int
    start_date: datetime
    end_date: datetime
    total_price: float

class PaymentInfo(BaseModel):
    method: str  # "payme", "click", "card"
    card_number: Optional[str] = None
    expiry: Optional[str] = None
    cvv: Optional[str] = None

class BookingResponse(BaseModel):
    id: int
    user_id: int
    car_id: int
    start_date: datetime
    end_date: datetime
    total_price: float
    status: str
    payment_status: str
    payment_method: Optional[str]
    transaction_id: Optional[str]
    created_at: datetime
    
    # We might want to include car info in the response
    car_name: Optional[str] = None 
    car_brand: Optional[str] = None

    class Config:
        from_attributes = True
