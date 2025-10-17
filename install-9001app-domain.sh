#!/bin/bash

# 🚀 Instalación 9001app v6 con dominio 9001app.com

echo "🚀 Instalando 9001app v6 con dominio 9001app.com..."

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

# 3. Clonar repositorio con SSH
echo "📥 Clonando repositorio..."
git clone git@github.com:Sergiocharata1977/9001app-v6.git .

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

# 6. Configurar .env con tu dominio
echo "⚙️ Configurando .env con dominio 9001app.com..."
cd ../backend
cat > .env << EOF
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/9001app-v6?retryWrites=true&w=majority
JWT_SECRET=jwt-secret-super-seguro-para-produccion-9001app
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=https://www.9001app.com
BACKEND_URL=https://www.9001app.com
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
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: '9001app-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/9001app-v6/frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
EOF

# 8. Configurar Nginx para tu dominio
echo "⚙️ Configurando Nginx para 9001app.com..."
cat > /etc/nginx/sites-available/9001app-v6 << EOF
server {
    listen 80;
    server_name 9001app.com www.9001app.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 9. Activar sitio
echo "🔗 Activando sitio..."
ln -sf /etc/nginx/sites-available/9001app-v6 /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 10. Iniciar aplicaciones
echo "🚀 Iniciando aplicaciones..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Instalación completada!"
echo "🌐 Tu aplicación estará disponible en:"
echo "   - https://www.9001app.com"
echo "   - https://9001app.com"
echo "📊 Verificar: pm2 status"
echo "📋 Logs: pm2 logs"



