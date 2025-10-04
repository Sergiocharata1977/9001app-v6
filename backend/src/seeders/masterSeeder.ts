import { connectDB } from '../config/database';
import userSeeder from './userSeeder';
import processDefinitionSeeder from './processDefinitionSeeder';

export const masterSeeder = {
  async seedAll() {
    try {
      console.log('🚀 Iniciando seeder maestro...\n');

      // Conectar a la base de datos si no está conectada
      await connectDB();

      // Ejecutar seeders en orden
      console.log('1️⃣ Ejecutando seeder de usuarios y departamentos...');
      const userData = await userSeeder.seed();
      
      console.log('\n2️⃣ Ejecutando seeder de definiciones de procesos...');
      const processData = await processDefinitionSeeder.seed();

      console.log('\n🎉 ¡Seeder maestro completado exitosamente!');
      console.log('\n📊 Resumen final:');
      console.log(`- Organización: ${userData.organization.name}`);
      console.log(`- Usuarios: ${userData.users.length}`);
      console.log(`- Departamentos: ${userData.departments.length}`);
      console.log(`- Procesos: ${processData.count}`);

      return {
        success: true,
        userData,
        processData
      };

    } catch (error) {
      console.error('❌ Error en seeder maestro:', error);
      throw error;
    }
  },

  async clearAll() {
    try {
      console.log('🗑️ Limpiando todos los datos...\n');

      // Conectar a la base de datos si no está conectada
      await connectDB();

      // Limpiar en orden inverso
      console.log('1️⃣ Limpiando procesos...');
      await processDefinitionSeeder.clear();
      
      console.log('2️⃣ Limpiando usuarios y departamentos...');
      await userSeeder.clear();

      console.log('\n✅ Todos los datos han sido limpiados');

      return { success: true };

    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
      throw error;
    }
  }
};

export default masterSeeder;