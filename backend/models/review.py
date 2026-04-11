from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from datetime import datetime
from core.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    car_id = Column(Integer, ForeignKey("cars.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    user_name = Column(String)    # Ko'rsatish uchun ism
    rating = Column(Float)        # 1-5 yulduz
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
