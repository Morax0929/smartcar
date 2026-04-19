# 🚀 SmartCar AI Platform - Setup Guide

Bu qo'llanma SmartCar AI platformasini lokal kompyuterda ishga tushirish uchun batafsil yo'riqnoma.

---

## 📋 Talablar

### Zarur dasturlar:
- **Python 3.11+** - Backend uchun
- **Node.js 18+** - Frontend uchun
- **PostgreSQL 15+** - Asosiy database
- **MongoDB 6+** - Avtomobil spesifikatsiyalari
- **Redis 7+** - Caching uchun
- **Git** - Version control

---

## 🔧 1. Loyihani Klonlash

```bash
git clone https://github.com/your-username/smartcar-ai.git
cd smartcar-ai
```

---

## 🗄️ 2. Database O'rnatish

### PostgreSQL:

```bash
# PostgreSQL'ni ishga tushiring
# Windows: Services dan PostgreSQL14 ni ishga tushiring
# Linux: sudo systemctl start postgresql

# Database yarating
psql -U postgres
CREATE DATABASE smartcar_db;
\q
```

### MongoDB:

```bash
# MongoDB'ni ishga tushiring
# Windows: Services dan MongoDB ni ishga tushiring
# Linux: sudo systemctl start mongod

# Test qiling
mongosh
show dbs
exit
```

### Redis:

```bash
# Redis'ni ishga tushiring
# Windows: redis-server
# Linux: sudo systemctl start redis

# Test qiling
redis-cli ping
# PONG javobini ko'rishingiz kerak
```

---

## 🐍 3. Backend Setup

```bash
cd backend

# Virtual environment yaratish
python -m venv venv

# Aktivatsiya qilish
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Dependencies o'rnatish
pip install -r requirements.txt

# .env fayl yaratish
cp ../.env.example .env

# .env faylni tahrirlash (kerakli qiymatlarni kiriting)
# DATABASE_URL, MONGODB_URL, REDIS_URL, SECRET_KEY
```

### .env Konfiguratsiyasi:

```env
# Database URLs
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/smartcar_db
MONGODB_URL=mongodb://localhost:27017/smartcar_specs
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-very-secret-key-min-32-characters-long

# API
DEBUG=True
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

### Database Migration:

```bash
# Alembic'ni init qilish (birinchi marta)
alembic init alembic

# Migration yaratish
alembic revision --autogenerate -m "Initial migration"

# Migration'ni run qilish
alembic upgrade head
```

### Backend'ni ishga tushirish:

```bash
# Development mode
uvicorn app.main:app --reload

# Yoki
python -m uvicorn app.main:app --reload --port 8000
```

**Backend URL:** http://localhost:8000  
**API Docs:** http://localhost:8000/api/docs

---

## ⚛️ 4. Frontend Setup

Yangi terminal oching:

```bash
cd frontend

# Dependencies o'rnatish
npm install

# .env.local yaratish
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Development server
npm run dev
```

**Frontend URL:** http://localhost:3000

---

## 🐳 5. Docker bilan ishga tushirish (Ixtiyoriy)

Agar Docker o'rnatilgan bo'lsa:

```bash
# Root directoriyda
docker-compose up -d

# Loglarni ko'rish
docker-compose logs -f

# To'xtatish
docker-compose down
```

---

## ✅ 6. Test qilish

### Backend test:

```bash
# Backend terminalda
curl http://localhost:8000/health

# Yoki brauzerda:
# http://localhost:8000/api/docs
```

### Frontend test:

Brauzerda: http://localhost:3000

---

## 👤 7. Demo User yaratish

Backend terminalda Python shell ochib:

```bash
python

# Python shell ichida:
from app.db.database import SessionLocal
from app.crud.user import create_user
from app.schemas.user import UserCreate

db = SessionLocal()

demo_user = UserCreate(
    email="demo@smartcar.uz",
    password="Demo123456",
    first_name="Demo",
    last_name="User",
    phone_number="+998901234567"
)

user = create_user(db, demo_user)
print(f"Demo user created: {user.email}")

exit()
```

### Demo admin yaratish:

```python
# Yuqoridagi userning rolini o'zgartiring
from app.models.user import UserRole

user.role = UserRole.ADMIN
db.commit()
print(f"Admin created: {user.email}")
```

---

## 📊 8. Sample Data qo'shish

### Avtomobillar qo'shish:

```python
from app.crud.car import create_car
from app.schemas.car import CarCreate

cars_data = [
    {
        "make": "Toyota",
        "model": "Camry",
        "year": 2024,
        "color": "Oq",
        "license_plate": "01A123BC",
        "daily_rate": 50.0,
    },
    {
        "make": "BMW",
        "model": "X5",
        "year": 2023,
        "color": "Qora",
        "license_plate": "01B456DE",
        "daily_rate": 120.0,
    },
]

for car_data in cars_data:
    car = CarCreate(**car_data)
    create_car(db, car)
    print(f"Car created: {car.make} {car.model}")
```

---

## 🔐 9. Environment Variables

### Backend (.env):
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
MONGODB_URL=mongodb://localhost:27017/db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
```

### Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🐛 10. Troubleshooting

### Port band bo'lsa:

```bash
# Backend uchun boshqa port
uvicorn app.main:app --reload --port 8001

# Frontend uchun boshqa port
npm run dev -- -p 3001
```

### Database connection error:

```bash
# PostgreSQL ishlab turganini tekshiring
psql -U postgres -c "SELECT 1"

# MongoDB
mongosh --eval "db.version()"

# Redis
redis-cli ping
```

### Dependencies error:

```bash
# Backend
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall

# Frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 11. Production Deploy

### Backend (Railway/Render):

1. GitHub'ga push qiling
2. Railway.app yoki Render.com'ga kirish
3. GitHub repo'ni ulang
4. Environment variables qo'shing
5. Deploy qiling

### Frontend (Vercel):

```bash
npm run build
vercel --prod
```

---

## 📚 12. Qo'shimcha Ma'lumotlar

### Foydali linklar:
- **Backend API Docs:** http://localhost:8000/api/docs
- **Backend ReDoc:** http://localhost:8000/api/redoc
- **Frontend:** http://localhost:3000

### Portlar:
- Backend: 8000
- Frontend: 3000
- PostgreSQL: 5432
- MongoDB: 27017
- Redis: 6379

---

## 🎓 13. Diplom uchun

### Hujjatlar:
- README.md - Umumiy ma'lumot
- SETUP_GUIDE.md - Setup yo'riqnomasi (bu fayl)
- API Documentation - /api/docs
- Database Schema - PDF arxitekturada

### Demo:
1. Backend API: https://your-backend.railway.app
2. Frontend: https://your-app.vercel.app
3. Demo user: demo@smartcar.uz / Demo123456

---

## ❓ Yordam

Muammolar bo'lsa:
- GitHub Issues yarating
- Email: your-email@example.com
- Telegram: @your_username

---

**Muvaffaqiyatlar!** 🎉
