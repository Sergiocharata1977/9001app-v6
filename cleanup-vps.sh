#!/bin/bash

# 🧹 Script de Limpieza Completa - VPS Hostinger
# Ejecutar como root para limpiar versiones viejas

echo "🧹 Iniciando limpieza completa del VPS..."

# 1. Parar todos los procesos de Node.js
echo "🛑 Parando procesos de Node.js..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
pkill -f node 2>/dev/null || true

# 2. Verificar procesos restantes
echo "🔍 Verificando procesos restantes..."
ps aux | grep node | grep -v grep

# 3. Limpiar directorios del proyecto
echo "🗑️ Eliminando directorios viejos del proyecto..."
rm -rf /var/www/9001app*
rm -rf /var/www/9001*
rm -rf /home/*/9001app*
rm -rf /root/9001app*

# 4. Limpiar configuración de Nginx
echo "🗑️ Limpiando configuración de Nginx..."
rm -f /etc/nginx/sites-available/9001app*
rm -f /etc/nginx/sites-enabled/9001app*
rm -f /etc/nginx/sites-available/9001*
rm -f /etc/nginx/sites-enabled/9001*

# 5. Limpiar logs
echo "🗑️ Limpiando logs viejos..."
rm -f /var/log/nginx/9001app*
rm -f /root/.pm2/logs/9001app*

# 6. Verificar puertos libres
echo "🔍 Verificando puertos..."
netstat -tulpn | grep :3000 || echo "Puerto 3000 libre"
netstat -tulpn | grep :5000 || echo "Puerto 5000 libre" 
netstat -tulpn | grep :5001 || echo "Puerto 5001 libre"

# 7. Recargar servicios
echo "🔄 Recargando servicios..."
nginx -t && systemctl reload nginx

# 8. Mostrar estado final
echo "📊 Estado final del sistema:"
echo "Directorios en /var/www/:"
ls -la /var/www/

echo "Procesos de Node.js:"
ps aux | grep node | grep -v grep || echo "Ningún proceso de Node.js corriendo"

echo "✅ Limpieza completada!"
echo "🚀 Ahora puedes proceder con la instalación limpia"



