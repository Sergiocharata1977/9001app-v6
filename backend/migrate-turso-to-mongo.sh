#!/bin/bash

# Script para migrar datos de Turso a MongoDB
# Ejecuta el script de migración TypeScript

echo "🚀 Iniciando migración de Turso a MongoDB..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js versión: $NODE_VERSION"

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm primero."
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm versión: $NPM_VERSION"

# Navegar al directorio del backend
cd backend

# Verificar que existe el archivo package.json
if [ ! -f "package.json" ]; then
    echo "❌ No se encontró package.json en el directorio backend"
    exit 1
fi

# Instalar dependencias si es necesario
echo "📦 Verificando dependencias..."
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Compilar TypeScript
echo "🔨 Compilando TypeScript..."
npm run build

# Verificar que la compilación fue exitosa
if [ $? -ne 0 ]; then
    echo "❌ Error en la compilación de TypeScript"
    exit 1
fi

# Ejecutar el script de migración
echo "🔄 Ejecutando migración..."
node dist/scripts/tursoToMongoMigration.js

# Verificar el resultado
if [ $? -eq 0 ]; then
    echo "🎉 ¡Migración completada exitosamente!"
    echo "📊 Los datos de Turso han sido migrados a MongoDB"
else
    echo "❌ Error durante la migración"
    exit 1
fi

echo "✅ Script completado"
