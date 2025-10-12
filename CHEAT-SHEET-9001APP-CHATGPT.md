# 🚀 CHEAT SHEET - 9001APP v6
**Referencia Rápida para ChatGPT**

---

## ⚡ INICIO RÁPIDO (5 minutos)

```bash
# 1. Iniciar todo el sistema (Windows)
.\arrancar-sistema-completo.ps1

# 2. O manualmente:
cd backend && npm run dev       # Puerto 5000
cd frontend && npm run dev      # Puerto 3000

# 3. Acceder
http://localhost:3000/crm/dashboard
http://localhost:3000/super-admin/tareas
```

---

## 📊 MÓDULOS Y RUTAS PRINCIPALES

| Módulo | Ruta | Estado | % |
|--------|------|--------|---|
| **CRM** | `/crm/*` | 🟢 Completo | 100% |
| **Legajos** | `/crm/legajos/*` | 🟢 Completo | 100% |
| **RRHH** | `/rrhh/*` | 🟡 Básico | 60% |
| **Auditorías** | `/auditorias/*` | 🟡 Básico | 60% |
| **Procesos** | `/procesos/*` | 🟢 Funcional | 75% |
| **Documentos** | `/documentos/*` | 🟢 Funcional | 75% |
| **Normas** | `/normas/*` | 🟢 Funcional | 75% |
| **Super Admin** | `/super-admin/*` | 🟢 Completo | 100% |
| **Don Cándido** | Integrado | ⚠️ No activado | 80% |

---

## 🗂️ ESTRUCTURA DE CARPETAS CLAVE

```
9001app-v6/
├── backend/src/
│   ├── models/          ← Modelos MongoDB (20+)
│   ├── controllers/     ← Lógica de negocio
│   ├── routes/          ← API REST (100+ endpoints)
│   └── services/        ← Servicios reutilizables
│
└── frontend/src/
    ├── app/             ← Next.js 14 App Router
    │   ├── crm/         ← CRM completo ✅
    │   ├── rrhh/        ← RRHH básico 🟡
    │   ├── auditorias/  ← Auditorías básico 🟡
    │   ├── procesos/    ← Procesos funcional ✅
    │   ├── documentos/  ← Documentos funcional ✅
    │   ├── normas/      ← Normas funcional ✅
    │   └── super-admin/ ← Admin completo ✅
    │
    ├── components/      ← Componentes React (100+)
    └── services/        ← API clients
```

---

## 🎯 FUNCIONALIDADES ESTRELLA

### 1️⃣ CRM con Kanban Drag & Drop
- **Ubicación**: `/crm/oportunidades`
- **Funciona**: Arrastra tarjetas, se guarda automáticamente en MongoDB
- **Backend**: `backend/src/routes/crmRoutes.ts`

### 2️⃣ Legajos Financieros con Ratios Automáticos
- **Ubicación**: `/crm/legajos`
- **Calcula**: 15 ratios financieros al guardar datos
- **Documentación**: `GUIA-RAPIDA-LEGAJOS.md`

### 3️⃣ Sistema Kanban de Roadmap
- **Ubicación**: `/super-admin/tareas`
- **Gestiona**: 30+ tareas con drag & drop
- **Filtros**: Por módulo, prioridad, fase, tipo, asignado

### 4️⃣ Don Cándido (IA Assistant)
- **Estado**: Código listo, necesita API Key
- **Activación**: 15 minutos
- **Documentación**: `README-DON-CANDIDO-ESTADO-ACTUAL.md`

---

## 🔑 ARCHIVOS CLAVE PARA IA

### Para Entender el Proyecto
```
1. PROYECTO-9001APP-ESTADO-ACTUAL-CHATGPT.md    ← Este archivo (PRINCIPAL)
2. README-DON-CANDIDO-ESTADO-ACTUAL.md          ← Don Cándido
3. GUIA-RAPIDA-LEGAJOS.md                       ← Sistema financiero
4. ROADMAP-KANBAN-README.md                     ← Gestión de tareas
```

### Para Implementar Código
```
Backend:
- backend/src/server.ts                         ← Entry point
- backend/src/models/                           ← Schemas MongoDB
- backend/src/routes/crmRoutes.ts               ← CRM API
- backend/src/services/MetricsService.ts        ← Cálculo ratios

Frontend:
- frontend/src/app/crm/oportunidades/page.tsx   ← Kanban CRM
- frontend/src/app/crm/legajos/[id]/page.tsx    ← Detalle legajo
- frontend/src/app/super-admin/tareas/page.tsx  ← Kanban roadmap
- frontend/src/contexts/OrganizationContext.tsx ← Multi-tenant
```

---

## 💾 CARGAR DATOS DE PRUEBA

```bash
cd backend

# Todos los datos de una vez
npm run build
node insert-sample-data.js         # Datos generales
node insert-crm-sample-data.js     # CRM
node run-seed-legajos.js           # Legajos con ratios
npm run ts-node src/seeders/roadmapTaskSeeder.ts  # Tareas
```

---

## 🧪 TESTING RÁPIDO

```bash
# Verificar todo el sistema
.\test-maestro-9001app.ps1

# Test de performance
node test-velocidad-v3.js

# Diagnóstico
node diagnostico-completo.js

# Ver datos en MongoDB
node backend/check-data.js
```

---

## ⚙️ VARIABLES DE ENTORNO

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/9001app
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
JWT_SECRET=tu-secreto-aqui
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLAUDE_API_KEY=sk-ant-...  # Opcional, solo Don Cándido
```

---

## 🐛 PROBLEMAS COMUNES

### "No veo datos"
```javascript
// En DevTools Console:
localStorage.setItem('organizationId', 'ORG-2024-001');
location.reload();
```

### "Backend no conecta"
```bash
# Verificar MongoDB
mongosh

# Verificar URI en backend/.env
MONGODB_URI=mongodb://localhost:27017/9001app
```

### "Drag & Drop no funciona"
- Verificar backend corriendo (puerto 5000)
- Ver Network tab en DevTools
- Debe haber requests PATCH exitosos

### "Errores de TypeScript"
```bash
cd backend
npm run build
# Revisar errores y corregir
```

---

## 🎯 PRIORIDADES ACTUALES

### 🔴 AHORA (Esta Semana)
- [ ] **Decidir sobre Don Cándido** (¿Activar MVP $2K?)
- [ ] **Completar ABM RRHH Personal** (CRUD completo)
- [ ] **Completar ABM CRM Empresas** (Formularios)

### 🟠 PRONTO (Este Mes)
- [ ] Testing E2E con Playwright
- [ ] Optimización de performance
- [ ] Documentación de usuario

### 🟡 DESPUÉS (Próximos 2 Meses)
- [ ] Sistema de notificaciones
- [ ] Exportación de reportes
- [ ] Dashboard de métricas globales

---

## 📊 ESTADÍSTICAS DEL PROYECTO

```
Líneas de Código:   ~40,000 (TS/TSX)
Componentes React:  100+
API Endpoints:      100+
Modelos MongoDB:    20+
Páginas:            50+
Tests:              En desarrollo

Progreso:           ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜⬜⬜⬜⬜ 75%
```

---

## 🤖 DON CÁNDIDO - ESTADO

```
Código:           ✅ 100% (1,500 líneas)
API Key:          ❌ No configurada
Activación:       ⏱️ 15 minutos
Costo MVP:        💰 $2,000 (1 semana)
Plan:             📋 FASE-0-MVP-DON-CANDIDO.md
```

**Para activar:**
```bash
# 1. Obtener API Key: https://console.anthropic.com
# 2. Configurar:
echo "NEXT_PUBLIC_CLAUDE_API_KEY=sk-ant-..." >> frontend/.env.local
# 3. Reiniciar:
npm run dev
```

---

## 🔗 ENDPOINTS API MÁS USADOS

### CRM
```
GET    /api/crm/empresas
GET    /api/crm/oportunidades
PATCH  /api/crm/oportunidades/:id/etapa
GET    /api/crm/contactos
GET    /api/crm/actividades
```

### Legajos
```
GET    /api/legajos
GET    /api/legajos/:id/metrics
POST   /api/legajos/:id/recalculate-ratios
GET    /api/legajos/:id/risk-factors
```

### Roadmap
```
GET    /api/roadmap/tasks
POST   /api/roadmap/tasks
PATCH  /api/roadmap/tasks/:id/move
GET    /api/roadmap/stats
```

---

## 📱 NAVEGACIÓN RÁPIDA

```
Dashboard CRM:           /crm/dashboard
Empresas:                /crm/empresas
Oportunidades (Kanban):  /crm/oportunidades
Legajos:                 /crm/legajos
Análisis Riesgo:         /crm/analisis-riesgo

Personal RRHH:           /rrhh/personal
Auditorías:              /auditorias
Procesos:                /procesos
Documentos:              /documentos

Super Admin:             /super-admin
Roadmap Kanban:          /super-admin/tareas
Testing:                 /super-admin/testing
```

---

## 💡 COMANDOS ÚTILES

```bash
# Iniciar desarrollo
npm run dev

# Compilar TypeScript
npm run build

# Tests
npm test

# Limpiar y reiniciar
npm run clean
npm install

# Ver logs
tail -f backend/logs/app.log

# MongoDB
mongosh
use 9001app
db.companies.find()
db.roadmaptasks.find()
```

---

## 🎓 STACK TECNOLÓGICO

```
Backend:     Node.js + Express + TypeScript + MongoDB
Frontend:    Next.js 14 + React 18 + TypeScript
UI:          Tailwind CSS + Lucide Icons
State:       React Query + Context API
Drag&Drop:   @hello-pangea/dnd
Charts:      Recharts
Toast:       Sonner
IA:          Anthropic Claude (pendiente activar)
```

---

## ✅ CHECKLIST SESIÓN DE TRABAJO

Antes de pedirle a ChatGPT que trabaje:

- [ ] Sistema iniciado (backend + frontend)
- [ ] Datos de prueba cargados
- [ ] Este documento leído por la IA
- [ ] Tarea específica identificada
- [ ] Archivos relevantes localizados

Durante el trabajo con IA:

- [ ] Documentar cambios importantes
- [ ] Actualizar este cheat sheet si cambia algo
- [ ] Ejecutar tests después de cambios
- [ ] Verificar que compila sin errores

---

**Última actualización**: 12 de Octubre, 2025  
**Versión**: 1.0  
**Propósito**: Referencia rápida para ChatGPT/Claude al trabajar con 9001app-v6

---

### 📌 Documentos Recomendados para ChatGPT (4 slots)

1. ✅ **PROYECTO-9001APP-ESTADO-ACTUAL-CHATGPT.md** ← Principal
2. ✅ **CHEAT-SHEET-9001APP-CHATGPT.md** ← Este archivo
3. ✅ **README-DON-CANDIDO-ESTADO-ACTUAL.md** ← Don Cándido
4. ✅ **GUIA-RAPIDA-LEGAJOS.md** ← Legajos financieros

Con estos 4 archivos, ChatGPT tiene **contexto completo** del proyecto! 🎯

