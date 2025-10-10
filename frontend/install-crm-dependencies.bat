@echo off
echo ============================================
echo INSTALANDO DEPENDENCIAS CRM - 9001App v6
echo ============================================
echo.

cd /d "%~dp0"

echo [1/2] Instalando Sonner (Toast notifications)...
call npm install sonner

echo.
echo [2/2] Verificando instalacion...
call npm list sonner

echo.
echo ============================================
echo INSTALACION COMPLETADA
echo ============================================
echo.
echo Ahora puedes iniciar el frontend con: npm run dev
echo.
pause



