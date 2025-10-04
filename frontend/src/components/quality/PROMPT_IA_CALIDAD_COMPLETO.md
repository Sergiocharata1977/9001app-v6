# 🤖 PROMPT PARA IA - MÓDULO DE CALIDAD ISO 9001 COMPLETO

## 📋 **CONTEXTO DEL PROYECTO**

Eres un desarrollador Full-Stack experto en **Next.js 15**, **React 19**, **TypeScript** y **Tailwind CSS**. Necesitas crear un **Módulo de Calidad ISO 9001** completo y moderno para un sistema de gestión empresarial.

**Empresa:** "Los Señores del Agro" - Proveedor de fertilizantes, semillas y servicios logísticos agrícolas.

**Objetivo:** Implementar un sistema completo de gestión de calidad que cumpla con la norma ISO 9001:2015.

---

## 🎯 **REQUISITOS ESPECÍFICOS**

### **1. POLÍTICA DE CALIDAD** 📜
```typescript
// REQUERIDO: Crear componente PolicyCard con:
interface PolicyCardProps {
  title: string;
  content: string;
  version: string;
  lastUpdated: Date;
  approver: string;
  status: 'draft' | 'approved' | 'published';
  sections: {
    commitment: string;
    objectives: string;
    framework: string;
    communication: string;
  };
}
```

**Funcionalidades:**
- ✅ Editor de texto enriquecido (WYSIWYG)
- ✅ Historial de versiones
- ✅ Sistema de aprobación
- ✅ Difusión automática
- ✅ Tracking de lectura por empleados

### **2. ANÁLISIS AMFE AVANZADO** 🔍
```typescript
// REQUERIDO: Crear AMFETable con:
interface AMFERecord {
  id: string;
  process: string;
  potentialFailure: string;
  potentialEffects: string;
  potentialCauses: string;
  currentControls: string;
  severity: number; // 1-10
  occurrence: number; // 1-10
  detection: number; // 1-10
  rpn: number; // severity * occurrence * detection
  recommendedActions: string;
  responsible: string;
  targetDate: Date;
  status: 'open' | 'in-progress' | 'completed' | 'verified';
}
```

**Funcionalidades:**
- ✅ Cálculo automático de RPN
- ✅ Matriz de riesgos visual
- ✅ Planes de acción con seguimiento
- ✅ Alertas por RPN alto
- ✅ Reportes automáticos
- ✅ Exportación a Excel/PDF

### **3. ANÁLISIS DE ASPECTOS Y FORTALEZAS** 💪
```typescript
// REQUERIDO: Crear SWOTMatrix con:
interface SWOTAnalysis {
  strengths: AspectItem[];
  weaknesses: AspectItem[];
  opportunities: AspectItem[];
  threats: AspectItem[];
}

interface AspectItem {
  id: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  probability: 'low' | 'medium' | 'high';
  priority: number;
  actionPlan?: string;
  responsible?: string;
  dueDate?: Date;
}
```

**Funcionalidades:**
- ✅ Matriz FODA interactiva
- ✅ Análisis de contexto organizacional
- ✅ Identificación de partes interesadas
- ✅ Evaluación de riesgos y oportunidades
- ✅ Plan de acción estratégico
- ✅ Dashboard de fortalezas

### **4. GESTIÓN DE REUNIONES** 📅
```typescript
// REQUERIDO: Crear MeetingScheduler con:
interface Meeting {
  id: string;
  title: string;
  type: 'quality-review' | 'amfe-analysis' | 'policy-review' | 'strategic-planning';
  date: Date;
  duration: number; // minutes
  participants: Participant[];
  agenda: AgendaItem[];
  minutes?: Minutes;
  actionItems: ActionItem[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

interface ActionItem {
  id: string;
  description: string;
  responsible: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}
```

**Funcionalidades:**
- ✅ Programación automática de reuniones
- ✅ Gestión de participantes
- ✅ Minutas automáticas con IA
- ✅ Seguimiento de acuerdos
- ✅ Integración con calendario
- ✅ Reportes de productividad

### **5. ORGANIGRAMA Y PROCESOS** 🏗️
```typescript
// REQUERIDO: Crear OrgChart y ProcessMap con:
interface OrgChartNode {
  id: string;
  name: string;
  position: string;
  department: string;
  level: number;
  parentId?: string;
  children: string[];
  responsibilities: string[];
  competencies: string[];
  image?: string;
}

interface ProcessNode {
  id: string;
  name: string;
  type: 'management' | 'support' | 'operational';
  isoClause: string;
  inputs: string[];
  outputs: string[];
  controls: string[];
  indicators: ProcessIndicator[];
  responsible: string;
  nextProcesses: string[];
  previousProcesses: string[];
}
```

**Funcionalidades:**
- ✅ Organigrama interactivo con drag & drop
- ✅ Mapa de procesos ISO 9001
- ✅ Relaciones entre procesos
- ✅ Flujos de información
- ✅ Responsabilidades y autoridades
- ✅ Indicadores de proceso en tiempo real

---

## 🎨 **REQUISITOS DE DISEÑO**

### **Paleta de Colores:**
```css
:root {
  --quality-primary: #059669;      /* Emerald-600 */
  --quality-secondary: #10b981;    /* Emerald-500 */
  --quality-accent: #34d399;       /* Emerald-400 */
  --quality-background: #f0fdf4;   /* Emerald-50 */
  --quality-surface: #ffffff;      /* White */
  --quality-text: #064e3b;         /* Emerald-900 */
  --quality-success: #22c55e;      /* Green-500 */
  --quality-warning: #f59e0b;      /* Amber-500 */
  --quality-error: #ef4444;        /* Red-500 */
}
```

### **Layout Responsive:**
- **Desktop:** Layout de 3 columnas con sidebar expandido
- **Tablet:** Layout de 2 columnas con sidebar colapsible
- **Mobile:** Layout de 1 columna con sidebar overlay

### **Componentes UI Requeridos:**
- Usar **shadcn/ui** como base
- **Radix UI** para primitives
- **Lucide React** para iconos
- **Framer Motion** para animaciones
- **Recharts** para gráficos
- **React Flow** para organigrama
- **React Hook Form** para formularios

---

## 🗂️ **ESTRUCTURA DE ARCHIVOS REQUERIDA**

```
src/components/quality/
├── QualityModule.tsx              # Componente principal
├── policy/
│   ├── PolicyCard.tsx            # Tarjeta de política
│   ├── PolicyEditor.tsx          # Editor de política
│   ├── PolicyHistory.tsx         # Historial de cambios
│   └── PolicyApproval.tsx        # Sistema de aprobación
├── amfe/
│   ├── AMFETable.tsx             # Tabla AMFE principal
│   ├── RiskMatrix.tsx            # Matriz de riesgos visual
│   ├── ActionPlanForm.tsx        # Formulario de planes
│   ├── AMFEReports.tsx           # Reportes AMFE
│   └── RPNDashboard.tsx          # Dashboard de RPN
├── aspects/
│   ├── SWOTMatrix.tsx            # Matriz FODA interactiva
│   ├── StakeholderAnalysis.tsx   # Análisis de partes interesadas
│   ├── ContextAnalysis.tsx       # Análisis de contexto
│   ├── RiskOpportunityMatrix.tsx # Matriz de riesgos y oportunidades
│   └── StrategicPlan.tsx         # Plan estratégico
├── meetings/
│   ├── MeetingScheduler.tsx      # Programador de reuniones
│   ├── MeetingMinutes.tsx        # Minutas de reuniones
│   ├── ActionTracker.tsx         # Seguimiento de acuerdos
│   ├── MeetingReports.tsx        # Reportes de reuniones
│   └── CalendarIntegration.tsx   # Integración con calendario
├── organization/
│   ├── OrgChart.tsx              # Organigrama interactivo
│   ├── ProcessMap.tsx            # Mapa de procesos
│   ├── ProcessRelations.tsx      # Relaciones entre procesos
│   ├── ResponsibilityMatrix.tsx  # Matriz de responsabilidades
│   └── ProcessIndicators.tsx     # Indicadores de proceso
└── shared/
    ├── QualityDashboard.tsx      # Dashboard principal
    ├── QualityFilters.tsx        # Filtros globales
    ├── QualityExports.tsx        # Exportaciones
    ├── QualityNotifications.tsx  # Notificaciones
    └── QualityHelp.tsx           # Sistema de ayuda
```

---

## 🚀 **FUNCIONALIDADES AVANZADAS REQUERIDAS**

### **1. Dashboard Ejecutivo**
```typescript
// REQUERIDO: Crear dashboard con KPIs en tiempo real
interface QualityKPIs {
  policyCompliance: number;        // % cumplimiento política
  amfeCompletion: number;          // % AMFE completados
  meetingEfficiency: number;       // Eficiencia de reuniones
  processMaturity: number;         // Madurez de procesos
  riskMitigation: number;          // % riesgos mitigados
  stakeholderSatisfaction: number; // Satisfacción partes interesadas
}
```

### **2. Sistema de Notificaciones**
- Alertas por RPN alto en AMFE
- Recordatorios de reuniones
- Vencimientos de planes de acción
- Cambios en políticas
- Actualizaciones de procesos

### **3. Exportaciones**
- PDF de políticas de calidad
- Excel de análisis AMFE
- Imágenes de organigrama
- Reportes de reuniones
- Dashboard ejecutivo

### **4. Integración con IA**
- Sugerencias automáticas de acciones AMFE
- Generación de minutas de reuniones
- Análisis de tendencias
- Recomendaciones de mejora

---

## 📊 **DATOS DE EJEMPLO REQUERIDOS**

### **Política de Calidad:**
```json
{
  "title": "Política de Calidad - Los Señores del Agro",
  "version": "2.1",
  "lastUpdated": "2024-01-15",
  "approver": "Director de Calidad",
  "content": {
    "commitment": "Compromiso con la excelencia en productos agrícolas...",
    "objectives": "Objetivos específicos de calidad...",
    "framework": "Marco ISO 9001:2015...",
    "communication": "Estrategia de comunicación..."
  }
}
```

### **Registros AMFE:**
```json
[
  {
    "process": "Recepción de Fertilizantes",
    "potentialFailure": "Contaminación del producto",
    "severity": 8,
    "occurrence": 3,
    "detection": 6,
    "rpn": 144,
    "status": "in-progress"
  }
]
```

### **Reuniones:**
```json
[
  {
    "title": "Revisión Mensual de Calidad",
    "type": "quality-review",
    "participants": ["Director Calidad", "Supervisor Producción"],
    "actionItems": [
      {
        "description": "Implementar nuevo control de calidad",
        "responsible": "Supervisor Producción",
        "dueDate": "2024-02-15"
      }
    ]
  }
]
```

---

## 🔧 **TECNOLOGÍAS Y DEPENDENCIAS**

### **Package.json requerido:**
```json
{
  "dependencies": {
    "next": "15.2.4",
    "react": "^19",
    "react-dom": "^19",
    "typescript": "^5",
    "tailwindcss": "^3.4.17",
    "@radix-ui/react-tabs": "1.1.2",
    "@radix-ui/react-dialog": "1.1.4",
    "@radix-ui/react-dropdown-menu": "2.1.4",
    "@radix-ui/react-select": "2.1.4",
    "lucide-react": "^0.454.0",
    "recharts": "2.15.0",
    "react-flow-renderer": "^10.3.17",
    "react-hook-form": "^7.54.1",
    "@hookform/resolvers": "^3.9.1",
    "zod": "^3.24.1",
    "framer-motion": "^11.0.0",
    "react-hot-toast": "^2.4.1",
    "jspdf": "^2.5.1",
    "xlsx": "^0.18.5",
    "date-fns": "4.1.0"
  }
}
```

---

## 📋 **CRITERIOS DE ACEPTACIÓN**

### **Funcionalidad:**
- ✅ Todas las 5 secciones implementadas
- ✅ Componentes responsive
- ✅ Formularios funcionales
- ✅ Validaciones completas
- ✅ Exportaciones funcionando

### **Diseño:**
- ✅ Paleta de colores consistente
- ✅ Componentes UI modernos
- ✅ Animaciones suaves
- ✅ Iconografía coherente
- ✅ Tipografía legible

### **Código:**
- ✅ TypeScript sin errores
- ✅ Componentes reutilizables
- ✅ Hooks personalizados
- ✅ Manejo de estado apropiado
- ✅ Comentarios en código

### **ISO 9001:2015:**
- ✅ Cumplimiento cláusula 4 (Contexto)
- ✅ Cumplimiento cláusula 5 (Liderazgo)
- ✅ Cumplimiento cláusula 6 (Planificación)
- ✅ Cumplimiento cláusula 8 (Operación)

---

## 🎯 **ENTREGABLES ESPERADOS**

1. **Código completo** del módulo de calidad
2. **Documentación** de componentes
3. **Guía de uso** para usuarios
4. **Datos de ejemplo** para testing
5. **Tests unitarios** básicos
6. **README** con instrucciones de instalación

---

## 💡 **CONSIDERACIONES ADICIONALES**

- **Performance:** Optimizar para cargas de datos grandes
- **Accesibilidad:** Cumplir WCAG 2.1 AA
- **Internacionalización:** Preparar para múltiples idiomas
- **Seguridad:** Validar todas las entradas
- **Escalabilidad:** Diseñar para crecimiento futuro

---

**¡IMPORTANTE!** Este módulo debe ser **profesional**, **completo** y **listo para producción**. Cada componente debe ser funcional, bien documentado y seguir las mejores prácticas de React y Next.js.
