from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from datetime import datetime
from core.database import Base

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)         # Chevrolet Malibu
    brand = Column(String, index=True)        # Chevrolet
    category = Column(String)                 # Premium, Comfort, Krossover
    price_per_day = Column(Float)             # Kunlik narx (UZS)
    image_url = Column(String, nullable=True) # Rasm URL
    description = Column(Text, nullable=True)
    is_available = Column(Boolean, default=True)
    year = Column(Integer, nullable=True)
    mileage = Column(Integer, default=0)              # Umumiy probeq
    last_service_mileage = Column(Integer, default=0) # Oxirgi servis probeqi 
    created_at = Column(DateTime, default=datetime.utcnow)
