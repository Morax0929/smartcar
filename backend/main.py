from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from core.database import engine, Base
from api.auth import router as auth_router
from api.cars import router as cars_router
from api.upload import router as upload_router

from api.bookings import router as bookings_router
from api.documents import router as documents_router
from api.ai import router as ai_router
from api.damage import router as damage_router

# Barcha modellarni import qilamiz
from models import user, car, review, booking, document  # noqa: F401

# Ma'lumotlar bazasini yaratish
Base.metadata.create_all(bind=engine)

# Rasm yuklash uchun papkalarni yaratish
os.makedirs("uploads", exist_ok=True)
os.makedirs("uploads/documents", exist_ok=True)

app = FastAPI(title="SmartCar AI Platform API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Yuklangan rasmlarni statik fayl sifatida tarqatish
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router, prefix="/api/auth", tags=["Autentifikatsiya"])
app.include_router(cars_router, prefix="/api/cars", tags=["Avtomobillar"])
app.include_router(upload_router, prefix="/api/upload", tags=["Fayl Yuklash"])
app.include_router(bookings_router, prefix="/api/bookings", tags=["Bron Qilish"])
app.include_router(documents_router, prefix="/api/documents", tags=["Hujjatlar"])
app.include_router(ai_router, prefix="/api/ai", tags=["AI Xizmatlari"])
app.include_router(damage_router, prefix="/api/damage", tags=["Zarar Tahlili"])

@app.get("/")
def read_root():
    return {"message": "SmartCar AI Platform API ishlaydi! 🚗🚀", "version": "1.0.0"}
