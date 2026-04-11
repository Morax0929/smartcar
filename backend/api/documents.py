from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
import shutil
from core.database import get_db
from models.document import Document
from models.user import User
from api.auth import get_current_user

router = APIRouter()

UPLOAD_DIR = "uploads/documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=None)
async def upload_document(
    type: str,
    booking_id: int = None,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fayl nomini generatsiya qilish
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    file_url = f"http://localhost:8000/uploads/documents/{filename}"
    
    # Bazaga saqlash
    db_doc = Document(
        user_id=current_user.id,
        booking_id=booking_id,
        file_name=file.filename,
        file_url=file_url,
        type=type,
        status="pending" if type in ["passport", "license"] else "verified"
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    
    return db_doc

@router.get("/my", response_model=None)
def get_my_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Document).filter(Document.user_id == current_user.id).all()

@router.get("/all", response_model=None)
def get_all_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat berilmagan")
    return db.query(Document).all()

@router.put("/{doc_id}/status", response_model=None)
def update_document_status(
    doc_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Ruxsat berilmagan")
    
    db_doc = db.query(Document).filter(Document.id == doc_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Hujjat topilmadi")
    
    db_doc.status = status
    db.commit()
    db.refresh(db_doc)
    return db_doc
