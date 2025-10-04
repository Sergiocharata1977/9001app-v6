import { ProcessUnified } from '../models/ProcessUnified';
import { QualityObjective } from '../models/QualityObjective';
import { QualityIndicator } from '../models/QualityIndicator';
import { Measurement } from '../models/Measurement';

export async function seedISOData() {
  try {
    console.log('🚀 Iniciando seeder de datos ISO 9001...');

    // 1. Crear Procesos ISO 9001
    const processes = [
      {
        id: 'proc-iso-001',
        name: 'Dirección y Liderazgo',
        description: 'Establecer la dirección estratégica y promover la mejora continua',
        content: 'Proceso que establece la política de calidad, objetivos y responsabilidades de la dirección.',
        category: 'Gestión',
        type: 'operativo',
        responsable: 'Director General',
        nivel_critico: 'alto',
        responsable_id: 'emp-001',
        departamento_id: 'dept-004',
        proveedores: 'Consejo de Administración',
        clientes: 'Todos los empleados',
        recursos_requeridos: 'Sistema de gestión, recursos humanos',
        competencias_requeridas: 'Liderazgo, gestión estratégica',
        metodos_seguimiento: 'Revisiones por la dirección, indicadores de desempeño',
        criterios_control: 'Cumplimiento de objetivos estratégicos',
        procedimientos_documentados: 'Política de calidad, objetivos de calidad',
        registros_requeridos: 'Actas de revisiones, planes de mejora',
        riesgos_identificados: 'Falta de compromiso directivo',
        oportunidades_mejora: 'Mejora en comunicación interna',
        fecha_vigencia: '2025-12-31',
        fecha_revision: '2024-12-31',
        objetivo: 'Establecer dirección clara y promover cultura de calidad',
        alcance: 'Toda la organización',
        version: '1.0',
        entradas: 'Necesidades de partes interesadas',
        salidas: 'Política de calidad, objetivos estratégicos',
        created_by: 1,
        is_active: 1,
        organization_id: 1
      },
      {
        id: 'proc-iso-002',
        name: 'Planificación',
        description: 'Planificar acciones para abordar riesgos y oportunidades',
        content: 'Proceso de identificación de riesgos y oportunidades, planificación de cambios.',
        category: 'Gestión',
        type: 'operativo',
        responsable: 'Gerente de Calidad',
        nivel_critico: 'alto',
        responsable_id: 'emp-001',
        departamento_id: 'dept-004',
        proveedores: 'Dirección',
        clientes: 'Todos los procesos',
        recursos_requeridos: 'Herramientas de análisis de riesgos',
        competencias_requeridas: 'Análisis de riesgos, planificación estratégica',
        metodos_seguimiento: 'Auditorías internas, revisiones de planes',
        criterios_control: 'Efectividad de planes de acción',
        procedimientos_documentados: 'Plan de gestión de riesgos',
        registros_requeridos: 'Análisis FODA, planes de acción',
        riesgos_identificados: 'Cambios no planificados',
        oportunidades_mejora: 'Mejora en identificación de oportunidades',
        fecha_vigencia: '2025-12-31',
        fecha_revision: '2024-12-31',
        objetivo: 'Planificar acciones efectivas para riesgos y oportunidades',
        alcance: 'Todos los procesos críticos',
        version: '1.0',
        entradas: 'Objetivos estratégicos',
        salidas: 'Planes de acción, objetivos operativos',
        created_by: 1,
        is_active: 1,
        organization_id: 1
      },
      {
        id: 'proc-iso-003',
        name: 'Apoyo',
        description: 'Proporcionar los recursos necesarios para el sistema de gestión',
        content: 'Gestión de recursos, infraestructura, ambiente de trabajo y competencias.',
        category: 'Apoyo',
        type: 'apoyo',
        responsable: 'Gerente de RRHH',
        nivel_critico: 'medio',
        responsable_id: 'emp-001',
        departamento_id: 'dept-001',
        proveedores: 'Proveedores externos',
        clientes: 'Todos los procesos operativos',
        recursos_requeridos: 'Presupuesto, proveedores',
        competencias_requeridas: 'Gestión de recursos, contratación',
        metodos_seguimiento: 'Auditorías de recursos, evaluaciones',
        criterios_control: 'Disponibilidad de recursos',
        procedimientos_documentados: 'Plan de recursos',
        registros_requeridos: 'Contratos, evaluaciones de proveedores',
        riesgos_identificados: 'Falta de recursos',
        oportunidades_mejora: 'Optimización de recursos',
        fecha_vigencia: '2025-12-31',
        fecha_revision: '2024-12-31',
        objetivo: 'Asegurar recursos adecuados para el SGC',
        alcance: 'Todos los recursos organizacionales',
        version: '1.0',
        entradas: 'Planes operativos',
        salidas: 'Recursos asignados, infraestructura',
        created_by: 1,
        is_active: 1,
        organization_id: 1
      },
      {
        id: 'proc-iso-004',
        name: 'Operación',
        description: 'Planificar, implementar y controlar los procesos operativos',
        content: 'Control de procesos operativos, producción de bienes y servicios.',
        category: 'Operativo',
        type: 'operativo',
        responsable: 'Gerente de Producción',
        nivel_critico: 'alto',
        responsable_id: 'emp-005',
        departamento_id: 'dept-003',
        proveedores: 'Proveedores de insumos',
        clientes: 'Clientes externos',
        recursos_requeridos: 'Maquinaria, personal operativo',
        competencias_requeridas: 'Control de procesos, calidad',
        metodos_seguimiento: 'Indicadores de proceso, inspecciones',
        criterios_control: 'Cumplimiento de especificaciones',
        procedimientos_documentados: 'Procedimientos operativos',
        registros_requeridos: 'Registros de producción, controles de calidad',
        riesgos_identificados: 'Fallas en procesos',
        oportunidades_mejora: 'Optimización de procesos',
        fecha_vigencia: '2025-12-31',
        fecha_revision: '2024-12-31',
        objetivo: 'Producir bienes y servicios conforme a requisitos',
        alcance: 'Procesos de producción y servicios',
        version: '1.0',
        entradas: 'Órdenes de producción, especificaciones',
        salidas: 'Productos terminados, servicios prestados',
        created_by: 1,
        is_active: 1,
        organization_id: 1
      },
      {
        id: 'proc-iso-005',
        name: 'Evaluación del Desempeño',
        description: 'Monitorear, medir, analizar y evaluar el desempeño del SGC',
        content: 'Seguimiento de indicadores, auditorías, análisis de datos.',
        category: 'Gestión',
        type: 'operativo',
        responsable: 'Auditor Interno',
        nivel_critico: 'medio',
        responsable_id: 'emp-001',
        departamento_id: 'dept-004',
        proveedores: 'Procesos operativos',
        clientes: 'Dirección',
        recursos_requeridos: 'Herramientas de medición, software',
        competencias_requeridas: 'Análisis de datos, auditoría',
        metodos_seguimiento: 'Indicadores KPI, auditorías',
        criterios_control: 'Exactitud de mediciones',
        procedimientos_documentados: 'Plan de medición',
        registros_requeridos: 'Resultados de mediciones, informes de auditoría',
        riesgos_identificados: 'Datos inexactos',
        oportunidades_mejora: 'Mejora en análisis de datos',
        fecha_vigencia: '2025-12-31',
        fecha_revision: '2024-12-31',
        objetivo: 'Evaluar el desempeño del sistema de gestión',
        alcance: 'Todo el SGC',
        version: '1.0',
        entradas: 'Datos de procesos',
        salidas: 'Informes de desempeño, acciones correctivas',
        created_by: 1,
        is_active: 1,
        organization_id: 1
      },
      {
        id: 'proc-iso-006',
        name: 'Mejora',
        description: 'Mejorar continuamente la adecuación, eficacia y eficiencia del SGC',
        content: 'Acciones correctivas y preventivas, mejora continua.',
        category: 'Gestión',
        type: 'operativo',
        responsable: 'Gerente de Calidad',
        nivel_critico: 'alto',
        responsable_id: 'emp-001',
        departamento_id: 'dept-004',
        proveedores: 'Evaluación del desempeño',
        clientes: 'Toda la organización',
        recursos_requeridos: 'Equipo de mejora, herramientas de calidad',
        competencias_requeridas: 'Gestión de calidad, mejora continua',
        metodos_seguimiento: 'Indicadores de mejora',
        criterios_control: 'Efectividad de acciones',
        procedimientos_documentados: 'Procedimiento de mejora',
        registros_requeridos: 'Acciones correctivas, planes de mejora',
        riesgos_identificados: 'Falta de mejora continua',
        oportunidades_mejora: 'Innovación y optimización',
        fecha_vigencia: '2025-12-31',
        fecha_revision: '2024-12-31',
        objetivo: 'Mejorar continuamente el SGC',
        alcance: 'Todo el sistema de gestión',
        version: '1.0',
        entradas: 'Resultados de evaluaciones',
        salidas: 'Mejoras implementadas, lecciones aprendidas',
        created_by: 1,
        is_active: 1,
        organization_id: 1
      }
    ];

    await ProcessUnified.deleteMany({});
    const createdProcesses = await ProcessUnified.insertMany(processes);
    console.log(`✅ ${createdProcesses.length} procesos ISO 9001 creados`);

    // 2. Crear Objetivos de Calidad
    const objectives = [
      {
        id: 'obj-iso-001',
        nombre_objetivo: 'Reducir quejas de clientes en 20%',
        descripcion: 'Reducir el número de quejas de clientes mediante mejora en procesos operativos',
        proceso_id: 'proc-iso-004',
        indicador_asociado_id: 2024001,
        meta: 'Reducir quejas de 50 a 40 por trimestre',
        responsable: 'Gerente de Producción',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        estado: 'activo',
        indicadores: 'Número de quejas, índice de satisfacción',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 'obj-iso-002',
        nombre_objetivo: 'Aumentar eficiencia operativa en 15%',
        descripcion: 'Optimizar procesos para reducir tiempos de ciclo y costos',
        proceso_id: 'proc-iso-004',
        indicador_asociado_id: 2024002,
        meta: 'Reducir tiempo de ciclo de 8 a 6.8 horas',
        responsable: 'Supervisor de Producción',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        estado: 'activo',
        indicadores: 'Tiempo de ciclo, costo por unidad',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 'obj-iso-003',
        nombre_objetivo: '100% cumplimiento en capacitaciones',
        descripcion: 'Asegurar que todo el personal reciba capacitación requerida',
        proceso_id: 'proc-iso-003',
        indicador_asociado_id: 2024003,
        meta: 'Alcanzar 100% de cumplimiento en planes de capacitación',
        responsable: 'Gerente de RRHH',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        estado: 'activo',
        indicadores: 'Porcentaje de capacitaciones completadas',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 'obj-iso-004',
        nombre_objetivo: 'Reducir no conformidades en 30%',
        descripcion: 'Disminuir las no conformidades identificadas en auditorías',
        proceso_id: 'proc-iso-005',
        indicador_asociado_id: 2024004,
        meta: 'Reducir NC de 30 a 21 por año',
        responsable: 'Auditor Interno',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        estado: 'activo',
        indicadores: 'Número de no conformidades',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      }
    ];

    await QualityObjective.deleteMany({});
    const createdObjectives = await QualityObjective.insertMany(objectives);
    console.log(`✅ ${createdObjectives.length} objetivos de calidad creados`);

    // 3. Crear Indicadores
    const indicators = [
      {
        id: 2024001,
        nombre: 'Índice de Quejas de Clientes',
        descripcion: 'Número de quejas recibidas por trimestre',
        proceso_id: 'proc-iso-004',
        frecuencia_medicion: 'trimestral',
        meta: 40,
        formula: 'Número total de quejas / Número de pedidos * 100',
        fecha_fin: '2024-12-31',
        estado: 'activo',
        indicadores: 'Quejas por trimestre',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 2024002,
        nombre: 'Eficiencia Operativa',
        descripcion: 'Tiempo promedio de ciclo de producción',
        proceso_id: 'proc-iso-004',
        frecuencia_medicion: 'mensual',
        meta: 6.8,
        formula: 'Tiempo total / Número de unidades producidas',
        fecha_fin: '2024-12-31',
        estado: 'activo',
        indicadores: 'Horas por unidad',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 2024003,
        nombre: 'Cumplimiento de Capacitaciones',
        descripcion: 'Porcentaje de capacitaciones completadas',
        proceso_id: 'proc-iso-003',
        frecuencia_medicion: 'trimestral',
        meta: 100,
        formula: '(Capacitaciones completadas / Capacitaciones planificadas) * 100',
        fecha_fin: '2024-12-31',
        estado: 'activo',
        indicadores: 'Porcentaje de cumplimiento',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 2024004,
        nombre: 'No Conformidades por Auditoría',
        descripcion: 'Número de no conformidades identificadas',
        proceso_id: 'proc-iso-005',
        frecuencia_medicion: 'anual',
        meta: 21,
        formula: 'Número total de NC identificadas',
        fecha_fin: '2024-12-31',
        estado: 'activo',
        indicadores: 'NC por año',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      }
    ];

    await QualityIndicator.deleteMany({});
    const createdIndicators = await QualityIndicator.insertMany(indicators);
    console.log(`✅ ${createdIndicators.length} indicadores creados`);

    // 4. Crear Mediciones
    const measurements = [
      // Mediciones para Índice de Quejas
      {
        id: 'med-2024-001',
        indicador_id: '2024001',
        valor: 45,
        fecha_medicion: '2024-01-31',
        observaciones: 'Quejas del trimestre enero-marzo',
        responsable: 'Gerente de Producción',
        fecha_creacion: '2024-01-31T10:00:00.000Z',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 'med-2024-002',
        indicador_id: '2024001',
        valor: 42,
        fecha_medicion: '2024-04-30',
        observaciones: 'Quejas del trimestre abril-junio',
        responsable: 'Gerente de Producción',
        fecha_creacion: '2024-04-30T10:00:00.000Z',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 'med-2024-003',
        indicador_id: '2024001',
        valor: 38,
        fecha_medicion: '2024-07-31',
        observaciones: 'Quejas del trimestre julio-septiembre',
        responsable: 'Gerente de Producción',
        fecha_creacion: '2024-07-31T10:00:00.000Z',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      },
      // Mediciones para Eficiencia Operativa
      {
        id: 'med-2024-004',
        indicador_id: '2024002',
        valor: 7.8,
        fecha_medicion: '2024-01-31',
        observaciones: 'Tiempo promedio enero',
        responsable: 'Supervisor de Producción',
        fecha_creacion: '2024-01-31T10:00:00.000Z',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 'med-2024-005',
        indicador_id: '2024002',
        valor: 7.2,
        fecha_medicion: '2024-02-29',
        observaciones: 'Tiempo promedio febrero',
        responsable: 'Supervisor de Producción',
        fecha_creacion: '2024-02-29T10:00:00.000Z',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 'med-2024-006',
        indicador_id: '2024002',
        valor: 6.9,
        fecha_medicion: '2024-03-31',
        observaciones: 'Tiempo promedio marzo',
        responsable: 'Supervisor de Producción',
        fecha_creacion: '2024-03-31T10:00:00.000Z',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      },
      // Mediciones para Cumplimiento de Capacitaciones
      {
        id: 'med-2024-007',
        indicador_id: '2024003',
        valor: 85,
        fecha_medicion: '2024-03-31',
        observaciones: 'Cumplimiento primer trimestre',
        responsable: 'Gerente de RRHH',
        fecha_creacion: '2024-03-31T10:00:00.000Z',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 'med-2024-008',
        indicador_id: '2024003',
        valor: 92,
        fecha_medicion: '2024-06-30',
        observaciones: 'Cumplimiento segundo trimestre',
        responsable: 'Gerente de RRHH',
        fecha_creacion: '2024-06-30T10:00:00.000Z',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      },
      // Mediciones para No Conformidades
      {
        id: 'med-2024-009',
        indicador_id: '2024004',
        valor: 28,
        fecha_medicion: '2024-06-30',
        observaciones: 'No conformidades primer semestre',
        responsable: 'Auditor Interno',
        fecha_creacion: '2024-06-30T10:00:00.000Z',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      }
    ];

    await Measurement.deleteMany({});
    const createdMeasurements = await Measurement.insertMany(measurements);
    console.log(`✅ ${createdMeasurements.length} mediciones creadas`);

    console.log('\n🎉 Seeder de datos ISO 9001 completado exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - ${createdProcesses.length} procesos`);
    console.log(`   - ${createdObjectives.length} objetivos`);
    console.log(`   - ${createdIndicators.length} indicadores`);
    console.log(`   - ${createdMeasurements.length} mediciones`);

    return {
      processes: createdProcesses,
      objectives: createdObjectives,
      indicators: createdIndicators,
      measurements: createdMeasurements
    };

  } catch (error) {
    console.error('❌ Error en seeder de datos ISO:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedISOData()
    .then(() => {
      console.log('✅ Seeder ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error ejecutando seeder:', error);
      process.exit(1);
    });
}