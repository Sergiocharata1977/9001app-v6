Write-Host "===================================" -ForegroundColor Cyan
Write-Host "9001app MVP - Iniciando servidor..." -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Cambiar al directorio backend
Set-Location -Path .\backend

Write-Host "Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host "`nCompilando TypeScript..." -ForegroundColor Yellow
npx tsc

Write-Host "`nIniciando servidor MVP..." -ForegroundColor Green
node dist/server-mvp.js

# Mantener la ventana abierta
Write-Host "`nPresiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")