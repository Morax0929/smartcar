#!/bin/bash

echo "================================================="
echo "  SmartCar AI Platform — Replit muhitiga tayyorlanmoqda..."
echo "================================================="

# 1. Backend sozlamalari
echo "[1/3] Backend (Python) kutubxonalari o'rnatilmoqda..."
pip install -r backend/requirements.txt

# 2. Frontend sozlamalari
echo "[2/3] Frontend (Next.js) kutubxonalari o'rnatilmoqda..."
cd frontend
npm install
cd ..

# 3. Serverlarni ishga tushirish
echo "[3/3] Serverlar ishga tushirilmoqda..."

# Backend orqa fonda ishga tushadi (port 8000)
echo "[INFO] FastAPI backend (8000 port) yoqilmoqda..."
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &

# Xatolik bo'lmasligi uchun 3 soniya kutamiz
sleep 3

# Frontend old fonda ishga tushadi (port 3000)
echo "[INFO] Next.js frontend (3000 port) yoqilmoqda..."
cd frontend
npm run dev
