import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/9001app';

async function cleanDatabase() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    console.log('🧹 Limpiando base de datos...');
    
    // Verificar que la conexión esté establecida
    if (!mongoose.connection.db) {
      throw new Error('No hay conexión a la base de datos');
    }
    
    // Obtener todas las colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log(`📋 Encontradas ${collections.length} colecciones:`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Eliminar todas las colecciones
    for (const collection of collections) {
      try {
        const count = await mongoose.connection.db.collection(collection.name).countDocuments();
        await mongoose.connection.db.collection(collection.name).drop();
        console.log(`🗑️  Colección '${collection.name}' eliminada (${count} documentos)`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.log(`⚠️  Error al eliminar '${collection.name}':`, errorMessage);
      }
    }

    console.log('✅ Base de datos limpiada completamente');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  cleanDatabase()
    .then(() => {
      console.log('🎉 Limpieza completada exitosamente!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export { cleanDatabase };