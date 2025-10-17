#!/bin/bash
# =============================================
# Quick Fix para módulo Action
# Normaliza el nombre del archivo a minúsculas
# =============================================

set -e

TARGET_DIR="frontend/src/shared-types/entities"

echo "🔍 Buscando archivo Action..."

if [ -d "$TARGET_DIR" ]; then
  FOUND=$(ls $TARGET_DIR 2>/dev/null | grep -i '^action' || true)
  
  if [ -n "$FOUND" ]; then
    echo "✓ Encontrado: $FOUND"
    
    # Normalizar a action.ts (minúsculas)
    if [ "$FOUND" != "Action.ts" ]; then
      echo "⚠️  Archivo ya está en formato correcto"
    else
      echo "🔧 Renombrando $FOUND -> action.ts"
      
      # Usar técnica de archivo temporal para evitar problemas en sistemas case-insensitive
      git mv "$TARGET_DIR/$FOUND" "$TARGET_DIR/action-temp.ts"
      git mv "$TARGET_DIR/action-temp.ts" "$TARGET_DIR/Action.ts"
      
      git commit -m "fix: normalizar nombre de archivo Action.ts para compatibilidad Linux"
      
      echo "✅ Renombrado completado y commit creado"
    fi
  else
    echo "ℹ️  No se encontró archivo Action existente"
    echo "✓ El archivo Action.ts será creado por el sistema"
  fi
else
  echo "ℹ️  Directorio $TARGET_DIR no existe aún"
  echo "✓ Será creado con el archivo Action.ts"
fi

echo ""
echo "✅ Verificación completada"

