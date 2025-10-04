import { NormPoint } from './models/NormPoint';
import mongoose from 'mongoose';

const iso9001NormPoints = [
  // CAPÍTULO 4 - CONTEXTO DE LA ORGANIZACIÓN
  {
    code: '4.1',
    title: 'Comprensión de la organización y de su contexto',
    chapter: 4,
    section: '4.1',
    category: 'contexto',
    requirements: 'La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y que afectan a su capacidad para lograr los resultados previstos de su sistema de gestión de la calidad.',
    guidance: 'Debe considerar cuestiones como: condiciones legales, tecnológicas, competitivas, del mercado, culturales, sociales y económicas, ya sean internacionales, nacionales, regionales o locales.',
    keywords: ['contexto', 'organización', 'externo', 'interno', 'entorno'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '4.2',
    title: 'Comprensión de las necesidades y expectativas de las partes interesadas',
    chapter: 4,
    section: '4.2',
    category: 'contexto',
    requirements: 'La organización debe determinar: a) las partes interesadas que son pertinentes al sistema de gestión de la calidad; b) los requisitos de estas partes interesadas que son pertinentes al sistema de gestión de la calidad.',
    guidance: 'Las partes interesadas pueden incluir: clientes, proveedores, empleados, accionistas, sociedad, reguladores, etc.',
    keywords: ['partes interesadas', 'stakeholders', 'requisitos', 'expectativas'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '4.3',
    title: 'Determinación del alcance del sistema de gestión de la calidad',
    chapter: 4,
    section: '4.3',
    category: 'contexto',
    requirements: 'La organización debe determinar los límites y aplicabilidad de su sistema de gestión de la calidad para establecer su alcance.',
    guidance: 'El alcance debe incluir los productos, servicios y procesos incluidos en el sistema de gestión de la calidad.',
    keywords: ['alcance', 'aplicabilidad', 'límites', 'productos', 'servicios'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '4.4',
    title: 'Sistema de gestión de la calidad y sus procesos',
    chapter: 4,
    section: '4.4',
    category: 'contexto',
    requirements: 'La organización debe establecer, implementar, mantener y mejorar continuamente un sistema de gestión de la calidad, incluyendo los procesos necesarios y sus interacciones.',
    guidance: 'Debe determinar los procesos necesarios, establecer criterios y métodos, proporcionar recursos, etc.',
    keywords: ['sistema de gestión', 'procesos', 'interacciones', 'mejora continua'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '4.4.1',
    title: 'Generalidades del sistema de gestión de la calidad',
    chapter: 4,
    section: '4.4.1',
    category: 'contexto',
    requirements: 'La organización debe establecer, implementar, mantener y mejorar continuamente un sistema de gestión de la calidad, incluidos los procesos necesarios y sus interacciones.',
    guidance: 'Debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización.',
    keywords: ['sistema de gestión', 'procesos', 'interacciones', 'aplicación'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '4.4.2',
    title: 'Información documentada del sistema de gestión',
    chapter: 4,
    section: '4.4.2',
    category: 'contexto',
    requirements: 'La organización debe mantener información documentada para apoyar la operación de sus procesos y conservar información documentada para tener la confianza de que los procesos se realizan según lo planificado.',
    guidance: 'La información documentada puede estar en cualquier formato y medio, y puede provenir de cualquier fuente.',
    keywords: ['información documentada', 'procesos', 'operación', 'planificación'],
    is_mandatory: true,
    priority: 'alta'
  },

  // CAPÍTULO 5 - LIDERAZGO
  {
    code: '5.1',
    title: 'Liderazgo y compromiso',
    chapter: 5,
    section: '5.1',
    category: 'liderazgo',
    requirements: 'La alta dirección debe demostrar liderazgo y compromiso con el sistema de gestión de la calidad mediante: a) responsabilidad y autoridad; b) establecimiento de la política y objetivos; c) promoción de la mejora; d) apoyo a otros roles de dirección.',
    guidance: 'El liderazgo debe ser visible y promover una cultura de calidad en toda la organización.',
    keywords: ['liderazgo', 'compromiso', 'alta dirección', 'cultura de calidad'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '5.1.1',
    title: 'Generalidades del liderazgo y compromiso',
    chapter: 5,
    section: '5.1.1',
    category: 'liderazgo',
    requirements: 'La alta dirección debe demostrar liderazgo y compromiso con respecto al sistema de gestión de la calidad asumiendo la responsabilidad y obligación de rendir cuentas con relación a la eficacia del sistema de gestión de la calidad.',
    guidance: 'La alta dirección debe asegurar que se establezcan la política de la calidad y los objetivos de la calidad para el sistema de gestión de la calidad.',
    keywords: ['liderazgo', 'compromiso', 'responsabilidad', 'eficacia'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '5.1.2',
    title: 'Enfoque al cliente',
    chapter: 5,
    section: '5.1.2',
    category: 'liderazgo',
    requirements: 'La alta dirección debe demostrar liderazgo y compromiso con respecto al enfoque al cliente asegurándose de que: a) se determinen, se comprendan y se cumplan regularmente los requisitos del cliente y los legales y reglamentarios aplicables; b) se determinen y se consideren los riesgos y oportunidades que pueden afectar a la conformidad de los productos y servicios y a la capacidad de aumentar la satisfacción del cliente; c) se mantenga el enfoque en el aumento de la satisfacción del cliente.',
    guidance: 'El enfoque al cliente debe ser una prioridad estratégica de la organización.',
    keywords: ['enfoque al cliente', 'requisitos del cliente', 'satisfacción', 'conformidad'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '5.2',
    title: 'Política',
    chapter: 5,
    section: '5.2',
    category: 'liderazgo',
    requirements: 'La alta dirección debe establecer, implementar y mantener una política de calidad que: a) sea apropiada para el propósito y contexto; b) proporcione un marco para establecer objetivos; c) incluya un compromiso con el cumplimiento de requisitos; d) incluya un compromiso con la mejora continua.',
    guidance: 'La política debe estar disponible como información documentada y ser comunicada, entendida e implementada.',
    keywords: ['política de calidad', 'objetivos', 'cumplimiento', 'mejora continua'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '5.3',
    title: 'Roles, responsabilidades y autoridades en la organización',
    chapter: 5,
    section: '5.3',
    category: 'liderazgo',
    requirements: 'La alta dirección debe asegurar que las responsabilidades y autoridades para los roles pertinentes al sistema de gestión de la calidad sean asignadas, comunicadas y entendidas dentro de la organización.',
    guidance: 'Debe establecerse una estructura organizacional clara con responsabilidades definidas.',
    keywords: ['roles', 'responsabilidades', 'autoridades', 'estructura organizacional'],
    is_mandatory: true,
    priority: 'alta'
  },

  // CAPÍTULO 6 - PLANIFICACIÓN
  {
    code: '6.1',
    title: 'Acciones para abordar riesgos y oportunidades',
    chapter: 6,
    section: '6.1',
    category: 'planificacion',
    requirements: 'La organización debe planificar acciones para abordar riesgos y oportunidades mediante: a) determinar riesgos y oportunidades; b) planificar acciones; c) integrar y implementar acciones; d) evaluar la efectividad.',
    guidance: 'Debe considerar el contexto de la organización y los requisitos de las partes interesadas.',
    keywords: ['riesgos', 'oportunidades', 'planificación', 'acciones preventivas'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '6.1.1',
    title: 'Generalidades de riesgos y oportunidades',
    chapter: 6,
    section: '6.1.1',
    category: 'planificacion',
    requirements: 'Al planificar el sistema de gestión de la calidad, la organización debe considerar las cuestiones referidas en 4.1 y los requisitos referidos en 4.2 y determinar los riesgos y oportunidades que es necesario abordar.',
    guidance: 'Los riesgos y oportunidades deben estar relacionados con el contexto de la organización y las partes interesadas.',
    keywords: ['riesgos', 'oportunidades', 'contexto', 'partes interesadas'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '6.1.2',
    title: 'Planificación de acciones para abordar riesgos y oportunidades',
    chapter: 6,
    section: '6.1.2',
    category: 'planificacion',
    requirements: 'La organización debe planificar: a) las acciones para abordar estos riesgos y oportunidades; b) la manera de integrar e implementar las acciones en sus procesos del sistema de gestión de la calidad; c) la manera de evaluar la eficacia de estas acciones.',
    guidance: 'Las acciones tomadas para abordar los riesgos y oportunidades deben ser proporcionales al impacto potencial en la conformidad de los productos y servicios.',
    keywords: ['planificación de acciones', 'integración', 'implementación', 'eficacia'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '6.2',
    title: 'Objetivos de la calidad y planificación para lograrlos',
    chapter: 6,
    section: '6.2',
    category: 'planificacion',
    requirements: 'La organización debe establecer objetivos de calidad en niveles pertinentes y planificar cómo lograrlos.',
    guidance: 'Los objetivos deben ser medibles, consistentes con la política de calidad y comunicados.',
    keywords: ['objetivos de calidad', 'planificación', 'metas', 'medibles'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '6.2.1',
    title: 'Objetivos de la calidad',
    chapter: 6,
    section: '6.2.1',
    category: 'planificacion',
    requirements: 'La organización debe establecer objetivos de la calidad para las funciones y niveles pertinentes y los procesos necesarios para el sistema de gestión de la calidad.',
    guidance: 'Los objetivos de la calidad deben: a) ser coherentes con la política de la calidad; b) ser medibles; c) tener en cuenta los requisitos aplicables; d) ser pertinentes para la conformidad de los productos y servicios y para el aumento de la satisfacción del cliente; e) ser objeto de seguimiento; f) comunicarse; g) actualizarse, según corresponda.',
    keywords: ['objetivos de calidad', 'medibles', 'coherentes', 'seguimiento'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '6.2.2',
    title: 'Planificación de las acciones para lograr los objetivos de la calidad',
    chapter: 6,
    section: '6.2.2',
    category: 'planificacion',
    requirements: 'Al planificar cómo lograr sus objetivos de la calidad, la organización debe determinar: a) qué se va a hacer; b) qué recursos se requerirán; c) quién será responsable; d) cuándo se finalizará; e) cómo se evaluarán los resultados.',
    guidance: 'La planificación debe incluir métodos de seguimiento y evaluación del progreso hacia los objetivos.',
    keywords: ['planificación', 'recursos', 'responsabilidades', 'evaluación'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '6.3',
    title: 'Planificación de los cambios',
    chapter: 6,
    section: '6.3',
    category: 'planificacion',
    requirements: 'La organización debe determinar la necesidad de cambios en el sistema de gestión de la calidad y gestionar estos cambios de manera planificada.',
    guidance: 'Los cambios deben ser revisados antes de su implementación para asegurar que no afecten negativamente la calidad.',
    keywords: ['cambios', 'planificación', 'gestión del cambio', 'revisión'],
    is_mandatory: true,
    priority: 'media'
  },

  // CAPÍTULO 7 - APOYO
  {
    code: '7.1',
    title: 'Recursos',
    chapter: 7,
    section: '7.1',
    category: 'apoyo',
    requirements: 'La organización debe determinar y proporcionar los recursos necesarios para establecer, implementar, mantener y mejorar el sistema de gestión de la calidad.',
    guidance: 'Los recursos incluyen personas, infraestructura, entorno de trabajo, equipos de monitoreo, etc.',
    keywords: ['recursos', 'infraestructura', 'equipos', 'entorno de trabajo'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '7.2',
    title: 'Competencia',
    chapter: 7,
    section: '7.2',
    category: 'apoyo',
    requirements: 'La organización debe: a) determinar la competencia necesaria; b) asegurar que el personal sea competente; c) evaluar la efectividad de las acciones tomadas; d) mantener registros apropiados.',
    guidance: 'Debe proporcionar formación, educación y experiencia necesaria para el personal.',
    keywords: ['competencia', 'formación', 'capacitación', 'habilidades'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '7.3',
    title: 'Toma de conciencia',
    chapter: 7,
    section: '7.3',
    category: 'apoyo',
    requirements: 'El personal que realiza trabajos bajo el control de la organización debe estar consciente de: a) la política de calidad; b) su contribución a la efectividad del sistema; c) las implicaciones de no cumplir con los requisitos.',
    guidance: 'Debe promoverse la toma de conciencia a través de comunicación y formación.',
    keywords: ['conciencia', 'política de calidad', 'contribución', 'efectividad'],
    is_mandatory: true,
    priority: 'media'
  },
  {
    code: '7.4',
    title: 'Comunicación',
    chapter: 7,
    section: '7.4',
    category: 'apoyo',
    requirements: 'La organización debe determinar la necesidad de comunicación interna y externa pertinente al sistema de gestión de la calidad.',
    guidance: 'La comunicación debe ser clara, efectiva y promover el entendimiento del sistema de gestión de la calidad.',
    keywords: ['comunicación', 'interna', 'externa', 'efectiva'],
    is_mandatory: true,
    priority: 'media'
  },
  {
    code: '7.5',
    title: 'Información documentada',
    chapter: 7,
    section: '7.5',
    category: 'apoyo',
    requirements: 'El sistema de gestión de la calidad debe incluir: a) información documentada requerida por esta Norma Internacional; b) información documentada determinada por la organización como necesaria.',
    guidance: 'Debe controlarse la creación, actualización, distribución y disposición de la información documentada.',
    keywords: ['información documentada', 'documentos', 'registros', 'control'],
    is_mandatory: true,
    priority: 'alta'
  },

  // CAPÍTULO 8 - OPERACIÓN
  {
    code: '8.1',
    title: 'Planificación y control operacional',
    chapter: 8,
    section: '8.1',
    category: 'operacion',
    requirements: 'La organización debe planificar, implementar y controlar los procesos necesarios para cumplir con los requisitos de los productos y servicios.',
    guidance: 'Debe considerar los requisitos de los clientes, legales y otros aplicables.',
    keywords: ['planificación operacional', 'control', 'procesos', 'requisitos'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '8.2',
    title: 'Requisitos para los productos y servicios',
    chapter: 8,
    section: '8.2',
    category: 'operacion',
    requirements: 'La organización debe establecer requisitos para los productos y servicios mediante: a) determinación de requisitos especificados por el cliente; b) determinación de requisitos no expresados; c) requisitos legales y regulatorios; d) otros requisitos.',
    guidance: 'Debe asegurarse que los requisitos sean definidos, documentados y comunicados.',
    keywords: ['requisitos', 'productos', 'servicios', 'clientes'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '8.3',
    title: 'Diseño y desarrollo de los productos y servicios',
    chapter: 8,
    section: '8.3',
    category: 'operacion',
    requirements: 'La organización debe establecer, implementar y mantener un proceso de diseño y desarrollo que sea apropiado para asegurar productos y servicios que cumplan con los requisitos especificados.',
    guidance: 'Incluye planificación, entradas, controles, salidas, cambios y revisión.',
    keywords: ['diseño', 'desarrollo', 'productos', 'servicios'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '8.4',
    title: 'Control de los procesos, productos y servicios suministrados externamente',
    chapter: 8,
    section: '8.4',
    category: 'operacion',
    requirements: 'La organización debe asegurar que los procesos, productos y servicios suministrados externamente cumplan con los requisitos especificados.',
    guidance: 'Incluye selección de proveedores, verificación de productos y servicios, etc.',
    keywords: ['control externo', 'proveedores', 'suministros', 'verificación'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '8.5',
    title: 'Producción y provisión del servicio',
    chapter: 8,
    section: '8.5',
    category: 'operacion',
    requirements: 'La organización debe implementar controles de producción y servicio para asegurar que se cumplan los requisitos de producción y provisión de servicio.',
    guidance: 'Incluye control de cambios, validación, identificación y trazabilidad.',
    keywords: ['producción', 'servicio', 'controles', 'validación'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '8.6',
    title: 'Liberación de los productos y servicios',
    chapter: 8,
    section: '8.6',
    category: 'operacion',
    requirements: 'La organización debe implementar controles planificados para verificar que se cumplan los criterios de liberación de productos y servicios.',
    guidance: 'Solo se liberan productos y servicios que cumplan con los requisitos especificados.',
    keywords: ['liberación', 'productos', 'servicios', 'verificación'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '8.7',
    title: 'Control de las salidas no conformes',
    chapter: 8,
    section: '8.7',
    category: 'operacion',
    requirements: 'La organización debe asegurar que las salidas que no cumplan con sus requisitos sean identificadas y controladas para prevenir su uso o entrega no intencional.',
    guidance: 'Incluye corrección, segregación, retorno, suspensión, etc.',
    keywords: ['no conformes', 'control', 'corrección', 'prevención'],
    is_mandatory: true,
    priority: 'alta'
  },

  // CAPÍTULO 9 - EVALUACIÓN DEL DESEMPEÑO
  {
    code: '9.1',
    title: 'Seguimiento, medición, análisis y evaluación',
    chapter: 9,
    section: '9.1',
    category: 'evaluacion',
    requirements: 'La organización debe determinar: a) qué necesita ser monitoreado y medido; b) los métodos para monitoreo, medición, análisis y evaluación; c) cuándo se realizarán; d) quién los realizará.',
    guidance: 'Debe evaluar el desempeño del sistema de gestión de la calidad y la efectividad de las acciones tomadas.',
    keywords: ['seguimiento', 'medición', 'análisis', 'evaluación'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '9.2',
    title: 'Auditoría interna',
    chapter: 9,
    section: '9.2',
    category: 'evaluacion',
    requirements: 'La organización debe realizar auditorías internas a intervalos planificados para proporcionar información sobre si el sistema de gestión de la calidad: a) cumple con los requisitos; b) es implementado y mantenido efectivamente.',
    guidance: 'Las auditorías deben ser objetivas, imparciales y realizadas por personal competente.',
    keywords: ['auditoría interna', 'intervalos planificados', 'objetiva', 'imparcial'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '9.3',
    title: 'Revisión por la dirección',
    chapter: 9,
    section: '9.3',
    category: 'evaluacion',
    requirements: 'La alta dirección debe revisar el sistema de gestión de la calidad a intervalos planificados para asegurar su conveniencia, adecuación y efectividad continuas.',
    guidance: 'La revisión debe incluir cambios en el contexto, retroalimentación de clientes, desempeño de procesos, etc.',
    keywords: ['revisión por la dirección', 'intervalos planificados', 'efectividad', 'conveniencia'],
    is_mandatory: true,
    priority: 'alta'
  },

  // CAPÍTULO 10 - MEJORA
  {
    code: '10.1',
    title: 'Generalidades',
    chapter: 10,
    section: '10.1',
    category: 'mejora',
    requirements: 'La organización debe determinar y seleccionar oportunidades de mejora y implementar acciones necesarias para lograr los resultados previstos.',
    guidance: 'La mejora debe ser un objetivo continuo de la organización.',
    keywords: ['mejora', 'oportunidades', 'acciones', 'resultados'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '10.2',
    title: 'No conformidad y acción correctiva',
    chapter: 10,
    section: '10.2',
    category: 'mejora',
    requirements: 'La organización debe reaccionar ante no conformidades y: a) tomar acciones para controlar y corregir; b) tratar las causas; c) evaluar la necesidad de acciones para eliminar las causas; d) implementar acciones; e) revisar la efectividad.',
    guidance: 'Las acciones correctivas deben ser apropiadas para la magnitud de los problemas encontrados.',
    keywords: ['no conformidad', 'acción correctiva', 'causas', 'efectividad'],
    is_mandatory: true,
    priority: 'alta'
  },
  {
    code: '10.3',
    title: 'Mejora continua',
    chapter: 10,
    section: '10.3',
    category: 'mejora',
    requirements: 'La organización debe mejorar continuamente la conveniencia, adecuación y efectividad del sistema de gestión de la calidad mediante el uso de: a) política de calidad; b) objetivos de calidad; c) resultados de auditorías; d) análisis de datos; e) acciones correctivas; f) revisión por la dirección.',
    guidance: 'La mejora continua debe ser un proceso sistemático y proactivo.',
    keywords: ['mejora continua', 'conveniencia', 'adecuación', 'efectividad'],
    is_mandatory: true,
    priority: 'alta'
  }
];

export async function seedNormPoints() {
  try {
    console.log('🌱 Iniciando seeding de puntos de norma ISO 9001...');

    // Verificar si ya existen puntos de norma
    const existingCount = await NormPoint.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Ya existen ${existingCount} puntos de norma. Skipping seeding.`);
      return;
    }

    // Crear un usuario dummy para created_by (esto debería ser reemplazado por un usuario real)
    const dummyUserId = new mongoose.Types.ObjectId();

    // Preparar los datos con created_by
    const normPointsWithUser = iso9001NormPoints.map(point => ({
      ...point,
      created_by: dummyUserId,
      version: 'ISO 9001:2015'
    }));

    // Insertar los puntos de norma
    const insertedPoints = await NormPoint.insertMany(normPointsWithUser);

    console.log(`✅ Seeding completado exitosamente. Insertados ${insertedPoints.length} puntos de norma.`);

    // Mostrar resumen por capítulo
    const chapterSummary = await NormPoint.aggregate([
      { $group: { _id: '$chapter', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('📊 Resumen por capítulo:');
    chapterSummary.forEach(chapter => {
      console.log(`  Capítulo ${chapter._id}: ${chapter.count} puntos`);
    });

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    throw error;
  }
}

// Función para ejecutar el seeding si se ejecuta directamente
if (require.main === module) {
  require('dotenv').config();
  const { connectDB } = require('./config/database');

  connectDB()
    .then(() => seedNormPoints())
    .then(() => {
      console.log('🎉 Seeding completado exitosamente');
      process.exit(0);
    })
    .catch((error: unknown) => {
      console.error('💥 Error en seeding:', error);
      process.exit(1);
    });
}

export default seedNormPoints;