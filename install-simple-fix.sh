#!/bin/bash

# 🚀 Script Simplificado - Sin errores

echo "🚀 Instalación simplificada 9001app v6..."

# Verificar herramientas necesarias
echo "🔍 Verificando herramientas..."

# Instalar Node.js si no existe
if ! command -v node &> /dev/null; then
    echo "📦 Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    apt-get install -y nodejs
fi

# Instalar PM2 si no existe
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    npm install -g pm2
fi

# 1. Limpiar
echo "🧹 Limpiando..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
pkill -f node 2>/dev/null || true
rm -rf /var/www/9001app*
rm -f /etc/nginx/sites-available/9001app*
rm -f /etc/nginx/sites-enabled/9001app*

# 2. Crear directorio
echo "📁 Creando directorio..."
mkdir -p /var/www/9001app-v6
cd /var/www/9001app-v6

# 3. Clonar
echo "📥 Clonando repositorio..."
git clone git@github.com:Sergiocharata1977/9001app-v6.git .

# 4. Backend
echo "📦 Instalando backend..."
cd backend
npm install
npm run build

# 5. Frontend
echo "📦 Instalando frontend..."
cd ../frontend
npm install
npm run build

# 6. Configurar .env básico
echo "⚙️ Configurando .env..."
cd ../backend
cat > .env << EOF
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/9001app-v6
JWT_SECRET=jwt-secret-9001app-produccion
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://www.9001app.com
BACKEND_URL=https://www.9001app.com
EOF

# 7. Iniciar con PM2
echo "🚀 Iniciando aplicaciones..."
cd /var/www/9001app-v6

# Backend
pm2 start backend/dist/server.js --name "9001app-backend" --env production

# Frontend
pm2 start npm --name "9001app-frontend" --cwd frontend -- start

pm2 save

echo "✅ Instalación completada!"
echo "📊 Estado: pm2 status"
echo "📋 Logs: pm2 logs"



