@echo off
echo Iniciando tests de RRHH...
cd frontend

echo.
echo ========================================
echo TEST 1: DEPARTAMENTOS
echo ========================================
node test-rrhh-departamentos-optimizado.js

echo.
echo ========================================
echo TEST 2: PUESTOS
echo ========================================
node test-rrhh-puestos-optimizado.js

echo.
echo ========================================
echo TEST 3: PERSONAL
echo ========================================
node test-rrhh-personal-optimizado.js

echo.
echo ========================================
echo TODOS LOS TESTS COMPLETADOS
echo ========================================
cd ..
pause

