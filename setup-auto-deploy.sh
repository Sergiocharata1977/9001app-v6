#!/bin/bash

# 🚀 Script para configurar actualización automática del servidor

echo "🚀 Configurando actualización automática del servidor..."

# 1. Crear script de actualización
echo "📝 Creando script de actualización..."
cat > /var/www/9001app-v6/update-app.sh << 'EOF'
#!/bin/bash

# 🔄 Script de actualización automática
cd /var/www/9001app-v6

echo "🔄 Actualizando aplicación..."

# Pull del repositorio
git pull origin main

# Reinstalar dependencias del backend
cd backend
npm install --production
npm run build

# Reinstalar dependencias del frontend
cd ../frontend
npm install
npm run build

# Reiniciar aplicaciones
cd /var/www/9001app-v6
pm2 restart all

echo "✅ Aplicación actualizada"
EOF

chmod +x /var/www/9001app-v6/update-app.sh

# 2. Configurar webhook de GitHub (opcional)
echo "📝 Configurando webhook de GitHub..."
cat > /var/www/9001app-v6/webhook-deploy.js << 'EOF'
const http = require('http');
const { exec } = require('child_process');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        if (payload.ref === 'refs/heads/main') {
          console.log('🚀 Deploy trigger from GitHub');
          exec('/var/www/9001app-v6/update-app.sh', (error, stdout, stderr) => {
            if (error) {
              console.error('Error:', error);
            }
            console.log('Deploy completed');
          });
        }
      } catch (e) {
        console.error('Error parsing webhook:', e);
      }
    });
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({status: 'ok'}));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3001, () => {
  console.log('Webhook server running on port 3001');
});
EOF

# 3. Configurar PM2 para el webhook
echo "📝 Configurando webhook en PM2..."
cd /var/www/9001app-v6
cat > ecosystem-webhook.config.js << 'EOF'
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
    },
    {
      name: '9001app-webhook',
      script: 'node',
      args: 'webhook-deploy.js',
      cwd: '/var/www/9001app-v6',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
EOF

# 4. Configurar Nginx para el webhook
echo "📝 Configurando Nginx para webhook..."
cat >> /etc/nginx/sites-available/9001app-v6 << 'EOF'

    # Webhook para actualizaciones automáticas
    location /webhook {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
EOF

# 5. Recargar configuración
echo "🔄 Recargando configuración..."
nginx -t && systemctl reload nginx
pm2 restart ecosystem-webhook.config.js

echo "✅ Configuración de actualización automática completada!"
echo ""
echo "📋 Pasos para actualización automática:"
echo "1. Manual: ./update-app.sh"
echo "2. Webhook: POST a https://www.9001app.com/webhook"
echo "3. GitHub: Configurar webhook en Settings → Webhooks"
echo ""
echo "🔗 URL del webhook: https://www.9001app.com/webhook"



