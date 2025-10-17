#!/bin/bash
# =============================================
# 🚀 9001app v6 - Fix Linux Build Environment
# Solución sistémica completa Windows → Linux
# Autor: Sergio De Filippi
# Versión: 2.0 (Mejorada)
# Fecha: $(date +%Y-%m-%d)
# =============================================

set -e  # Detener en cualquier error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "============================================="
echo "🚀 9001APP v6 - DEPLOYMENT LINUX"
echo "============================================="
echo ""

# =============================================
# 0. Verificar directorio
# =============================================
if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: No se encuentra el directorio 'frontend'${NC}"
    echo "   Ejecuta este script desde: /root/9001app-v6"
    exit 1
fi

echo -e "${BLUE}📍 Directorio actual: $(pwd)${NC}"
echo ""

# =============================================
# 1. Detener servicios
# =============================================
echo "============================================="
echo "1️⃣  DETENIENDO SERVICIOS PM2..."
echo "============================================="
pm2 stop all 2>/dev/null || echo -e "${YELLOW}⚠️  No hay servicios corriendo${NC}"
echo ""

# =============================================
# 2. Actualizar código desde GitHub
# =============================================
echo "============================================="
echo "2️⃣  ACTUALIZANDO CÓDIGO DESDE GITHUB..."
echo "============================================="
git pull origin main
echo -e "${GREEN}✅ Código actualizado${NC}"
echo ""

# Ver último commit
echo -e "${BLUE}📝 Último commit:${NC}"
git log -1 --oneline
echo ""

# =============================================
# 3. Limpiar entorno completamente
# =============================================
echo "============================================="
echo "3️⃣  LIMPIANDO ENTORNO Y CACHÉS..."
echo "============================================="
cd frontend
rm -rf node_modules
rm -rf .next
rm -rf dist
rm -rf .cache
rm -rf node_modules/.cache
npm cache clean --force
echo -e "${GREEN}✅ Limpieza completada${NC}"
echo ""

# =============================================
# 4. Reinstalar dependencias
# =============================================
echo "============================================="
echo "4️⃣  REINSTALANDO DEPENDENCIAS PARA LINUX..."
echo "============================================="
npm install --legacy-peer-deps
echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# =============================================
# 5. Recompilar dependencias nativas
# =============================================
echo "============================================="
echo "5️⃣  RECOMPILANDO DEPENDENCIAS NATIVAS..."
echo "============================================="
npm rebuild
echo -e "${GREEN}✅ Dependencias recompiladas${NC}"
echo ""

# =============================================
# 6. Convertir archivos .env a formato Unix
# =============================================
echo "============================================="
echo "6️⃣  CONVIRTIENDO ARCHIVOS .ENV A FORMATO UNIX..."
echo "============================================="
for envfile in .env .env.local .env.production; do
    if [ -f "$envfile" ]; then
        # Instalar dos2unix si no está
        if ! command -v dos2unix &> /dev/null; then
            echo "Instalando dos2unix..."
            apt-get update -qq && apt-get install -y dos2unix -qq
        fi
        dos2unix "$envfile" 2>/dev/null || sed -i 's/\r$//' "$envfile"
        echo -e "${GREEN}✅ $envfile convertido${NC}"
    fi
done
echo ""

# =============================================
# 7. Verificar imports conflictivos
# =============================================
echo "============================================="
echo "7️⃣  VERIFICANDO IMPORTS CONFLICTIVOS..."
echo "============================================="
if grep -rn "from ['\"]\.\/[A-Z]" src/ > ../case_conflicts.txt 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Se encontraron imports con PascalCase:${NC}"
    head -5 ../case_conflicts.txt
    echo "   (Ver archivo completo en: case_conflicts.txt)"
else
    echo -e "${GREEN}✅ No se detectaron imports problemáticos${NC}"
fi
echo ""

# =============================================
# 8. Verificar exports de AMFETable
# =============================================
echo "============================================="
echo "8️⃣  VERIFICANDO EXPORTS DE AMFETable..."
echo "============================================="
if grep -rn "AMFETable" src/ > ../amfe_check.txt 2>/dev/null; then
    if grep -q "export default.*AMFETable" ../amfe_check.txt; then
        echo -e "${GREEN}✅ AMFETable exportado correctamente${NC}"
    else
        echo -e "${YELLOW}⚠️  Revisar exports de AMFETable (ver amfe_check.txt)${NC}"
    fi
fi
echo ""

# =============================================
# 9. Análisis TypeScript completo
# =============================================
echo "============================================="
echo "9️⃣  ANÁLISIS TYPESCRIPT (STRICT MODE)..."
echo "============================================="

# Crear directorio de reportes
mkdir -p ../reports

# Ejecutar TypeScript compiler en modo check
echo "🔍 Verificando tipos estrictos..."
npx tsc --noEmit --pretty > ../reports/ts-errors-full.txt 2>&1 || true

# Contar errores
TS_ERRORS=$(grep -c "error TS" ../reports/ts-errors-full.txt 2>/dev/null || echo "0")

if [ "$TS_ERRORS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Se encontraron $TS_ERRORS errores de TypeScript${NC}"
    
    # Extraer solo errores de undefined/null
    grep -E "undefined|possibly|cannot|may be" ../reports/ts-errors-full.txt > ../reports/ts-undefined-errors.txt 2>/dev/null || true
    
    UNDEFINED_ERRORS=$(wc -l < ../reports/ts-undefined-errors.txt 2>/dev/null || echo "0")
    
    if [ "$UNDEFINED_ERRORS" -gt 0 ]; then
        echo -e "${YELLOW}   • $UNDEFINED_ERRORS relacionados con undefined/null${NC}"
        echo ""
        echo "🔍 Primeros 10 errores críticos:"
        head -10 ../reports/ts-undefined-errors.txt
        echo ""
    fi
    
    echo -e "${BLUE}📄 Reporte completo en: reports/ts-errors-full.txt${NC}"
else
    echo -e "${GREEN}✅ TypeScript: Sin errores de tipos${NC}"
fi

# Ejecutar validación pre-build adicional
if [ -f "scripts/prebuild-linux.js" ]; then
    echo ""
    echo "🔍 Ejecutando validaciones adicionales..."
    node scripts/prebuild-linux.js || echo -e "${YELLOW}⚠️  Advertencias encontradas, continuando...${NC}"
fi
echo ""

# =============================================
# 10. BUILD DEL FRONTEND (Momento crítico)
# =============================================
echo "============================================="
echo "🔨 BUILD DEL FRONTEND (MOMENTO CRÍTICO)..."
echo "============================================="
echo ""

# Ejecutar build con logs detallados
if npm run build 2>&1 | tee ../build_log.txt; then
    # Verificar que realmente fue exitoso (no confiar solo en exit code)
    if grep -q "Failed to compile" ../build_log.txt; then
        echo ""
        echo "============================================="
        echo -e "${RED}❌ BUILD FALLÓ (TypeScript errors)${NC}"
        echo "============================================="
        
        # Extraer el error específico
        grep -A 10 "Type error:" ../build_log.txt | head -15
        
        echo ""
        echo -e "${YELLOW}💡 Sugerencias:${NC}"
        echo "   1. Revisa: reports/ts-errors-full.txt"
        echo "   2. Corrige los errores de tipos"
        echo "   3. Haz push a GitHub"
        echo "   4. Vuelve a ejecutar este script"
        echo ""
        BUILD_SUCCESS=false
    else
        echo ""
        echo "============================================="
        echo -e "${GREEN}✅ ¡BUILD EXITOSO!${NC}"
        echo "============================================="
        BUILD_SUCCESS=true
    fi
else
    echo ""
    echo "============================================="
    echo -e "${RED}❌ BUILD FALLÓ${NC}"
    echo "============================================="
    echo -e "${RED}Revisa los errores en: build_log.txt${NC}"
    BUILD_SUCCESS=false
fi
echo ""

# =============================================
# 11. Reiniciar servicios (solo si build exitoso)
# =============================================
if [ "$BUILD_SUCCESS" = true ]; then
    echo "============================================="
    echo "🔄 REINICIANDO SERVICIOS..."
    echo "============================================="
    cd /root/9001app-v6
    
    # Reiniciar o iniciar servicios
    pm2 restart all 2>/dev/null || pm2 start all 2>/dev/null || echo -e "${YELLOW}⚠️  No se pudieron iniciar los servicios PM2${NC}"
    
    echo ""
    echo "📊 ESTADO DE LOS SERVICIOS:"
    pm2 status
    
    echo ""
    echo "============================================="
    echo -e "${GREEN}🎉 ¡DEPLOYMENT COMPLETADO CON ÉXITO!${NC}"
    echo "============================================="
    echo ""
    echo "🌐 Tu aplicación debería estar funcionando"
    echo ""
    echo "📝 Para ver logs en tiempo real:"
    echo "   pm2 logs --lines 50"
    echo ""
    echo "📁 Archivos de diagnóstico generados:"
    echo "   - build_log.txt (log completo del build)"
    echo "   - case_conflicts.txt (imports con case problems)"
    echo "   - amfe_check.txt (status de AMFETable)"
    echo "   - reports/ts-errors-full.txt (todos los errores TS)"
    echo "   - reports/ts-undefined-errors.txt (solo undefined/null)"
    echo ""
else
    echo ""
    echo "============================================="
    echo -e "${RED}❌ DEPLOYMENT FALLÓ${NC}"
    echo "============================================="
    echo ""
    echo "📁 Revisa los siguientes archivos:"
    echo "   - build_log.txt (log completo del build)"
    echo "   - case_conflicts.txt (imports problemáticos)"
    echo "   - amfe_check.txt (exports de AMFETable)"
    echo "   - reports/ts-errors-full.txt (errores TypeScript)"
    echo "   - reports/ts-undefined-errors.txt (problemas undefined)"
    echo ""
    echo "🔧 Acciones sugeridas:"
    echo "   1. Revisa los errores en build_log.txt"
    echo "   2. Corrige los problemas en Windows"
    echo "   3. Haz push a GitHub"
    echo "   4. Vuelve a ejecutar este script"
    echo ""
    exit 1
fi

