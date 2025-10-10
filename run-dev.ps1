Write-Host "========================================" -ForegroundColor Green
Write-Host "   INICIANDO SERVIDORES DE DESARROLLO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "[1/2] Iniciando backend..." -ForegroundColor Yellow
Set-Location backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "[2/2] Iniciando frontend..." -ForegroundColor Yellow
Set-Location ../frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   SERVERS INICIADOS" -ForegroundColor Green
Write-Host "   Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green








