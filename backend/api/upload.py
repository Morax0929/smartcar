import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from core.config import settings

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE_MB = 5

def verify_admin(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        role = payload.get("role")
        if role != "admin":
            raise HTTPException(status_code=403, detail="Faqat adminlar rasm yuklay oladi")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token yaroqsiz")

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    _: dict = Depends(verify_admin)
):
    # Fayl turi tekshiruvi
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Faqat JPG, PNG, WEBP yoki GIF ruxsat etiladi")

    # Fayl o'lchamini tekshirish
    contents = await file.read()
    if len(contents) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"Fayl hajmi {MAX_SIZE_MB}MB dan oshmasligi kerak")

    # Noyob nom bilan saqlash
    extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{extension}"
    filepath = os.path.join("uploads", filename)

    with open(filepath, "wb") as f:
        f.write(contents)

    # Frontend uchun to'liq URL (xavfsizroq bo'lishi uchun faqat nisbiy /uploads qaytariladi)
    return {
        "url": f"/uploads/{filename}",
        "filename": filename
    }
