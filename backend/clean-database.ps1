# Script para limpiar la base de datos MongoDB
# Ejecutar desde la carpeta backend

Write-Host "🚀 Iniciando limpieza de base de datos..." -ForegroundColor Green

# Verificar que estamos en la carpeta correcta
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Ejecutar este script desde la carpeta backend" -ForegroundColor Red; exit 1
}

# Verificar que Node.js esté instalado
try {
    $nodeVersion = node --version; Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js no está instalado o no está en el PATH" -ForegroundColor Red; exit 1
}

# Verificar que npm esté disponible
try {
    $npmVersion = npm --version; Write-Host "✅ npm detectado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: npm no está disponible" -ForegroundColor Red; exit 1
}

# Instalar dependencias si es necesario
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow; npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red; exit 1
    }
}

# Ejecutar el script de limpieza
Write-Host "🧹 Ejecutando limpieza de base de datos..." -ForegroundColor Yellow; npm run clean-db

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Limpieza completada exitosamente!" -ForegroundColor Green
} else {
    Write-Host "❌ Error durante la limpieza" -ForegroundColor Red; exit 1
}

Write-Host "✅ Proceso finalizado" -ForegroundColor Green
