from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from datetime import datetime
from core.database import Base
import enum

class DocumentType(str, enum.Enum):
    PASSPORT = "passport"
    LICENSE = "license"
    AGREEMENT = "agreement"
    RECEIPT = "receipt"

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    
    file_name = Column(String)
    file_url = Column(String)
    
    # passport, license, agreement, receipt
    type = Column(String)
    
    # pending, verified, rejected
    status = Column(String, default="pending")
    
    created_at = Column(DateTime, default=datetime.utcnow)
