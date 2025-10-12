# 🎯 9001APP v6 - Sistema de Gestión de Calidad ISO 9001:2015

**Sistema integral de gestión de calidad multi-tenant**

[![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-blue)]()
[![Progreso](https://img.shields.io/badge/Progreso-75%25-green)]()
[![Tests](https://img.shields.io/badge/Tests-78%2F78%20✓-brightgreen)]()
[![Licencia](https://img.shields.io/badge/Licencia-Propietaria-red)]()

---

## 📋 Descripción

Sistema completo de gestión de calidad basado en ISO 9001:2015 con 8 módulos principales implementados, testing automatizado y panel de administración avanzado.

**Stack Tecnológico:**
- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Base de Datos**: MongoDB
- **Testing**: Playwright (E2E)
- **UI**: Tailwind CSS + Shadcn/ui

---

## 🚀 Inicio Rápido (5 minutos)

### 1. Requisitos Previos
```bash
Node.js 18+
MongoDB (local o Atlas)
Git
```

### 2. Clonar e Instalar
```bash
# Clonar repositorio
git clone [url-del-repo]
cd 9001app-v6

# Instalar dependencias backend
cd backend
npm install

# Instalar dependencias frontend
cd ../frontend
npm install
```

### 3. Configurar Variables de Entorno

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/9001app
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
JWT_SECRET=tu-secreto-aqui
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Iniciar el Sistema

**Opción A - Automático (Windows):**
```powershell
.\arrancar-sistema-completo.ps1
```

**Opción B - Manual:**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 5. Acceder al Sistema
```
Frontend:    http://localhost:3000
CRM:         http://localhost:3000/crm/dashboard
Super Admin: http://localhost:3000/super-admin
```

---

## 📦 Módulos Implementados

| Módulo | Estado | Progreso | Descripción |
|--------|--------|----------|-------------|
| **CRM** | 🟢 Operativo | 100% | Kanban, Legajos Financieros, Análisis Riesgo |
| **Legajos** | 🟢 Operativo | 100% | 15 ratios financieros automáticos |
| **Super Admin** | 🟢 Operativo | 100% | Testing, Roadmap Kanban, Administración |
| **Documentos** | 🟢 Operativo | 100% | Gestión documental SGC |
| **Puntos Norma** | 🟢 Operativo | 100% | ISO 9001:2015 completa |
| **Procesos** | 🟡 Funcional | 75% | Gestión de procesos |
| **RRHH** | 🟡 Básico | 60% | Personal, Puestos, Departamentos |
| **Auditorías** | 🟡 Básico | 60% | Planificación y ejecución |

**Progreso General**: ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜⬜⬜⬜⬜ **75%**

---

## 🧪 Testing

### Tests Implementados: 78 tests al 100%

| Módulo | Tests | Estado |
|--------|-------|--------|
| Documentos | 15 | ✅ 100% |
| Puntos Norma | 19 | ✅ 100% |
| Procesos | 12 | ✅ 100% |
| Personal | 12 | ✅ 100% |
| Puestos | 10 | ✅ 100% |
| Departamentos | 10 | ✅ 100% |

### Ejecutar Tests
```bash
# Test completo del sistema
.\test-maestro-9001app.ps1

# Test de performance
node test-velocidad-v3.js

# Diagnóstico del sistema
node diagnostico-completo.js
```

**Dashboard de Testing**: `http://localhost:3000/super-admin/testing`

---

## 💾 Cargar Datos de Prueba

```bash
cd backend

# Compilar TypeScript
npm run build

# Datos generales del sistema
node insert-sample-data.js

# Datos de CRM (empresas, contactos, oportunidades)
node insert-crm-sample-data.js

# Legajos financieros con ratios calculados
node run-seed-legajos.js

# Tareas del roadmap Kanban
npm run ts-node src/seeders/roadmapTaskSeeder.ts
```

---

## 📚 Documentación

### Para ChatGPT / Claude (4 documentos recomendados):
1. **`PROYECTO-9001APP-ESTADO-ACTUAL-CHATGPT.md`** - Documento maestro completo
2. **`CHEAT-SHEET-9001APP-CHATGPT.md`** - Referencia rápida
3. **`GUIA-SUPER-ADMIN-COMPLETA.md`** - Sistema de testing y admin
4. **`GUIA-RAPIDA-LEGAJOS.md`** - Sistema financiero

### Guías por Módulo:
- **CRM**: `INICIO_RAPIDO_CRM.md`
- **Legajos**: `GUIA-RAPIDA-LEGAJOS.md`, `RESUMEN-IMPLEMENTACION-LEGAJOS.md`
- **Roadmap**: `ROADMAP-KANBAN-README.md`
- **Super Admin**: `GUIA-SUPER-ADMIN-COMPLETA.md`

### Don Cándido (Asistente IA):
- **Estado**: `README-DON-CANDIDO-ESTADO-ACTUAL.md`
- **Plan Ejecutivo**: `RESUMEN-EJECUTIVO-DON-CANDIDO.md`
- **Plan MVP**: `FASE-0-MVP-DON-CANDIDO.md`
- **Activación**: `QUICK-START-DON-CANDIDO.md`

**Estado Don Cándido**: ⚠️ Código 100% listo, necesita activar API Key (15 minutos)

---

## 🎯 Funcionalidades Destacadas

### 1. CRM con Kanban Drag & Drop
- Gestión de empresas, contactos, oportunidades
- Kanban interactivo con persistencia en MongoDB
- Análisis de riesgo v1.0 integrado

**Acceder**: `/crm/oportunidades`

### 2. Legajos Financieros con Ratios Automáticos
- Carga de datos financieros por año fiscal
- **15 ratios calculados automáticamente**:
  - Liquidez, Endeudamiento, Rentabilidad, Eficiencia, Cobertura
- Dashboard con gráficos de evolución
- Vinculación con análisis de riesgo

**Acceder**: `/crm/legajos`

### 3. Roadmap Kanban
- 30+ tareas pre-cargadas del proyecto
- Drag & Drop entre columnas (persiste en BD)
- 7 filtros avanzados
- Gestión completa de tareas (CRUD)

**Acceder**: `/super-admin/tareas`

### 4. Sistema de Testing Automatizado
- 78 tests implementados (100% pasando)
- Dashboard con historial y métricas
- Reportes descargables
- Testing E2E con Playwright

**Acceder**: `/super-admin/testing`

---

## 🛠️ Scripts Disponibles

### Desarrollo
```bash
# Iniciar todo el sistema (Windows)
.\arrancar-sistema-completo.ps1

# Desarrollo backend + frontend
.\run-dev.ps1

# O manualmente
cd backend && npm run dev
cd frontend && npm run dev
```

### Testing
```bash
# Test maestro (completo)
.\test-maestro-9001app.ps1

# Performance
.\test-velocidad-abm.ps1
node test-velocidad-v3.js

# Diagnóstico
node diagnostico-completo.js
node diagnostico-sistema.js
```

### Seeds y Migraciones
```bash
# Legajos
.\run-seed-legajos.ps1
.\run-migrate-legajos.ps1

# Datos generales
node backend/insert-sample-data.js
node backend/insert-crm-sample-data.js
```

---

## 📊 Arquitectura del Proyecto

```
9001app-v6/
├── backend/                     # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── models/             # 20+ modelos MongoDB
│   │   ├── controllers/        # Lógica de negocio
│   │   ├── routes/             # 100+ endpoints REST
│   │   ├── services/           # Servicios reutilizables
│   │   └── middleware/         # Auth, validación, multi-tenant
│   └── dist/                   # TypeScript compilado
│
├── frontend/                    # Next.js 14 + React + TypeScript
│   └── src/
│       ├── app/                # App Router (Next.js 14)
│       │   ├── crm/           # Módulo CRM ✅
│       │   ├── rrhh/          # Módulo RRHH 🟡
│       │   ├── auditorias/    # Módulo Auditorías 🟡
│       │   ├── procesos/      # Módulo Procesos ✅
│       │   ├── documentos/    # Módulo Documentos ✅
│       │   ├── normas/        # Módulo Normas ✅
│       │   └── super-admin/   # Panel Admin ✅
│       ├── components/         # 100+ componentes React
│       ├── services/           # API clients
│       └── hooks/              # Custom hooks
│
└── Documentación/              # 15+ archivos MD importantes
```

---

## 🐛 Troubleshooting

### "No veo datos en el frontend"
```javascript
// En DevTools Console:
localStorage.setItem('organizationId', 'ORG-2024-001');
location.reload();
```

### "Backend no conecta a MongoDB"
```bash
# Verificar MongoDB corriendo
mongosh

# Verificar URI en backend/.env
MONGODB_URI=mongodb://localhost:27017/9001app
```

### "Error de TypeScript al compilar"
```bash
cd backend
npm run build
# Revisar errores y corregir
```

### "Drag & Drop no funciona en Kanban"
- Verificar backend corriendo (puerto 5000)
- Ver Network tab en DevTools
- Debe haber requests PATCH exitosos

---

## 🔐 Multi-Tenant

El sistema soporta **múltiples organizaciones** con datos aislados:
- Filtrado automático por `organization_id`
- Middleware en todas las rutas
- Context en frontend
- Cada organización ve solo sus datos

**Cambiar organización**:
```javascript
localStorage.setItem('organizationId', 'TU-ORG-ID');
location.reload();
```

---

## 🚀 Roadmap

### ✅ v6.0 - Base Funcional (ACTUAL)
- Backend + Frontend operativo
- 8 módulos implementados
- CRM completo con Kanban
- Legajos financieros
- 78 tests automatizados

### 🟡 v6.1 - Testing y Consolidación (2-4 semanas)
- Setup Playwright completo
- Tests para todos los módulos
- CI/CD con GitHub Actions
- ABM completos

### 🔵 v6.5 - Integración (4-8 semanas)
- Logging centralizado
- Sistema de alertas
- Portal de documentación
- Tests de integración

### 🟣 v7.0 - Optimización (3-6 meses)
- Code splitting
- Caché con Redis
- Event Sourcing
- RBAC granular

### 🟠 v8.0 - Innovación (6-12 meses)
- Agente IA avanzado
- Predicción de fallos
- Integraciones externas
- API Pública v1.0

---

## 🤖 Don Cándido - Asistente IA

**Estado**: ⚠️ Código 100% listo, esperando activación

### ¿Qué es?
Asistente de IA (Anthropic Claude) que responde preguntas sobre ISO 9001 dentro del sistema.

### ¿Qué falta?
Solo configurar API Key (15 minutos):

```bash
# 1. Obtener API Key: https://console.anthropic.com
# 2. Configurar:
echo "NEXT_PUBLIC_CLAUDE_API_KEY=sk-ant-..." >> frontend/.env.local
# 3. Reiniciar:
npm run dev
```

### Plan de Activación
**FASE 0 - MVP** (1 semana, $2,000 USD):
- Activar Claude API
- Rate limiting simple
- 5 usuarios piloto
- Recolectar feedback
- Decidir si continuar

**Documentación**: Ver `README-DON-CANDIDO-ESTADO-ACTUAL.md`

---

## 📞 Soporte y Contacto

### Diagnóstico Rápido
```bash
# Verificar sistema completo
node diagnostico-completo.js

# Ver logs backend
cd backend && npm run dev
# (ver consola)

# Ver errores frontend
# Abrir DevTools (F12) → Console
```

### Enlaces Útiles
- **Super Admin**: http://localhost:3000/super-admin
- **Testing**: http://localhost:3000/super-admin/testing
- **Roadmap**: http://localhost:3000/super-admin/tareas
- **CRM Dashboard**: http://localhost:3000/crm/dashboard

---

## 📄 Licencia

Propietaria - 9001app v6

---

## 🎉 Estado del Proyecto

```
┌────────────────────────────────────────────────────────┐
│  ESTADO ACTUAL - 9001APP v6                            │
├────────────────────────────────────────────────────────┤
│  • Módulos Operativos:         5 / 8 (62%)            │
│  • Tests Implementados:        78 (100% pasando)      │
│  • Líneas de Código:           ~40,000 (TS/TSX)       │
│  • API Endpoints:              100+                    │
│  • Componentes React:          100+                    │
│  • Modelos MongoDB:            20+                     │
│  • Progreso General:           75%                     │
│  ─────────────────────────────────────────────────────  │
│  🟢 LISTO PARA USO EN DESARROLLO                       │
│  ⚠️  Don Cándido listo pero sin activar                │
│  🎯 Siguiente hito: v6.1 (Testing completo)           │
└────────────────────────────────────────────────────────┘
```

---

## ✨ Características Destacadas

- ✅ **Multi-tenant** con aislamiento de datos
- ✅ **78 tests automatizados** al 100%
- ✅ **Kanban con Drag & Drop** persistente
- ✅ **15 ratios financieros** calculados automáticamente
- ✅ **Sistema de testing** con dashboard completo
- ✅ **Roadmap Kanban** para gestión de proyecto
- ✅ **ISO 9001:2015** completa implementada
- ✅ **Don Cándido** (IA) listo para activar
- ✅ **Documentación completa** para IA

---

**Desarrollado con ❤️ para sistemas de gestión de calidad**

**Última actualización**: 12 de Octubre, 2025  
**Versión**: v6.0  
**Estado**: 🟢 En Desarrollo Activo

---

### 🚀 ¿Listo para empezar?

```bash
.\arrancar-sistema-completo.ps1
```

Luego abre: http://localhost:3000

**¡Bienvenido a 9001app v6!** 🎯

