# Script para iniciar el sistema completo (Backend + Frontend)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Iniciando 9001app-v6" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# Verificar puertos
Write-Host "Verificando puertos..." -ForegroundColor Yellow
$backendPort = 5000
$frontendPort = 3000

if (Test-Port -Port $backendPort) {
    Write-Host "⚠️  Puerto $backendPort ya está en uso (Backend)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Puerto $backendPort disponible" -ForegroundColor Green
}

if (Test-Port -Port $frontendPort) {
    Write-Host "⚠️  Puerto $frontendPort ya está en uso (Frontend)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Puerto $frontendPort disponible" -ForegroundColor Green
}

Write-Host ""
Write-Host "Iniciando servicios..." -ForegroundColor Yellow
Write-Host ""

# Iniciar Backend
Write-Host "🔧 Iniciando Backend (puerto $backendPort)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Minimized

# Esperar un poco para que el backend inicie
Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "🎨 Iniciando Frontend (puerto $frontendPort)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Minimized

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Sistema iniciado correctamente" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Backend:  http://localhost:$backendPort" -ForegroundColor White
Write-Host "🌐 Frontend: http://localhost:$frontendPort" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C para detener todos los servicios" -ForegroundColor Yellow
Write-Host ""

# Mantener el script corriendo
Write-Host "Servicios en ejecución. Presiona Ctrl+C para detener..." -ForegroundColor Cyan
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host ""
    Write-Host "Deteniendo servicios..." -ForegroundColor Yellow
    
    # Matar procesos de Node
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process powershell -ErrorAction SilentlyContinue | Where-Object { $_.Id -ne $PID } | Stop-Process -Force
    
    Write-Host "Servicios detenidos." -ForegroundColor Green
}

