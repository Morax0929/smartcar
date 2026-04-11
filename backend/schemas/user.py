from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str
    # YASHIRIN KOD -> Admin yoki User ligini hal qiladi
    admin_secret_code: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    
    class Config:
        from_attributes = True
