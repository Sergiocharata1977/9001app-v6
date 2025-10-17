#!/bin/bash

# 🔧 Script para corregir errores de TypeScript

echo "🔧 Corrigiendo errores de TypeScript..."

cd /var/www/9001app-v6/backend/src/controllers

# Corregir ProcessDefinitionControllerV2.ts
sed -i 's/.regex(/^\d+\.\d+$/, "La versión debe tener formato X.Y")/.pattern(/^\d+\.\d+$/, "La versión debe tener formato X.Y")/g' ProcessDefinitionControllerV2.ts

echo "✅ Errores corregidos"
echo "🔨 Continuando con el build..."

cd /var/www/9001app-v6/backend
npm run build

echo "✅ Build completado"



