// Contexto completo del proyecto ISO 9001 App v6
// Para que Don Plácido tenga información completa del sistema

export const contextoProyectoCompleto = {
  // Información general del proyecto
  proyecto: {
    nombre: 'ISO 9001 App v6',
    version: '6.0.0',
    descripcion: 'Sistema integral de gestión de calidad ISO 9001',
    objetivo: 'Automatizar y digitalizar todos los procesos de gestión de calidad según norma ISO 9001:2015',
    estado: 'En desarrollo activo',
    fechaInicio: '2024-01-01',
    fechaObjetivo: '2024-12-31'
  },

  // Arquitectura del sistema
  arquitectura: {
    frontend: 'Next.js 14 + React + TypeScript + Tailwind CSS',
    backend: 'Node.js + Express + TypeScript + MongoDB',
    baseDatos: 'MongoDB con Mongoose',
    autenticacion: 'JWT + Roles y permisos',
    ia: 'Claude API (Anthropic) + Contexto dinámico',
    ui: 'Shadcn/UI + Lucide React + Framer Motion'
  },

  // Módulos implementados
  modulosImplementados: [
    {
      id: 'rrhh',
      nombre: 'Recursos Humanos',
      estado: 'implementado',
      progreso: 85,
      funcionalidades: [
        'Gestión de Personal',
        'Departamentos',
        'Puestos de Trabajo',
        'Evaluaciones de Desempeño',
        'Capacitaciones',
        'Clima Laboral',
        'Ausencias',
        'Reclutamiento'
      ],
      rutas: ['/rrhh', '/rrhh/personal', '/rrhh/departamentos', '/rrhh/puestos'],
      apis: ['/api/rrhh/personal', '/api/rrhh/departamentos', '/api/rrhh/puestos']
    },
    {
      id: 'procesos',
      nombre: 'Procesos',
      estado: 'implementado',
      progreso: 92,
      funcionalidades: [
        'Definiciones de Procesos',
        'Registros de Procesos',
        'Objetivos de Calidad',
        'Indicadores de Calidad',
        'Mediciones',
        'Vista Unificada con Tabs'
      ],
      rutas: ['/procesos', '/procesos/[id]', '/procesos/nuevo'],
      apis: ['/api/processes/definitions', '/api/processes/records']
    },
    {
      id: 'mejoras',
      nombre: 'Sistema de Mejoras',
      estado: 'implementado',
      progreso: 78,
      funcionalidades: [
        'Auditorías Internas',
        'Hallazgos',
        'Acciones Correctivas',
        'Acciones Preventivas',
        'Seguimiento',
        'Mejora Continua'
      ],
      rutas: ['/auditorias', '/hallazgos', '/acciones'],
      apis: ['/api/audits', '/api/hallazgos', '/api/acciones']
    },
    {
      id: 'normas',
      nombre: 'Puntos de Norma',
      estado: 'implementado',
      progreso: 65,
      funcionalidades: [
        'Cláusulas ISO 9001',
        'Evaluaciones',
        'Hallazgos Normativos',
        'Plan de Cumplimiento',
        'Documentación',
        'Control de Versiones'
      ],
      rutas: ['/normas', '/normas/evaluaciones', '/normas/hallazgos'],
      apis: ['/api/normas', '/api/normas/evaluaciones']
    },
    {
      id: 'crm',
      nombre: 'CRM y Satisfacción',
      estado: 'implementado',
      progreso: 70,
      funcionalidades: [
        'Gestión de Clientes',
        'Análisis de Riesgo de Clientes',
        'Oportunidades',
        'Actividades',
        'Productos',
        'Satisfacción del Cliente'
      ],
      rutas: ['/crm', '/crm/clientes', '/crm/analisis-riesgo'],
      apis: ['/api/crm/clientes', '/api/crm/oportunidades']
    }
  ],

  // Módulos pendientes
  modulosPendientes: [
    {
      id: 'calidad',
      nombre: 'Calidad (Gerencia)',
      estado: 'pendiente',
      progreso: 25,
      funcionalidades: [
        'Dashboard Ejecutivo',
        'Indicadores Estratégicos',
        'Revisión por Dirección',
        'Política de Calidad',
        'Objetivos Estratégicos',
        'Certificación ISO'
      ]
    },
    {
      id: 'superadmin',
      nombre: 'Super Admin',
      estado: 'pendiente',
      progreso: 0,
      funcionalidades: [
        'Gestión de Usuarios',
        'Roles y Permisos',
        'Sistemas Tenant',
        'Configuración Global',
        'Logs del Sistema',
        'Backup y Restauración'
      ]
    }
  ],

  // Base de conocimiento ISO 9001
  conocimientoISO: {
    clausulas: {
      '4': 'Contexto de la organización',
      '5': 'Liderazgo',
      '6': 'Planificación',
      '7': 'Soporte',
      '8': 'Operación',
      '9': 'Evaluación del desempeño',
      '10': 'Mejora'
    },
    principios: [
      'Enfoque al cliente',
      'Liderazgo',
      'Compromiso de las personas',
      'Enfoque basado en procesos',
      'Mejora',
      'Toma de decisiones basada en evidencia',
      'Gestión de las relaciones'
    ],
    requisitos: [
      'Sistema de gestión de la calidad',
      'Responsabilidad de la dirección',
      'Gestión de recursos',
      'Realización del producto',
      'Medición, análisis y mejora'
    ]
  },

  // Flujos de trabajo principales
  flujosTrabajo: [
    {
      nombre: 'Gestión de Procesos',
      descripcion: 'Definir → Registrar → Medir → Mejorar',
      pasos: [
        'Crear definición de proceso',
        'Configurar etapas y campos',
        'Registrar actividades',
        'Definir objetivos e indicadores',
        'Realizar mediciones',
        'Analizar y mejorar'
      ]
    },
    {
      nombre: 'Gestión de Hallazgos',
      descripcion: 'Identificar → Analizar → Actuar → Verificar',
      pasos: [
        'Identificar hallazgo en auditoría',
        'Clasificar severidad y tipo',
        'Asignar responsable',
        'Crear plan de acción',
        'Ejecutar acciones',
        'Verificar efectividad'
      ]
    },
    {
      nombre: 'Gestión de Personal',
      descripcion: 'Reclutar → Evaluar → Capacitar → Desarrollar',
      pasos: [
        'Definir puesto y competencias',
        'Reclutar candidatos',
        'Evaluar desempeño',
        'Planificar capacitaciones',
        'Desarrollar competencias',
        'Medir satisfacción'
      ]
    }
  ],

  // Integraciones y APIs
  integraciones: {
    claude: {
      api: 'https://api.anthropic.com/v1/messages',
      modelo: 'claude-3-sonnet-20240229',
      contexto: 'ISO 9001, gestión de calidad, procesos organizacionales'
    },
    baseDatos: {
      tipo: 'MongoDB',
      colecciones: [
        'processes', 'personnel', 'departments', 'positions',
        'audits', 'hallazgos', 'acciones', 'quality_objectives',
        'quality_indicators', 'crm_clientes', 'crm_oportunidades'
      ]
    }
  },

  // Métricas del proyecto
  metricas: {
    modulosImplementados: 4,
    modulosTotal: 8,
    funcionalidadesImplementadas: 32,
    funcionalidadesTotal: 48,
    progresoGeneral: 69,
    estadoGeneral: 'Bueno'
  },

  // Roadmap futuro
  roadmap: {
    q1_2024: ['Completar módulo de Calidad', 'Implementar Super Admin'],
    q2_2024: ['Sistema de notificaciones', 'Reportes avanzados'],
    q3_2024: ['Integración con ERP', 'Mobile app'],
    q4_2024: ['Certificación ISO', 'Multi-idioma']
  }
};

// Función para obtener contexto específico por módulo
export function obtenerContextoModulo(modulo: string) {
  const moduloInfo = contextoProyectoCompleto.modulosImplementados.find(m => m.id === modulo);
  return moduloInfo || null;
}

// Función para obtener contexto de IA
export function obtenerContextoIA(usuario: any, modulo: string) {
  return {
    proyecto: contextoProyectoCompleto.proyecto,
    modulo: obtenerContextoModulo(modulo),
    usuario: usuario,
    conocimiento: contextoProyectoCompleto.conocimientoISO,
    metricas: contextoProyectoCompleto.metricas
  };
}
