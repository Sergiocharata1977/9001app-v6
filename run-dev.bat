@echo off
echo ========================================
echo    INICIANDO SERVIDORES DE DESARROLLO
echo ========================================

echo.
echo [1/2] Iniciando backend...
cd backend
start "Backend Server" cmd /k "npm run dev"

echo.
echo [2/2] Iniciando frontend...
cd ../frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo    SERVERS INICIADOS
echo    Backend: http://localhost:5000
echo    Frontend: http://localhost:3000
echo ========================================
pause












