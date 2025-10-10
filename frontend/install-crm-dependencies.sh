#!/bin/bash

echo "============================================"
echo "INSTALANDO DEPENDENCIAS CRM - 9001App v6"
echo "============================================"
echo ""

cd "$(dirname "$0")"

echo "[1/2] Instalando Sonner (Toast notifications)..."
npm install sonner

echo ""
echo "[2/2] Verificando instalacion..."
npm list sonner

echo ""
echo "============================================"
echo "INSTALACION COMPLETADA"
echo "============================================"
echo ""
echo "Ahora puedes iniciar el frontend con: npm run dev"
echo ""



