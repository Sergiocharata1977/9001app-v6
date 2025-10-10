const mongoose = require('mongoose');
require('dotenv').config();

// Schema simple para RoadmapTask
const RoadmapTaskSchema = new mongoose.Schema({
  organization_id: { type: String, required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true },
  module: { 
    type: String, 
    enum: ['rrhh', 'crm', 'auditorias', 'procesos', 'documentos', 'normas', 'calidad', 'productos', 'riesgos', 'general', 'testing'],
    required: true,
    index: true
  },
  status: { 
    type: String, 
    enum: ['backlog', 'todo', 'in_progress', 'review', 'done'],
    default: 'backlog',
    required: true,
    index: true
  },
  priority: { 
    type: String, 
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium',
    required: true,
    index: true
  },
  type: { 
    type: String, 
    enum: ['feature', 'bug', 'improvement', 'documentation', 'testing', 'abm'],
    default: 'feature',
    required: true
  },
  responsible: { type: String, trim: true },
  assignedTo: { type: String, trim: true, index: true },
  estimatedDays: { type: Number, min: 0 },
  dueDate: { type: Date },
  tags: [{ type: String, trim: true }],
  abmType: { 
    type: String, 
    enum: ['create', 'read', 'update', 'delete', 'list'],
    sparse: true
  },
  linkedTo: {
    type: { type: String, enum: ['audit', 'process', 'document', 'norm', 'crm', 'rrhh'] },
    id: String
  },
  phase: { 
    type: String, 
    enum: ['v6.1', 'v6.5', 'v7.0', 'v8.0', 'backlog'],
    default: 'backlog',
    index: true
  },
  order: { type: Number, default: 0, index: true },
  createdBy: { type: String, required: true },
  updatedBy: { type: String },
  isActive: { type: Boolean, default: true, index: true }
}, {
  timestamps: true
});

const RoadmapTask = mongoose.model('RoadmapTask', RoadmapTaskSchema);

// Tareas de ejemplo
const sampleTasks = [
  {
    title: 'Setup Playwright y configuración',
    description: 'Instalar Playwright, configurar ambientes y crear estructura base de tests',
    module: 'testing',
    status: 'done',
    priority: 'critical',
    type: 'testing',
    assignedTo: 'developer',
    estimatedDays: 2,
    phase: 'v6.1',
    tags: ['testing', 'setup', 'playwright'],
    order: 1,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  },
  {
    title: 'Tests CRM: Oportunidades CRUD',
    description: 'Crear 5 tests E2E para crear, editar, eliminar y listar oportunidades',
    module: 'crm',
    status: 'in_progress',
    priority: 'critical',
    type: 'testing',
    abmType: 'create',
    assignedTo: 'ia',
    estimatedDays: 2,
    phase: 'v6.1',
    tags: ['crm', 'testing', 'crud'],
    order: 1,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  },
  {
    title: 'Tests CRM: Empresas ABM',
    description: 'Tests completos de ABM para módulo de empresas',
    module: 'crm',
    status: 'todo',
    priority: 'high',
    type: 'abm',
    abmType: 'create',
    assignedTo: 'ia',
    estimatedDays: 2,
    phase: 'v6.1',
    tags: ['crm', 'abm'],
    order: 2,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  },
  {
    title: 'Tests Auditorías: Crear auditoría',
    description: 'Tests E2E para flujo de creación de auditorías',
    module: 'auditorias',
    status: 'todo',
    priority: 'high',
    type: 'testing',
    assignedTo: 'developer',
    estimatedDays: 2,
    phase: 'v6.1',
    tags: ['auditorias', 'testing'],
    order: 3,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  },
  {
    title: 'Configurar CI/CD con GitHub Actions',
    description: 'Crear workflow para ejecutar tests automáticamente en PRs',
    module: 'general',
    status: 'todo',
    priority: 'critical',
    type: 'feature',
    assignedTo: 'developer',
    estimatedDays: 1,
    phase: 'v6.1',
    tags: ['ci/cd', 'github', 'automation'],
    order: 6,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  },
  {
    title: 'Actualizar web de documentación',
    description: 'Sincronizar documentación con estado actual del sistema',
    module: 'general',
    status: 'todo',
    priority: 'high',
    type: 'documentation',
    assignedTo: 'ia',
    estimatedDays: 2,
    phase: 'v6.1',
    tags: ['docs', 'sync'],
    order: 7,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  },
  {
    title: 'Aplicar middleware de logging a todos los módulos',
    description: 'Integrar usageLogger en todas las rutas para monitoreo completo',
    module: 'general',
    status: 'backlog',
    priority: 'high',
    type: 'improvement',
    assignedTo: 'developer',
    estimatedDays: 1,
    phase: 'v6.5',
    tags: ['monitoring', 'logging'],
    order: 1,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  },
  {
    title: 'Dashboard de trazabilidad',
    description: 'Crear vista interactiva: Norma → Proceso → Documento → Indicador',
    module: 'general',
    status: 'backlog',
    priority: 'high',
    type: 'feature',
    assignedTo: 'developer',
    estimatedDays: 5,
    phase: 'v6.5',
    tags: ['dashboard', 'trazabilidad'],
    order: 2,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  },
  {
    title: 'Sistema de alertas y notificaciones',
    description: 'Alertas de errores críticos y notificaciones de tareas vencidas',
    module: 'general',
    status: 'backlog',
    priority: 'medium',
    type: 'feature',
    assignedTo: 'developer',
    estimatedDays: 3,
    phase: 'v6.5',
    tags: ['notifications', 'alerts'],
    order: 3,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  },
  {
    title: 'Optimización frontend: Code splitting',
    description: 'Implementar lazy loading y code splitting por módulo',
    module: 'general',
    status: 'backlog',
    priority: 'medium',
    type: 'improvement',
    assignedTo: 'developer',
    estimatedDays: 3,
    phase: 'v7.0',
    tags: ['performance', 'optimization'],
    order: 1,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  },
  {
    title: 'Implementar caché con Redis',
    description: 'Caché distribuido para consultas frecuentes',
    module: 'general',
    status: 'backlog',
    priority: 'high',
    type: 'feature',
    assignedTo: 'developer',
    estimatedDays: 3,
    phase: 'v7.0',
    tags: ['cache', 'redis', 'performance'],
    order: 2,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  },
  {
    title: 'Agente IA: Detección de anomalías',
    description: 'ML model para detectar patrones anormales en logs',
    module: 'general',
    status: 'backlog',
    priority: 'low',
    type: 'feature',
    assignedTo: 'ia',
    estimatedDays: 10,
    phase: 'v8.0',
    tags: ['ai', 'ml', 'anomaly-detection'],
    order: 1,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  },
  {
    title: 'Chatbot técnico con LangChain',
    description: 'Asistente IA para soporte y documentación',
    module: 'general',
    status: 'backlog',
    priority: 'low',
    type: 'feature',
    assignedTo: 'ia',
    estimatedDays: 8,
    phase: 'v8.0',
    tags: ['ai', 'chatbot', 'langchain'],
    order: 2,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  },
  {
    title: 'Integración con Jira',
    description: 'Sincronización bidireccional de tareas',
    module: 'general',
    status: 'backlog',
    priority: 'low',
    type: 'feature',
    assignedTo: 'developer',
    estimatedDays: 5,
    phase: 'v8.0',
    tags: ['integration', 'jira'],
    order: 4,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  },
  {
    title: 'API Pública v1.0',
    description: 'OpenAPI completa con webhooks y autenticación',
    module: 'general',
    status: 'backlog',
    priority: 'medium',
    type: 'feature',
    assignedTo: 'developer',
    estimatedDays: 6,
    phase: 'v8.0',
    tags: ['api', 'public', 'webhooks'],
    order: 6,
    organization_id: 'org-default',
    createdBy: 'seeder',
    isActive: true
  }
];

async function seedRoadmapTasks() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Limpiar tareas existentes
    console.log('🧹 Limpiando tareas existentes...');
    await RoadmapTask.deleteMany({ organization_id: 'org-default' });

    // Insertar tareas de ejemplo
    console.log('📝 Insertando tareas de ejemplo...');
    await RoadmapTask.insertMany(sampleTasks);

    console.log(`✅ Seeded ${sampleTasks.length} roadmap tasks successfully!`);
    
    // Mostrar estadísticas
    const stats = await RoadmapTask.aggregate([
      { $match: { organization_id: 'org-default' } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);
    
    console.log('📊 Estadísticas por estado:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} tareas`);
    });

    await mongoose.disconnect();
    console.log('👋 Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedRoadmapTasks();
