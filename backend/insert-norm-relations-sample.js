const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/9001app-v6';

async function insertSampleRelations() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const db = mongoose.connection.db;

    // Obtener IDs de ejemplo
    const sampleProcess = await db.collection('process_definitions').findOne({ organization_id: '1' });
    const sampleUser = await db.collection('users').findOne({});

    if (!sampleProcess) {
      console.log('⚠️  No hay procesos en la base de datos. Ejecuta primero insert-sample-data.js');
      return;
    }

    // Crear puntos de norma de ejemplo si no existen
    const normPoints = [
      {
        code: '4.1',
        title: 'Comprensión de la organización y su contexto',
        description: 'La organización debe determinar las cuestiones externas e internas pertinentes',
        chapter: 4,
        section: '4.1',
        category: 'contexto',
        requirements: 'Determinar cuestiones externas e internas que afectan la capacidad del SGC',
        guidance: 'Analizar factores FODA, contexto estratégico, partes interesadas',
        status: 'vigente',
        version: 'ISO 9001:2015',
        keywords: ['contexto', 'analisis', 'organizacion', 'foda'],
        is_mandatory: true,
        priority: 'alta',
        is_active: true,
        created_by: sampleUser?._id || new mongoose.Types.ObjectId(),
        effective_date: new Date('2015-09-15')
      },
      {
        code: '8.5.1',
        title: 'Control de la producción y provisión del servicio',
        description: 'Implementar la producción bajo condiciones controladas',
        chapter: 8,
        section: '8.5.1',
        category: 'operacion',
        requirements: 'Disponibilidad de información, instrucciones, equipos apropiados, seguimiento',
        guidance: 'Establecer procedimientos de producción, controles en proceso',
        status: 'vigente',
        version: 'ISO 9001:2015',
        keywords: ['produccion', 'control', 'operacion', 'calidad'],
        is_mandatory: true,
        priority: 'alta',
        is_active: true,
        created_by: sampleUser?._id || new mongoose.Types.ObjectId(),
        effective_date: new Date('2015-09-15')
      }
    ];

    for (const point of normPoints) {
      await db.collection('puntos_norma').updateOne(
        { code: point.code },
        { $set: point },
        { upsert: true }
      );
    }
    console.log('✅ Puntos de norma de ejemplo insertados');

    // Crear relaciones de ejemplo
    const normPoint41 = await db.collection('puntos_norma').findOne({ code: '4.1' });
    const normPoint851 = await db.collection('puntos_norma').findOne({ code: '8.5.1' });

    const relations = [
      {
        norm_point_id: normPoint41._id,
        process_id: sampleProcess._id,
        document_ids: [],
        compliance_status: 'completo',
        compliance_percentage: 100,
        evidence_description: 'Análisis FODA documentado en el proceso de planificación estratégica',
        evidence_files: [],
        responsible_user_id: sampleUser?._id || new mongoose.Types.ObjectId(),
        verification_date: new Date(),
        next_review_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 meses
        audit_comments: [{
          date: new Date(),
          auditor_id: sampleUser?._id || new mongoose.Types.ObjectId(),
          comment: 'Cumplimiento verificado en auditoría interna',
          status: 'conforme'
        }],
        organization_id: '1',
        is_active: true,
        created_by: sampleUser?._id || new mongoose.Types.ObjectId(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        norm_point_id: normPoint851._id,
        process_id: sampleProcess._id,
        document_ids: [],
        compliance_status: 'parcial',
        compliance_percentage: 60,
        evidence_description: 'Procedimientos de producción en desarrollo',
        evidence_files: [],
        responsible_user_id: sampleUser?._id || new mongoose.Types.ObjectId(),
        verification_date: null,
        next_review_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 mes
        audit_comments: [],
        organization_id: '1',
        is_active: true,
        created_by: sampleUser?._id || new mongoose.Types.ObjectId(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await db.collection('norm_process_doc_relations').deleteMany({ organization_id: '1' });
    await db.collection('norm_process_doc_relations').insertMany(relations);

    console.log('✅ Relaciones de ejemplo insertadas');
    console.log(`📊 Total de relaciones: ${relations.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

insertSampleRelations();