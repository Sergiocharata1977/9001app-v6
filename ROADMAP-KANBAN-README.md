# 📋 Sistema de Tareas Kanban - Super Admin
## 9001app v6 - Roadmap y Coordinación de Desarrollo

---

## 🎯 Descripción

Sistema completo de gestión de tareas tipo **Kanban** para el Super Admin, permitiendo:

- ✅ **UN SOLO tablero centralizado** para TODAS las tareas del sistema
- ✅ **Coordinación entre humanos e IAs** para desarrollo colaborativo
- ✅ **Filtros avanzados** por módulo, ABM, prioridad, fase, tipo, etc.
- ✅ **Drag & drop** interactivo para cambiar estados
- ✅ **Gestión completa** (crear, editar, eliminar, mover tareas)
- ✅ **Estadísticas en tiempo real** del progreso del proyecto

---

## 🏗️ Arquitectura Implementada

### Backend
```
backend/src/
├── models/RoadmapTask.ts          # Modelo de tarea
├── controllers/roadmapTaskController.ts  # Lógica de negocio
├── routes/roadmapRoutes.ts        # Endpoints REST
└── seeders/roadmapTaskSeeder.ts   # Datos de ejemplo
```

### Frontend
```
frontend/src/
├── app/super-admin/tareas/page.tsx  # Página principal Kanban
├── services/roadmapService.ts       # API client
└── (usa componentes existentes)
    ├── components/ui/UnifiedKanbanBoard.tsx
    ├── hooks/useKanbanDrag.ts
    └── hooks/useKanbanDrop.ts
```

---

## 🚀 Instalación y Configuración

### 1. Backend ya configurado ✅

El sistema ya está integrado en `server.ts`:
```typescript
// Modelo importado
import './models/RoadmapTask';

// Rutas registradas
import roadmapRoutes from './routes/roadmapRoutes';
app.use('/api/roadmap', roadmapRoutes);
```

### 2. Poblar base de datos con tareas de ejemplo

```bash
# Ejecutar seeder (desde directorio backend)
cd backend
npm run ts-node src/seeders/roadmapTaskSeeder.ts

# O con organization_id específico
npm run ts-node src/seeders/roadmapTaskSeeder.ts org-123
```

Esto creará **30+ tareas de ejemplo** organizadas por fases (v6.1, v6.5, v7.0, v8.0).

### 3. Acceder al Kanban

1. Iniciar servidor backend: `npm run dev` (puerto 5000)
2. Iniciar frontend: `npm run dev` (puerto 3000)
3. Navegar a: **http://localhost:3000/super-admin/tareas**

O desde el Super Admin principal:
- **http://localhost:3000/super-admin** → Click en botón **"Roadmap Kanban"**

---

## 📊 Modelo de Datos

### RoadmapTask Schema

```typescript
interface RoadmapTask {
  // Identificación
  _id: string;
  organization_id: string;  // Multi-tenant
  
  // Información básica
  title: string;
  description?: string;
  module: 'rrhh' | 'crm' | 'auditorias' | 'procesos' | 
          'documentos' | 'normas' | 'calidad' | 'productos' | 
          'riesgos' | 'general' | 'testing';
  
  // Estado y workflow
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'critical' | 'high' | 'medium' | 'low';
  order: number;  // Posición en columna
  
  // Categorización
  type: 'feature' | 'bug' | 'improvement' | 
        'documentation' | 'testing' | 'abm';
  abmType?: 'create' | 'read' | 'update' | 'delete' | 'list';
  phase: 'v6.1' | 'v6.5' | 'v7.0' | 'v8.0' | 'backlog';
  
  // Asignación y planificación
  assignedTo?: string;  // 'ia', 'developer', 'team', etc.
  responsible?: string;
  estimatedDays?: number;
  dueDate?: Date;
  tags: string[];
  
  // Trazabilidad
  linkedTo?: {
    type: 'audit' | 'process' | 'document' | 'norm' | 'crm' | 'rrhh';
    id: string;
  };
  
  // Metadatos
  createdBy: string;
  updatedBy?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 API Endpoints

### Tareas

#### GET `/api/roadmap/tasks`
Obtener todas las tareas (con filtros opcionales)

**Query params:**
- `module`: Filtrar por módulo
- `status`: Filtrar por estado
- `priority`: Filtrar por prioridad
- `phase`: Filtrar por fase
- `type`: Filtrar por tipo
- `abmType`: Filtrar por tipo ABM
- `assignedTo`: Filtrar por asignado
- `tags`: Filtrar por tags (array)
- `search`: Búsqueda en título/descripción

**Ejemplo:**
```bash
GET /api/roadmap/tasks?module=crm&status=in_progress&priority=high
```

#### GET `/api/roadmap/tasks/:id`
Obtener tarea por ID

#### POST `/api/roadmap/tasks`
Crear nueva tarea

**Body:**
```json
{
  "title": "Implementar CRUD de Auditorías",
  "description": "ABM completo con validaciones",
  "module": "auditorias",
  "priority": "high",
  "type": "abm",
  "abmType": "create",
  "assignedTo": "developer",
  "estimatedDays": 3,
  "phase": "v6.1",
  "tags": ["crud", "auditorias"]
}
```

#### PUT `/api/roadmap/tasks/:id`
Actualizar tarea

#### DELETE `/api/roadmap/tasks/:id`
Eliminar tarea (soft delete)

#### PATCH `/api/roadmap/tasks/:id/move`
Mover tarea (cambiar status y order)

**Body:**
```json
{
  "status": "in_progress",
  "order": 2
}
```

### Estadísticas

#### GET `/api/roadmap/stats`
Obtener estadísticas del roadmap

**Response:**
```json
{
  "total": 32,
  "byStatus": {
    "backlog": 10,
    "todo": 8,
    "in_progress": 7,
    "review": 4,
    "done": 3
  },
  "byPriority": {
    "critical": 5,
    "high": 12,
    "medium": 10,
    "low": 5
  },
  "byModule": {
    "crm": 8,
    "auditorias": 6,
    "testing": 10,
    ...
  },
  "byPhase": {
    "v6.1": 15,
    "v6.5": 8,
    "v7.0": 5,
    "v8.0": 4
  },
  "progress": 9
}
```

---

## 🎨 Características del Frontend

### 1. Tablero Kanban con 5 Columnas

```
┌─────────┬──────────┬─────────────┬──────────┬────────┐
│ Backlog │ Por Hacer│ En Progreso │ Revisión │ Hecho  │
├─────────┼──────────┼─────────────┼──────────┼────────┤
│ 10      │    8     │      7      │    4     │   3    │
│ tareas  │  tareas  │   tareas    │  tareas  │ tareas │
└─────────┴──────────┴─────────────┴──────────┴────────┘
```

### 2. Filtros Avanzados

- **Búsqueda**: Texto libre en título/descripción
- **Módulo**: RRHH, CRM, Auditorías, Procesos, etc.
- **Prioridad**: Crítica, Alta, Media, Baja
- **Fase**: v6.1, v6.5, v7.0, v8.0, Backlog
- **Tipo**: Feature, Bug, Mejora, Docs, Testing, ABM
- **Tipo ABM**: Create, Read, Update, Delete, List
- **Asignado a**: IA, Developer, Team, etc.

### 3. Estadísticas en Tiempo Real

4 cards con métricas clave:
- **Total de tareas**
- **En progreso** (+ pendientes)
- **Completadas** (+ en revisión)
- **Progreso general** (% completado)

### 4. Tarjetas de Tarea

Cada tarea muestra:
- ✅ Título
- ✅ Descripción (resumida)
- ✅ Badges: Módulo, Prioridad, Fase, Tipo ABM
- ✅ Asignado a
- ✅ Días estimados
- ✅ Tags
- ✅ Acciones: Editar, Eliminar

### 5. Modal de Creación/Edición

Formulario completo con:
- Título (requerido)
- Descripción
- Módulo (requerido)
- Prioridad (requerido)
- Tipo de tarea
- Tipo ABM (si aplica)
- Fase del roadmap
- Asignado a
- Días estimados
- Tags (multi-input)

### 6. Drag & Drop

- Arrastra tareas entre columnas
- Cambio de estado automático
- Actualización optimista en UI
- Persistencia en backend

---

## 💡 Casos de Uso

### Caso 1: Coordinar con IA

**Escenario**: Quiero que una IA implemente tests del CRM

1. Click en **"+ Nueva Tarea"**
2. Completar:
   - Título: "Tests CRM: Oportunidades CRUD"
   - Módulo: `crm`
   - Tipo: `testing`
   - Tipo ABM: `create`
   - Asignado a: `ia`
   - Prioridad: `high`
   - Fase: `v6.1`
3. Guardar
4. Compartir link de tarea con la IA
5. IA mueve tarea a "En Progreso" al empezar
6. IA mueve a "Revisión" al terminar
7. Developer revisa y mueve a "Hecho"

### Caso 2: Filtrar por ABM

**Escenario**: Ver solo tareas de Create de ABMs

1. Abrir filtros
2. Tipo: `abm`
3. Tipo ABM: `create`
4. Ver todas las tareas de creación de ABMs

### Caso 3: Roadmap por Fase

**Escenario**: Ver qué falta de la fase v6.1

1. Filtro Fase: `v6.1`
2. Ver tareas de esa fase
3. Identificar pendientes (columnas Backlog, Todo)

### Caso 4: Priorizar Trabajo

**Escenario**: Mover tarea crítica a "Por Hacer"

1. Buscar tarea en Backlog
2. Arrastrar a columna "Por Hacer"
3. Cambio persistido automáticamente

---

## 🔧 Personalización

### Agregar nuevo módulo

1. Actualizar enum en `RoadmapTask.ts`:
```typescript
module: {
  type: String,
  enum: ['rrhh', 'crm', ..., 'nuevo_modulo'],
  ...
}
```

2. Actualizar select en `page.tsx`:
```typescript
<SelectItem value="nuevo_modulo">Nuevo Módulo</SelectItem>
```

3. Agregar color en función `getModuleColor()`:
```typescript
const colors = {
  ...
  nuevo_modulo: 'bg-purple-100 text-purple-800'
};
```

### Agregar nueva columna de estado

1. Actualizar enum en modelo:
```typescript
status: {
  type: String,
  enum: ['backlog', ..., 'nuevo_estado'],
  ...
}
```

2. Agregar columna en frontend:
```typescript
const columns = [
  ...
  { id: 'nuevo_estado', title: 'Nuevo Estado', color: 'bg-...' }
];
```

---

## 📈 Roadmap del Sistema

### Tareas ya creadas por fase:

#### ✅ v6.1 - Fundamentos Críticos (2-4 semanas)
- Setup Playwright
- Tests CRM, Auditorías, Procesos
- CI/CD con GitHub Actions
- Actualizar documentación

#### 🟡 v6.5 - Integración (4-8 semanas)
- Logging en todos los módulos
- Dashboard de trazabilidad
- Sistema de alertas
- Tests de integración y accesibilidad
- Portal Docusaurus

#### 🔵 v7.0 - Optimización (3-6 meses)
- Optimización frontend (code splitting)
- Caché con Redis
- Event Sourcing
- RBAC granular
- MongoDB Replica Set
- Testing visual
- Blue-Green Deployment

#### 🟣 v8.0 - Innovación (6-12 meses)
- Agente IA (detección anomalías)
- Chatbot técnico
- Predicción de fallos
- Integraciones (Jira, Slack, Teams)
- API Pública v1.0

---

## 🐛 Troubleshooting

### Error: "Organization ID is required"

**Causa**: Falta header `x-organization-id` en request

**Solución**: Asegurarse de que el middleware multiTenant esté configurado:
```typescript
// En api.ts o axios config
headers: {
  'x-organization-id': 'org-123'
}
```

### Tareas no aparecen en el Kanban

**Causa**: Filtro activo o tareas de otra organización

**Solución**:
1. Limpiar todos los filtros
2. Verificar organization_id en MongoDB:
```bash
db.roadmaptasks.find({ organization_id: "org-default" })
```

### Drag & drop no funciona

**Causa**: Hooks no inicializados correctamente

**Solución**: Verificar que `@hello-pangea/dnd` esté instalado:
```bash
npm install @hello-pangea/dnd
```

### Seeder no crea tareas

**Causa**: Error de conexión a MongoDB

**Solución**: Verificar `MONGO_URI` en `.env`:
```bash
MONGO_URI=mongodb://localhost:27017/9001app
```

---

## 📝 Próximas Mejoras Sugeridas

1. **Comentarios en tareas**: Thread de discusión por tarea
2. **Historial de cambios**: Ver quién movió qué y cuándo
3. **Dependencias entre tareas**: Marcar tareas bloqueantes
4. **Templates de tareas**: Crear tareas desde plantillas
5. **Exportar a CSV/Excel**: Descargar roadmap completo
6. **Vista de calendario**: Ver tareas por fecha
7. **Notificaciones**: Email/Push cuando te asignan una tarea
8. **Subtareas**: Checklist dentro de cada tarea
9. **Time tracking**: Registrar tiempo invertido
10. **Webhooks**: Notificar a sistemas externos

---

## 🎉 ¡Sistema Completado!

El sistema de Tareas Kanban está **100% funcional** y listo para usar.

### ✅ Checklist de Implementación

- [x] Modelo RoadmapTask en backend
- [x] Controller con 7 endpoints REST
- [x] Rutas registradas en server.ts
- [x] Service en frontend
- [x] Página Kanban en /super-admin/tareas
- [x] Drag & drop con hooks existentes
- [x] Modal crear/editar tareas
- [x] Filtros avanzados (7 filtros)
- [x] Estadísticas en tiempo real
- [x] Enlace desde Super Admin principal
- [x] Seeder con 30+ tareas de ejemplo
- [x] Documentación completa (este README)

### 🚀 Para empezar a usar:

```bash
# 1. Poblar base de datos
cd backend
npm run ts-node src/seeders/roadmapTaskSeeder.ts

# 2. Iniciar sistema
npm run dev  # backend (puerto 5000)
cd ../frontend && npm run dev  # frontend (puerto 3000)

# 3. Abrir navegador
http://localhost:3000/super-admin/tareas
```

---

**Desarrollado para 9001app v6**  
Sistema de gestión de calidad ISO 9001:2015  
Roadmap Kanban - Super Admin Module  

📅 Fecha: Octubre 2025  
🔄 Versión: 1.0.0  

