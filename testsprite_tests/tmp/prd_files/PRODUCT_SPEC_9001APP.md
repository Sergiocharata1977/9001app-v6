# 9001App v6 - Sistema de Gestión de Procesos ISO 9001

## 📋 DESCRIPCIÓN DEL PRODUCTO

**9001App v6** es una aplicación web full-stack para la gestión de procesos ISO 9001 en el sector agropecuario, desarrollada con Next.js 14 y Node.js.

## 🎯 OBJETIVO

Automatizar y digitalizar la gestión de procesos de calidad ISO 9001, permitiendo a las empresas agropecuarias cumplir con estándares de calidad de manera eficiente.

## 🏗️ ARQUITECTURA TÉCNICA

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes**: Shadcn/ui
- **Puerto**: 3000

### Backend
- **Framework**: Node.js + Express
- **Lenguaje**: TypeScript
- **Base de datos**: MongoDB Atlas
- **ORM**: Mongoose
- **Puerto**: 5000

## 🔧 FUNCIONALIDADES PRINCIPALES

### 1. Gestión de Procesos

#### A) **Estructura de Procesos - Dos Componentes Principales**

**1. DEFINICIÓN DEL PROCESO** (Información estática)
- **Objetivo**: Propósito y meta del proceso
- **Alcance**: Límites y cobertura del proceso
- **Tareas**: Actividades y pasos del proceso
- **Diagrama**: Representación visual del flujo
- **Entradas y Salidas**: Inputs y outputs del proceso
- **Responsable**: Quién es el dueño del proceso
- **Documentos relacionados**: Manuales, procedimientos, formularios
- **Puntos de norma**: Requisitos ISO 9001 asociados

**2. REGISTROS DEL PROCESO** (Información dinámica)
- **Registros**: Evidencia de ejecución del proceso
- **Vista Kanban**: Gestión visual por etapas (Iniciado → En Progreso → Completado)
- **Alto riesgo**: Identificación de registros críticos
- **Problemas**: Seguimiento de no conformidades
- **Objetivos de calidad**: Metas específicas del proceso
- **Indicadores**: Métricas de desempeño
- **Mediciones**: Datos cuantitativos de seguimiento

#### B) **Vistas del Sistema**
- **Lista de procesos**: Vista principal con tarjetas de procesos (✅ FUNCIONA)
- **Single de proceso**: Vista detallada unificada con tabs (❌ NO FUNCIONA - ERROR 500)
- **Dashboard**: Métricas y estadísticas de procesos
- **Crear proceso**: Formulario para nuevos procesos

### 2. Sistema de Calidad ISO 9001

#### **Documentación de Norma ISO 9001 - Sistema de Puntos de Norma**

El sistema incluye un **módulo completo de Puntos de Norma** que funciona como un checklist inteligente de cumplimiento normativo:

**¿Qué es?**
- Enumeración **punto por punto** de la norma ISO 9001 y otras normas aplicables
- Cada punto de la norma está detallado con su descripción, requisitos y funciones específicas
- Sistema de **trazabilidad** que relaciona cada punto de la norma con los procesos de la empresa

**¿Cómo funciona?**
1. **Relacionar procesos con puntos de norma**: Al vincular un proceso con un punto específico de la norma, el sistema marca ese requisito como "en cumplimiento"
2. **Identificar gaps de cumplimiento**: Los puntos de norma **NO relacionados** con ningún proceso indican que **falta algo** para el cumplimiento completo de la norma
3. **Aplicar el resto**: El sistema calcula automáticamente qué requisitos faltan implementar

**Beneficios**:
- ✅ **Visibilidad total** del cumplimiento normativo
- ✅ **Identificación automática** de requisitos no cumplidos
- ✅ **Priorización** de acciones para cerrar gaps
- ✅ **Evidencia documental** para auditorías
- ✅ **Trazabilidad completa** entre norma y procesos

**Componentes del módulo**:
- **Estructura de la norma**: Organización por cláusulas (4. Contexto, 5. Liderazgo, 6. Planificación, 7. Apoyo, 8. Operación, 9. Evaluación, 10. Mejora)
- **Requisitos específicos**: Cada punto de la norma con su descripción detallada y código único
- **Funciones por requisito**: Qué debe hacer la organización para cumplir cada requisito (acciones concretas)
- **Relación con procesos**: Vinculación bidireccional entre requisitos de la norma y procesos de la empresa
- **Estado de cumplimiento**: Visual claro de qué está cumplido, en progreso o pendiente
- **Evidencias requeridas**: Qué documentos y registros se necesitan para demostrar cumplimiento
- **Ejemplos prácticos**: Casos de uso específicos del sector agropecuario

**Ejemplo de Punto de Norma**:
```
8.5.1 Control de la producción y provisión del servicio
├── Descripción: La organización debe implementar la producción y provisión del servicio bajo condiciones controladas
├── Funciones:
│   ├── Disponibilidad de información que describa las características de los productos
│   ├── Disponibilidad de instrucciones de trabajo
│   ├── Uso de equipo apropiado
│   ├── Disponibilidad y uso de dispositivos de seguimiento y medición
│   ├── Implementación de actividades de seguimiento y medición
│   └── Implementación de actividades de liberación, entrega y posteriores a la entrega
├── Procesos relacionados: Producción, Control de Calidad, Gestión de Compras
└── Registros necesarios: Instrucciones de trabajo, Registros de inspección, Certificados de conformidad
```

#### **Componentes del Sistema de Calidad**
- **Objetivos de calidad**: Gestión y seguimiento de metas
- **Indicadores**: Métricas de desempeño (KPIs)
- **Mediciones**: Datos cuantitativos y análisis
- **Registros**: Evidencia de ejecución y cumplimiento

### 3. Módulos Especializados (ABM - Alta, Baja, Modificación)
- **Auditorías**: Gestión de auditorías internas
- **Mejoras**: Planes de mejora continua
- **Recursos Humanos**: Gestión de competencias y capacitación
- **Comercial/CRM**: Gestión de clientes del sector agropecuario
- **Documentos**: Control documental y versionado

## 🚨 PROBLEMAS ACTUALES Y CONTEXTO CRÍTICO

### **CAMBIO ARQUITECTÓNICO RECIENTE**
El sistema pasó de tener **listings y singles individuales** para cada ABM (Alta, Baja, Modificación) a un **sistema unificado con un solo single**.

**ANTES** (Sistema fragmentado):
```
/procesos/definiciones/        → Lista separada de definiciones
/procesos/definiciones/[id]/   → Single separado de definición
/procesos/registros/           → Lista separada de registros
/procesos/registros/[id]/      → Single separado de registro
/procesos/objetivos/           → Lista separada de objetivos
/procesos/indicadores/         → Lista separada de indicadores
```

**AHORA** (Sistema unificado):
```
/procesos/                     → Lista principal unificada ✅ FUNCIONA
/procesos/[id]/                → Single unificado con todos los tabs ❌ NO FUNCIONA
├── Tab: Definición            → Información estática del proceso
├── Tab: Registros             → Evidencias con vista Kanban
├── Tab: Objetivos de Calidad  → Metas del proceso
├── Tab: Indicadores           → Métricas de desempeño
└── Tab: Mediciones            → Datos cuantitativos
```

**IMPACTO DEL CAMBIO**:
- ✅ Código más limpio y mantenible
- ✅ UX consistente y navegación unificada
- ❌ Error 500 en el single unificado (problema actual)
- ❌ Archivos obsoletos eliminados pero quedan referencias incorrectas

### **SISTEMA DE IA - DON CÁNDIDO (ACTUALMENTE DESACTIVADO)**
El sistema incluía un asistente de IA llamado **"Don Cándido"** que:
- Ayudaba a completar formularios de procesos
- Sugería mejoras basadas en ISO 9001
- Respondía consultas sobre la norma
- Generaba documentación automáticamente

**Estado actual**: ⚠️ **DESACTIVADO TEMPORALMENTE**
- Motivo: Enfoque en resolver problemas críticos del sistema de procesos
- Archivos relacionados:
  - `frontend/src/components/ia/ChatDonCandidos.tsx`
  - `frontend/src/app/api/ia/don-candidos/route.ts`
  - `frontend/src/lib/ia/contextoProyectoCompleto.ts`

### **ERROR CRÍTICO: Single de Proceso No Funciona**

#### **Problema Principal**
- **Endpoint afectado**: `GET /api/process-definitions/:id`
- **Error**: `StrictPopulateError: Cannot populate path 'responsible_user_id' because it is not in your schema`
- **Causa raíz**: El controlador intenta popular campos que **NO EXISTEN** en el schema de MongoDB
- **Resultado**: 
  - ❌ Backend retorna 500 Internal Server Error
  - ❌ Frontend muestra "Proceso no encontrado"
  - ❌ Single de proceso NO se renderiza
  - ❌ Todos los tabs están inaccesibles

#### **Campos Problemáticos** (intentan popularse pero NO EXISTEN)
- `responsible_user_id` ❌ NO EXISTE en schema
- `department_id` ❌ NO EXISTE en schema
- `team_members` ❌ NO EXISTE en schema

#### **Campos Correctos** (existen y deben popularse)
- `created_by` ✅ EXISTE (referencia a User)
- `related_documents` ✅ EXISTE (array de Document)
- `related_norm_points` ✅ EXISTE (array de NormPoint)
- `related_records` ✅ EXISTE (array de ProcessRecord)
- `related_objectives` ✅ EXISTE (array de QualityObjective)
- `related_indicators` ✅ EXISTE (array de QualityIndicator)

## 🎯 OBJETIVOS DE TESTING

### 1. Tests de API Backend
- Verificar que todos los endpoints retornen 200 (no 500)
- Validar que los populates sean correctos
- Probar manejo de errores (400, 404, 500)

### 2. Tests de Frontend
- Verificar navegación de lista a single
- Validar renderizado de componentes
- Probar estados de carga y error

### 3. Tests de Integración
- Flujo completo: Lista → Single → Tabs
- Verificar que los datos se muestren correctamente
- Probar interacciones de usuario

## 📊 ESTRUCTURA DE DATOS

### ProcessDefinition Schema
```typescript
{
  _id: ObjectId,
  name: String,
  description: String,
  owner: String,
  codigo: String,
  version: String,
  objetivo: String,
  alcance: String,
  entradas: String,
  salidas: String,
  tipo: String,
  categoria: String,
  nivel_critico: String,
  estado: String,
  organization_id: String,
  is_active: Boolean,
  is_archived: Boolean,
  created_by: ObjectId, // ✅ EXISTE
  related_documents: [ObjectId], // ✅ EXISTE
  related_norm_points: [ObjectId], // ✅ EXISTE
  related_records: [ObjectId], // ✅ EXISTE
  related_objectives: [ObjectId], // ✅ EXISTE
  related_indicators: [ObjectId], // ✅ EXISTE
  created_at: Date,
  updated_at: Date
}
```

## 🔍 ENDPOINTS PRINCIPALES

### Backend (Puerto 5000)
- `GET /api/process-definitions` - Lista de procesos ✅ FUNCIONA
- `GET /api/process-definitions/:id` - Single de proceso ❌ ERROR 500
- `POST /api/process-definitions` - Crear proceso
- `PUT /api/process-definitions/:id` - Actualizar proceso
- `DELETE /api/process-definitions/:id` - Eliminar proceso

### Frontend (Puerto 3000)
- `/procesos` - Lista principal ✅ FUNCIONA
- `/procesos/[id]` - Single de proceso ❌ NO SE RENDERIZA
- `/procesos/dashboard` - Dashboard
- `/procesos/nuevo` - Crear proceso

## 🎯 CRITERIOS DE ÉXITO Y FACTORES CRÍTICOS

### **FACTORES CRÍTICOS DE ÉXITO**

#### **1. Single de Proceso Funcional** (PRIORIDAD MÁXIMA)
- ✅ El endpoint `/api/process-definitions/:id` debe retornar 200 (no 500)
- ✅ Todos los populates deben ser de campos que **EXISTEN** en el schema
- ✅ El single debe renderizarse correctamente en frontend
- ✅ Los 5 tabs deben ser accesibles y funcionales
- **Impacto**: Sin esto, el sistema completo de procesos es inútil

#### **2. Integridad de Datos**
- ✅ Consistencia entre schema de MongoDB y controladores
- ✅ Validación de ObjectIds antes de queries
- ✅ Manejo correcto de relaciones entre modelos
- ✅ No hay referencias a campos inexistentes
- **Impacto**: Previene errores futuros similares

#### **3. Trazabilidad Norma-Procesos**
- ✅ Sistema de Puntos de Norma funcionando
- ✅ Relación bidireccional entre procesos y requisitos
- ✅ Identificación automática de gaps de cumplimiento
- ✅ Reportes de cumplimiento normativo
- **Impacto**: Core value del producto para auditorías

#### **4. Sistema de Registros con Kanban**
- ✅ Vista Kanban funcional por etapas
- ✅ Drag & drop de registros entre estados
- ✅ Identificación de registros de alto riesgo
- ✅ Seguimiento de problemas y no conformidades
- **Impacto**: Gestión operativa diaria

#### **5. Performance y Escalabilidad**
- ✅ Queries optimizadas (evitar N+1)
- ✅ Populates solo de datos necesarios
- ✅ Paginación en listas grandes
- ✅ Caching de datos frecuentes
- **Impacto**: Experiencia de usuario fluida

### **CRITERIOS DE ÉXITO INMEDIATOS**

#### **Funcionalidad Básica**
- ✅ Lista de procesos se carga correctamente
- ✅ Single de proceso se renderiza sin errores
- ✅ Todos los tabs funcionan (Definición, Registros, Objetivos, Indicadores, Mediciones)
- ✅ No hay errores 500 en consola
- ✅ Navegación fluida entre vistas
- ✅ Formulario de creación de procesos funciona
- ✅ Sistema de Puntos de Norma accesible

#### **Performance**
- ✅ Tiempo de carga de lista < 2 segundos
- ✅ Tiempo de carga de single < 1.5 segundos
- ✅ No hay memory leaks
- ✅ Queries optimizadas en MongoDB
- ✅ Populates selectivos (solo campos necesarios)

#### **Calidad de Código**
- ✅ Código TypeScript sin errores
- ✅ Tests automatizados pasando
- ✅ Documentación actualizada
- ✅ Consistencia en nomenclatura
- ✅ Manejo robusto de errores

#### **Documentación**
- ✅ README actualizado con arquitectura
- ✅ Diagramas de relaciones entre modelos
- ✅ Guía de desarrollo para nuevos features
- ✅ Documentación de API endpoints
- ✅ Ejemplos de uso del sistema

## 🚀 PRÓXIMOS PASOS

1. **Corregir error de populate** en controlador
2. **Implementar tests automatizados** con TestSprite
3. **Verificar funcionalidad completa** del single
4. **Optimizar performance** de queries
5. **Documentar sistema** completamente
