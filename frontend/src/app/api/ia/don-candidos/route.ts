import { NextRequest, NextResponse } from 'next/server';
import { contextoProyectoCompleto, obtenerContextoIA } from '@/lib/ia/contextoProyectoCompleto';

interface ContextoUsuario {
  id: string;
  nombre: string;
  puesto: string;
  departamento: string;
  nivel_experiencia: 'basico' | 'intermedio' | 'avanzado';
  procesos_asignados: string[];
  permisos: string[];
}

interface ContextoProceso {
  modulo: 'rrhh' | 'crm' | 'iso' | 'auditoria';
  seccion: string;
  proceso: string;
  documentos_relacionados: string[];
  clausulas_iso: string[];
}

interface Message {
  tipo: 'user' | 'assistant' | 'system';
  mensaje: string;
  timestamp: Date;
  sugerencias?: string[];
}

// Base de conocimiento ISO 9001
const baseConocimientoISO = {
  clausulas: {
    '4': {
      titulo: 'Contexto de la organización',
      descripcion: 'La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y que afectan su capacidad para lograr los resultados previstos de su sistema de gestión de la calidad.',
      requisitos: ['Entender la organización y su contexto', 'Entender las necesidades y expectativas de las partes interesadas', 'Determinar el alcance del sistema de gestión de la calidad', 'Sistema de gestión de la calidad y sus procesos']
    },
    '5': {
      titulo: 'Liderazgo',
      descripcion: 'El liderazgo y el compromiso de la alta dirección son esenciales para el establecimiento y mantenimiento de un sistema de gestión de la calidad.',
      requisitos: ['Liderazgo y compromiso', 'Política de calidad', 'Roles, responsabilidades y autoridades en la organización']
    },
    '6': {
      titulo: 'Planificación',
      descripcion: 'La organización debe planificar las acciones para abordar los riesgos y oportunidades, y lograr los objetivos de calidad.',
      requisitos: ['Acciones para abordar riesgos y oportunidades', 'Objetivos de calidad y planificación para lograrlos', 'Planificación de los cambios']
    },
    '7': {
      titulo: 'Apoyo',
      descripcion: 'La organización debe determinar y proporcionar los recursos necesarios para establecer, implementar, mantener y mejorar el sistema de gestión de la calidad.',
      requisitos: ['Recursos', 'Competencia', 'Conciencia', 'Comunicación', 'Información documentada']
    },
    '8': {
      titulo: 'Operación',
      descripcion: 'La organización debe planificar, implementar y controlar los procesos necesarios para cumplir con los requisitos para la provisión de productos y servicios.',
      requisitos: ['Planificación y control operacional', 'Requisitos para los productos y servicios', 'Diseño y desarrollo de productos y servicios', 'Control de proveedores externos', 'Producción y provisión del servicio', 'Liberación de productos y servicios', 'Control de salidas no conformes']
    },
    '9': {
      titulo: 'Evaluación del desempeño',
      descripcion: 'La organización debe evaluar el desempeño y la eficacia de su sistema de gestión de la calidad.',
      requisitos: ['Seguimiento, medición, análisis y evaluación', 'Auditoría interna', 'Revisión por la dirección']
    },
    '10': {
      titulo: 'Mejora',
      descripcion: 'La organización debe mejorar continuamente la conveniencia, adecuación y eficacia de su sistema de gestión de la calidad.',
      requisitos: ['Mejora continua', 'No conformidades y acciones correctivas', 'Mejora']
    }
  },
  mejoresPracticas: {
    auditoria: [
      'Planificar la auditoría con objetivos claros',
      'Revisar documentación antes de la auditoría',
      'Entrevistar al personal en su lugar de trabajo',
      'Observar los procesos en acción',
      'Documentar hallazgos con evidencia objetiva'
    ],
    documentacion: [
      'Mantener documentos actualizados',
      'Controlar versiones de documentos',
      'Asegurar accesibilidad de documentos',
      'Revisar periódicamente la documentación'
    ]
  }
};

// Función para construir el prompt contextualizado
function construirPromptDinamico(
  consulta: string,
  contextoUsuario: ContextoUsuario,
  contextoProceso: ContextoProceso,
  historial: Message[]
): string {
  // Obtener contexto completo del proyecto
  const contextoCompleto = obtenerContextoIA(contextoUsuario, contextoProceso.modulo);
  
  const promptBase = `Eres DON CANDIDOS, un asesor experto en ISO 9001 con más de 20 años de experiencia en gestión de calidad.
Tu especialidad es ayudar a los trabajadores con normas de calidad, procesos y mejoras.

CONTEXTO COMPLETO DEL PROYECTO:
- Proyecto: ${contextoCompleto.proyecto.nombre} v${contextoCompleto.proyecto.version}
- Estado: ${contextoCompleto.proyecto.estado}
- Objetivo: ${contextoCompleto.proyecto.objetivo}
- Progreso General: ${contextoCompleto.metricas.progresoGeneral}%

CONTEXTO ACTUAL DEL USUARIO:
- Nombre: ${contextoUsuario.nombre}
- Puesto: ${contextoUsuario.puesto}
- Departamento: ${contextoUsuario.departamento}
- Nivel de experiencia: ${contextoUsuario.nivel_experiencia}
- Procesos asignados: ${contextoUsuario.procesos_asignados.join(', ')}
- Módulo actual: ${contextoProceso.modulo}
- Proceso actual: ${contextoProceso.proceso}
- Sección: ${contextoProceso.seccion}
- Cláusulas ISO relacionadas: ${contextoProceso.clausulas_iso.join(', ')}

MÓDULOS DISPONIBLES EN EL SISTEMA:
${contextoCompleto.modulosImplementados.map(mod => `- ${mod.nombre} (${mod.progreso}%): ${mod.funcionalidades.join(', ')}`).join('\n')}

RESTRICCIONES ESTRICTAS:
- SOLO responde sobre ISO 9001 y gestión de calidad
- NO respondas sobre política, deportes, entretenimiento u otros temas no relacionados
- Mantén un tono profesional pero amigable, como un mentor experimentado
- Usa ejemplos prácticos del trabajo diario
- Siempre referencia cláusulas ISO cuando sea relevante
- Adapta la complejidad de la respuesta al nivel de experiencia del usuario

BASE DE CONOCIMIENTO ISO 9001 (usa esta información para dar respuestas precisas):
${JSON.stringify(baseConocimientoISO, null, 2)}

FORMATO DE RESPUESTA OBLIGATORIO:
1. **Explicación clara y práctica**: Explica el concepto de manera sencilla
2. **Referencia ISO**: Indica la cláusula o requisito específico aplicable
3. **Ejemplo práctico**: Da un ejemplo concreto del trabajo diario
4. **Siguiente paso**: Recomienda qué hacer a continuación

HISTORIAL DE CONVERSACIÓN:
${historial.slice(-5).map(msg => `${msg.tipo.toUpperCase()}: ${msg.mensaje}`).join('\n')}

CONSULTA ACTUAL DEL USUARIO:
${consulta}

RESPUESTA:`;

  return promptBase;
}

// Función para generar sugerencias basadas en el contexto
function generarSugerencias(
  contextoUsuario: ContextoUsuario,
  contextoProceso: ContextoProceso
): string[] {
  const sugerencias: string[] = [];

  // Sugerencias basadas en el puesto
  switch (contextoUsuario.puesto.toLowerCase()) {
    case 'auditor interno':
      sugerencias.push(
        '¿Cómo documentar un hallazgo de auditoría?',
        '¿Qué evidencia necesito para verificar el cumplimiento de la cláusula 8.1?'
      );
      break;
    case 'responsable de proceso':
      sugerencias.push(
        '¿Cómo implementar controles operacionales según la cláusula 8.1?',
        '¿Qué indicadores debo medir en mi proceso?'
      );
      break;
    case 'gerente de calidad':
      sugerencias.push(
        '¿Cómo preparar la revisión por la dirección?',
        '¿Qué métricas de calidad son más importantes?'
      );
      break;
    default:
      sugerencias.push(
        '¿Qué dice la cláusula 5.1 sobre liderazgo?',
        '¿Cómo identificar riesgos en mi área?'
      );
  }

  // Sugerencias basadas en el módulo
  switch (contextoProceso.modulo) {
    case 'auditoria':
      sugerencias.push('¿Cuáles son los criterios para calificar un hallazgo?');
      break;
    case 'rrhh':
      sugerencias.push('¿Cómo documentar la competencia del personal según ISO 9001?');
      break;
    case 'crm':
      sugerencias.push('¿Cómo medir la satisfacción del cliente?');
      break;
  }

  return sugerencias.slice(0, 3);
}

export async function POST(request: NextRequest) {
  try {
    const { mensaje, contextoUsuario, contextoProceso, historial } = await request.json();

    // Validar datos requeridos
    if (!mensaje || !contextoUsuario || !contextoProceso) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos: mensaje, contextoUsuario, contextoProceso' },
        { status: 400 }
      );
    }

    // Construir el prompt dinámico
    const promptCompleto = construirPromptDinamico(
      mensaje,
      contextoUsuario,
      contextoProceso,
      historial || []
    );

    // Integración REAL con Claude API
    const claudeApiKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY;
    
    if (!claudeApiKey) {
      console.warn('⚠️ CLAUDE_API_KEY no configurada, usando respuesta simulada');
      const respuestaSimulada = await generarRespuestaSimulada(
        mensaje,
        contextoUsuario,
        contextoProceso
      );
      const sugerencias = generarSugerencias(contextoUsuario, contextoProceso);
      
      return NextResponse.json({
        respuesta: respuestaSimulada,
        sugerencias,
        modo: 'simulado',
        contexto_usado: {
          usuario: contextoUsuario,
          proceso: contextoProceso
        }
      });
    }

    // Llamada REAL a Claude API
    try {
      const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${claudeApiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': claudeApiKey
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          temperature: 0.7,
          messages: [
            {
              role: 'user',
              content: promptCompleto
            }
          ]
        })
      });

      if (!claudeResponse.ok) {
        const errorData = await claudeResponse.json();
        console.error('Error de Claude API:', errorData);
        throw new Error(`Claude API error: ${claudeResponse.status}`);
      }

      const claudeData = await claudeResponse.json();
      const respuesta = claudeData.content[0].text;

      // Generar sugerencias
      const sugerencias = generarSugerencias(contextoUsuario, contextoProceso);

      return NextResponse.json({
        respuesta,
        sugerencias,
        modo: 'claude_api',
        contexto_usado: {
          usuario: contextoUsuario,
          proceso: contextoProceso
        }
      });

    } catch (claudeError) {
      console.error('Error al llamar a Claude API:', claudeError);
      
      // Fallback a respuesta simulada si Claude falla
      const respuestaSimulada = await generarRespuestaSimulada(
        mensaje,
        contextoUsuario,
        contextoProceso
      );
      const sugerencias = generarSugerencias(contextoUsuario, contextoProceso);
      
      return NextResponse.json({
        respuesta: respuestaSimulada,
        sugerencias,
        modo: 'fallback',
        error_info: 'Claude API no disponible, usando respuesta simulada',
        contexto_usado: {
          usuario: contextoUsuario,
          proceso: contextoProceso
        }
      });
    }

  } catch (error) {
    console.error('Error en API DON CANDIDOS:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función temporal para simular respuestas de Claude
async function generarRespuestaSimulada(
  consulta: string,
  contextoUsuario: ContextoUsuario,
  contextoProceso: ContextoProceso
): Promise<string> {
  // Simular diferentes respuestas basadas en palabras clave
  const consultaLower = consulta.toLowerCase();

  if (consultaLower.includes('cláusula 8.1') || consultaLower.includes('planificación operacional')) {
    return `Según la **cláusula 8.1** de ISO 9001, debes planificar y controlar los procesos operacionales.

**Explicación**: Esta cláusula requiere que determines los requisitos para los productos/servicios, planifiques su realización y controles los procesos.

**Ejemplo práctico**: Si eres ${contextoUsuario.puesto} en ${contextoUsuario.departamento}, asegúrate de que cada proceso tenga definidos: entradas, actividades, salidas, recursos necesarios y criterios de aceptación.

**Siguiente paso**: Revisa si tus procedimientos operativos incluyen estos elementos y actualízalos si es necesario.`;
  }

  if (consultaLower.includes('auditoría') || consultaLower.includes('auditor')) {
    return `Para las **auditorías internas** según la **cláusula 9.2**, debes planificar, ejecutar y reportar los resultados.

**Explicación**: Las auditorías ayudan a verificar que el sistema de calidad funciona correctamente y identifican oportunidades de mejora.

**Ejemplo práctico**: Como ${contextoUsuario.puesto}, cuando audites un proceso, observa las actividades reales, compara con los procedimientos documentados y documenta cualquier desviación con evidencia objetiva.

**Siguiente paso**: Prepara un plan de auditoría anual que cubra todos los procesos críticos de tu área.`;
  }

  if (consultaLower.includes('documentación') || consultaLower.includes('documentos')) {
    return `La **cláusula 7.5** establece los requisitos para la **información documentada**.

**Explicación**: Debes mantener documentos actualizados, controlar su acceso y asegurar que estén disponibles donde se necesiten.

**Ejemplo práctico**: En ${contextoUsuario.departamento}, cada procedimiento debe tener: propósito, alcance, responsabilidades, pasos detallados y registros asociados.

**Siguiente paso**: Realiza una revisión de tu documentación actual y actualiza cualquier procedimiento obsoleto.`;
  }

  if (consultaLower.includes('mejora continua') || consultaLower.includes('mejora')) {
    return `La **cláusula 10.3** requiere **mejora continua** del sistema de gestión de calidad.

**Explicación**: Debes identificar oportunidades de mejora a través de auditorías, análisis de datos, retroalimentación y acciones correctivas.

**Ejemplo práctico**: Como ${contextoUsuario.puesto}, analiza los indicadores de tu proceso mensual y busca patrones que indiquen áreas para mejorar.

**Siguiente paso**: Implementa al menos una mejora pequeña cada mes en tu área de responsabilidad.`;
  }

  // Respuesta genérica
  return `Como experto en ISO 9001, te ayudo con temas de gestión de calidad.

**Explicación**: Tu consulta sobre "${consulta.substring(0, 50)}..." está relacionada con el sistema de gestión de calidad.

**Referencia ISO**: Dependiendo del tema específico, aplica diferentes cláusulas del estándar ISO 9001:2015.

**Ejemplo práctico**: En tu rol de ${contextoUsuario.puesto} en ${contextoUsuario.departamento}, considera cómo este tema impacta tus procesos diarios.

**Siguiente paso**: ¿Puedes darme más detalles sobre qué aspecto específico de ISO 9001 te interesa?`;
}