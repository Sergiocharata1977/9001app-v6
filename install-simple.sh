#!/bin/bash

# 🚀 Instalación Simple 9001app v6 - Sin autenticación GitHub

echo "🚀 Instalación Simple 9001app v6..."

# 1. Limpiar versión vieja
echo "🧹 Limpiando versión vieja..."
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

# 3. Clonar con HTTPS público
echo "📥 Clonando repositorio..."
git clone https://github.com/Sergiocharata1977/9001app-v6.git .

# 4. Instalar backend
echo "📦 Instalando backend..."
cd backend
npm install --production
npm run build

# 5. Instalar frontend
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
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/9001app-v6?retryWrites=true&w=majority
JWT_SECRET=jwt-secret-super-seguro-para-produccion-9001app
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5001
EOF

# 7. Configurar PM2
echo "⚙️ Configurando PM2..."
cd /var/www/9001app-v6
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: '9001app-backend',
      script: './backend/dist/server.js',
      cwd: '/var/www/9001app-v6',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      }
    },
    {
      name: '9001app-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/9001app-v6/frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
EOF

# 8. Iniciar aplicaciones
echo "🚀 Iniciando aplicaciones..."
pm2 start ecosystem.config.js
pm2 save

echo "✅ Instalación completada!"
echo "📊 Verificar: pm2 status"
echo "📋 Logs: pm2 logs"



