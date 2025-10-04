# MongoDB Connection Control Script for Windows PowerShell
# Permite verificar, conectar, desconectar y diagnosticar la conexión a MongoDB

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Colores para la consola
$Colors = @{
    Reset = "`e[0m"
    Bright = "`e[1m"
    Red = "`e[31m"
    Green = "`e[32m"
    Yellow = "`e[33m"
    Blue = "`e[34m"
    Magenta = "`e[35m"
    Cyan = "`e[36m"
}

function Write-ColorLog {
    param(
        [string]$Message,
        [string]$Color = $Colors.Reset
    )
    Write-Host "$Color$Message$($Colors.Reset)"
}

function Write-ErrorLog {
    param([string]$Message)
    Write-ColorLog "❌ $Message" $Colors.Red
}

function Write-SuccessLog {
    param([string]$Message)
    Write-ColorLog "✅ $Message" $Colors.Green
}

function Write-WarningLog {
    param([string]$Message)
    Write-ColorLog "⚠️  $Message" $Colors.Yellow
}

function Write-InfoLog {
    param([string]$Message)
    Write-ColorLog "ℹ️  $Message" $Colors.Blue
}

function Write-Header {
    param([string]$Message)
    Write-ColorLog "`n$($Colors.Bright)$($Colors.Cyan)=== $Message ===$($Colors.Reset)"
}

# Verificar si Node.js está instalado
function Test-NodeJS {
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-SuccessLog "Node.js encontrado: $nodeVersion"
            return $true
        }
    }
    catch {
        Write-ErrorLog "Node.js no está instalado o no está en el PATH"
        return $false
    }
    return $false
}

# Verificar si el archivo .env existe
function Test-EnvFile {
    $envPath = Join-Path $PSScriptRoot "..\.env"
    if (Test-Path $envPath) {
        Write-SuccessLog "Archivo .env encontrado"
        return $true
    } else {
        Write-ErrorLog "Archivo .env no encontrado en: $envPath"
        return $false
    }
}

# Verificar configuración de MongoDB
function Test-MongoDBConfig {
    Write-Header "VERIFICACIÓN DE CONFIGURACIÓN"
    
    if (-not (Test-EnvFile)) {
        return $false
    }
    
    $envPath = Join-Path $PSScriptRoot "..\.env"
    $envContent = Get-Content $envPath -Raw
    
    if ($envContent -match "MONGODB_URI=(.+)") {
        $mongoUri = $matches[1].Trim()
        Write-SuccessLog "MONGODB_URI encontrada"
        
        # Ocultar credenciales en el log
        $maskedUri = $mongoUri -replace "://([^:]+):([^@]+)@", "://***:***@"
        Write-InfoLog "URI: $maskedUri"
        
        return $true
    } else {
        Write-ErrorLog "MONGODB_URI no encontrada en el archivo .env"
        return $false
    }
}

# Ejecutar script de Node.js
function Invoke-MongoScript {
    param([string]$Command)
    
    $scriptPath = Join-Path $PSScriptRoot "mongo-connection-control.js"
    
    if (-not (Test-Path $scriptPath)) {
        Write-ErrorLog "Script de Node.js no encontrado: $scriptPath"
        return $false
    }
    
    try {
        Write-InfoLog "Ejecutando script de Node.js..."
        node $scriptPath $Command
        return $true
    }
    catch {
        Write-ErrorLog "Error ejecutando script: $($_.Exception.Message)"
        return $false
    }
}

# Verificar si el backend está corriendo
function Test-BackendRunning {
    Write-Header "VERIFICACIÓN DEL BACKEND"
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 200) {
            Write-SuccessLog "Backend está corriendo en puerto 5000"
            return $true
        }
    }
    catch {
        Write-WarningLog "Backend no está respondiendo en puerto 5000"
        Write-InfoLog "Intentando iniciar el backend..."
        
        $backendPath = Join-Path $PSScriptRoot ".."
        $packageJson = Join-Path $backendPath "package.json"
        
        if (Test-Path $packageJson) {
            Write-InfoLog "Iniciando backend..."
            Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory $backendPath -WindowStyle Minimized
            Start-Sleep -Seconds 3
            
            # Verificar nuevamente
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
                if ($response.StatusCode -eq 200) {
                    Write-SuccessLog "Backend iniciado exitosamente"
                    return $true
                }
            }
            catch {
                Write-ErrorLog "No se pudo iniciar el backend"
            }
        }
    }
    
    return $false
}

# Función principal
function Main {
    Write-ColorLog "$($Colors.Bright)$($Colors.Magenta)MongoDB Connection Control (PowerShell)$($Colors.Reset)`n"
    
    # Verificar prerrequisitos
    if (-not (Test-NodeJS)) {
        Write-ErrorLog "Node.js es requerido para ejecutar este script"
        exit 1
    }
    
    switch ($Command.ToLower()) {
        "check" {
            Write-Header "VERIFICACIÓN RÁPIDA"
            Test-MongoDBConfig
            Invoke-MongoScript "check"
        }
        
        "connect" {
            Write-Header "CONEXIÓN A MONGODB"
            if (Test-MongoDBConfig) {
                Invoke-MongoScript "connect"
            }
        }
        
        "test" {
            Write-Header "PRUEBAS DE MONGODB"
            if (Test-MongoDBConfig) {
                Invoke-MongoScript "test"
            }
        }
        
        "diagnostic" {
            Write-Header "DIAGNÓSTICO COMPLETO"
            if (Test-MongoDBConfig) {
                Invoke-MongoScript "diagnostic"
            }
        }
        
        "backend" {
            Test-BackendRunning
        }
        
        "full" {
            Write-Header "DIAGNÓSTICO COMPLETO DEL SISTEMA"
            
            # 1. Verificar configuración
            $configOk = Test-MongoDBConfig
            
            # 2. Verificar MongoDB
            if ($configOk) {
                Invoke-MongoScript "diagnostic"
            }
            
            # 3. Verificar backend
            Test-BackendRunning
            
            Write-Header "RESUMEN"
            Write-InfoLog "Para más detalles, ejecuta comandos individuales:"
            Write-InfoLog "  .\mongo-connection-control.ps1 diagnostic"
            Write-InfoLog "  .\mongo-connection-control.ps1 backend"
        }
        
        default {
            Write-ColorLog "Uso: .\mongo-connection-control.ps1 [comando]`n" $Colors.Yellow
            Write-ColorLog "Comandos disponibles:" $Colors.Bright
            Write-ColorLog "  check       - Verificación rápida de configuración y estado"
            Write-ColorLog "  connect     - Conectar a MongoDB"
            Write-ColorLog "  test        - Probar operaciones básicas de MongoDB"
            Write-ColorLog "  diagnostic  - Diagnóstico completo de MongoDB"
            Write-ColorLog "  backend     - Verificar estado del backend"
            Write-ColorLog "  full        - Diagnóstico completo del sistema`n"
            Write-ColorLog "Ejemplos:" $Colors.Bright
            Write-ColorLog "  .\mongo-connection-control.ps1 check"
            Write-ColorLog "  .\mongo-connection-control.ps1 diagnostic"
            Write-ColorLog "  .\mongo-connection-control.ps1 full"
        }
    }
}

# Ejecutar función principal
Main
