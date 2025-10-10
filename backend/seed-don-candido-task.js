/**
 * Script para crear tarea de Don Cándido en el Kanban de Super Admin
 * Ejecutar: node seed-don-candido-task.js
 */

const mongoose = require('mongoose');

// Configurar conexión a MongoDB (usar valor por defecto)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/9001app';

console.log('🔗 MongoDB URI:', MONGO_URI);

// Definir esquema directamente
const RoadmapTaskSchema = new mongoose.Schema({
  organization_id: String,
  taskNumber: String,
  title: String,
  description: String,
  objectives: String,
  module: String,
  status: String,
  priority: String,
  type: String,
  responsible: String,
  assignedTo: String,
  estimatedDays: Number,
  dueDate: Date,
  tags: [String],
  abmType: String,
  linkedTo: {
    type: String,
    id: String
  },
  linkedMdFiles: [String],
  attachedDocuments: [{
    name: String,
    path: String,
    type: String,
    uploadedAt: Date
  }],
  phase: String,
  order: Number,
  createdBy: String,
  updatedBy: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}, { timestamps: true });

const RoadmapTask = mongoose.model('RoadmapTask', RoadmapTaskSchema);

async function createDonCandidoTask() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Usar organization_id por defecto
    const organizationId = process.argv[2] || 'org-default';

    // Generar número único de tarea
    const existingTasks = await RoadmapTask.countDocuments({ organization_id: organizationId });
    const taskNumber = `TASK-${String(existingTasks + 1).padStart(4, '0')}`;

    console.log(`📝 Creando tarea: ${taskNumber} para organización: ${organizationId}\n`);

    // Definir la tarea de Don Cándido
    const donCandidoTask = {
      organization_id: organizationId,
      taskNumber: taskNumber,
      
      // Información básica
      title: '🤖 Activar Sistema de IA "Don Cándido" con Anthropic Claude',
      
      description: `Sistema de Inteligencia Artificial "Don Cándido" ya implementado al 100% en código pero pendiente de activación.

**ESTADO ACTUAL**:
- ✅ Código completo (API + UI + Animaciones)
- ✅ Base de conocimiento ISO 9001 integrada
- ✅ Sistema de contexto dinámico implementado
- ⚠️ API Key de Anthropic Claude NO configurada (suspendido)
- ✅ Modo fallback operativo (respuestas simuladas)

**QUÉ ES**:
Asistente de IA conectado a Anthropic Claude que proporciona asesoramiento experto en ISO 9001 y gestión de calidad 24/7 dentro del sistema.

**POR QUÉ ES IMPORTANTE**:
- ROI: 959% en primer año
- Ahorro: $18,000 USD/año
- Inversión: Solo $520 USD (config + API mensual)
- Tiempo de activación: 2 días
- Payback: 12 días`,

      objectives: `**OBJETIVOS DE LA TAREA**:

1. **Activar conexión real con Anthropic Claude API**
   - Obtener API Key de Anthropic
   - Configurar variable NEXT_PUBLIC_CLAUDE_API_KEY
   - Verificar conexión funcionando

2. **Testing completo del sistema**
   - Probar respuestas contextuales de IA
   - Verificar modo fallback
   - Validar en diferentes módulos (RRHH, Procesos, CRM, Auditorías)

3. **Deploy a producción**
   - Deploy staging con tests
   - Deploy producción con monitoreo
   - Capacitación básica al equipo

**BENEFICIOS ESPERADOS**:
- ⬇️ 70% reducción en tiempo de resolución de dudas
- ⬇️ 50% menos consultas a expertos ISO
- ⬆️ 60% más rápida capacitación de nuevos usuarios
- ⬆️ 40% mejora en satisfacción de usuario

**DOCUMENTACIÓN COMPLETA**:
Ver archivos .md enlazados abajo con análisis técnico, económico y guías de implementación.

**ARCHIVOS DE CÓDIGO YA IMPLEMENTADOS**:
- frontend/src/app/api/ia/don-candidos/route.ts
- frontend/src/components/chat/DonCandidoChat.tsx
- frontend/src/contexts/DonCandidoContext.tsx
- frontend/src/lib/ia/contextoProyectoCompleto.ts`,

      // Clasificación
      module: 'general',
      status: 'todo', // Listo para trabajar
      priority: 'high', // Alta prioridad por ROI
      type: 'feature',
      
      // Asignación
      responsible: 'Tech Lead',
      assignedTo: 'developer',
      estimatedDays: 2,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En 1 semana
      
      // Tags para búsqueda
      tags: [
        'ia',
        'anthropic',
        'claude',
        'don-candido',
        'iso-9001',
        'asistente-virtual',
        'quick-win',
        'high-roi',
        'documentado'
      ],
      
      // Archivos de documentación enlazados
      linkedMdFiles: [
        'README-DON-CANDIDO-ESTADO-ACTUAL.md',
        'QUICK-START-DON-CANDIDO.md',
        'RESUMEN-EJECUTIVO-DON-CANDIDO.md',
        'TAREAS-ACTIVACION-DON-CANDIDO.md',
        'INFORME-DON-CANDIDO-IA-ANTHROPIC.md',
        'INDICE-DOCUMENTACION-DON-CANDIDO.md'
      ],
      
      // Fase del roadmap
      phase: 'v6.1', // Implementación inmediata
      
      // Orden (al principio)
      order: 1,
      
      // Metadatos
      createdBy: 'system',
      isActive: true
    };

    // Crear la tarea
    const task = await RoadmapTask.create(donCandidoTask);
    
    console.log('✅ Tarea creada exitosamente!\n');
    console.log('📋 DETALLES DE LA TAREA:');
    console.log('─────────────────────────────────────────');
    console.log(`ID: ${task._id}`);
    console.log(`Número: ${task.taskNumber}`);
    console.log(`Título: ${task.title}`);
    console.log(`Módulo: ${task.module}`);
    console.log(`Estado: ${task.status}`);
    console.log(`Prioridad: ${task.priority}`);
    console.log(`Tipo: ${task.type}`);
    console.log(`Fase: ${task.phase}`);
    console.log(`Asignado a: ${task.assignedTo}`);
    console.log(`Días estimados: ${task.estimatedDays}`);
    console.log(`Tags: ${task.tags.join(', ')}`);
    console.log(`\nArchivos .md enlazados:`);
    task.linkedMdFiles.forEach(file => console.log(`  - ${file}`));
    console.log('─────────────────────────────────────────\n');

    console.log('🎯 PRÓXIMOS PASOS:');
    console.log('1. Ir a Super Admin → Tareas → Kanban');
    console.log('2. Buscar la tarea "Don Cándido"');
    console.log('3. Moverla a "En Progreso" cuando comiences');
    console.log('4. Seguir guía: QUICK-START-DON-CANDIDO.md');
    console.log('5. Marcar como "Done" al completar\n');

    console.log('📖 PARA LEER LA DOCUMENTACIÓN:');
    console.log('1. Abrir: README-DON-CANDIDO-ESTADO-ACTUAL.md (10 min)');
    console.log('2. Decidir: ¿Activamos?');
    console.log('3. Ejecutar: QUICK-START-DON-CANDIDO.md (15 min)\n');

  } catch (error) {
    console.error('❌ Error al crear tarea:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar
createDonCandidoTask();

