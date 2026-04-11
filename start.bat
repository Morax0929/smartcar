@echo off
title SmartCar AI Platform — Ishga tushirish
color 0A
echo.
echo  ====================================================
echo   SmartCar AI Platform ishga tushirilmoqda...
echo  ====================================================
echo.

:: Logs papkasini yaratish
if not exist "logs" mkdir logs

:: Eski PM2 jarayonlarni to'xtatish
echo [1/3] Eski jarayonlar to'xtatilmoqda...
pm2 delete smartcar-backend 2>nul
pm2 delete smartcar-frontend 2>nul

:: Backend ni PM2 orqali ishga tushirish
echo [2/3] Backend (FastAPI) ishga tushirilmoqda...
pm2 start ecosystem.config.js --only smartcar-backend

:: 3 sekund kutish
timeout /t 3 /nobreak >nul

:: Frontend ni PM2 orqali ishga tushirish
echo [3/3] Frontend (Next.js) ishga tushirilmoqda...
pm2 start ecosystem.config.js --only smartcar-frontend

:: Holat ko'rsatish
echo.
echo  ====================================================
echo   Barcha servislar ishga tushdi!
echo  ====================================================
echo.
pm2 status

echo.
echo  Brauzeringizda oching:
echo    Frontend   : http://localhost:3000
echo    Admin Panel: http://localhost:3000/admin
echo    Backend API: http://localhost:8000/docs
echo.
echo  Foydali buyruqlar:
echo    pm2 status     - holat ko'rish
echo    pm2 logs       - loglar ko'rish
echo    pm2 stop all   - to'xtatish
echo    pm2 restart all - qayta ishga tushirish
echo.
pause
