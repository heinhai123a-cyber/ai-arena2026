@echo off
chcp 65001 >nul
echo ========================================================
echo        DANG KHOI DONG VIET PHUC REMIX...
echo ========================================================
echo.
echo Link tren may: http://localhost:5173/
echo Link tren Wi-Fi: http://172.20.10.2:5173/
echo.
cd /d "d:\AI_CHINH_THUC\ai-arena2026-main\ai-arena2026-main"

start "" "http://localhost:5173/"

npm run dev
pause
