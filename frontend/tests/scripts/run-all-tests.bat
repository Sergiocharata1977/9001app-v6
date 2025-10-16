@echo off
echo ========================================
echo    🧪 EJECUTANDO TODOS LOS TESTS OPTIMIZADOS
echo ========================================

echo.
echo [1/4] Tests de Rendimiento...
cd ..\rendimiento
node test-rendimiento-optimizado.js

echo.
echo [2/4] Tests de Velocidad...
cd ..\velocidad
node test-velocidad-completo.js

echo.
echo [3/4] Tests de Super Admin...
cd ..\super-admin
node test-super-admin-completo.js

echo.
echo [4/4] Tests de Usabilidad...
cd ..\usabilidad
node test-usabilidad-completo.js

echo.
echo ========================================
echo    ✅ TODOS LOS TESTS COMPLETADOS
echo ========================================
echo.
echo 📊 Reportes generados en:
echo    - frontend/tests/reportes/rendimiento/
echo    - frontend/tests/reportes/velocidad/
echo    - frontend/tests/reportes/super-admin/
echo    - frontend/tests/reportes/usabilidad/
echo.
echo 🎯 PRÓXIMOS PASOS:
echo    1. Revisar reportes HTML para análisis visual
echo    2. Implementar recomendaciones de rendimiento
echo    3. Ejecutar tests nuevamente para validar mejoras
echo.
pause
