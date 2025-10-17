#!/bin/bash

# 🚀 Script de Deploy: Corrección Case Sensitivity
# Para VPS Linux (Hostinger)
# Fecha: 17 Oct 2025

set -e  # Detener en caso de error

echo "=================================="
echo "🚀 DEPLOY: 9001app-v6"
echo "Fix: Case Sensitivity"
echo "=================================="
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuración
PROJECT_DIR="/var/www/9001app-v6"
BRANCH="main"

# 1. Ir al directorio del proyecto
echo -e "${YELLOW}📁 Navegando al directorio del proyecto...${NC}"
cd $PROJECT_DIR || { echo -e "${RED}❌ Error: No se encuentra el directorio${NC}"; exit 1; }
echo -e "${GREEN}✓ En: $(pwd)${NC}"
echo ""

# 2. Detener servicios PM2
echo -e "${YELLOW}🛑 Deteniendo servicios PM2...${NC}"
pm2 stop all 2>/dev/null || echo "Servicios ya detenidos"
echo -e "${GREEN}✓ Servicios detenidos${NC}"
echo ""

# 3. Hacer backup de .env files
echo -e "${YELLOW}💾 Respaldando archivos de configuración...${NC}"
cp backend/.env backend/.env.backup 2>/dev/null || true
cp frontend/.env.local frontend/.env.local.backup 2>/dev/null || true
echo -e "${GREEN}✓ Backup completado${NC}"
echo ""

# 4. Pull del repositorio
echo -e "${YELLOW}📥 Descargando cambios del repositorio...${NC}"
git fetch origin
git reset --hard origin/$BRANCH
echo -e "${GREEN}✓ Código actualizado${NC}"
echo ""

# 5. Instalar dependencias del Frontend
echo -e "${YELLOW}📦 Instalando dependencias del frontend...${NC}"
cd frontend
npm install --legacy-peer-deps
echo -e "${GREEN}✓ Dependencias frontend instaladas${NC}"
echo ""

# 6. Build del Frontend
echo -e "${YELLOW}🏗️  Compilando frontend (puede tomar 5-8 minutos)...${NC}"
npm run build
echo -e "${GREEN}✓ Frontend compilado${NC}"
echo ""

# 7. Instalar dependencias del Backend
echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"
cd ../backend
npm install --legacy-peer-deps
echo -e "${GREEN}✓ Dependencias backend instaladas${NC}"
echo ""

# 8. Build del Backend
echo -e "${YELLOW}🏗️  Compilando backend...${NC}"
npm run build
echo -e "${GREEN}✓ Backend compilado${NC}"
echo ""

# 9. Restaurar archivos de configuración
echo -e "${YELLOW}⚙️  Restaurando configuración...${NC}"
cd ..
cp backend/.env.backup backend/.env 2>/dev/null || true
cp frontend/.env.local.backup frontend/.env.local 2>/dev/null || true
echo -e "${GREEN}✓ Configuración restaurada${NC}"
echo ""

# 10. Reiniciar servicios PM2
echo -e "${YELLOW}🚀 Reiniciando servicios...${NC}"
pm2 restart all || pm2 start ecosystem.config.js
pm2 save
echo -e "${GREEN}✓ Servicios reiniciados${NC}"
echo ""

# 11. Verificar estado
echo -e "${YELLOW}📊 Estado de los servicios:${NC}"
pm2 status
echo ""

# 12. Mostrar logs recientes
echo -e "${YELLOW}📋 Últimos logs:${NC}"
pm2 logs --lines 20 --nostream
echo ""

echo "=================================="
echo -e "${GREEN}✅ DEPLOY COMPLETADO${NC}"
echo "=================================="
echo ""
echo "🌐 Frontend: http://$(hostname -I | awk '{print $1}'):3000"
echo "🔧 Backend: http://$(hostname -I | awk '{print $1}'):5001"
echo ""
echo "Comandos útiles:"
echo "  pm2 logs                  # Ver logs en tiempo real"
echo "  pm2 status                # Ver estado de servicios"
echo "  pm2 restart all           # Reiniciar todos los servicios"
echo "  pm2 monit                 # Monitor en tiempo real"
echo ""

