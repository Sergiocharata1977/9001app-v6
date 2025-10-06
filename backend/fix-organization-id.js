const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/9001app-v6';

async function fixOrganizationIds() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    console.log('📊 Base de datos:', mongoose.connection.db.databaseName);

    const db = mongoose.connection.db;

    // Colecciones a actualizar
    const collections = [
      'process_definitions',
      'process_records',
      'quality_objectives',
      'quality_indicators',
      'measurements',
      'users'
    ];

    console.log('\n🔧 Actualizando organization_id en todas las colecciones...\n');

    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        
        // Verificar si la colección existe
        const exists = await db.listCollections({ name: collectionName }).hasNext();
        if (!exists) {
          console.log(`⚠️  Colección "${collectionName}" no existe, saltando...`);
          continue;
        }

        // Contar documentos antes
        const countBefore = await collection.countDocuments({});
        
        // Actualizar de 'org-001' a '1'
        const result1 = await collection.updateMany(
          { organization_id: 'org-001' },
          { $set: { organization_id: '1' } }
        );

        // Actualizar de 'org-1' a '1'
        const result2 = await collection.updateMany(
          { organization_id: 'org-1' },
          { $set: { organization_id: '1' } }
        );

        // Actualizar documentos sin organization_id
        const result3 = await collection.updateMany(
          { organization_id: { $exists: false } },
          { $set: { organization_id: '1' } }
        );

        const totalModified = result1.modifiedCount + result2.modifiedCount + result3.modifiedCount;
        
        if (totalModified > 0) {
          console.log(`✅ ${collectionName}:`);
          console.log(`   - Documentos totales: ${countBefore}`);
          console.log(`   - Actualizados: ${totalModified}`);
          console.log(`   - org-001 → 1: ${result1.modifiedCount}`);
          console.log(`   - org-1 → 1: ${result2.modifiedCount}`);
          console.log(`   - Sin org_id → 1: ${result3.modifiedCount}`);
        } else {
          console.log(`✓ ${collectionName}: Ya actualizado (${countBefore} docs)`);
        }

      } catch (error) {
        console.error(`❌ Error en ${collectionName}:`, error.message);
      }
    }

    console.log('\n📊 Verificando datos finales...\n');

    // Verificar process_definitions
    const processCount = await db.collection('process_definitions').countDocuments({ organization_id: '1' });
    console.log(`✅ Procesos con organization_id='1': ${processCount}`);

    // Verificar process_records
    const recordCount = await db.collection('process_records').countDocuments({ organization_id: '1' });
    console.log(`✅ Tareas con organization_id='1': ${recordCount}`);

    console.log('\n✅ Actualización completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar el script
fixOrganizationIds();
