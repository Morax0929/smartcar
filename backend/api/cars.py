from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from schemas.car import CarCreate, CarResponse, ReviewCreate, ReviewResponse
from models.car import Car
from models.review import Review
from models.user import User
from core.database import get_db
from api.auth import get_current_user

router = APIRouter()

# ── Cars CRUD ────────────────────────────────────────────────

@router.get("/", response_model=List[CarResponse])
def get_all_cars(db: Session = Depends(get_db)):
    return db.query(Car).all()

@router.get("/available", response_model=List[CarResponse])
def get_available_cars(db: Session = Depends(get_db)):
    return db.query(Car).filter(Car.is_available == True).all()

@router.get("/{car_id}", response_model=CarResponse)
def get_car_by_id(car_id: int, db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Avtomobil topilmadi")
    return car

@router.post("/", response_model=CarResponse)
def create_car(car_data: CarCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Faqat adminlar mashina qo'sha oladi!")
    new_car = Car(**car_data.model_dump())
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    return new_car

@router.delete("/{car_id}")
def delete_car(car_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Faqat adminlar o'chira oladi!")
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Mashina topilmadi")
    db.delete(car)
    db.commit()
    return {"message": "Mashina o'chirildi"}

@router.put("/{car_id}", response_model=CarResponse)
def update_car(car_id: int, car_data: CarCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Faqat adminlar tahrirlash huquqiga ega!")
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Mashina topilmadi")
    for key, value in car_data.model_dump().items():
        setattr(car, key, value)
    db.commit()
    db.refresh(car)
    return car

# ── Reviews ───────────────────────────────────────────────────

@router.get("/{car_id}/reviews", response_model=List[ReviewResponse])
def get_car_reviews(car_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.car_id == car_id).all()

@router.post("/{car_id}/reviews", response_model=ReviewResponse)
def add_review(car_id: int, review_data: ReviewCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_review = Review(
        car_id=car_id,
        user_id=current_user.id,
        user_name=current_user.full_name,
        rating=review_data.rating,
        comment=review_data.comment
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review
