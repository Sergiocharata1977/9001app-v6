import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importar modelos existentes
import { Organization } from '../models/Organization';
import { User } from '../models/User';
import { Department } from '../models/Department';
import { Personnel } from '../models/Personnel';

// Importar modelos de procesos
import { Proceso } from '../models/PROCESO';
import { RegistroProceso } from '../models/REGISTRO_PROCESO';

// Importar modelo de acciones
import { Acciones } from '../models/acciones';

// Importar modelos de calidad
import { QualityObjective } from '../models/QualityObjective';
import { QualityIndicator } from '../models/QualityIndicator';
import { Measurement } from '../models/Measurement';
import { NormPoint } from '../models/NormPoint';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/9001app';

/**
 * Script para completar la migración con las colecciones faltantes
 */
export class CompleteMigration {

  static async migrateAll(): Promise<void> {
    try {
      console.log('🚀 Iniciando migración completa de colecciones faltantes...');

      await mongoose.connect(MONGODB_URI);
      console.log('✅ Conectado a MongoDB');

      // Migrar en orden de dependencias
      await this.migrateProcesos();
      await this.migrateRegistrosProceso();
      await this.migrateAcciones();
      await this.migrateObjetivosCalidad();
      await this.migrateIndicadoresCalidad();
      await this.migrateMediciones();
      await this.migratePuntosNorma();

      console.log('🎉 Migración completa exitosa!');

    } catch (error) {
      console.error('❌ Error durante la migración:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Desconectado de MongoDB');
    }
  }

  /**
   * Migrar Definiciones de Procesos
   */
  static async migrateProcesos(): Promise<void> {
    console.log('📋 Migrando Definiciones de Procesos...');

    const procesosData = [
      {
        codigo: 'PROC-2024-001',
        nombre: 'Gestión de No Conformidades',
        descripcion: 'Proceso para identificar, documentar y gestionar no conformidades del sistema de gestión de calidad',
        version: '1.0',
        objetivo: 'Garantizar la identificación y resolución oportuna de no conformidades',
        alcance: 'Aplicable a todas las actividades del sistema de gestión de calidad',
        responsable: 'Responsable de Calidad',
        entradas: 'No conformidades identificadas, auditorías, reclamos',
        salidas: 'Acciones correctivas implementadas, registros de seguimiento',
        etapas_kanban: [
          { nombre: 'Identificada', color: '#EF4444', orden: 1, es_inicial: true, es_final: false },
          { nombre: 'En Análisis', color: '#F59E0B', orden: 2, es_inicial: false, es_final: false },
          { nombre: 'En Acción', color: '#3B82F6', orden: 3, es_inicial: false, es_final: false },
          { nombre: 'Verificada', color: '#10B981', orden: 4, es_inicial: false, es_final: true }
        ],
        tipo: 'operativo',
        categoria: 'calidad',
        nivel_critico: 'alto',
        estado: 'activo',
        organization_id: 1,
        is_active: true,
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011'
      },
      {
        codigo: 'PROC-2024-002',
        nombre: 'Auditorías Internas',
        descripcion: 'Proceso para planificar, ejecutar y dar seguimiento a las auditorías internas del SGC',
        version: '1.0',
        objetivo: 'Verificar la conformidad y eficacia del sistema de gestión de calidad',
        alcance: 'Todo el sistema de gestión de calidad según ISO 9001:2015',
        responsable: 'Auditor Líder',
        entradas: 'Plan de auditorías, criterios de auditoría, documentos del SGC',
        salidas: 'Informes de auditoría, hallazgos, acciones correctivas',
        etapas_kanban: [
          { nombre: 'Planificada', color: '#6B7280', orden: 1, es_inicial: true, es_final: false },
          { nombre: 'En Ejecución', color: '#F59E0B', orden: 2, es_inicial: false, es_final: false },
          { nombre: 'Informe', color: '#3B82F6', orden: 3, es_inicial: false, es_final: false },
          { nombre: 'Seguimiento', color: '#10B981', orden: 4, es_inicial: false, es_final: true }
        ],
        tipo: 'operativo',
        categoria: 'calidad',
        nivel_critico: 'alto',
        estado: 'activo',
        organization_id: 1,
        is_active: true,
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011'
      },
      {
        codigo: 'PROC-2024-003',
        nombre: 'Gestión de Mejoras',
        descripcion: 'Proceso para identificar e implementar oportunidades de mejora continua',
        version: '1.0',
        objetivo: 'Mejorar continuamente la eficacia del sistema de gestión de calidad',
        alcance: 'Todas las actividades y procesos de la organización',
        responsable: 'Responsable de Mejoras',
        entradas: 'Oportunidades de mejora, sugerencias, análisis de datos',
        salidas: 'Proyectos de mejora implementados, resultados medidos',
        etapas_kanban: [
          { nombre: 'Propuesta', color: '#8B5CF6', orden: 1, es_inicial: true, es_final: false },
          { nombre: 'Evaluación', color: '#F59E0B', orden: 2, es_inicial: false, es_final: false },
          { nombre: 'Implementación', color: '#3B82F6', orden: 3, es_inicial: false, es_final: false },
          { nombre: 'Evaluada', color: '#10B981', orden: 4, es_inicial: false, es_final: true }
        ],
        tipo: 'estratégico',
        categoria: 'mejora',
        nivel_critico: 'medio',
        estado: 'activo',
        organization_id: 1,
        is_active: true,
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011'
      }
    ];

    await Proceso.deleteMany({});
    const createdProcesos = await Proceso.insertMany(procesosData);
    console.log(`✅ ${createdProcesos.length} definiciones de procesos migradas`);
  }

  /**
   * Migrar Registros de Proceso
   */
  static async migrateRegistrosProceso(): Promise<void> {
    console.log('📝 Migrando Registros de Proceso...');

    const registrosData = [
      {
        proceso_id: '507f1f77bcf86cd799439011', // ObjectId del proceso
        codigo: 'REG-2024-001',
        titulo: 'No Conformidad - Proceso de Producción',
        descripcion: 'Se identificó una desviación en el proceso de producción que afecta la calidad del producto',
        estado_actual: 'En Análisis',
        historial_estados: [
          {
            estado: 'Identificada',
            fecha_cambio: new Date('2024-01-15'),
            cambiado_por: '507f1f77bcf86cd799439011',
            comentario: 'No conformidad identificada durante inspección de calidad'
          }
        ],
        responsable_id: '507f1f77bcf86cd799439011',
        asignados: ['507f1f77bcf86cd799439011'],
        fecha_inicio: new Date('2024-01-15'),
        fecha_vencimiento: new Date('2024-01-30'),
        prioridad: 'alta',
        porcentaje_progreso: 25,
        archivos: [],
        comentarios: [
          {
            contenido: 'Se requiere análisis de causa raíz inmediato',
            creado_por: '507f1f77bcf86cd799439011',
            fecha_creacion: new Date('2024-01-15'),
            mencionados: ['507f1f77bcf86cd799439011']
          }
        ],
        checklist: [
          {
            descripcion: 'Identificar causa raíz',
            completado: false,
            completado_por: null,
            fecha_completado: null
          },
          {
            descripcion: 'Definir acciones correctivas',
            completado: false,
            completado_por: null,
            fecha_completado: null
          }
        ],
        tags: ['calidad', 'producción', 'no-conformidad'],
        organization_id: 1,
        is_active: true,
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011'
      },
      {
        proceso_id: '507f1f77bcf86cd799439012', // ObjectId del proceso
        codigo: 'REG-2024-002',
        titulo: 'Auditoría Interna - Departamento de Ventas',
        descripcion: 'Auditoría programada para evaluar la conformidad del proceso de ventas',
        estado_actual: 'En Ejecución',
        historial_estados: [
          {
            estado: 'Planificada',
            fecha_cambio: new Date('2024-01-10'),
            cambiado_por: '507f1f77bcf86cd799439011',
            comentario: 'Auditoría programada según plan anual'
          },
          {
            estado: 'En Ejecución',
            fecha_cambio: new Date('2024-01-16'),
            cambiado_por: '507f1f77bcf86cd799439011',
            comentario: 'Iniciada auditoría en campo'
          }
        ],
        responsable_id: '507f1f77bcf86cd799439011',
        asignados: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
        fecha_inicio: new Date('2024-01-16'),
        fecha_vencimiento: new Date('2024-01-20'),
        prioridad: 'media',
        porcentaje_progreso: 60,
        archivos: [],
        comentarios: [],
        checklist: [
          {
            descripcion: 'Revisar documentación del proceso',
            completado: true,
            completado_por: '507f1f77bcf86cd799439011',
            fecha_completado: new Date('2024-01-16')
          },
          {
            descripcion: 'Entrevistar al personal',
            completado: true,
            completado_por: '507f1f77bcf86cd799439011',
            fecha_completado: new Date('2024-01-17')
          },
          {
            descripcion: 'Evaluar evidencias objetivas',
            completado: false,
            completado_por: null,
            fecha_completado: null
          }
        ],
        tags: ['auditoría', 'ventas', 'conformidad'],
        organization_id: 1,
        is_active: true,
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011'
      }
    ];

    await RegistroProceso.deleteMany({});
    const createdRegistros = await RegistroProceso.insertMany(registrosData);
    console.log(`✅ ${createdRegistros.length} registros de proceso migrados`);
  }

  /**
   * Migrar Acciones (Correctivas y de Mejora)
   */
  static async migrateAcciones(): Promise<void> {
    console.log('⚡ Migrando Acciones...');

    const accionesData = [
      {
        id: 'ACC-2024-001',
        codigo: 'ACC-2024-001',
        titulo: 'Acción Correctiva - Desviación en Producción',
        descripcion: 'Implementar controles adicionales para prevenir desviaciones en el proceso de producción',
        tipo_accion: 'correctiva',
        origen: 'no_conformidad',
        hallazgo_id: 'HALL-2024-001',
        responsable_id: 'EMP001',
        responsable_nombre: 'Juan Pérez',
        departamento_id: 'DEPT001',
        equipo_trabajo: ['EMP001', 'EMP002'],
        estado: 'en_ejecucion',
        historial_estados: [
          {
            estado: 'identificada',
            fecha_cambio: new Date('2024-01-15'),
            cambiado_por: '507f1f77bcf86cd799439011',
            comentario: 'Acción identificada por no conformidad'
          },
          {
            estado: 'planificada',
            fecha_cambio: new Date('2024-01-16'),
            cambiado_por: '507f1f77bcf86cd799439011',
            comentario: 'Plan de acción definido'
          },
          {
            estado: 'en_ejecucion',
            fecha_cambio: new Date('2024-01-17'),
            cambiado_por: '507f1f77bcf86cd799439011',
            comentario: 'Iniciada implementación'
          }
        ],
        fecha_identificacion: new Date('2024-01-15'),
        fecha_planificada: new Date('2024-01-16'),
        fecha_limite: new Date('2024-02-15'),
        fecha_inicio_ejecucion: new Date('2024-01-17'),
        causa_raiz: 'Falta de controles en el proceso de mezclado',
        analisis_causas: 'Se utilizó la técnica de los 5 porqués para identificar la causa raíz',
        herramientas_utilizadas: ['5 porqués', 'Diagrama Ishikawa'],
        actividades: [
          {
            descripcion: 'Revisar procedimiento de mezclado',
            responsable: 'EMP001',
            fecha_limite: new Date('2024-01-25'),
            completada: true,
            fecha_completado: new Date('2024-01-20'),
            evidencias: 'Procedimiento actualizado',
            observaciones: 'Procedimiento mejorado con controles adicionales'
          },
          {
            descripcion: 'Capacitar al personal',
            responsable: 'EMP002',
            fecha_limite: new Date('2024-02-05'),
            completada: false,
            fecha_completado: null,
            evidencias: null,
            observaciones: null
          }
        ],
        recursos_necesarios: 'Tiempo de personal y materiales de capacitación',
        presupuesto_estimado: 5000,
        moneda: 'MXN',
        criterios_verificacion: 'Reducción del 50% en desviaciones de producción',
        prioridad: 'alta',
        nivel_impacto: 'alto',
        riesgo_asociado: 'Pérdida de clientes por calidad inconsistente',
        organization_id: 1,
        is_active: true,
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 'ACC-2024-002',
        codigo: 'ACC-2024-002',
        titulo: 'Acción de Mejora - Optimización de Procesos',
        descripcion: 'Implementar sistema automatizado para mejorar la eficiencia del proceso de facturación',
        tipo_accion: 'mejora',
        origen: 'oportunidad_mejora',
        responsable_id: 'EMP002',
        responsable_nombre: 'María García',
        departamento_id: 'DEPT002',
        equipo_trabajo: ['EMP002', 'EMP003'],
        estado: 'planificada',
        historial_estados: [
          {
            estado: 'identificada',
            fecha_cambio: new Date('2024-01-10'),
            cambiado_por: '507f1f77bcf86cd799439012',
            comentario: 'Oportunidad identificada en análisis de procesos'
          },
          {
            estado: 'planificada',
            fecha_cambio: new Date('2024-01-12'),
            cambiado_por: '507f1f77bcf86cd799439012',
            comentario: 'Plan de mejora definido'
          }
        ],
        fecha_identificacion: new Date('2024-01-10'),
        fecha_planificada: new Date('2024-01-12'),
        fecha_limite: new Date('2024-03-31'),
        actividades: [
          {
            descripcion: 'Evaluar software de facturación',
            responsable: 'EMP002',
            fecha_limite: new Date('2024-02-15'),
            completada: false,
            fecha_completado: null,
            evidencias: null,
            observaciones: null
          },
          {
            descripcion: 'Implementar nueva solución',
            responsable: 'EMP003',
            fecha_limite: new Date('2024-03-15'),
            completada: false,
            fecha_completado: null,
            evidencias: null,
            observaciones: null
          }
        ],
        recursos_necesarios: 'Software de facturación y capacitación',
        presupuesto_estimado: 25000,
        moneda: 'MXN',
        criterios_verificacion: 'Reducción del 30% en tiempo de facturación',
        prioridad: 'media',
        nivel_impacto: 'medio',
        organization_id: 1,
        is_active: true,
        created_by: '507f1f77bcf86cd799439012',
        updated_by: '507f1f77bcf86cd799439012'
      }
    ];

    await Acciones.deleteMany({});
    const createdAcciones = await Acciones.insertMany(accionesData);
    console.log(`✅ ${createdAcciones.length} acciones migradas`);
  }

  /**
   * Migrar Objetivos de Calidad
   */
  static async migrateObjetivosCalidad(): Promise<void> {
    console.log('🎯 Migrando Objetivos de Calidad...');

    const objetivosData = [
      {
        id: 'OBJ-2024-001',
        nombre_objetivo: 'Reducir No Conformidades',
        descripcion: 'Disminuir el número de no conformidades en un 25% respecto al año anterior',
        proceso_id: 'PROC-2024-001',
        indicador_asociado_id: 1,
        meta: 'Máximo 15 no conformidades por trimestre',
        responsable: 'Responsable de Calidad',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        estado: 'activo',
        indicadores: 'Número de no conformidades por trimestre',
        organization_id: 1,
        is_active: true,
        is_archived: false,
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 'OBJ-2024-002',
        nombre_objetivo: 'Mejorar Satisfacción del Cliente',
        descripcion: 'Incrementar la satisfacción del cliente al 95%',
        proceso_id: 'PROC-2024-002',
        indicador_asociado_id: 2,
        meta: 'Índice de satisfacción del cliente ≥ 95%',
        responsable: 'Responsable de Ventas',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        estado: 'activo',
        indicadores: 'Encuesta de satisfacción del cliente',
        organization_id: 1,
        is_active: true,
        is_archived: false,
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011'
      }
    ];

    await QualityObjective.deleteMany({});
    const createdObjetivos = await QualityObjective.insertMany(objetivosData);
    console.log(`✅ ${createdObjetivos.length} objetivos de calidad migrados`);
  }

  /**
   * Migrar Indicadores de Calidad
   */
  static async migrateIndicadoresCalidad(): Promise<void> {
    console.log('📊 Migrando Indicadores de Calidad...');

    const indicadoresData = [
      {
        id: 1,
        nombre: 'Número de No Conformidades',
        descripcion: 'Cantidad de no conformidades identificadas por período',
        frecuencia_medicion: 'trimestral',
        meta: 15,
        formula: 'Conteo de no conformidades por trimestre',
        fecha_fin: '2024-12-31',
        estado: 'activo',
        indicadores: 'No conformidades identificadas',
        proceso_id: 1,
        organization_id: 1,
        is_active: true,
        is_archived: false,
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 2,
        nombre: 'Satisfacción del Cliente',
        descripcion: 'Porcentaje de satisfacción del cliente medido por encuestas',
        frecuencia_medicion: 'mensual',
        meta: 95,
        formula: '(Clientes satisfechos / Total clientes) * 100',
        fecha_fin: '2024-12-31',
        estado: 'activo',
        indicadores: 'Encuesta de satisfacción del cliente',
        proceso_id: 2,
        organization_id: 1,
        is_active: true,
        is_archived: false,
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011'
      }
    ];

    await QualityIndicator.deleteMany({});
    const createdIndicadores = await QualityIndicator.insertMany(indicadoresData);
    console.log(`✅ ${createdIndicadores.length} indicadores de calidad migrados`);
  }

  /**
   * Migrar Mediciones
   */
  static async migrateMediciones(): Promise<void> {
    console.log('📏 Migrando Mediciones...');

    const medicionesData = [
      {
        id: 'MED-2024-001',
        indicador_id: '1',
        valor: 12,
        fecha_medicion: '2024-01-31',
        observaciones: 'Reducción del 20% respecto al trimestre anterior',
        responsable: 'Responsable de Calidad',
        fecha_creacion: '2024-01-31',
        organization_id: 1,
        is_active: true,
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011'
      },
      {
        id: 'MED-2024-002',
        indicador_id: '2',
        valor: 94.5,
        fecha_medicion: '2024-01-31',
        observaciones: 'Mejora del 2% respecto al mes anterior',
        responsable: 'Responsable de Ventas',
        fecha_creacion: '2024-01-31',
        organization_id: 1,
        is_active: true,
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011'
      }
    ];

    await Measurement.deleteMany({});
    const createdMediciones = await Measurement.insertMany(medicionesData);
    console.log(`✅ ${createdMediciones.length} mediciones migradas`);
  }

  /**
   * Migrar Puntos de Norma ISO 9001
   */
  static async migratePuntosNorma(): Promise<void> {
    console.log('📚 Migrando Puntos de Norma ISO 9001...');

    const puntosData = [
      {
        code: '8.5.2',
        title: 'Acciones Correctivas',
        description: 'La organización debe tomar acción para eliminar las causas de las no conformidades',
        chapter: 8,
        section: '8.5.2',
        category: 'operacion',
        requirements: 'La organización debe tomar acción para eliminar las causas de las no conformidades para prevenir su recurrencia',
        guidance: 'Las acciones correctivas deben ser apropiadas a los efectos de las no conformidades encontradas',
        examples: 'Implementar controles adicionales, modificar procedimientos, capacitar personal',
        status: 'vigente',
        version: 'ISO 9001:2015',
        effective_date: new Date('2015-09-15'),
        keywords: ['acciones correctivas', 'no conformidades', 'eliminación causas'],
        is_mandatory: true,
        priority: 'alta',
        related_processes: [],
        related_documents: [],
        related_objectives: [],
        related_indicators: [],
        is_active: true,
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011'
      },
      {
        code: '10.2',
        title: 'No Conformidades y Acciones Correctivas',
        description: 'Cuando ocurre una no conformidad, la organización debe reaccionar',
        chapter: 10,
        section: '10.2',
        category: 'mejora',
        requirements: 'Cuando ocurre una no conformidad, la organización debe reaccionar y tomar acción para controlarla y corregirla',
        guidance: 'La organización debe evaluar la necesidad de acciones para eliminar las causas de las no conformidades',
        examples: 'Procedimientos de gestión de no conformidades, análisis de causa raíz',
        status: 'vigente',
        version: 'ISO 9001:2015',
        effective_date: new Date('2015-09-15'),
        keywords: ['no conformidades', 'acciones correctivas', 'mejora continua'],
        is_mandatory: true,
        priority: 'alta',
        related_processes: [],
        related_documents: [],
        related_objectives: [],
        related_indicators: [],
        is_active: true,
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011'
      }
    ];

    await NormPoint.deleteMany({});
    const createdPuntos = await NormPoint.insertMany(puntosData);
    console.log(`✅ ${createdPuntos.length} puntos de norma migrados`);
  }
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  CompleteMigration.migrateAll()
    .then(() => {
      console.log('🎉 Migración completa exitosa!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal durante la migración:', error);
      process.exit(1);
    });
}
