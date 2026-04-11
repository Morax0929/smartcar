from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from core.database import get_db
from models.booking import Booking
from models.car import Car
from models.user import User
from schemas.booking import BookingCreate, BookingResponse, PaymentInfo
from api.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=BookingResponse)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Mashina mavjudligini tekshirish
    car = db.query(Car).filter(Car.id == booking_in.car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Avtomobil topilmadi")
    
    if not car.is_available:
        raise HTTPException(status_code=400, detail="Avtomobil hozirda band")

    # 2. Bronni yaratish
    db_booking = Booking(
        user_id=current_user.id,
        car_id=booking_in.car_id,
        start_date=booking_in.start_date,
        end_date=booking_in.end_date,
        total_price=booking_in.total_price,
        status="pending"
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    
    return db_booking

@router.post("/{booking_id}/pay", response_model=BookingResponse)
def process_payment(
    booking_id: int,
    payment_in: PaymentInfo,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id, Booking.user_id == current_user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Bron topilmadi")

    # To'lov simulyatsiyasi (Reallikga yaqin)
    if payment_in.method == "card":
        if not payment_in.card_number or len(payment_in.card_number.replace(" ", "")) != 16:
             raise HTTPException(status_code=400, detail="Karta raqami noto'g'ri")
        
    # To'lovni muvaffaqiyatli deb hisoblash va statuslarni yangilash
    booking.payment_status = "paid"
    booking.payment_method = payment_in.method
    booking.status = "confirmed"
    booking.transaction_id = f"TXN-{uuid.uuid4().hex[:8].upper()}"
    
    # Mashinani band qilish (oddiy simulyatsiya - aslida sanalarni tekshirish kerak)
    car = db.query(Car).filter(Car.id == booking.car_id).first()
    if car:
        car.is_available = False
        
    db.commit()
    db.refresh(booking)
    return booking

@router.get("/my", response_model=List[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()
    
    # Har bir bron uchun mashina nomini qo'shish (Frontend uchun qulaylik)
    for b in bookings:
        car = db.query(Car).filter(Car.id == b.car_id).first()
        if car:
            b.car_name = car.name
            b.car_brand = car.brand
            
    return bookings

@router.get("/all", response_model=List[BookingResponse])
def get_all_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat berilmagan")
        
    bookings = db.query(Booking).all()
    for b in bookings:
        car = db.query(Car).filter(Car.id == b.car_id).first()
        if car:
            b.car_name = car.name
            b.car_brand = car.brand
    return bookings
@router.put("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: int,
    new_status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat berilmagan")
        
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Bron topilmadi")
        
    booking.status = new_status
    
    # Hujjat yaratish simulyatsiyasi
    from models.document import Document as DocModel
    
    if new_status == "confirmed":
        # Ijara shartnomasi yaratish (simulyatsiya)
        new_doc = DocModel(
            user_id=booking.user_id,
            booking_id=booking_id,
            file_name=f"Shartnoma_{booking.id}.pdf",
            file_url=f"http://localhost:8000/uploads/documents/agreement_sample.pdf",
            type="agreement",
            status="verified"
        )
        db.add(new_doc)
    
    # Agar mashina qaytarilgan bo'lsa (completed), mashinani yana mavjud qilish
    if new_status == "completed":
        car = db.query(Car).filter(Car.id == booking.car_id).first()
        if car:
            car.is_available = True
            
    db.commit()
    db.refresh(booking)
    return booking
