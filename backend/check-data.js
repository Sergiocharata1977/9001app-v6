const mongoose = require('mongoose');

async function checkData() {
  try {
    await mongoose.connect('mongodb+srv://usuario:usuario@cluster0.hatcfri.mongodb.net/9001app-v6');
    console.log('=== VERIFICANDO DATOS EN MONGODB ===\n');

    // 1. PROCESOS
    const ProcessDefinition = require('./dist/models/ProcessDefinition').default;
    const processes = await ProcessDefinition.find();
    console.log('1. PROCESOS:');
    console.log(`Total procesos: ${processes.length}`);
    processes.forEach(p => console.log(`- ${p.name} (ID: ${p._id})`));

    // 2. OBJETIVOS DE CALIDAD
    try {
      const QualityObjective = require('./dist/models/QualityObjective').default;
      const objectives = await QualityObjective.find();
      console.log('\n2. OBJETIVOS DE CALIDAD:');
      console.log(`Total objetivos: ${objectives.length}`);
      objectives.forEach(o => console.log(`- ${o.title} (Proceso: ${o.process_definition_id})`));
    } catch (e) {
      console.log('\n2. OBJETIVOS DE CALIDAD:');
      console.log('Modelo no encontrado o error:', e.message);
    }

    // 3. INDICADORES
    try {
      const QualityIndicator = require('./dist/models/QualityIndicator').default;
      const indicators = await QualityIndicator.find();
      console.log('\n3. INDICADORES:');
      console.log(`Total indicadores: ${indicators.length}`);
      indicators.forEach(i => console.log(`- ${i.name} (Proceso: ${i.process_definition_id})`));
    } catch (e) {
      console.log('\n3. INDICADORES:');
      console.log('Modelo no encontrado o error:', e.message);
    }

    // 4. MEDICIONES
    try {
      const Measurement = require('./dist/models/Measurement').default;
      const measurements = await Measurement.find();
      console.log('\n4. MEDICIONES:');
      console.log(`Total mediciones: ${measurements.length}`);
      measurements.forEach(m => console.log(`- Valor: ${m.value} (Indicador: ${m.indicator_id})`));
    } catch (e) {
      console.log('\n4. MEDICIONES:');
      console.log('Modelo no encontrado o error:', e.message);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkData();


