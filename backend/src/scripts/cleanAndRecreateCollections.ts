import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/9001app';

// Importar todos los modelos existentes
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { Department } from '../models/Department';
import { Personnel } from '../models/Personnel';
import { Position } from '../models/Position';
import { QualityObjective } from '../models/QualityObjective';
import { QualityIndicator } from '../models/QualityIndicator';
import { Measurement } from '../models/Measurement';
import { NormPoint } from '../models/NormPoint';
import { Proceso } from '../models/PROCESO';
import { ProcessRecord } from '../models/ProcessRecord';

// Importar modelos basados en Turso
import { Documentos } from '../models/documentos';
import { Hallazgos } from '../models/hallazgos';
import { Indicadores } from '../models/indicadores';
import { Mediciones } from '../models/mediciones';
import { Departamentos } from '../models/departamentos';
import { Competencias } from '../models/competencias';
import { Encuestas } from '../models/encuestas';
import { Minutas } from '../models/minutas';
import { Limites_uso } from '../models/limites_uso';

// Lista de todas las colecciones a limpiar
const collectionsToClean = [
  'users',
  'organizations',
  'departments',
  'personnel',
  'positions',
  'qualityobjectives',
  'qualityindicators',
  'measurements',
  'normpoints',
  'procesos',
  'processrecords',
  'documentos',
  'hallazgos',
  'indicadores',
  'mediciones',
  'departamentos',
  'competencias',
  'encuestas',
  'minutas',
  'limites_uso',
  // Colecciones CRM (opcional - comentar si no se necesitan)
  'crm_actividades_agro',
  'crm_activos_inmuebles',
  'crm_analisis_riesgo',
  'crm_balances_financieros',
  'crm_clientes_agro',
  'crm_contactos',
  'crm_cultivos_cliente',
  'crm_cultivos_lote',
  'crm_explotaciones_agricolas',
  'crm_flujo_caja',
  'crm_impuestos_mensuales',
  'crm_lotes',
  'crm_metricas_agro',
  'crm_oportunidades_agro',
  'crm_productos_agro',
  'crm_zonas_geograficas',
  // Colecciones RRHH
  'rrhh_capacitaciones',
  'rrhh_competencias',
  'rrhh_evaluaciones_individuales',
  'rrhh_evaluacion_programacion',
  'rrhh_temas_capacitacion',
  // Colecciones de evaluación
  'evaluacion_programacion',
  'evaluaciones_competencias_detalle',
  'evaluaciones_individuales'
];

async function cleanCollections() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/9001app');
    console.log('✅ Conectado a MongoDB');

    console.log('🧹 Limpiando colecciones...');
    
    for (const collectionName of collectionsToClean) {
      try {
        const collection = mongoose.connection.db?.collection(collectionName);
        if (collection) {
          const count = await collection.countDocuments();
          
          if (count > 0) {
            await collection.drop();
            console.log(`🗑️  Colección '${collectionName}' eliminada (${count} documentos)`);
          } else {
            console.log(`ℹ️  Colección '${collectionName}' ya estaba vacía`);
          }
        } else {
          console.log(`⚠️  Colección '${collectionName}' no encontrada`);
        }
      } catch (error) {
        console.log(`⚠️  Error al limpiar '${collectionName}':`, (error as Error).message);
      }
    }

    console.log('✅ Limpieza completada');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  }
}

async function recreateCollections() {
  try {
    console.log('🔄 Recreando colecciones...');

    // Recrear índices para las colecciones principales
    console.log('📊 Creando índices...');
    
    // Índices para Users
    await User.createIndexes();
    console.log('✅ Índices de Users creados');
    
    // Índices para Organizations
    await Organization.createIndexes();
    console.log('✅ Índices de Organizations creados');
    
    // Índices para Departments
    await Department.createIndexes();
    console.log('✅ Índices de Departments creados');
    
    // Índices para Personnel
    await Personnel.createIndexes();
    console.log('✅ Índices de Personnel creados');
    
    // Índices para Positions
    await Position.createIndexes();
    console.log('✅ Índices de Positions creados');
    
    // Índices para Quality Objectives
    await QualityObjective.createIndexes();
    console.log('✅ Índices de Quality Objectives creados');
    
    // Índices para Quality Indicators
    await QualityIndicator.createIndexes();
    console.log('✅ Índices de Quality Indicators creados');
    
    // Índices para Measurements
    await Measurement.createIndexes();
    console.log('✅ Índices de Measurements creados');
    
    // Índices para Norm Points
    await NormPoint.createIndexes();
    console.log('✅ Índices de Norm Points creados');
    
    // Índices para Procesos
    await Proceso.createIndexes();
    console.log('✅ Índices de Procesos creados');
    
    // Índices para Process Records
    await ProcessRecord.createIndexes();
    console.log('✅ Índices de Process Records creados');

    console.log('✅ Colecciones recreadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error al recrear colecciones:', error);
    throw error;
  }
}

async function seedInitialData() {
  try {
    console.log('🌱 Insertando datos iniciales...');

    // Crear organización por defecto
    const defaultOrg = new Organization({
      name: 'Organización Principal',
      email: 'admin@organizacion.com',
      phone: '+52 55 1234 5678',
      plan: 'premium',
      is_active: true
    });
    await defaultOrg.save();
    console.log('✅ Organización por defecto creada');

    // Crear usuario administrador
    const adminUser = new User({
      name: 'Administrador',
      email: 'admin@organizacion.com',
      role: 'admin',
      organization_id: defaultOrg._id,
      is_active: true
    });
    await adminUser.save();
    console.log('✅ Usuario administrador creado');

    // Crear departamento por defecto
    const defaultDept = new Department({
      name: 'Dirección General',
      description: 'Dirección estratégica de la organización',
      organization_id: defaultOrg._id,
      objectives: 'Liderar la organización hacia la excelencia operativa'
    });
    await defaultDept.save();
    console.log('✅ Departamento por defecto creado');

    // Crear puesto por defecto
    const defaultPosition = new Position({
      name: 'Director General',
      description_responsabilities: 'Liderar la organización y definir estrategias',
      requisitos_experiencia: 'Mínimo 10 años en puestos directivos',
      requisitos_formacion: 'Licenciatura en Administración o afín',
      departamento_id: defaultDept._id,
      organization_id: defaultOrg._id
    });
    await defaultPosition.save();
    console.log('✅ Puesto por defecto creado');

    // Crear personal por defecto
    const defaultPersonnel = new Personnel({
      organization_id: defaultOrg._id,
      nombres: 'Carlos',
      apellidos: 'Administrador',
      email: 'admin@organizacion.com',
      telefono: '+52 55 1234 5678',
      fecha_contratacion: new Date(),
      numero_legajo: 'EMP001',
      estado: 'Activo',
      tipo_personal: 'directivo'
    });
    await defaultPersonnel.save();
    console.log('✅ Personal por defecto creado');

    console.log('✅ Datos iniciales insertados');
    
  } catch (error) {
    console.error('❌ Error al insertar datos iniciales:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando limpieza y recreación de colecciones...');
    
    await cleanCollections();
    await recreateCollections();
    await seedInitialData();
    
    console.log('🎉 Proceso completado exitosamente!');
    console.log('📋 Resumen:');
    console.log(`   - ${collectionsToClean.length} colecciones limpiadas`);
    console.log('   - Índices recreados');
    console.log('   - Datos iniciales insertados');
    
  } catch (error) {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

export { cleanCollections, recreateCollections, seedInitialData };
