#!/bin/bash
# ==============================================================================
# 🚀 9001app v6 - Script de Deploy y Diagnóstico Completo para VPS Linux
# Autor: Sergio De Filippi
# Versión: 3.0 (con mejoras de diagnóstico y corrección de tipos)
# Fecha: $(date)
# ==============================================================================

# --- Configuración ---
PROJECT_ROOT="/root/9001app-v6"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"
LOG_DIR="$PROJECT_ROOT/reports"
BUILD_LOG="$LOG_DIR/build_log.txt"
CASE_CONFLICTS_LOG="$LOG_DIR/case_conflicts.txt"
AMFE_CHECK_LOG="$LOG_DIR/amfe_check.txt"
TS_ERRORS_FULL_LOG="$LOG_DIR/ts-errors-full.txt"
TS_UNDEFINED_ERRORS_LOG="$LOG_DIR/ts-undefined-errors.txt"

# --- Funciones de Utilidad ---
log_step() {
    echo "=============================================================================="
    echo "➡️ $1"
    echo "=============================================================================="
}

log_success() {
    echo "✅ ÉXITO: $1"
}

log_error() {
    echo "❌ ERROR: $1"
    exit 1
}

# --- Inicio del Script ---
log_step "INICIANDO PROCESO DE DEPLOY Y DIAGNÓSTICO PARA 9001APP V6"

# Crear directorio de logs si no existe
mkdir -p "$LOG_DIR" || log_error "No se pudo crear el directorio de logs: $LOG_DIR"

# 1. Navegar al directorio del proyecto
log_step "1. Navegando al directorio del proyecto: $PROJECT_ROOT"
cd "$PROJECT_ROOT" || log_error "No se pudo navegar al directorio del proyecto: $PROJECT_ROOT"

# 2. Detener servicios PM2
log_step "2. Deteniendo servicios PM2 existentes"
pm2 stop all || echo "Advertencia: No hay procesos PM2 corriendo o error al detenerlos."
pm2 delete all || echo "Advertencia: No hay procesos PM2 para eliminar o error al eliminarlos."
log_success "Servicios PM2 detenidos y eliminados."

# 3. Actualizar código desde GitHub
log_step "3. Actualizando código desde GitHub (rama main)"
git fetch origin main || log_error "Error al hacer git fetch."
git reset --hard origin/main || log_error "Error al hacer git reset --hard."
git pull origin main || log_error "Error al hacer git pull."
log_success "Código actualizado desde GitHub."

# 4. Verificar y corregir archivos PascalCase en frontend/src/components/ui
log_step "4. Verificando y corrigiendo nombres de archivos PascalCase en frontend/src/components/ui"
UI_COMPONENTS_PATH="$FRONTEND_DIR/src/components/ui"
if [ -d "$UI_COMPONENTS_PATH" ]; then
    cd "$UI_COMPONENTS_PATH" || log_error "No se pudo navegar a $UI_COMPONENTS_PATH"
    PASCAL_FILES=$(find . -maxdepth 1 -type f -name "*.tsx" -exec basename {} \; | grep -E "^[A-Z]")
    if [ -n "$PASCAL_FILES" ]; then
        echo "Archivos PascalCase encontrados, renombrando a kebab-case:"
        for file in $PASCAL_FILES; do
            kebab_file=$(echo "$file" | sed -r 's/([A-Z])/-\L\1/g' | sed -r 's/^-//')
            if [ "$file" != "$kebab_file" ]; then
                # Renombrar usando un nombre temporal para evitar conflictos de case-insensitivity
                temp_file="${file}.tmp"
                mv "$file" "$temp_file" && mv "$temp_file" "$kebab_file"
                if [ $? -eq 0 ]; then
                    echo "  Renombrado: $file -> $kebab_file"
                else
                    echo "  ❌ Error al renombrar $file a $kebab_file"
                fi
            fi
        done
    else
        echo "No se encontraron archivos PascalCase en $UI_COMPONENTS_PATH."
    fi
    cd "$PROJECT_ROOT" || log_error "No se pudo volver al directorio del proyecto."
else
    echo "Advertencia: Directorio $UI_COMPONENTS_PATH no encontrado."
fi
log_success "Verificación y corrección de nombres de archivos completada."

# 5. Limpiar caché y dependencias antiguas
log_step "5. Limpiando caché y dependencias antiguas"
cd "$FRONTEND_DIR" || log_error "No se pudo navegar a $FRONTEND_DIR"
rm -rf .next node_modules .cache dist || echo "Advertencia: Algunos archivos de caché/módulos no existen."
npm cache clean --force || echo "Advertencia: Error al limpiar la caché de npm."
log_success "Caché y dependencias antiguas eliminadas."

# 6. Instalar dependencias del frontend
log_step "6. Instalando dependencias del frontend en $FRONTEND_DIR"
npm install --legacy-peer-deps || log_error "Error al instalar dependencias del frontend."
npm rebuild || log_error "Error al reconstruir módulos nativos del frontend."
log_success "Dependencias del frontend instaladas y reconstruidas."

# 7. Limpiar caché y dependencias antiguas del backend
log_step "7. Limpiando caché y dependencias antiguas del backend"
cd "$BACKEND_DIR" || log_error "No se pudo navegar a $BACKEND_DIR"
rm -rf node_modules .cache dist || echo "Advertencia: Algunos archivos de caché/módulos no existen."
npm cache clean --force || echo "Advertencia: Error al limpiar la caché de npm."
log_success "Caché y dependencias antiguas del backend eliminadas."

# 8. Instalar dependencias del backend
log_step "8. Instalando dependencias del backend en $BACKEND_DIR"
npm install --legacy-peer-deps || log_error "Error al instalar dependencias del backend."
npm rebuild || log_error "Error al reconstruir módulos nativos del backend."
log_success "Dependencias del backend instaladas y reconstruidas."

# 9. Convertir archivos .env a formato Unix (si existen)
log_step "9. Convirtiendo archivos .env a formato Unix"
cd "$PROJECT_ROOT"
find . -name ".env*" -exec dos2unix {} \; 2>/dev/null || echo "Advertencia: dos2unix no encontrado o no hay archivos .env para convertir."
log_success "Archivos .env convertidos a formato Unix."

# 10. Verificación de Case Sensitivity (imports)
log_step "10. Ejecutando script de verificación de case sensitivity"
cd "$FRONTEND_DIR"
node scripts/check-case-sensitivity.js > "$CASE_CONFLICTS_LOG" 2>&1
if grep -q "ERROR" "$CASE_CONFLICTS_LOG"; then
    echo "❌ Se detectaron conflictos de case sensitivity. Revisar: $CASE_CONFLICTS_LOG"
    # No se detiene el script aquí, pero se registra el error.
else
    log_success "No se detectaron conflictos de case sensitivity en los imports."
fi

# 11. Verificación de AMFETable (export duplicado)
log_step "11. Verificando AMFETable.tsx para exportaciones duplicadas"
AMFE_FILE="$FRONTEND_DIR/src/components/quality/amfe/AMFETable.tsx"
if [ -f "$AMFE_FILE" ]; then
    if grep -q "export default function AMFETable()" "$AMFE_FILE" && grep -q "export default AMFETable;" "$AMFE_FILE"; then
        echo "❌ AMFETable.tsx tiene un 'export default' duplicado. Corrigiendo..." | tee -a "$AMFE_CHECK_LOG"
        # Eliminar la línea "export default AMFETable;"
        sed -i '/export default AMFETable;/d' "$AMFE_FILE"
        log_success "AMFETable.tsx corregido."
    else
        log_success "AMFETable.tsx no tiene exportaciones duplicadas."
    fi
else
    echo "Advertencia: AMFETable.tsx no encontrado."
fi

# 12. Ejecutar Typecheck de TypeScript
log_step "12. Ejecutando verificación de tipos de TypeScript (npx tsc --noEmit)"
cd "$FRONTEND_DIR"
npx tsc --noEmit --pretty > "$TS_ERRORS_FULL_LOG" 2>&1
if grep -q "error TS" "$TS_ERRORS_FULL_LOG"; then
    echo "❌ Se detectaron errores de TypeScript. Revisar: $TS_ERRORS_FULL_LOG"
    grep -E "undefined|possibly|not assignable to type" "$TS_ERRORS_FULL_LOG" > "$TS_UNDEFINED_ERRORS_LOG"
    echo "Errores relacionados con 'undefined' o asignación de tipos en: $TS_UNDEFINED_ERRORS_LOG"
    # No se detiene el script aquí, pero se registra el error.
else
    log_success "No se detectaron errores de tipos de TypeScript."
fi

# 13. Ejecutar script prebuild-linux.js
log_step "13. Ejecutando script prebuild-linux.js"
cd "$FRONTEND_DIR"
node scripts/prebuild-linux.js || echo "Advertencia: prebuild-linux.js falló o no existe."
log_success "Script prebuild-linux.js ejecutado."

# 14. Build del frontend
log_step "14. Iniciando build del frontend (npm run build)"
cd "$FRONTEND_DIR"
npm run build > "$BUILD_LOG" 2>&1
BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -ne 0 ] || grep -q "Failed to compile" "$BUILD_LOG"; then
    log_error "El build del frontend falló. Revisar: $BUILD_LOG"
else
    log_success "Build del frontend completado exitosamente."
fi

# 15. Iniciar servicios PM2
log_step "15. Iniciando servicios PM2"
cd "$PROJECT_ROOT"

# Iniciar backend
log_step "Iniciando backend con PM2"
pm2 start "$BACKEND_DIR/dist/main.js" --name "9001app-backend" --watch --ignore-watch="node_modules" --time || log_error "Error al iniciar el backend con PM2."
log_success "Backend iniciado con PM2."

# Iniciar frontend
log_step "Iniciando frontend con PM2"
pm2 start npm --name "9001app-frontend" -- start --prefix "$FRONTEND_DIR" --watch --ignore-watch="node_modules" --time || log_error "Error al iniciar el frontend con PM2."
log_success "Frontend iniciado con PM2."

# Guardar configuración de PM2
pm2 save || log_error "Error al guardar la configuración de PM2."
log_success "Configuración de PM2 guardada."

# Mostrar estado de PM2
log_step "Estado actual de PM2"
pm2 list

log_step "PROCESO DE DEPLOY Y DIAGNÓSTICO FINALIZADO"
echo "=============================================================================="
echo "🎉 ¡Deploy completado! Revisa los logs para cualquier advertencia o error."
echo "Reportes generados en: $LOG_DIR"
echo "=============================================================================="