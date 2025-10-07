Set-Location -Path "frontend";
Write-Host "Iniciando tests de RRHH..." -ForegroundColor Green;

Write-Host "";
Write-Host "========================================" -ForegroundColor Cyan;
Write-Host "TEST 1: DEPARTAMENTOS" -ForegroundColor Yellow;
Write-Host "========================================" -ForegroundColor Cyan;
node test-rrhh-departamentos-optimizado.js;

Write-Host "";
Write-Host "========================================" -ForegroundColor Cyan;
Write-Host "TEST 2: PUESTOS" -ForegroundColor Yellow;
Write-Host "========================================" -ForegroundColor Cyan;
node test-rrhh-puestos-optimizado.js;

Write-Host "";
Write-Host "========================================" -ForegroundColor Cyan;
Write-Host "TEST 3: PERSONAL" -ForegroundColor Yellow;
Write-Host "========================================" -ForegroundColor Cyan;
node test-rrhh-personal-optimizado.js;

Write-Host "";
Write-Host "========================================" -ForegroundColor Green;
Write-Host "TODOS LOS TESTS COMPLETADOS" -ForegroundColor Green;
Write-Host "========================================" -ForegroundColor Green;
Set-Location -Path "..";
Read-Host "Press Enter to continue...";

