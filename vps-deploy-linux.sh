#!/bin/bash
# Script de deployment automatizado para VPS Linux
# Solución sistémica para problemas Windows → Linux

set -e  # Detener en cualquier error

echo "🚀 Iniciando deployment en VPS Linux..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Detener servicios
echo ""
echo "1️⃣ Deteniendo servicios..."
pm2 stop all || echo "⚠️  No hay servicios corriendo"

# 2. Ir al directorio del proyecto
echo ""
echo "2️⃣ Navegando al directorio del proyecto..."
cd /root/9001app-v6

# 3. Actualizar código desde GitHub
echo ""
echo "3️⃣ Actualizando código desde GitHub..."
git pull origin main
echo "✅ Código actualizado"

# 4. Verificar último commit
echo ""
echo "4️⃣ Último commit:"
git log -1 --oneline

# 5. Limpiar entorno completamente
echo ""
echo "5️⃣ Limpiando entorno (node_modules, .next, cache)..."
cd frontend
rm -rf node_modules
rm -rf .next
rm -rf .cache
npm cache clean --force
echo "✅ Entorno limpio"

# 6. Instalar dependencias con arquitectura Linux
echo ""
echo "6️⃣ Instalando dependencias para Linux..."
npm install --legacy-peer-deps
echo "✅ Dependencias instaladas"

# 7. Instalar plugin de case sensitivity
echo ""
echo "7️⃣ Instalando case-sensitive-paths-webpack-plugin..."
npm install --save-dev case-sensitive-paths-webpack-plugin
echo "✅ Plugin instalado"

# 8. Recompilar dependencias nativas
echo ""
echo "8️⃣ Recompilando dependencias nativas para Linux..."
npm rebuild
echo "✅ Dependencias recompiladas"

# 9. Ejecutar validación pre-build
echo ""
echo "9️⃣ Ejecutando validación pre-build..."
node scripts/prebuild-linux.js || echo "⚠️  Advertencias encontradas, continuando..."

# 10. Build del frontend
echo ""
echo "🔨 BUILD DEL FRONTEND (momento crítico)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run build

# Verificar si el build fue exitoso
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡BUILD EXITOSO!"
    
    # 11. Volver al directorio raíz
    cd /root/9001app-v6
    
    # 12. Reiniciar servicios
    echo ""
    echo "🔄 Reiniciando servicios con PM2..."
    pm2 restart all || pm2 start all
    
    # 13. Verificar estado
    echo ""
    echo "📊 Estado de los servicios:"
    pm2 status
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 ¡DEPLOYMENT COMPLETADO CON ÉXITO!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🌐 Tu aplicación debería estar funcionando en:"
    echo "   Frontend: http://tu-dominio:3000"
    echo "   Backend: http://tu-dominio:5000"
    echo ""
    echo "📝 Para ver los logs:"
    echo "   pm2 logs --lines 50"
    echo ""
else
    echo ""
    echo "❌ BUILD FALLÓ"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Revisa los errores arriba y corrígelos."
    echo ""
    exit 1
fi

