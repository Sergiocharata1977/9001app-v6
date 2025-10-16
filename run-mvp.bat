@echo off
echo ===================================
echo 9001app MVP - Iniciando servidor...
echo ===================================

cd backend
echo Instalando dependencias...
call npm install

echo.
echo Compilando TypeScript...
call npx tsc

echo.
echo Iniciando servidor MVP...
call node dist/server-mvp.js

pause