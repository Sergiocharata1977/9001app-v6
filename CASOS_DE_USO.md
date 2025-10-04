# 📖 CASOS DE USO - Sistema ISO 9001 App v6

> Documento de referencia con casos de uso reales de cada módulo del sistema

---

## 📑 ÍNDICE

1. [Puntos de la Norma ISO 9001](#1-puntos-de-la-norma-iso-9001)
2. [Documentos](#2-documentos)

---

## 1. PUNTOS DE LA NORMA ISO 9001

### 🎯 OBJETIVO DEL MÓDULO
Gestionar los 32 requisitos de ISO 9001:2015 (capítulos 4-10), vincularlos con procesos, documentos, objetivos e indicadores para garantizar trazabilidad completa.

### 📊 ESTRUCTURA DE DATOS

#### Punto de Norma (NormPoint)
```typescript
{
  // IDENTIFICACIÓN
  code: "8.3",                          // Número del punto
  title: "Diseño y desarrollo",        // Título
  chapter: 8,                           // Capítulo (4-10)
  section: "8.3",                       // Sección completa
  
  // CONTENIDO ISO (texto oficial)
  requirements: "La organización debe...",  // Requisitos
  guidance: "Incluye planificación...",     // Guía de implementación
  examples: "Por ejemplo...",               // Ejemplos prácticos
  
  // CLASIFICACIÓN
  category: "operacion",                // contexto|liderazgo|planificacion|apoyo|operacion|evaluacion|mejora
  keywords: ["diseño", "desarrollo"],   // Para búsqueda
  is_mandatory: true,                   // ¿Es obligatorio?
  priority: "alta",                     // alta|media|baja
  
  // RELACIONES (multi-tenant)
  related_processes: [ObjectId],        // Procesos que cumplen este requisito
  related_documents: [ObjectId],        // Documentos que evidencian
  related_objectives: [ObjectId],       // Objetivos vinculados
  related_indicators: [ObjectId],       // KPIs que miden cumplimiento
  
  // ESTADO
  status: "vigente",                    // vigente|obsoleto|en_revision
  version: "ISO 9001:2015"
}
```

**NOTA:** NormPoint es **GLOBAL** (sin `organization_id`) porque ISO 9001:2015 es la misma norma para todos. Cada organización vincula sus propios procesos/documentos.

---

### 📝 CASOS DE USO

#### **CASO 1: Consultor implementando ISO - Ver requisitos**

**Actor:** Consultor de Calidad  
**Objetivo:** Entender qué requisitos debe cumplir la organización

**Flujo:**
1. Usuario ingresa a `/norm-points`
2. Ve tabla con 32 puntos organizados por capítulos (4-10)
3. Usa filtros:
   - Capítulo: "8 - Operación"
   - Categoría: "Operación"
   - Prioridad: "Alta"
4. Resultado: 7 puntos del capítulo 8

**Pantalla:**
```
┌─────────────────────────────────────────────────────────────┐
│ PUNTOS DE LA NORMA ISO 9001:2015                           │
├─────────────────────────────────────────────────────────────┤
│ [Filtros] Capítulo: [8 ▼] Categoría: [Operación ▼]        │
│                                                             │
│ ► 8. Operación                                             │
│   ├─ 8.1 Planificación y control operacional  [Alta] 🔗 3  │
│   ├─ 8.2 Requisitos para productos/servicios  [Alta] 🔗 2  │
│   ├─ 8.3 Diseño y desarrollo                  [Alta] 🔗 1  │
│   └─ 8.7 Control de salidas no conformes      [Alta] 🔗 0  │
│                                                             │
│ 🔗 = Procesos vinculados                                   │
└─────────────────────────────────────────────────────────────┘
```

**Resultado:** Usuario identifica qué requisitos aplicar.

---

#### **CASO 2: Ver detalle de un requisito ISO**

**Actor:** Responsable de Calidad  
**Objetivo:** Entender en detalle qué exige la norma

**Flujo:**
1. Usuario hace click en "8.3 Diseño y desarrollo"
2. Ve modal/página con:
   - ✅ Texto oficial del requisito ISO
   - 📘 Guía práctica de implementación
   - 💡 Ejemplos de aplicación
   - 🔗 Lista de procesos relacionados actuales
   - 📄 Documentos vinculados
   - 🎯 Objetivos relacionados

**Pantalla detalle:**
```
┌─────────────────────────────────────────────────────────────┐
│ 8.3 DISEÑO Y DESARROLLO DE PRODUCTOS Y SERVICIOS          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ✅ REQUISITO ISO                                           │
│ "La organización debe establecer, implementar y            │
│  mantener un proceso de diseño y desarrollo apropiado      │
│  para asegurar la posterior provisión de productos         │
│  y servicios."                                             │
│                                                             │
│ 📘 GUÍA DE IMPLEMENTACIÓN                                  │
│ - Definir etapas del diseño                               │
│ - Establecer entradas y salidas                            │
│ - Controlar cambios                                        │
│ - Validar diseños                                          │
│                                                             │
│ 🔗 PROCESOS RELACIONADOS (1)                               │
│ • Diseño de Productos [Ver proceso]                        │
│                                                             │
│ [+ Vincular Proceso] [+ Vincular Documento]               │
└─────────────────────────────────────────────────────────────┘
```

**Resultado:** Usuario comprende el requisito y ve qué tiene implementado.

---

#### **CASO 3: Vincular proceso a punto de norma**

**Actor:** Jefe de Calidad  
**Objetivo:** Relacionar un proceso con los requisitos ISO que debe cumplir

**Flujo:**
1. Usuario está en detalle de "8.4 Control de proveedores"
2. Click en botón "Vincular Proceso"
3. Modal muestra procesos de SU organización:
   - ☐ Gestión de Compras
   - ☐ Selección de Proveedores
   - ☐ Evaluación de Proveedores
4. Selecciona checkboxes:
   - ☑ Gestión de Compras
   - ☑ Evaluación de Proveedores
5. Click "Guardar"
6. Sistema actualiza `related_processes` del punto 8.4

**Modal:**
```
┌─────────────────────────────────────────────────────────────┐
│ VINCULAR PROCESOS AL PUNTO 8.4                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Selecciona los procesos que cumplen este requisito:       │
│                                                             │
│ ☑ Gestión de Compras                                       │
│ ☑ Evaluación de Proveedores                                │
│ ☐ Control de Inventarios                                   │
│ ☐ Producción                                               │
│                                                             │
│ [Cancelar] [Guardar]                                       │
└─────────────────────────────────────────────────────────────┘
```

**Resultado:** Ahora el punto 8.4 está vinculado a 2 procesos. Cuando auditen esos procesos, sabrán qué verificar.

---

#### **CASO 4: Auditor - Generar checklist de auditoría**

**Actor:** Auditor Interno  
**Objetivo:** Saber qué verificar al auditar un proceso

**Flujo:**
1. Auditor va a auditar proceso "Gestión de Compras"
2. Ingresa al detalle del proceso
3. Ve sección "Requisitos ISO aplicables":
   - 8.4 Control de proveedores externos
   - 7.1 Recursos
   - 9.1 Seguimiento y medición
4. Click en cada punto para ver qué verificar
5. Genera checklist automático:
   - ¿Hay criterios para seleccionar proveedores? (8.4)
   - ¿Se evalúa desempeño de proveedores? (8.4)
   - ¿Hay recursos asignados? (7.1)
   - ¿Se mide el proceso? (9.1)

**Pantalla:**
```
┌─────────────────────────────────────────────────────────────┐
│ PROCESO: GESTIÓN DE COMPRAS                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📋 REQUISITOS ISO APLICABLES                               │
│                                                             │
│ 8.4 Control de proveedores externos          [Ver detalle] │
│   ✅ Criterios de selección documentados                   │
│   ✅ Evaluación de proveedores (semestral)                 │
│   ⚠️  Falta: Validación de compras críticas               │
│                                                             │
│ 7.1 Recursos                                  [Ver detalle] │
│   ✅ Recursos asignados                                    │
│                                                             │
│ [Generar Checklist Auditoría]                              │
└─────────────────────────────────────────────────────────────┘
```

**Resultado:** Auditor tiene checklist específico basado en ISO.

---

#### **CASO 5: Gerente - Matriz de trazabilidad ISO**

**Actor:** Gerente de Calidad  
**Objetivo:** Ver cumplimiento general de ISO 9001

**Flujo:**
1. Usuario ingresa a `/norm-points/dashboard`
2. Ve estadísticas:
   - Total puntos: 32
   - Con procesos: 25 (78%)
   - Sin procesos: 7 (22%)
   - Por capítulo:
     - Cap. 4: 100%
     - Cap. 8: 71% ⚠️
     - Cap. 10: 100%
3. Click "Exportar Matriz de Trazabilidad"
4. Descarga Excel con tabla completa

**Dashboard:**
```
┌─────────────────────────────────────────────────────────────┐
│ CUMPLIMIENTO ISO 9001                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📊 RESUMEN GENERAL                                         │
│ ████████████████░░░░ 78% (25/32 con procesos)             │
│                                                             │
│ 📈 POR CAPÍTULO                                            │
│ Cap. 4 - Contexto      ████████████████████ 100%          │
│ Cap. 5 - Liderazgo     ████████████████████ 100%          │
│ Cap. 8 - Operación     ██████████████░░░░░░ 71% ⚠️        │
│ Cap. 9 - Evaluación    ████████████████████ 100%          │
│                                                             │
│ ⚠️  PUNTOS SIN PROCESOS                                    │
│ • 8.6 Liberación de productos                              │
│ • 8.7 Control de salidas no conformes                      │
│                                                             │
│ [Exportar Matriz Excel]                                    │
└─────────────────────────────────────────────────────────────┘
```

**Excel exportado:**
```
| Punto | Título                    | Procesos         | Docs | Objetivos | Estado      |
|-------|---------------------------|------------------|------|-----------|-------------|
| 4.1   | Contexto organización     | Planificación    | 2    | 1         | ✅ Completo |
| 8.3   | Diseño y desarrollo       | Diseño Productos | 3    | 2         | ✅ Completo |
| 8.6   | Liberación productos      | -                | 0    | 0         | ⚠️ Pendiente|
| 9.2   | Auditoría interna         | Auditorías       | 4    | 1         | ✅ Completo |
```

**Resultado:** Gerente identifica gaps y toma decisiones.

---

### 🔗 INTEGRACIONES

#### Con Procesos
- Proceso muestra qué puntos ISO debe cumplir
- Punto ISO muestra qué procesos lo implementan

#### Con Auditorías
- Al auditar proceso, se verifican puntos ISO relacionados
- Hallazgos se vinculan a puntos ISO incumplidos

#### Con Documentos
- Documentos evidencian cumplimiento de puntos ISO
- Punto ISO lista documentos que lo respaldan

---

## 2. DOCUMENTOS

### 🎯 OBJETIVO DEL MÓDULO
Gestionar documentos del Sistema de Gestión de Calidad (PDFs, Word, etc.) con control de versiones, estados de aprobación y vinculación a procesos.

### 📊 ESTRUCTURA DE DATOS

#### Documento (ProcessDocument)
```typescript
{
  // IDENTIFICACIÓN
  process_id: ObjectId,                  // A qué proceso pertenece (puede ser null)
  titulo: "Manual de Calidad",
  descripcion: "Manual del SGC v2",
  
  // CLASIFICACIÓN
  tipo_documento: "manual",              // procedimiento|instructivo|formato|manual|politica|otro
  
  // VERSIONAMIENTO
  version: "2.0",                        // Control de versiones
  estado: "aprobado",                    // borrador|revision|aprobado|obsoleto
  
  // ARCHIVO FÍSICO
  archivo_url: "/uploads/manual_v2.pdf",
  archivo_nombre: "manual_calidad_v2.pdf",
  archivo_tamaño: 2048000,               // bytes
  
  // CONTROL
  fecha_creacion: Date,
  fecha_revision: Date,
  creado_por: ObjectId,                  // Usuario que creó
  revisado_por: ObjectId,                // Usuario que aprobó
  
  // MULTI-TENANT
  organization_id: "org-001",
  is_active: true,
  is_archived: false                     // Documentos archivados
}
```

---

### 📝 CASOS DE USO

#### **CASO 1: Subir nuevo documento**

**Actor:** Responsable de Proceso  
**Objetivo:** Subir un procedimiento documentado

**Flujo:**
1. Usuario ingresa a `/documentos`
2. Click botón "+ Nuevo Documento"
3. Modal de upload:
   - Título: "Procedimiento de Compras"
   - Tipo: [Dropdown] → Selecciona "Procedimiento"
   - Proceso: [Dropdown] → Selecciona "Gestión de Compras" (opcional)
   - Descripción: "Procedimiento para compras menores a $10,000"
   - Archivo: [Seleccionar PDF] → `procedimiento_compras.pdf`
4. Click "Subir"
5. Sistema:
   - Guarda PDF en `/uploads/documents/`
   - Crea registro con `estado: "borrador"`, `version: "1.0"`
   - Retorna a listado

**Modal:**
```
┌─────────────────────────────────────────────────────────────┐
│ NUEVO DOCUMENTO                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Título *                                                    │
│ [Procedimiento de Compras____________________________]     │
│                                                             │
│ Tipo de Documento *                                        │
│ [Procedimiento ▼]                                          │
│   • Procedimiento                                          │
│   • Instructivo                                            │
│   • Formato                                                │
│   • Manual                                                 │
│   • Política                                               │
│                                                             │
│ Proceso Relacionado (opcional)                             │
│ [Gestión de Compras ▼]                                     │
│                                                             │
│ Descripción                                                │
│ [Procedimiento para compras menores a $10,000_______]     │
│                                                             │
│ Archivo PDF *                                              │
│ [Seleccionar archivo...] [procedimiento_compras.pdf]      │
│                                                             │
│ [Cancelar] [Subir Documento]                               │
└─────────────────────────────────────────────────────────────┘
```

**Resultado:** Documento creado en estado BORRADOR, listo para revisión.

---

#### **CASO 2: Ver y descargar documentos**

**Actor:** Cualquier usuario  
**Objetivo:** Consultar documentos aprobados

**Flujo:**
1. Usuario ingresa a `/documentos`
2. Ve tabla con documentos:
   - Filtros: Tipo, Estado, Proceso
3. Filtra por: Estado = "Aprobado"
4. Ve lista de documentos vigentes
5. Click en "Ver PDF" → Abre en nueva pestaña
6. Click en "Descargar" → Descarga archivo

**Pantalla:**
```
┌─────────────────────────────────────────────────────────────┐
│ DOCUMENTOS                                [+ Nuevo]         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Filtros: Tipo: [Todos ▼] Estado: [Aprobado ▼] Proceso: [] │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │Título               │Tipo         │Ver.│Estado    │     ││
│ ├─────────────────────────────────────────────────────────┤│
│ │Manual de Calidad    │Manual       │2.0 │APROBADO  │📄💾││
│ │Proc. Compras        │Procedimiento│1.0 │APROBADO  │📄💾││
│ │FOR-001 No Conform.  │Formato      │3.0 │APROBADO  │📄💾││
│ │Diseño Productos     │Instructivo  │1.5 │REVISIÓN  │📄  ││
│ │Política Calidad     │Política     │1.0 │BORRADOR  │📝  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ 📊 Total: 5 documentos | APROBADOS: 3 | EN REVISIÓN: 1    │
└─────────────────────────────────────────────────────────────┘

📄 = Ver PDF | 💾 = Descargar | 📝 = Editar
```

**Resultado:** Usuario encuentra y accede a documentos.

---

#### **CASO 3: Flujo de aprobación de documento**

**Actor:** Responsable de Calidad  
**Objetivo:** Aprobar un documento que está en revisión

**Flujo:**
1. Usuario recibe notificación: "Procedimiento de Compras requiere revisión"
2. Ingresa a `/documentos`
3. Filtra por Estado: "Revisión"
4. Click en "Procedimiento de Compras v1.0"
5. Ve detalle:
   - Título, descripción
   - PDF embebido o link
   - Historial: Creado por Juan Pérez el 10/01/2025
6. Revisa el documento
7. Click botón "Aprobar"
8. Modal: "¿Confirma aprobación? Agregue comentarios (opcional)"
9. Confirma
10. Sistema:
    - Cambia `estado: "aprobado"`
    - Registra `revisado_por: user_actual`
    - `fecha_revision: hoy`

**Detalle documento:**
```
┌─────────────────────────────────────────────────────────────┐
│ PROCEDIMIENTO DE COMPRAS v1.0                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Estado: [🟡 EN REVISIÓN]                                   │
│ Tipo: Procedimiento                                        │
│ Proceso: Gestión de Compras                                │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │                                                         ││
│ │          [Vista previa PDF embebida]                   ││
│ │                                                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ 📜 HISTORIAL                                               │
│ • Creado por: Juan Pérez - 10/01/2025                     │
│ • En revisión desde: 12/01/2025                            │
│                                                             │
│ [Rechazar] [Aprobar] [Solicitar Cambios]                  │
└─────────────────────────────────────────────────────────────┘
```

**Resultado:** Documento aprobado, disponible para toda la organización.

---

#### **CASO 4: Crear nueva versión de documento**

**Actor:** Dueño del proceso  
**Objetivo:** Actualizar un documento aprobado

**Flujo:**
1. Usuario ve "Manual de Calidad v1.0" (APROBADO)
2. Necesita actualizarlo con nuevos procedimientos
3. Click en "Nueva Versión"
4. Modal:
   - Versión actual: 1.0
   - Nueva versión: [2.0] (auto-calculada)
   - Comentarios: "Actualización capítulo 5 - Control de documentos"
   - Subir nuevo PDF: [manual_v2.pdf]
5. Click "Crear Versión"
6. Sistema:
   - Crea nuevo registro:
     - version: "2.0"
     - estado: "borrador"
     - archivo_url: nuevo PDF
   - Marca versión anterior (v1.0) como "obsoleto" (cuando se apruebe v2.0)

**Historial de versiones:**
```
┌─────────────────────────────────────────────────────────────┐
│ MANUAL DE CALIDAD - HISTORIAL                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │Ver. │Estado    │Fecha      │Autor      │Cambios     │  ││
│ ├─────────────────────────────────────────────────────────┤│
│ │2.0  │BORRADOR  │15/01/2025 │Juan P.    │Cap. 5      │📄││
│ │1.0  │APROBADO  │10/10/2024 │María G.   │Versión ini.│📄││
│ │0.9  │OBSOLETO  │05/09/2024 │María G.   │Draft       │📄││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [+ Nueva Versión]                                          │
└─────────────────────────────────────────────────────────────┘
```

**Resultado:** Nueva versión creada, cuando se apruebe, la v1.0 pasa a obsoleto automáticamente.

---

#### **CASO 5: Vincular documento a proceso**

**Actor:** Jefe de Calidad  
**Objetivo:** Asociar documento con su proceso correspondiente

**Flujo:**
1. Usuario está en detalle de documento "Procedimiento de Auditorías"
2. Campo "Proceso Relacionado": [Vacío]
3. Click en "Vincular Proceso"
4. Modal lista procesos de la organización
5. Selecciona: "Auditorías Internas"
6. Guarda
7. Ahora:
   - Documento muestra: Proceso → Auditorías Internas
   - Proceso "Auditorías Internas" muestra este documento en su pestaña "Documentos"

**Resultado:** Trazabilidad proceso ↔ documento establecida.

---

#### **CASO 6: Buscar documentos**

**Actor:** Auditor  
**Objetivo:** Encontrar todos los formatos relacionados con no conformidades

**Flujo:**
1. Usuario ingresa a `/documentos`
2. Usa barra de búsqueda: "no conformidad"
3. Usa filtro: Tipo = "Formato"
4. Resultado:
   - FOR-001 Reporte de No Conformidad v3.0
   - FOR-015 Análisis de Causa Raíz v1.0
   - FOR-022 Plan de Acción Correctiva v2.0
5. Click en cualquiera para ver/descargar

**Pantalla:**
```
┌─────────────────────────────────────────────────────────────┐
│ DOCUMENTOS                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🔍 [no conformidad_______________] [Buscar]               │
│ Tipo: [Formato ▼]                                          │
│                                                             │
│ 📄 RESULTADOS (3)                                          │
│                                                             │
│ • FOR-001 Reporte de No Conformidad v3.0    [APROBADO] 📄 │
│ • FOR-015 Análisis de Causa Raíz v1.0       [APROBADO] 📄 │
│ • FOR-022 Plan de Acción Correctiva v2.0    [APROBADO] 📄 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Resultado:** Auditor encuentra rápidamente formatos necesarios.

---

### 🔗 INTEGRACIONES

#### Con Procesos
- Documentos muestran a qué proceso pertenecen
- Procesos listan sus documentos asociados

#### Con Puntos de Norma
- Documentos evidencian cumplimiento de requisitos ISO
- Punto ISO 7.5 (Información documentada) lista todos los docs

#### Con Auditorías
- Auditor verifica que existan documentos requeridos
- Hallazgo si falta documentación obligatoria

#### Con Control de Cambios
- Al crear nueva versión, se notifica a usuarios afectados
- Historial completo de cambios documentado

---

### ⚙️ CONFIGURACIÓN TÉCNICA

#### Backend
- **Upload:** Multer con límite 10MB
- **Storage:** `/uploads/documents/`
- **Formatos:** Solo PDF (extensible a Word, Excel)
- **Rutas:** 
  - POST `/api/documents` (con FormData)
  - GET `/api/documents?organization_id=X&estado=aprobado`
  - PATCH `/api/documents/:id/status`
  - PATCH `/api/documents/:id/version`

#### Frontend
- **Página:** `/documentos`
- **Componentes:**
  - `DocumentTable.tsx`
  - `DocumentUploadModal.tsx`
  - `DocumentDetailModal.tsx`
  - `VersionHistoryModal.tsx`

---

## 📊 RESUMEN DE RELACIONES

```
Punto de Norma ─────┬──── Proceso ──────┬──── Documento
                    │                    │
                    ├──── Objetivo       │
                    │                    │
                    └──── Indicador ─────┘
```

**Flujo completo:**
1. **Punto ISO 8.3** (Diseño) → Se implementa en → **Proceso "Diseño de Productos"**
2. **Proceso** → Se documenta en → **Documento "Procedimiento de Diseño v2.0"**
3. **Objetivo** → "Reducir tiempo de diseño 20%" → Mide cumplimiento de ISO 8.3
4. **Indicador** → "Tiempo promedio diseño" → Evidencia mejora continua (ISO 10.3)

---

## 🚀 PRÓXIMOS MÓDULOS A DOCUMENTAR

- [ ] Procesos
- [ ] Auditorías
- [ ] Hallazgos
- [ ] Acciones Correctivas
- [ ] Indicadores
- [ ] Objetivos
- [ ] RRHH (Personal, Competencias)
- [ ] CRM Agro

---

**Última actualización:** 01/10/2025  
**Versión:** 1.0

