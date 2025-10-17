#!/bin/bash
# Comandos para actualizar VPS - Case Sensitivity Fix
# Ejecutar estos comandos en el VPS después de conectarte via SSH

echo "=== 1. DETENER SERVICIOS ==="
pm2 stop all

echo ""
echo "=== 2. IR AL DIRECTORIO DEL PROYECTO ==="
cd /root/9001app-v6

echo ""
echo "=== 3. ACTUALIZAR CÓDIGO DESDE GITHUB ==="
git pull origin main

echo ""
echo "=== 4. VERIFICAR CAMBIOS APLICADOS ==="
echo "--- Verificando index.ts ---"
head -50 frontend/src/components/ui/index.ts | grep -E "(modal|loading-spinner|error-message|kanban)"

echo ""
echo "--- Verificando README DonCandido ---"
head -50 frontend/src/components/ui/DonCandido/README.md | grep -E "don-candido"

echo ""
echo "=== 5. LIMPIAR CACHE DE NEXT.JS ==="
cd frontend
rm -rf .next
rm -rf node_modules/.cache

echo ""
echo "=== 6. INSTALAR DEPENDENCIAS (por si acaso) ==="
npm install --legacy-peer-deps

echo ""
echo "=== 7. BUILD DEL FRONTEND ==="
echo "Este es el momento crítico - aquí se detectarán errores de case sensitivity"
npm run build

echo ""
echo "=== 8. VOLVER AL ROOT Y REINICIAR SERVICIOS ==="
cd /root/9001app-v6
pm2 restart all

echo ""
echo "=== 9. VERIFICAR ESTADO ==="
pm2 status
pm2 logs --lines 20

echo ""
echo "✅ ACTUALIZACIÓN COMPLETADA"
echo "🌐 Verifica la aplicación en tu dominio"

