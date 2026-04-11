from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

from schemas.user import UserCreate, UserLogin, Token, UserResponse
from models.user import User
from core.database import get_db
from core.security import verify_password, get_password_hash, create_access_token
from jose import jwt, JWTError
from core.config import settings
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Token yaroqsiz")
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=401, detail="Foydalanuvchi topilmadi")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token muddati tugagan yoki yaroqsiz")

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Ushbu email bazada mavjud!")
    
    # 🌟 INNOVATSIYA: Yashirin kod tekshiruvi! 
    role = "admin" if user.admin_secret_code == "SCadmin" else "user"
    
    hashed_pwd = get_password_hash(user.password)
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        hashed_password=hashed_pwd,
        role=role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Noto'g'ri email yoki parol")
    
    # JWT Tokenga Email va uning maqomi (role) shifrlanadi!
    access_token = create_access_token(data={"sub": db_user.email, "role": db_user.role})
    
    return {"access_token": access_token, "token_type": "bearer", "role": db_user.role}

@router.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat berilmagan")
    return db.query(User).all()

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
