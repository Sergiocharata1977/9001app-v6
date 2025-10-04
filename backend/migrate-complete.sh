#!/bin/bash

# Script Bash para ejecutar migración completa
echo "🚀 Iniciando migración completa de colecciones faltantes..."

# Navegar al directorio backend
cd backend

# Compilar TypeScript
echo "📦 Compilando TypeScript..."
npx tsc backend/src/scripts/completeMigration.ts --outDir backend/dist --target es2020 --module commonjs --esModuleInterop --skipLibCheck

if [ $? -eq 0 ]; then
    echo "✅ Compilación exitosa"
    
    # Ejecutar migración
    echo "🔄 Ejecutando migración completa..."
    node backend/dist/scripts/completeMigration.js
    
    if [ $? -eq 0 ]; then
        echo "🎉 Migración completa exitosa!"
    else
        echo "❌ Error durante la migración"
        exit 1
    fi
else
    echo "❌ Error de compilación"
    exit 1
fi

# Volver al directorio raíz
cd ..
echo "✅ Script completado"
