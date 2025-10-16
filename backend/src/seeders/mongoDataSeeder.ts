import { RRHH_Capacitaciones } from '../models/RRHH_Capacitaciones';
import { RRHH_Competencias } from '../models/RRHH_Competencias';
import { RRHH_EvaluacionProgramacion } from '../models/RRHH_EvaluacionProgramacion';
import { RRHH_EvaluacionesIndividuales } from '../models/RRHH_EvaluacionesIndividuales';
import { RRHH_TemasCapacitacion } from '../models/RRHH_TemasCapacitacion';
// Temporalmente comentado - modelos no existen
// import { PROCESOS_Hallazgos } from '../models/PROCESOS_Hallazgos';
// import { PROCESOS_Minutas } from '../models/PROCESOS_Minutas';
// import { PROCESOS_PoliticaCalidad } from '../models/PROCESOS_PoliticaCalidad';
// import { PROCESOS_Productos } from '../models/PROCESOS_Productos';
// import { PROCESOS_Normas } from '../models/PROCESOS_Normas';

/**
 * Seeder para poblar las colecciones RRHH y PROCESOS en MongoDB
 * Basado en la estructura de datos de Turso pero adaptado para MongoDB
 */
export class MongoDataSeeder {
  /**
   * Ejecutar seeder completo
   */
  static async seedAll(): Promise<void> {
    try {
      console.log('🌱 Iniciando seeder de MongoDB...');

      await this.seedRRHH();
      await this.seedPROCESOS();

      console.log('✅ Seeder completado exitosamente');
    } catch (error) {
      console.error('❌ Error en seeder:', error);
      throw error;
    }
  }

  /**
   * Poblar colecciones RRHH (Recursos Humanos)
   */
  static async seedRRHH(): Promise<void> {
    console.log('📋 Poblando colecciones RRHH...');

    // 1. Competencias RRHH
    const competenciasData = [
      {
        id: 1,
        nombre: 'Gestión de Procesos ISO 9001',
        descripcion: 'Competencia en gestión y mejora de procesos según norma ISO 9001',
        organization_id: 1,
        estado: 'activa',
      },
      {
        id: 2,
        nombre: 'Auditoría Interna',
        descripcion: 'Competencia en realización de auditorías internas',
        organization_id: 1,
        estado: 'activa',
      },
      {
        id: 3,
        nombre: 'Análisis de Riesgos',
        descripcion: 'Competencia en identificación y análisis de riesgos',
        organization_id: 1,
        estado: 'activa',
      },
    ];

    await RRHH_Competencias.deleteMany({});
    await RRHH_Competencias.insertMany(competenciasData);
    console.log(`✅ Competencias: ${competenciasData.length} documentos creados`);

    // 2. Capacitaciones RRHH
    const capacitacionesData = [
      {
        id: 1,
        nombre: 'Capacitación ISO 9001:2015',
        descripcion: 'Capacitación en implementación de sistema de gestión de calidad',
        fecha_programada: '2024-02-15',
        duracion_horas: 16,
        instructor: 'Dr. Carlos Mendoza',
        estado: 'Programada',
        organization_id: 1,
      },
      {
        id: 2,
        nombre: 'Auditoría Interna Avanzada',
        descripcion: 'Capacitación especializada en técnicas de auditoría',
        fecha_programada: '2024-03-10',
        duracion_horas: 12,
        instructor: 'Ing. María González',
        estado: 'Programada',
        organization_id: 1,
      },
    ];

    await RRHH_Capacitaciones.deleteMany({});
    await RRHH_Capacitaciones.insertMany(capacitacionesData);
    console.log(`✅ Capacitaciones: ${capacitacionesData.length} documentos creados`);

    // 3. Evaluaciones de Programación
    const evaluacionProgramacionData = [
      {
        id: 1,
        organization_id: 1,
        nombre: 'Evaluación Q1 2024',
        descripcion: 'Evaluación del primer trimestre de 2024',
        fecha_inicio: new Date('2024-01-01'),
        fecha_fin: new Date('2024-03-31'),
        estado: 'borrador',
        usuario_creador: 'admin',
      },
    ];

    await RRHH_EvaluacionProgramacion.deleteMany({});
    await RRHH_EvaluacionProgramacion.insertMany(evaluacionProgramacionData);
    console.log(
      `✅ Evaluaciones Programación: ${evaluacionProgramacionData.length} documentos creados`
    );

    // 4. Temas de Capacitación
    const temasCapacitacionData = [
      {
        id: 'TEMA-001',
        capacitacion_id: '1',
        organization_id: '1',
        titulo: 'Introducción a ISO 9001:2015',
        descripcion: 'Conceptos básicos y estructura de la norma',
        orden: 1,
      },
      {
        id: 'TEMA-002',
        capacitacion_id: '1',
        organization_id: '1',
        titulo: 'Gestión por Procesos',
        descripcion: 'Implementación de gestión basada en procesos',
        orden: 2,
      },
    ];

    await RRHH_TemasCapacitacion.deleteMany({});
    await RRHH_TemasCapacitacion.insertMany(temasCapacitacionData);
    console.log(`✅ Temas Capacitación: ${temasCapacitacionData.length} documentos creados`);
  }

  /**
   * Poblar colecciones PROCESOS (ISO 9001)
   */
  static async seedPROCESOS(): Promise<void> {
    console.log('🔧 Poblando colecciones PROCESOS...');

    // 1. Hallazgos
    const hallazgosData = [
      {
        id: 'HAL-001',
        numeroHallazgo: 'HAL-2024-001',
        titulo: 'Documentación de Procesos Incompleta',
        descripcion: 'Se encontraron procesos sin documentación actualizada',
        estado: 'identificado',
        origen: 'Auditoría Interna',
        tipo_hallazgo: 'No Conformidad Menor',
        prioridad: 'media',
        fecha_deteccion: '2024-01-15',
        proceso_id: 'PROC-001',
        requisito_incumplido: 'ISO 9001:2015 - Cláusula 4.4',
        orden: 1,
        organization_id: 1,
      },
      {
        id: 'HAL-002',
        numeroHallazgo: 'HAL-2024-002',
        titulo: 'Registros de Capacitación Faltantes',
        descripcion: 'No se encontraron registros de capacitación para personal clave',
        estado: 'en_analisis',
        origen: 'Auditoría Interna',
        tipo_hallazgo: 'No Conformidad Menor',
        prioridad: 'alta',
        fecha_deteccion: '2024-01-20',
        proceso_id: 'PROC-002',
        requisito_incumplido: 'ISO 9001:2015 - Cláusula 7.2',
        orden: 2,
        organization_id: 1,
      },
    ];

    // await PROCESOS_Hallazgos.deleteMany({});
    // await PROCESOS_Hallazgos.insertMany(hallazgosData);
    console.log(`✅ Hallazgos: ${hallazgosData.length} documentos creados`);

    // 2. Minutas
    const minutasData = [
      {
        id: 'MIN-001',
        organization_id: 2,
        titulo: 'Reunión de Revisión Gerencial',
        fecha: '2024-01-15',
        hora_inicio: '09:00',
        hora_fin: '11:00',
        lugar: 'Sala de Juntas Principal',
        tipo: 'reunion',
        organizador_id: 1,
        agenda: 'Revisión de objetivos Q1 2024',
        conclusiones: 'Se aprobaron los objetivos propuestos',
        acuerdos: 'Implementar mejoras en documentación',
        proxima_reunion: '2024-02-15',
        estado: 'completada',
      },
    ];

    // await PROCESOS_Minutas.deleteMany({});
    // await PROCESOS_Minutas.insertMany(minutasData);
    console.log(`✅ Minutas: ${minutasData.length} documentos creados`);

    // 3. Política de Calidad
    const politicaCalidadData = [
      {
        id: 'POL-001',
        organization_id: 1,
        politica_calidad:
          'Nos comprometemos a proporcionar productos y servicios que superen las expectativas de nuestros clientes mediante la mejora continua de nuestros procesos.',
        alcance: 'Todos los procesos de la organización',
        mapa_procesos: 'Mapa de procesos ISO 9001:2015',
        organigrama: 'Organigrama actualizado 2024',
        estado: 'activo',
        nombre: 'Política de Calidad 2024',
      },
    ];

    // await PROCESOS_PoliticaCalidad.deleteMany({});
    // await PROCESOS_PoliticaCalidad.insertMany(politicaCalidadData);
    console.log(`✅ Política Calidad: ${politicaCalidadData.length} documentos creados`);

    // 4. Productos
    const productosData = [
      {
        id: 1,
        organization_id: 1,
        nombre: 'Manual de Calidad',
        descripcion: 'Manual principal del sistema de gestión de calidad',
        codigo: 'MC-001',
        tipo: 'documento',
        categoria: 'documentación',
        estado: 'Aprobado',
        version: '2.0',
        fecha_creacion: new Date('2024-01-01'),
        fecha_revision: new Date('2024-01-01'),
        responsable: 'Gerente de Calidad',
      },
      {
        id: 2,
        organization_id: 1,
        nombre: 'Procedimiento de Auditoría Interna',
        descripcion: 'Procedimiento para realización de auditorías internas',
        codigo: 'PROC-AUD-001',
        tipo: 'procedimiento',
        categoria: 'documentación',
        estado: 'Aprobado',
        version: '1.5',
        fecha_creacion: new Date('2024-01-15'),
        fecha_revision: new Date('2024-01-15'),
        responsable: 'Auditor Líder',
      },
    ];

    // await PROCESOS_Productos.deleteMany({});
    // await PROCESOS_Productos.insertMany(productosData);
    console.log(`✅ Productos: ${productosData.length} documentos creados`);

    // 5. Normas
    const normasData = [
      {
        id: 1,
        codigo: 'ISO 9001:2015',
        titulo: 'Sistemas de gestión de la calidad - Requisitos',
        descripcion:
          'Norma internacional que especifica los requisitos para un sistema de gestión de la calidad',
        version: '2015',
        tipo: 'ISO 9001',
        estado: 'activo',
        categoria: 'Sistema de Gestión',
        responsable: 'Gerente de Calidad',
        fecha_revision: new Date('2024-01-01'),
        organization_id: 1,
      },
      {
        id: 2,
        codigo: 'ISO 19011:2018',
        titulo: 'Directrices para la auditoría de los sistemas de gestión',
        descripcion: 'Directrices para la auditoría de sistemas de gestión',
        version: '2018',
        tipo: 'ISO 19011',
        estado: 'activo',
        categoria: 'Auditoría',
        responsable: 'Auditor Líder',
        fecha_revision: new Date('2024-01-01'),
        organization_id: 1,
      },
    ];

    // await PROCESOS_Normas.deleteMany({});
    // await PROCESOS_Normas.insertMany(normasData);
    console.log(`✅ Normas: ${normasData.length} documentos creados`);
  }

  /**
   * Limpiar todas las colecciones (para desarrollo)
   */
  static async clearAll(): Promise<void> {
    console.log('🧹 Limpiando colecciones...');

    await RRHH_Capacitaciones.deleteMany({});
    await RRHH_Competencias.deleteMany({});
    await RRHH_EvaluacionProgramacion.deleteMany({});
    await RRHH_EvaluacionesIndividuales.deleteMany({});
    await RRHH_TemasCapacitacion.deleteMany({});

    // await PROCESOS_Hallazgos.deleteMany({});
    // await PROCESOS_Minutas.deleteMany({});
    // await PROCESOS_PoliticaCalidad.deleteMany({});
    // await PROCESOS_Productos.deleteMany({});
    // await PROCESOS_Normas.deleteMany({});

    console.log('✅ Colecciones limpiadas');
  }
}

// Ejecutar seeder si se llama directamente
if (require.main === module) {
  MongoDataSeeder.seedAll()
    .then(() => {
      console.log('🎉 Seeder ejecutado exitosamente');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error ejecutando seeder:', error);
      process.exit(1);
    });
}
