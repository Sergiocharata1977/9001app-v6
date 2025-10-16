@echo off
echo ========================================
echo    🎯 TESTS SUPER ADMIN
echo ========================================

echo.
echo Ejecutando tests específicos del Super Admin...
echo - Dashboard principal
echo - Páginas single de módulos
echo - Navegación y usabilidad
echo.

cd ..\super-admin
node test-super-admin-completo.js

echo.
echo ========================================
echo    ✅ TESTS SUPER ADMIN COMPLETADOS
echo ========================================
echo.
echo 📊 Reportes generados en:
echo    - frontend/tests/reportes/super-admin/
echo.
pause














