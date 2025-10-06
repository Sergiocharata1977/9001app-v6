const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/9001app-v6';

// Schema simplificado para inserción directa
const ProcessRecordSchema = new mongoose.Schema({
  id: String,
  titulo: String,
  descripcion: String,
  processId: mongoose.Schema.Types.ObjectId,
  process_definition_id: mongoose.Schema.Types.ObjectId,
  responsible: String,
  responsable: String,
  date: Date,
  current_state: String,
  estado: String,
  prioridad: String,
  fecha_inicio: Date,
  fecha_fin: Date,
  observaciones: String,
  evidence: String,
  progress_percentage: Number,
  state_history: Array,
  organization_id: String,
  is_active: Boolean,
  is_archived: Boolean,
  created_by: mongoose.Schema.Types.ObjectId,
  created_at: Date,
  updated_at: Date
}, {
  collection: 'process_records'
});

const ProcessRecord = mongoose.model('ProcessRecord', ProcessRecordSchema);

async function insertSampleTasks() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    console.log('📊 Base de datos:', mongoose.connection.db.databaseName);

    // Verificar si ya existen registros
    const existingRecords = await ProcessRecord.countDocuments();
    console.log(`📋 Registros existentes: ${existingRecords}`);

    // IDs de ejemplo (usa los que tienes en tu base de datos)
    const processId = '68e1091fd2e5b6a2c385b77b'; // Control de Calidad
    const userId = '68e1091fd2e5b6a2c385b778'; // Usuario de ejemplo

    // Datos de ejemplo
    const sampleTasks = [
      {
        id: `PR-${Date.now()}-001`,
        titulo: 'Inspección de Materias Primas',
        descripcion: 'Inspeccionar la calidad de las materias primas recibidas según especificaciones',
        processId: new mongoose.Types.ObjectId(processId),
        process_definition_id: new mongoose.Types.ObjectId(processId),
        responsible: 'Inspector de Calidad',
        responsable: 'Inspector de Calidad',
        date: new Date(),
        current_state: 'iniciado',
        estado: 'pendiente',
        prioridad: 'alta',
        fecha_inicio: new Date('2025-10-06'),
        fecha_fin: new Date('2025-10-08'),
        observaciones: 'Revisar especificaciones técnicas antes de iniciar',
        evidence: 'Checklist de inspección completado',
        progress_percentage: 0,
        state_history: [{
          state: 'iniciado',
          changed_at: new Date(),
          changed_by: 'Sistema',
          comment: 'Tarea creada'
        }],
        organization_id: '1',
        is_active: true,
        is_archived: false,
        created_by: new mongoose.Types.ObjectId(userId),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: `PR-${Date.now()}-002`,
        titulo: 'Pruebas de Calidad Lote 2024-10',
        descripcion: 'Realizar pruebas de calidad al lote de producción 2024-10',
        processId: new mongoose.Types.ObjectId(processId),
        process_definition_id: new mongoose.Types.ObjectId(processId),
        responsible: 'Técnico de Laboratorio',
        responsable: 'Técnico de Laboratorio',
        date: new Date(),
        current_state: 'en_progreso',
        estado: 'en_progreso',
        prioridad: 'media',
        fecha_inicio: new Date('2025-10-05'),
        fecha_fin: new Date('2025-10-10'),
        observaciones: 'Pruebas físicas y químicas pendientes',
        evidence: 'Resultados de laboratorio adjuntos',
        progress_percentage: 45,
        state_history: [
          {
            state: 'iniciado',
            changed_at: new Date('2025-10-05'),
            changed_by: 'Sistema',
            comment: 'Tarea creada'
          },
          {
            state: 'en_progreso',
            changed_at: new Date(),
            changed_by: 'Técnico',
            comment: 'Pruebas iniciadas'
          }
        ],
        organization_id: '1',
        is_active: true,
        is_archived: false,
        created_by: new mongoose.Types.ObjectId(userId),
        created_at: new Date('2025-10-05'),
        updated_at: new Date()
      },
      {
        id: `PR-${Date.now()}-003`,
        titulo: 'Auditoría Interna de Calidad',
        descripcion: 'Auditoría interna del proceso de control de calidad según ISO 9001',
        processId: new mongoose.Types.ObjectId(processId),
        process_definition_id: new mongoose.Types.ObjectId(processId),
        responsible: 'Auditor Interno',
        responsable: 'Auditor Interno',
        date: new Date(),
        current_state: 'completado',
        estado: 'completado',
        prioridad: 'alta',
        fecha_inicio: new Date('2025-10-01'),
        fecha_fin: new Date('2025-10-04'),
        observaciones: 'Auditoría completada sin no conformidades mayores',
        evidence: 'Informe de auditoría y plan de acción',
        progress_percentage: 100,
        state_history: [
          {
            state: 'iniciado',
            changed_at: new Date('2025-10-01'),
            changed_by: 'Sistema',
            comment: 'Tarea creada'
          },
          {
            state: 'en_progreso',
            changed_at: new Date('2025-10-02'),
            changed_by: 'Auditor',
            comment: 'Auditoría en progreso'
          },
          {
            state: 'completado',
            changed_at: new Date('2025-10-04'),
            changed_by: 'Auditor',
            comment: 'Auditoría finalizada exitosamente'
          }
        ],
        organization_id: '1',
        is_active: true,
        is_archived: false,
        created_by: new mongoose.Types.ObjectId(userId),
        created_at: new Date('2025-10-01'),
        updated_at: new Date('2025-10-04')
      }
    ];

    console.log('\n📝 Insertando tareas de ejemplo...');
    
    for (const task of sampleTasks) {
      try {
        const newTask = new ProcessRecord(task);
        await newTask.save();
        console.log(`✅ Tarea creada: ${task.titulo} (ID: ${task.id})`);
      } catch (error) {
        console.error(`❌ Error creando tarea "${task.titulo}":`, error.message);
      }
    }

    // Verificar las tareas insertadas
    const totalRecords = await ProcessRecord.countDocuments();
    console.log(`\n📊 Total de registros en process_records: ${totalRecords}`);

    // Mostrar todas las tareas
    const allTasks = await ProcessRecord.find({ organization_id: '1' })
      .sort({ created_at: -1 })
      .limit(10);
    
    console.log('\n📋 Últimas tareas registradas:');
    allTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.titulo} - Estado: ${task.current_state} - Prioridad: ${task.prioridad}`);
    });

    console.log('\n✅ Script completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar el script
insertSampleTasks();
