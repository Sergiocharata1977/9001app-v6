import mongoose from 'mongoose';
import { connectDB } from '../config/database';

/**
 * Script para crear índices críticos que mejoran performance
 * Ejecutar: npm run create-indexes
 */

async function createCriticalIndexes() {
  try {
    console.log('🔍 Conectando a MongoDB...');
    await connectDB();

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    console.log('✅ Conectado a MongoDB');
    console.log('📊 Creando índices críticos...\n');

    // Índices para CRM
    console.log('📁 CRM - Oportunidades');
    await db
      .collection('crm_oportunidades_agro')
      .createIndex({ organization_id: 1, etapa: 1, fecha_creacion: -1 }, { background: true });
    console.log('  ✅ Índice: organization_id + etapa + fecha_creacion');

    console.log('\n📁 CRM - Clientes');
    await db
      .collection('crm_clientes_agro')
      .createIndex({ organization_id: 1, nombre: 1 }, { background: true });
    console.log('  ✅ Índice: organization_id + nombre');

    console.log('\n📁 CRM - Legajos');
    await db
      .collection('legajos')
      .createIndex({ organization_id: 1, cliente_id: 1 }, { background: true });
    console.log('  ✅ Índice: organization_id + cliente_id');

    console.log('\n📁 CRM - Análisis de Crédito');
    await db
      .collection('crm_analisis_credito')
      .createIndex({ organization_id: 1, cliente_id: 1, fecha: -1 }, { background: true });
    console.log('  ✅ Índice: organization_id + cliente_id + fecha');

    // Índices para RRHH
    console.log('\n📁 RRHH - Personal');
    await db
      .collection('personal')
      .createIndex({ organization_id: 1, departamento_id: 1 }, { background: true });
    console.log('  ✅ Índice: organization_id + departamento_id');

    await db
      .collection('personal')
      .createIndex({ organization_id: 1, nombre: 1, apellido: 1 }, { background: true });
    console.log('  ✅ Índice: organization_id + nombre + apellido');

    console.log('\n📁 RRHH - Departamentos');
    await db.collection('departamentos').createIndex({ organization_id: 1 }, { background: true });
    console.log('  ✅ Índice: organization_id');

    console.log('\n📁 RRHH - Puestos');
    await db.collection('puestos').createIndex({ organization_id: 1 }, { background: true });
    console.log('  ✅ Índice: organization_id');

    // Índices para Documentos
    console.log('\n📁 Documentos');
    await db
      .collection('documentos')
      .createIndex({ organization_id: 1, categoria: 1, estado: 1 }, { background: true });
    console.log('  ✅ Índice: organization_id + categoria + estado');

    await db
      .collection('documentos')
      .createIndex({ organization_id: 1, fecha_creacion: -1 }, { background: true });
    console.log('  ✅ Índice: organization_id + fecha_creacion');

    // Índices para Normas
    console.log('\n📁 Normas');
    await db
      .collection('norm_points')
      .createIndex({ organization_id: 1, numero: 1 }, { background: true });
    console.log('  ✅ Índice: organization_id + numero');

    // Índices para Procesos
    console.log('\n📁 Procesos');
    await db
      .collection('process_definitions')
      .createIndex({ organization_id: 1, estado: 1 }, { background: true });
    console.log('  ✅ Índice: organization_id + estado');

    await db
      .collection('process_records')
      .createIndex({ organization_id: 1, process_id: 1, fecha: -1 }, { background: true });
    console.log('  ✅ Índice: organization_id + process_id + fecha');

    // Índices para Auditorías
    console.log('\n📁 Auditorías');
    await db
      .collection('audits')
      .createIndex({ organization_id: 1, fecha: -1 }, { background: true });
    console.log('  ✅ Índice: organization_id + fecha');

    // Índices para Calidad
    console.log('\n📁 Calidad - Objetivos');
    await db
      .collection('quality_objectives')
      .createIndex({ organization_id: 1, estado: 1 }, { background: true });
    console.log('  ✅ Índice: organization_id + estado');

    console.log('\n📁 Calidad - Indicadores');
    await db
      .collection('quality_indicators')
      .createIndex({ organization_id: 1, fecha: -1 }, { background: true });
    console.log('  ✅ Índice: organization_id + fecha');

    // Índices para Performance Metrics
    console.log('\n📁 Performance Metrics');
    await db
      .collection('performance_metrics')
      .createIndex({ organization_id: 1, module_id: 1, timestamp: -1 }, { background: true });
    console.log('  ✅ Índice: organization_id + module_id + timestamp');

    console.log('\n✅ ¡Todos los índices críticos creados exitosamente!');
    console.log('\n📊 Resumen:');
    console.log('  - CRM: 4 índices');
    console.log('  - RRHH: 4 índices');
    console.log('  - Documentos: 2 índices');
    console.log('  - Normas: 1 índice');
    console.log('  - Procesos: 2 índices');
    console.log('  - Auditorías: 1 índice');
    console.log('  - Calidad: 2 índices');
    console.log('  - Performance: 1 índice');
    console.log('  TOTAL: 17 índices\n');

    console.log('🚀 Mejora esperada en performance: 50-70%');
    console.log('⚡ Queries multi-tenant ahora serán mucho más rápidas\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando índices:', error);
    process.exit(1);
  }
}

// Ejecutar script
createCriticalIndexes();
