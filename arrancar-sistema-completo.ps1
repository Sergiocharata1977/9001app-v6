# Script para arrancar el sistema completo 9001app-v6
Write-Host "🚀 Iniciando sistema 9001app-v6..." -ForegroundColor Green

# Definir rutas base
$projectPath = "C:\Users\Usuario\Documents\Proyectos\ISO -conjunto\9001app-v6"
$backendPath = Join-Path $projectPath "backend"
$frontendPath = Join-Path $projectPath "frontend"

# Verificar si MongoDB está corriendo
Write-Host "📊 Verificando MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if (-not $mongoProcess) {
    Write-Host "⚠️  MongoDB no está corriendo. Por favor, inicia MongoDB primero." -ForegroundColor Red
    Write-Host "   Ejecuta: net start MongoDB" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ MongoDB está corriendo" -ForegroundColor Green

# Arrancar Backend
Write-Host "🔧 Iniciando Backend..." -ForegroundColor Yellow
$backendCommand = "cd `"$backendPath`"; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand

# Esperar un poco para que el backend arranque
Start-Sleep -Seconds 5

# Arrancar Frontend
Write-Host "🎨 Iniciando Frontend..." -ForegroundColor Yellow
$frontendCommand = "cd `"$frontendPath`"; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand

Write-Host "🎉 Sistema iniciado!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📊 MongoDB: mongodb://localhost:27017" -ForegroundColor Cyan

# Esperar y abrir el navegador
Start-Sleep -Seconds 10
Start-Process "http://localhost:3000"