import { masterSeeder } from '../seeders/masterSeeder';

async function runSeeder() {
  try {
    console.log('🚀 Ejecutando seeder desde script...\n');
    
    const result = await masterSeeder.seedAll();
    
    if (result.success) {
      console.log('\n✅ Seeder ejecutado exitosamente!');
      process.exit(0);
    } else {
      console.log('\n❌ Error ejecutando seeder');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

runSeeder();