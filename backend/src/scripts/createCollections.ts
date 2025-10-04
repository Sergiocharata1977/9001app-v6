import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Importar modelos del sistema
import { OrganizationFeatures } from '../models/OrganizationFeatures';
import { Planes } from '../models/Planes';
import { RefreshTokens } from '../models/RefreshTokens';
import { Suscripciones } from '../models/Suscripciones';
import { UserFeaturePermissions } from '../models/user_feature_permissions';

// Importar modelos RRHH
import { RRHH_Capacitaciones } from '../models/rrhh_capacitaciones';
import { RRHH_Competencias } from '../models/rrhh_competencias';
import { RRHH_EvaluacionesIndividuales } from '../models/rrhh_evaluaciones_individuales';
import { RRHH_EvaluacionProgramacion } from '../models/rrhh_evaluacion_programacion';
import { RRHH_TemasCapacitacion } from '../models/rrhh_temas_capacitacion';

// Importar modelos SGC
import { Productos } from '../models/productos';
import { ProductosHistorial } from '../models/productos_historial';

// Importar modelos CRM
import { CRM_ActivosInmuebles } from '../models/crm_activos_inmuebles';
import { CRM_AnalisisRiesgo } from '../models/crm_analisis_riesgo';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/9001app';

/**
 * Script para crear colecciones con datos de ejemplo
 */
class CreateCollections {
  
  static async createAll(): Promise<void> {
    try {
      console.log('🚀 Iniciando creación de colecciones...');
      
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Conectado a MongoDB');

      // Crear colecciones del sistema
      await this.createPlanes();
      await this.createOrganizationFeatures();
      await this.createSuscripciones();
      await this.createRefreshTokens();
      await this.createUserFeaturePermissions();

      // Crear colecciones RRHH
      await this.createRRHHCompetencias();
      await this.createRRHHTemasCapacitacion();
      await this.createRRHHCapacitaciones();
      await this.createRRHHEvaluacionProgramacion();
      await this.createRRHHEvaluacionesIndividuales();

      // Crear colecciones SGC
      await this.createProductos();
      await this.createProductosHistorial();

      // Crear colecciones CRM faltantes
      await this.createCRMActivosInmuebles();
      await this.createCRMAnalisisRiesgo();
      
      console.log('🎉 ¡Todas las colecciones creadas exitosamente!');
      
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Desconectado de MongoDB');
    }
  }

  static async createPlanes(): Promise<void> {
    console.log('📋 Creando Planes...');
    
    const data = [
      {
        id: 1,
        nombre: 'Plan Gratuito',
        descripcion: 'Plan básico gratuito',
        precio_mensual: 0.00,
        precio_anual: 0.00,
        max_usuarios: 3,
        max_departamentos: 2,
        max_documentos: 50,
        max_auditorias: 2,
        max_hallazgos: 20,
        max_acciones: 30,
        caracteristicas: 'Funcionalidades básicas',
        estado: 'activo',
        es_plan_gratuito: true,
        orden_display: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Planes.deleteMany({});
    const created = await Planes.insertMany(data);
    console.log(`✅ ${created.length} planes creados`);
  }

  static async createOrganizationFeatures(): Promise<void> {
    console.log('🔧 Creando Organization Features...');
    
    const data = [
      {
        id: 1,
        organization_id: 1,
        feature_name: 'crm_module',
        is_enabled: true,
        created_at: new Date()
      },
      {
        id: 2,
        organization_id: 1,
        feature_name: 'rrhh_module',
        is_enabled: true,
        created_at: new Date()
      }
    ];

    await OrganizationFeatures.deleteMany({});
    const created = await OrganizationFeatures.insertMany(data);
    console.log(`✅ ${created.length} organization features creadas`);
  }

  static async createSuscripciones(): Promise<void> {
    console.log('💳 Creando Suscripciones...');
    
    const data = [
      {
        id: 1,
        organization_id: 1,
        plan_id: 1,
        estado: 'activa',
        fecha_inicio: new Date('2024-01-01'),
        fecha_fin: new Date('2024-12-31'),
        precio_actual: 0.00,
        moneda: 'MXN',
        periodo_facturacion: 'mensual',
        auto_renovacion: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Suscripciones.deleteMany({});
    const created = await Suscripciones.insertMany(data);
    console.log(`✅ ${created.length} suscripciones creadas`);
  }

  static async createRefreshTokens(): Promise<void> {
    console.log('🔑 Creando Refresh Tokens...');
    
    const data = [
      {
        id: 1,
        user_id: 1,
        token: 'refresh_token_example_' + Date.now(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_at: new Date()
      }
    ];

    await RefreshTokens.deleteMany({});
    const created = await RefreshTokens.insertMany(data);
    console.log(`✅ ${created.length} refresh tokens creados`);
  }

  static async createUserFeaturePermissions(): Promise<void> {
    console.log('🔐 Creando User Feature Permissions...');
    
    const data = [
      {
        id: 'PERM-001',
        organization_id: 1,
        user_id: 1,
        feature_name: 'crm_module',
        permission_level: 'full',
        date_granted: new Date(),
        granted_by: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await UserFeaturePermissions.deleteMany({});
    const created = await UserFeaturePermissions.insertMany(data);
    console.log(`✅ ${created.length} user permissions creados`);
  }

  static async createRRHHCompetencias(): Promise<void> {
    console.log('🎯 Creando RRHH Competencias...');
    
    const data = [
      {
        id: 'COMP-001',
        organization_id: 1,
        nombre: 'Gestión de Calidad ISO 9001',
        descripcion: 'Competencia en gestión de calidad',
        tipo_competencia: 'tecnica',
        categoria: 'Calidad',
        nivel_requerido: 'avanzado',
        area_aplicacion: 'Gestión de Calidad',
        frecuencia_evaluacion: 'anual',
        estado: 'activa',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await RRHH_Competencias.deleteMany({});
    const created = await RRHH_Competencias.insertMany(data);
    console.log(`✅ ${created.length} competencias RRHH creadas`);
  }

  static async createRRHHTemasCapacitacion(): Promise<void> {
    console.log('📚 Creando RRHH Temas Capacitación...');
    
    const data = [
      {
        id: 'TEMA-001',
        organization_id: 1,
        nombre: 'Introducción a ISO 9001:2015',
        descripcion: 'Fundamentos de la norma ISO 9001',
        categoria: 'Calidad',
        tipo_tema: 'normativo',
        nivel_dificultad: 'basico',
        duracion_estimada_horas: 16,
        modalidad_recomendada: 'presencial',
        estado: 'activo',
        version: '1.0',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await RRHH_TemasCapacitacion.deleteMany({});
    const created = await RRHH_TemasCapacitacion.insertMany(data);
    console.log(`✅ ${created.length} temas capacitación creados`);
  }

  static async createRRHHCapacitaciones(): Promise<void> {
    console.log('🎓 Creando RRHH Capacitaciones...');
    
    const data = [
      {
        id: 'CAP-001',
        organization_id: 1,
        titulo: 'Curso ISO 9001:2015',
        tipo_capacitacion: 'presencial',
        categoria: 'Calidad',
        duracion_horas: 16,
        fecha_inicio: new Date('2024-02-15'),
        fecha_fin: new Date('2024-02-16'),
        instructor: 'Ing. Roberto Martínez',
        modalidad: 'obligatoria',
        participantes_inscritos: 15,
        estado: 'planificada',
        evaluacion_requerida: true,
        certificacion: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await RRHH_Capacitaciones.deleteMany({});
    const created = await RRHH_Capacitaciones.insertMany(data);
    console.log(`✅ ${created.length} capacitaciones creadas`);
  }

  static async createRRHHEvaluacionProgramacion(): Promise<void> {
    console.log('📋 Creando RRHH Evaluación Programación...');
    
    const data = [
      {
        id: 'PROG-001',
        organization_id: 1,
        nombre_programa: 'Evaluación Anual 2024',
        tipo_evaluacion: 'desempeño',
        periodo: '2024',
        fecha_inicio: new Date('2024-01-15'),
        fecha_fin: new Date('2024-02-28'),
        frecuencia: 'anual',
        escala_evaluacion: 'Escala 1-5',
        responsable_programa: 'EMP001',
        estado: 'activo',
        total_empleados: 25,
        evaluaciones_completadas: 10,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await RRHH_EvaluacionProgramacion.deleteMany({});
    const created = await RRHH_EvaluacionProgramacion.insertMany(data);
    console.log(`✅ ${created.length} programaciones evaluación creadas`);
  }

  static async createRRHHEvaluacionesIndividuales(): Promise<void> {
    console.log('👤 Creando RRHH Evaluaciones Individuales...');
    
    const data = [
      {
        id: 'EVAL-001',
        organization_id: 1,
        empleado_id: 'EMP001',
        evaluador_id: 'EMP002',
        periodo_evaluacion: '2024',
        fecha_evaluacion: new Date(),
        tipo_evaluacion: 'desempeño',
        estado: 'completada',
        puntuacion_total: 85,
        puntuacion_maxima: 100,
        fortalezas: 'Excelente liderazgo',
        areas_mejora: 'Gestión del tiempo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await RRHH_EvaluacionesIndividuales.deleteMany({});
    const created = await RRHH_EvaluacionesIndividuales.insertMany(data);
    console.log(`✅ ${created.length} evaluaciones individuales creadas`);
  }

  static async createProductos(): Promise<void> {
    console.log('🏭 Creando Productos SGC...');
    
    const data = [
      {
        id: 'PROD-001',
        organization_id: 1,
        codigo_producto: 'SEM-MAI-001',
        nombre: 'Semilla Maíz Híbrido',
        categoria: 'Semillas',
        tipo_producto: 'fisico',
        etapa_desarrollo: 'produccion',
        version_actual: '2.1',
        responsable_desarrollo: 'EMP001',
        moneda: 'MXN',
        unidad_medida: 'kg',
        estado: 'activo',
        nivel_criticidad: 'alto',
        requiere_validacion_cliente: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Productos.deleteMany({});
    const created = await Productos.insertMany(data);
    console.log(`✅ ${created.length} productos SGC creados`);
  }

  static async createProductosHistorial(): Promise<void> {
    console.log('📋 Creando Productos Historial...');
    
    const data = [
      {
        id: 'HIST-001',
        organization_id: 1,
        producto_id: 'PROD-001',
        version_anterior: '2.0',
        version_nueva: '2.1',
        tipo_cambio: 'modificacion',
        motivo_cambio: 'Mejora solicitada por clientes',
        usuario_responsable: 'EMP002',
        aprobacion_requerida: true,
        validacion_requerida: true,
        validacion_completada: true,
        fecha_cambio: new Date(),
        created_at: new Date()
      }
    ];

    await ProductosHistorial.deleteMany({});
    const created = await ProductosHistorial.insertMany(data);
    console.log(`✅ ${created.length} historiales productos creados`);
  }

  static async createCRMActivosInmuebles(): Promise<void> {
    console.log('🏠 Creando CRM Activos Inmuebles...');
    
    const data = [
      {
        id: 'ACTIVO-001',
        organization_id: 1,
        cliente_id: 'CLI-001',
        tipo_inmueble: 'terreno',
        nombre_inmueble: 'Rancho San José',
        direccion: 'Km 15 Carretera Texcoco',
        ciudad: 'Texcoco',
        estado: 'Estado de México',
        superficie_total: 500.0,
        valor_comercial: 25000000,
        moneda: 'MXN',
        uso_actual: 'Agricultura',
        estado_conservacion: 'bueno',
        potencial_agricola: true,
        acceso_agua: true,
        acceso_electricidad: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await CRM_ActivosInmuebles.deleteMany({});
    const created = await CRM_ActivosInmuebles.insertMany(data);
    console.log(`✅ ${created.length} activos inmuebles creados`);
  }

  static async createCRMAnalisisRiesgo(): Promise<void> {
    console.log('⚠️ Creando CRM Análisis Riesgo...');
    
    const data = [
      {
        id: 'RIESGO-001',
        organization_id: 1,
        cliente_id: 'CLI-001',
        tipo_analisis: 'integral',
        fecha_analisis: new Date(),
        periodo_evaluacion: '2024',
        analista_responsable: 'EMP001',
        zona_climatica: 'Templado',
        nivel_riesgo_general: 'bajo',
        puntuacion_maxima: 100,
        fecha_proxima_revision: new Date('2024-12-31'),
        frecuencia_revision: 'anual',
        estado: 'aprobado',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await CRM_AnalisisRiesgo.deleteMany({});
    const created = await CRM_AnalisisRiesgo.insertMany(data);
    console.log(`✅ ${created.length} análisis riesgo creados`);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  CreateCollections.createAll()
    .then(() => {
      console.log('🎉 ¡Proceso completado!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

export { CreateCollections };