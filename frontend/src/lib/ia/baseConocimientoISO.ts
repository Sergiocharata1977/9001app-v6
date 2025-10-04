/**
 * Base de Conocimiento ISO 9001 para DON CANDIDOS
 * TODO: Conectar con MongoDB para obtener datos reales de NormPoint
 */

export interface ClausulaISO {
  codigo: string;
  titulo: string;
  descripcion: string;
  requisitos: string[];
  evidencias?: string[];
  ejemplos?: string[];
}

export interface BaseConocimientoISO {
  clausulas: Record<string, ClausulaISO>;
  mejoresPracticas: {
    auditoria: string[];
    documentacion: string[];
    mejoraContinua: string[];
    gestionProcesos: string[];
  };
}

// Base de conocimiento estática (fallback)
// TODO: Reemplazar con consulta a MongoDB
export const baseConocimientoISO: BaseConocimientoISO = {
  clausulas: {
    '4': {
      codigo: '4',
      titulo: 'Contexto de la organización',
      descripcion: 'La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y que afectan su capacidad para lograr los resultados previstos de su sistema de gestión de la calidad.',
      requisitos: [
        'Entender la organización y su contexto (4.1)',
        'Entender las necesidades y expectativas de las partes interesadas (4.2)',
        'Determinar el alcance del sistema de gestión de la calidad (4.3)',
        'Sistema de gestión de la calidad y sus procesos (4.4)'
      ],
      ejemplos: [
        'Análisis FODA de la organización',
        'Matriz de partes interesadas',
        'Documento de alcance del SGC'
      ]
    },
    '5': {
      codigo: '5',
      titulo: 'Liderazgo',
      descripcion: 'El liderazgo y el compromiso de la alta dirección son esenciales para el establecimiento y mantenimiento de un sistema de gestión de la calidad.',
      requisitos: [
        'Liderazgo y compromiso (5.1)',
        'Política de calidad (5.2)',
        'Roles, responsabilidades y autoridades en la organización (5.3)'
      ],
      ejemplos: [
        'Política de calidad aprobada por la dirección',
        'Organigrama con responsabilidades definidas',
        'Actas de revisión por la dirección'
      ]
    },
    '6': {
      codigo: '6',
      titulo: 'Planificación',
      descripcion: 'La organización debe planificar las acciones para abordar los riesgos y oportunidades, y lograr los objetivos de calidad.',
      requisitos: [
        'Acciones para abordar riesgos y oportunidades (6.1)',
        'Objetivos de calidad y planificación para lograrlos (6.2)',
        'Planificación de los cambios (6.3)'
      ],
      ejemplos: [
        'Matriz de riesgos y oportunidades',
        'Plan de objetivos de calidad con metas SMART',
        'Procedimiento de gestión del cambio'
      ]
    },
    '7': {
      codigo: '7',
      titulo: 'Apoyo',
      descripcion: 'La organización debe determinar y proporcionar los recursos necesarios para establecer, implementar, mantener y mejorar el sistema de gestión de la calidad.',
      requisitos: [
        'Recursos (7.1)',
        'Competencia (7.2)',
        'Conciencia (7.3)',
        'Comunicación (7.4)',
        'Información documentada (7.5)'
      ],
      ejemplos: [
        'Matriz de competencias del personal',
        'Plan de capacitación anual',
        'Lista maestra de documentos'
      ]
    },
    '8': {
      codigo: '8',
      titulo: 'Operación',
      descripcion: 'La organización debe planificar, implementar y controlar los procesos necesarios para cumplir con los requisitos para la provisión de productos y servicios.',
      requisitos: [
        'Planificación y control operacional (8.1)',
        'Requisitos para los productos y servicios (8.2)',
        'Diseño y desarrollo de productos y servicios (8.3)',
        'Control de proveedores externos (8.4)',
        'Producción y provisión del servicio (8.5)',
        'Liberación de productos y servicios (8.6)',
        'Control de salidas no conformes (8.7)'
      ],
      ejemplos: [
        'Procedimientos operativos estándar (SOP)',
        'Plan de control de calidad',
        'Evaluación de proveedores'
      ]
    },
    '9': {
      codigo: '9',
      titulo: 'Evaluación del desempeño',
      descripcion: 'La organización debe evaluar el desempeño y la eficacia de su sistema de gestión de la calidad.',
      requisitos: [
        'Seguimiento, medición, análisis y evaluación (9.1)',
        'Auditoría interna (9.2)',
        'Revisión por la dirección (9.3)'
      ],
      ejemplos: [
        'Dashboard de indicadores de calidad',
        'Programa de auditorías internas',
        'Acta de revisión por la dirección'
      ]
    },
    '10': {
      codigo: '10',
      titulo: 'Mejora',
      descripcion: 'La organización debe mejorar continuamente la conveniencia, adecuación y eficacia de su sistema de gestión de la calidad.',
      requisitos: [
        'Generalidades (10.1)',
        'No conformidades y acciones correctivas (10.2)',
        'Mejora continua (10.3)'
      ],
      ejemplos: [
        'Registro de no conformidades y acciones correctivas',
        'Plan de mejora continua',
        'Análisis de causa raíz (5 Por qués, Ishikawa)'
      ]
    }
  },
  mejoresPracticas: {
    auditoria: [
      'Planificar la auditoría con objetivos claros y alcance definido',
      'Revisar documentación antes de la auditoría (preparación)',
      'Entrevistar al personal en su lugar de trabajo',
      'Observar los procesos en acción (evidencia objetiva)',
      'Documentar hallazgos con evidencia verificable',
      'Realizar reunión de cierre con el auditado',
      'Hacer seguimiento a las acciones correctivas'
    ],
    documentacion: [
      'Mantener documentos actualizados y en versiones controladas',
      'Controlar acceso y distribución de documentos',
      'Revisar periódicamente la documentación (al menos anualmente)',
      'Asegurar que los documentos estén disponibles donde se necesiten',
      'Utilizar formato estándar para procedimientos',
      'Incluir registros como evidencia de conformidad'
    ],
    mejoraContinua: [
      'Aplicar ciclo PDCA (Planificar-Hacer-Verificar-Actuar)',
      'Analizar datos de indicadores mensualmente',
      'Implementar mejoras pequeñas frecuentes (Kaizen)',
      'Involucrar al personal en la identificación de mejoras',
      'Documentar lecciones aprendidas',
      'Compartir mejores prácticas entre áreas'
    ],
    gestionProcesos: [
      'Definir claramente entradas, actividades y salidas del proceso',
      'Asignar responsables para cada proceso',
      'Establecer criterios de medición y control',
      'Documentar procedimientos críticos',
      'Revisar eficacia del proceso periódicamente',
      'Identificar y gestionar riesgos del proceso'
    ]
  }
};

/**
 * Obtener cláusula específica de ISO 9001
 * TODO: Consultar desde MongoDB NormPoint
 */
export async function obtenerClausulaISO(codigo: string): Promise<ClausulaISO | null> {
  // TODO: Implementar consulta a MongoDB
  // const clausula = await NormPoint.findOne({ code: codigo });
  // return clausula;
  
  return baseConocimientoISO.clausulas[codigo] || null;
}

/**
 * Buscar cláusulas por palabra clave
 * TODO: Consultar desde MongoDB con búsqueda de texto
 */
export async function buscarClausulas(palabraClave: string): Promise<ClausulaISO[]> {
  // TODO: Implementar búsqueda en MongoDB
  // const clausulas = await NormPoint.find({ $text: { $search: palabraClave } });
  
  const palabraLower = palabraClave.toLowerCase();
  return Object.values(baseConocimientoISO.clausulas).filter(clausula =>
    clausula.titulo.toLowerCase().includes(palabraLower) ||
    clausula.descripcion.toLowerCase().includes(palabraLower)
  );
}

/**
 * Obtener mejores prácticas por categoría
 */
export function obtenerMejoresPracticas(categoria: keyof BaseConocimientoISO['mejoresPracticas']): string[] {
  return baseConocimientoISO.mejoresPracticas[categoria] || [];
}


