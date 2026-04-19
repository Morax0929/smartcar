
from sqlalchemy.orm import Session
from core.database import SessionLocal, engine
from models.user import User
from core.security import get_password_hash
import sys

def create_initial_admin():
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin_email = "admin@smartcar.uz"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        
        if existing_admin:
            print(f"Admin ({admin_email}) allaqachon mavjud.")
            return

        print("Yangi admin yaratilmoqda...")
        hashed_password = get_password_hash("Admin123456!")
        new_admin = User(
            full_name="Bosh Administrator",
            email=admin_email,
            phone="+998901234567",
            hashed_password=hashed_password,
            role="admin"
        )
        
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        print(f"Muvaffaqiyatli! Admin yaratildi: {admin_email}")
        print("Parol: Admin123456!")
        
    except Exception as e:
        print(f"Xatolik yuz berdi: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_initial_admin()
