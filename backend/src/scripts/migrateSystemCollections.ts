import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Importar solo los modelos del sistema que acabamos de crear
import { OrganizationFeatures } from '../models/OrganizationFeatures';
import { Planes } from '../models/Planes';
import { RefreshTokens } from '../models/RefreshTokens';
import { Suscripciones } from '../models/Suscripciones';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/9001app';

/**
 * Script específico para migrar solo las colecciones del sistema
 * Enfocado en completar la Tarea 2: Crear modelos MongoDB para funcionalidades del sistema
 */
class SystemCollectionsMigration {
  
  /**
   * Ejecutar migración de colecciones del sistema
   */
  static async migrateSystemCollections(): Promise<void> {
    try {
      console.log('🔧 Iniciando migración de colecciones del sistema...');
      
      // Conectar a MongoDB
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Conectado a MongoDB');

      // 1. Migrar Planes
      console.log('📋 Creando Planes...');
      const planesData = [
        {
          id: 1,
          nombre: 'Plan Gratuito',
          descripcion: 'Plan básico gratuito para organizaciones pequeñas',
          precio_mensual: 0.00,
          precio_anual: 0.00,
          max_usuarios: 3,
          max_departamentos: 2,
          max_documentos: 50,
          max_auditorias: 2,
          max_hallazgos: 20,
          max_acciones: 30,
          caracteristicas: 'Funcionalidades básicas, soporte por email',
          estado: 'activo',
          es_plan_gratuito: true,
          orden_display: 1,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          nombre: 'Plan Profesional',
          descripcion: 'Plan profesional para organizaciones medianas',
          precio_mensual: 2500.00,
          precio_anual: 25000.00,
          max_usuarios: 15,
          max_departamentos: 8,
          max_documentos: 500,
          max_auditorias: 12,
          max_hallazgos: 100,
          max_acciones: 200,
          caracteristicas: 'Todas las funcionalidades, reportes avanzados, soporte prioritario',
          estado: 'activo',
          es_plan_gratuito: false,
          orden_display: 2,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 3,
          nombre: 'Plan Empresarial',
          descripcion: 'Plan empresarial para organizaciones grandes',
          precio_mensual: 5000.00,
          precio_anual: 50000.00,
          max_usuarios: 100,
          max_departamentos: 25,
          max_documentos: 2000,
          max_auditorias: 50,
          max_hallazgos: 500,
          max_acciones: 1000,
          caracteristicas: 'Funcionalidades ilimitadas, integraciones API, soporte 24/7',
          estado: 'activo',
          es_plan_gratuito: false,
          orden_display: 3,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      await Planes.deleteMany({});
      const createdPlanes = await Planes.insertMany(planesData);
      console.log(`✅ ${createdPlanes.length} planes creados`);

      // 2. Migrar Organization Features
      console.log('🔧 Creando Organization Features...');
      const organizationFeaturesData = [
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
        },
        {
          id: 3,
          organization_id: 1,
          feature_name: 'sgc_module',
          is_enabled: true,
          created_at: new Date()
        },
        {
          id: 4,
          organization_id: 1,
          feature_name: 'auditorias_module',
          is_enabled: true,
          created_at: new Date()
        },
        {
          id: 5,
          organization_id: 1,
          feature_name: 'documentos_module',
          is_enabled: true,
          created_at: new Date()
        },
        {
          id: 6,
          organization_id: 1,
          feature_name: 'indicadores_module',
          is_enabled: true,
          created_at: new Date()
        },
        {
          id: 7,
          organization_id: 1,
          feature_name: 'procesos_module',
          is_enabled: true,
          created_at: new Date()
        },
        {
          id: 8,
          organization_id: 1,
          feature_name: 'reportes_avanzados',
          is_enabled: true,
          created_at: new Date()
        },
        {
          id: 9,
          organization_id: 1,
          feature_name: 'soporte_prioritario',
          is_enabled: true,
          created_at: new Date()
        }
      ];

      await OrganizationFeatures.deleteMany({});
      const createdFeatures = await OrganizationFeatures.insertMany(organizationFeaturesData);
      console.log(`✅ ${createdFeatures.length} organization features creadas`);

      // 3. Migrar Suscripciones
      console.log('💳 Creando Suscripciones...');
      const suscripcionesData = [
        {
          id: 1,
          organization_id: 1,
          plan_id: 2, // Plan Profesional
          estado: 'activa',
          fecha_inicio: new Date('2024-01-01'),
          fecha_fin: new Date('2024-12-31'),
          fecha_proximo_pago: new Date('2024-02-01'),
          metodo_pago: 'tarjeta_credito',
          precio_actual: 2500.00,
          moneda: 'MXN',
          periodo_facturacion: 'mensual',
          auto_renovacion: true,
          created_at: new Date(),
          updated_at: new Date(),
          created_by: 1,
          updated_by: 1
        }
      ];

      await Suscripciones.deleteMany({});
      const createdSuscripciones = await Suscripciones.insertMany(suscripcionesData);
      console.log(`✅ ${createdSuscripciones.length} suscripciones creadas`);

      // 4. Migrar Refresh Tokens (ejemplos para testing)
      console.log('🔑 Creando Refresh Tokens de ejemplo...');
      const refreshTokensData = [
        {
          id: 1,
          user_id: 1,
          token: 'refresh_token_example_1_' + Date.now(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          created_at: new Date()
        },
        {
          id: 2,
          user_id: 2,
          token: 'refresh_token_example_2_' + Date.now(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          created_at: new Date()
        }
      ];

      await RefreshTokens.deleteMany({});
      const createdTokens = await RefreshTokens.insertMany(refreshTokensData);
      console.log(`✅ ${createdTokens.length} refresh tokens creados`);

      console.log('🎉 Migración de colecciones del sistema completada exitosamente!');
      
    } catch (error) {
      console.error('❌ Error durante la migración:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Desconectado de MongoDB');
    }
  }
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  SystemCollectionsMigration.migrateSystemCollections()
    .then(() => {
      console.log('🎉 Migración de colecciones del sistema completada exitosamente!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error durante la migración:', error);
      process.exit(1);
    });
}

export { SystemCollectionsMigration };