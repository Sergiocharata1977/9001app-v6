import RoadmapTask from '../models/RoadmapTask';

const sampleTasks = [
  // ========== FASE v6.1 - FUNDAMENTOS CRÍTICOS ==========
  {
    title: 'Setup Playwright y configuración',
    description: 'Instalar Playwright, configurar ambientes y crear estructura base de tests',
    objectives: 'Establecer una base sólida de testing automatizado para garantizar la calidad del sistema',
    module: 'testing',
    status: 'done',
    priority: 'critical',
    type: 'testing',
    assignedTo: 'developer',
    estimatedDays: 2,
    phase: 'v6.1',
    tags: ['testing', 'setup', 'playwright'],
    linkedMdFiles: ['docs/testing-setup.md', 'docs/playwright-config.md'],
    attachedDocuments: [],
    order: 1
  },
  {
    title: 'Migrar tests existentes a Playwright',
    description: 'Convertir tests de Puppeteer a Playwright Test para unificar framework',
    objectives: 'Unificar el framework de testing para mejorar la consistencia y mantenibilidad de los tests automatizados',
    module: 'testing',
    status: 'done',
    priority: 'high',
    type: 'testing',
    assignedTo: 'developer',
    estimatedDays: 3,
    phase: 'v6.1',
    tags: ['testing', 'migration'],
    linkedMdFiles: ['docs/testing-migration.md'],
    attachedDocuments: [],
    order: 2
  },
  {
    title: 'Tests CRM: Oportunidades CRUD',
    description: 'Crear 5 tests E2E para crear, editar, eliminar y listar oportunidades',
    objectives: 'Validar que el módulo CRM funcione correctamente con operaciones CRUD completas para oportunidades de negocio',
    module: 'crm',
    status: 'in_progress',
    priority: 'critical',
    type: 'testing',
    abmType: 'create',
    assignedTo: 'ia',
    estimatedDays: 2,
    phase: 'v6.1',
    tags: ['crm', 'testing', 'crud'],
    linkedMdFiles: ['docs/crm-testing.md', 'docs/oportunidades-crud.md'],
    attachedDocuments: [
      {
        name: 'plan-integracion-metricas.md',
        path: 'uploads/plan-integracion-metricas.md',
        type: 'text/markdown'
      }
    ],
    order: 1
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
    order: 2
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
    order: 3
  },
  {
    title: 'Tests Auditorías: Registrar hallazgos',
    description: 'Tests para crear, editar y asociar hallazgos a auditorías',
    module: 'auditorias',
    status: 'todo',
    priority: 'medium',
    type: 'testing',
    assignedTo: 'ia',
    estimatedDays: 2,
    phase: 'v6.1',
    tags: ['auditorias', 'hallazgos'],
    order: 4
  },
  {
    title: 'Tests Procesos: ABM básico',
    description: 'Tests de alta, baja y modificación de procesos',
    module: 'procesos',
    status: 'backlog',
    priority: 'medium',
    type: 'abm',
    abmType: 'create',
    assignedTo: 'team',
    estimatedDays: 2,
    phase: 'v6.1',
    tags: ['procesos', 'abm'],
    order: 5
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
    order: 6
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
    order: 7
  },
  {
    title: 'Documentar API con Swagger',
    description: 'Generar especificación OpenAPI y UI interactiva',
    module: 'general',
    status: 'backlog',
    priority: 'medium',
    type: 'documentation',
    assignedTo: 'developer',
    estimatedDays: 2,
    phase: 'v6.1',
    tags: ['api', 'swagger', 'docs'],
    order: 8
  },

  // ========== FASE v6.5 - INTEGRACIÓN ==========
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
    order: 1
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
    order: 2
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
    order: 3
  },
  {
    title: 'Tests de integración con Supertest',
    description: 'Tests de API endpoints y base de datos',
    module: 'testing',
    status: 'backlog',
    priority: 'high',
    type: 'testing',
    assignedTo: 'developer',
    estimatedDays: 4,
    phase: 'v6.5',
    tags: ['testing', 'integration', 'api'],
    order: 4
  },
  {
    title: 'Tests de accesibilidad con Axe',
    description: 'Validar WCAG 2.1 AA en todos los módulos',
    module: 'testing',
    status: 'backlog',
    priority: 'medium',
    type: 'testing',
    assignedTo: 'ia',
    estimatedDays: 3,
    phase: 'v6.5',
    tags: ['accessibility', 'wcag'],
    order: 5
  },
  {
    title: 'Portal Docusaurus',
    description: 'Migrar documentación a Docusaurus con búsqueda y versionado',
    module: 'general',
    status: 'backlog',
    priority: 'medium',
    type: 'documentation',
    assignedTo: 'developer',
    estimatedDays: 4,
    phase: 'v6.5',
    tags: ['docs', 'docusaurus'],
    order: 6
  },

  // ========== FASE v7.0 - OPTIMIZACIÓN ==========
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
    order: 1
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
    order: 2
  },
  {
    title: 'Event Sourcing para auditoría',
    description: 'Trazabilidad completa de cambios con event sourcing',
    module: 'auditorias',
    status: 'backlog',
    priority: 'medium',
    type: 'feature',
    assignedTo: 'developer',
    estimatedDays: 6,
    phase: 'v7.0',
    tags: ['event-sourcing', 'audit'],
    order: 3
  },
  {
    title: 'RBAC granular',
    description: 'Sistema de permisos dinámicos por recurso y acción',
    module: 'general',
    status: 'backlog',
    priority: 'high',
    type: 'feature',
    assignedTo: 'developer',
    estimatedDays: 4,
    phase: 'v7.0',
    tags: ['rbac', 'permissions', 'security'],
    order: 4
  },
  {
    title: 'MongoDB Replica Set',
    description: 'Configurar réplicas para alta disponibilidad',
    module: 'general',
    status: 'backlog',
    priority: 'high',
    type: 'improvement',
    assignedTo: 'developer',
    estimatedDays: 3,
    phase: 'v7.0',
    tags: ['mongodb', 'ha', 'database'],
    order: 5
  },
  {
    title: 'Testing visual con Percy',
    description: 'Screenshot regression y tests cross-browser',
    module: 'testing',
    status: 'backlog',
    priority: 'low',
    type: 'testing',
    assignedTo: 'developer',
    estimatedDays: 3,
    phase: 'v7.0',
    tags: ['visual-testing', 'percy'],
    order: 6
  },
  {
    title: 'Blue-Green Deployment',
    description: 'Deploy sin downtime con Kubernetes',
    module: 'general',
    status: 'backlog',
    priority: 'medium',
    type: 'feature',
    assignedTo: 'developer',
    estimatedDays: 4,
    phase: 'v7.0',
    tags: ['deployment', 'kubernetes'],
    order: 7
  },

  // ========== FASE v8.0 - INNOVACIÓN ==========
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
    order: 1
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
    order: 2
  },
  {
    title: 'Predicción de fallos',
    description: 'Modelo predictivo para mantenimiento preventivo',
    module: 'general',
    status: 'backlog',
    priority: 'low',
    type: 'feature',
    assignedTo: 'ia',
    estimatedDays: 12,
    phase: 'v8.0',
    tags: ['ai', 'predictive', 'maintenance'],
    order: 3
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
    order: 4
  },
  {
    title: 'Integración Slack/Teams',
    description: 'Notificaciones y alertas en tiempo real',
    module: 'general',
    status: 'backlog',
    priority: 'low',
    type: 'feature',
    assignedTo: 'developer',
    estimatedDays: 3,
    phase: 'v8.0',
    tags: ['integration', 'slack', 'teams'],
    order: 5
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
    order: 6
  },

  // ========== BUGS Y MEJORAS ==========
  {
    title: 'Fix: Error en filtro de auditorías',
    description: 'Resolver bug en filtro por fecha de auditorías',
    module: 'auditorias',
    status: 'in_progress',
    priority: 'high',
    type: 'bug',
    assignedTo: 'developer',
    estimatedDays: 1,
    phase: 'v6.1',
    tags: ['bug', 'filter'],
    order: 10
  },
  {
    title: 'Mejora UX: Feedback visual en formularios',
    description: 'Agregar estados de loading y success en todos los formularios',
    module: 'general',
    status: 'review',
    priority: 'low',
    type: 'improvement',
    assignedTo: 'developer',
    estimatedDays: 2,
    phase: 'v6.1',
    tags: ['ux', 'forms'],
    order: 11
  }
];

export async function seedRoadmapTasks(organizationId: string = 'org-default') {
  try {
    // Limpiar tareas existentes de esta organización
    await RoadmapTask.deleteMany({ organization_id: organizationId });

    // Función para generar número único de tarea
    const generateTaskNumber = (index: number) => {
      const year = new Date().getFullYear();
      return `TASK-${year}-${String(index + 1).padStart(4, '0')}`;
    };

    // Insertar tareas de ejemplo
    const tasksWithOrg = sampleTasks.map((task, index) => ({
      ...task,
      organization_id: organizationId,
      taskNumber: generateTaskNumber(index),
      createdBy: 'seeder',
      isActive: true,
      linkedMdFiles: task.linkedMdFiles || [],
      attachedDocuments: task.attachedDocuments || []
    }));

    await RoadmapTask.insertMany(tasksWithOrg);

    console.log(`✅ Seeded ${tasksWithOrg.length} roadmap tasks for organization: ${organizationId}`);
    return { success: true, count: tasksWithOrg.length };
  } catch (error) {
    console.error('❌ Error seeding roadmap tasks:', error);
    throw error;
  }
}

// Script para ejecutar directamente
if (require.main === module) {
  const mongoose = require('mongoose');
  require('dotenv').config();

  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI no está definida en .env');
    process.exit(1);
  }

  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log('📦 Connected to MongoDB Atlas');
      const orgId = process.argv[2] || 'org-default';
      await seedRoadmapTasks(orgId);
      await mongoose.disconnect();
      console.log('👋 Disconnected from MongoDB');
      process.exit(0);
    })
    .catch((error: Error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

