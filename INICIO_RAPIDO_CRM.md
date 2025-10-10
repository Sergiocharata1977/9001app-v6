# 🚀 INICIO RÁPIDO - CRM OPERATIVO

## ✅ ETAPA 1 COMPLETADA

El CRM básico está **completamente funcional** y conectado al backend.

---

## 📋 Pre-requisitos

- Node.js 18+ instalado
- MongoDB corriendo (local o Atlas)
- Variables de entorno configuradas

---

## 🔧 Instalación en 3 Pasos

### 1. **Instalar Dependencias del Frontend**

#### Windows:
```bash
cd frontend
.\install-crm-dependencies.bat
```

#### Linux/Mac:
```bash
cd frontend
chmod +x install-crm-dependencies.sh
./install-crm-dependencies.sh
```

O manualmente:
```bash
cd frontend
npm install sonner
```

---

### 2. **Configurar Variables de Entorno**

#### Backend (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/iso9001-crm
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

#### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

### 3. **Iniciar los Servicios**

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Deberías ver:
```
🚀 Servidor ejecutándose en puerto 5000
✅ MongoDB conectado
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Deberías ver:
```
▲ Next.js 14.x
✓ Ready on http://localhost:3000
```

---

## 🎯 Acceder al CRM

Abre tu navegador en: **http://localhost:3000/crm/dashboard**

---

## 🧪 Verificar que Todo Funciona

### 1. **Dashboard CRM**
- Ve a `/crm/dashboard`
- Deberías ver el dashboard con estadísticas

### 2. **Módulo Empresas**
- Ve a `/crm/empresas`
- Si hay datos en MongoDB, los verás listados
- Prueba los filtros y la búsqueda

### 3. **Módulo Oportunidades (Kanban)**
- Ve a `/crm/oportunidades`
- Deberías ver un tablero Kanban con 5 columnas
- **Arrastra una tarjeta a otra columna** → Se guarda en MongoDB
- Recarga la página → La tarjeta sigue en la nueva posición ✅

### 4. **Módulo Contactos**
- Ve a `/crm/contactos`
- Verás listado de contactos si existen

### 5. **Módulo Actividades**
- Ve a `/crm/actividades`
- Verás listado de actividades si existen
- Prueba marcar una como completada

---

## 🎨 Funcionalidades Disponibles

### ✅ **Completamente Funcional:**
- [x] Lista de Empresas con búsqueda y filtros
- [x] **Kanban de Oportunidades con Drag & Drop persistente**
- [x] Lista de Contactos con búsqueda y filtros
- [x] Lista de Actividades con estados
- [x] Eliminación de registros (soft delete)
- [x] Estadísticas en tiempo real
- [x] Notificaciones toast para acciones
- [x] Loading states
- [x] Manejo de errores robusto
- [x] Vistas alternativas (tarjetas/lista)

### ⏳ **Próximamente:**
- [ ] Formularios de creación/edición
- [ ] Vistas de detalle
- [ ] Paginación avanzada
- [ ] Exportación de datos
- [ ] Filtros avanzados

---

## 🗄️ Datos de Prueba

Si tu base de datos está vacía, puedes insertar datos de prueba:

### Desde el Backend:
```bash
cd backend
node insert-sample-data.js
```

O usar los seeders existentes del sistema.

---

## 🐛 Solución de Problemas

### "No puedo ver datos"
- Verifica que MongoDB esté corriendo
- Verifica que `MONGODB_URI` en `.env` sea correcta
- Verifica que `organization_id` coincida con datos en BD

### "Drag & Drop no funciona"
- Verifica que el backend esté corriendo
- Abre DevTools → Network → Deberías ver requests a `/api/crm/oportunidades/:id/etapa`
- Verifica que no haya errores en consola

### "Toast no aparecen"
- Verifica que `sonner` esté instalado: `npm list sonner`
- Verifica que `<Toaster />` esté en el layout de CRM

### "Error de CORS"
- Verifica que `FRONTEND_URL` en backend `.env` sea `http://localhost:3000`
- Reinicia el backend

---

## 📊 Cambiar Organization ID

Por defecto usa `ORG-2024-001`. Para cambiarlo:

1. Abre DevTools → Console
2. Ejecuta:
```javascript
localStorage.setItem('organizationId', 'TU-ORG-ID');
location.reload();
```

O edita en: `frontend/src/contexts/OrganizationContext.tsx`

---

## 📚 Documentación Completa

- **Detalles técnicos:** `frontend/ETAPA_1_CRM_COMPLETADA.md`
- **Estructura del código:** Ver archivos en `frontend/src/`
- **API Endpoints:** Documentado en ETAPA_1_CRM_COMPLETADA.md

---

## 🎊 ¡Listo!

Tu CRM está **100% funcional**. 

**Próximos pasos sugeridos:**
1. Validar con usuarios reales
2. Crear formularios de alta/edición
3. Decidir si continuar con módulos financieros para el Legajo

---

## 💬 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Revisa los logs del backend
3. Verifica que ambos servidores estén corriendo
4. Verifica conexión a MongoDB

---

**Creado:** Octubre 2025  
**Estado:** ✅ ETAPA 1 COMPLETADA  
**Versión:** 9001App v6 - CRM Básico Funcional



