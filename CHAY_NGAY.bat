@echo off
chcp 65001 >nul
echo ========================================================
echo        DANG KHOI DONG VIET PHUC REMIX...
echo ========================================================
echo.
echo Link tren may: http://localhost:5173/
echo Link tren Wi-Fi: http://10.11.119.89:5173/
echo.
cd /d "%~dp0"

start "" "http://localhost:5173/"

npm run dev
pause

