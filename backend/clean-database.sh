#!/bin/bash

# Script para limpiar la base de datos MongoDB
# Ejecutar desde la carpeta backend

echo "🚀 Iniciando limpieza de base de datos..."

# Verificar que estamos en la carpeta correcta
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecutar este script desde la carpeta backend"; exit 1
fi

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado o no está en el PATH"; exit 1
fi

echo "✅ Node.js detectado: $(node --version)"

# Verificar que npm esté disponible
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no está disponible"; exit 1
fi

echo "✅ npm detectado: $(npm --version)"

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."; npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error al instalar dependencias"; exit 1
    fi
fi

# Ejecutar el script de limpieza
echo "🧹 Ejecutando limpieza de base de datos..."; npm run clean-db

if [ $? -eq 0 ]; then
    echo "🎉 Limpieza completada exitosamente!"
else
    echo "❌ Error durante la limpieza"; exit 1
fi

echo "✅ Proceso finalizado"
