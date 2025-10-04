const mongoose = require('mongoose');
require('dotenv').config();

// Script para limpiar colecciones duplicadas de procesos
async function cleanupCollections() {
  try {
    console.log('🚀 Iniciando limpieza de colecciones duplicadas...');

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado a MongoDB');

    // Obtener lista de colecciones antes de la limpieza
    const db = mongoose.connection.db;
    const collectionsBefore = await db.listCollections().toArray();
    console.log('📊 Colecciones antes de la limpieza:', collectionsBefore.map(c => c.name));

    // Colecciones a eliminar (duplicadas)
    const collectionsToDelete = [
      'processdefinitions',
      'processdocuments',
      'processes',
      'processrecords'
    ];

    // Colección a mantener (unificada)
    const collectionToKeep = 'processunifieds';

    console.log('🗑️ Colecciones a eliminar:', collectionsToDelete);
    console.log('✅ Colección a mantener:', collectionToKeep);

    // Confirmación de seguridad
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    await new Promise((resolve) => {
      rl.question('⚠️  ¿Está seguro de que desea eliminar las colecciones duplicadas? (Escriba "SÍ" para confirmar): ', (answer) => {
        if (answer.toUpperCase() !== 'SÍ') {
          console.log('❌ Operación cancelada por el usuario');
          process.exit(0);
        }
        rl.close();
        resolve();
      });
    });

    // Verificar que existe la colección unificada antes de eliminar las otras
    const unifiedExists = await db.listCollections({ name: collectionToKeep }).hasNext();
    if (!unifiedExists) {
      console.log('⚠️  Advertencia: La colección unificada "processunifieds" no existe aún.');
      console.log('💡 Recomendación: Ejecute el seeder primero antes de la limpieza.');
    }

    // Eliminar colecciones duplicadas
    for (const collectionName of collectionsToDelete) {
      try {
        const collectionExists = await db.listCollections({ name: collectionName }).hasNext();

        if (collectionExists) {
          // Contar documentos antes de eliminar
          const count = await db.collection(collectionName).countDocuments();
          console.log(`📈 Colección "${collectionName}": ${count} documentos`);

          // Eliminar colección
          await db.dropCollection(collectionName);
          console.log(`✅ Eliminada colección: ${collectionName}`);
        } else {
          console.log(`ℹ️  Colección "${collectionName}" no existe, omitiendo...`);
        }
      } catch (error) {
        console.error(`❌ Error eliminando colección ${collectionName}:`, error.message);
      }
    }

    // Obtener lista de colecciones después de la limpieza
    const collectionsAfter = await db.listCollections().toArray();
    console.log('📊 Colecciones después de la limpieza:', collectionsAfter.map(c => c.name));

    // Verificar colección unificada
    const unifiedCollection = await db.collection(collectionToKeep);
    const unifiedCount = await unifiedCollection.countDocuments();
    console.log(`✅ Colección unificada "${collectionToKeep}": ${unifiedCount} documentos`);

    console.log('🎉 Limpieza completada exitosamente!');
    console.log('📋 Resumen:');
    console.log(`   - Colecciones eliminadas: ${collectionsToDelete.length}`);
    console.log(`   - Colección mantenida: ${collectionToKeep} (${unifiedCount} documentos)`);

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  cleanupCollections();
}

module.exports = { cleanupCollections };