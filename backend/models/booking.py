from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from core.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    car_id = Column(Integer, ForeignKey("cars.id"))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    total_price = Column(Float)
    
    # "pending", "confirmed", "cancelled", "completed"
    status = Column(String, default="pending")
    
    # "unpaid", "paid", "refunded"
    payment_status = Column(String, default="unpaid")
    
    # "payme", "click", "card"
    payment_method = Column(String, nullable=True)
    
    transaction_id = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
