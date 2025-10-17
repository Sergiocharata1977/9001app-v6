#!/bin/bash

# 🚀 Script de Instalación Automática - 9001app v6 en VPS Hostinger
# Ejecutar como root en el VPS

echo "🚀 Iniciando instalación de 9001app v6 en VPS..."

# Actualizar sistema
echo "📦 Actualizando sistema..."
apt update && apt upgrade -y

# Instalar Node.js 22
echo "📦 Instalando Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
apt-get install -y nodejs

# Instalar PM2 para gestión de procesos
echo "📦 Instalando PM2..."
npm install -g pm2

# Instalar Nginx
echo "📦 Instalando Nginx..."
apt install -y nginx

# Instalar Git
echo "📦 Instalando Git..."
apt install -y git

# Crear directorio del proyecto
echo "📁 Creando directorio del proyecto..."
mkdir -p /var/www/9001app
cd /var/www/9001app

# Clonar repositorio
echo "📥 Clonando repositorio desde GitHub..."
git clone https://github.com/Sergiocharata1977/9001app-v6.git .

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install --production

# Compilar backend
echo "🔨 Compilando backend..."
npm run build

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd ../frontend
npm install
npm run build

# Configurar variables de entorno
echo "⚙️ Configurando variables de entorno..."
cd ../backend
cat > .env << EOF
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/9001app-v6?retryWrites=true&w=majority
JWT_SECRET=tu-jwt-secret-super-seguro
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=https://9001app.com
BACKEND_URL=https://api.9001app.com
EOF

echo "✅ Instalación completada!"
echo "🔧 Próximos pasos:"
echo "1. Configurar MongoDB URI en backend/.env"
echo "2. Configurar dominio en nginx"
echo "3. Iniciar servicios con PM2"



