from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String, nullable=True)
    hashed_password = Column(String)
    
    # "user" yoki "admin" maqomi (Role)
    role = Column(String, default="user") 
    
    created_at = Column(DateTime, default=datetime.utcnow)
