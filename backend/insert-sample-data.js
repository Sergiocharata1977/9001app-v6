const mongoose = require('mongoose');

async function insertSampleData() {
  try {
    await mongoose.connect('mongodb+srv://usuario:usuario@cluster0.hatcfri.mongodb.net/9001app-v6');
    console.log('=== INSERTANDO DATOS DE PRUEBA ===\n');

    // Importar modelos
    const ProcessDefinition = require('./dist/models/ProcessDefinition').default;
    const QualityObjective = require('./dist/models/QualityObjective').default;
    const QualityIndicator = require('./dist/models/QualityIndicator').default;
    const Measurement = require('./dist/models/Measurement').default;

    // 1. Obtener el proceso "Control de Calidad"
    const process = await ProcessDefinition.findOne({ name: 'Control de Calidad' });
    if (!process) {
      console.log('❌ No se encontró el proceso "Control de Calidad"');
      process.exit(1);
    }
    console.log(`✅ Proceso encontrado: ${process.name} (ID: ${process._id})`);

    // 2. Crear Objetivos de Calidad
    console.log('\n📋 Creando Objetivos de Calidad...');
    const objectives = [
      {
        title: 'Reducir defectos de calidad',
        description: 'Disminuir el porcentaje de productos defectuosos en el proceso de control de calidad',
        target_value: 2,
        current_value: 5,
        unit: '%',
        process_definition_id: process._id,
        priority: 'alto',
        due_date: new Date('2024-12-31'),
        organization_id: '1',
        created_by: process.created_by,
        status: 'en_progreso'
      },
      {
        title: 'Mejorar tiempo de inspección',
        description: 'Reducir el tiempo promedio de inspección de productos',
        target_value: 15,
        current_value: 25,
        unit: 'minutos',
        process_definition_id: process._id,
        priority: 'medio',
        due_date: new Date('2024-11-30'),
        organization_id: '1',
        created_by: process.created_by,
        status: 'pendiente'
      }
    ];

    for (const objData of objectives) {
      const objective = new QualityObjective(objData);
      await objective.save();
      console.log(`✅ Objetivo creado: ${objective.title}`);
    }

    // 3. Crear Indicadores de Calidad
    console.log('\n📊 Creando Indicadores de Calidad...');
    const indicators = [
      {
        name: 'Porcentaje de Defectos',
        description: 'Porcentaje de productos defectuosos detectados en inspección',
        current_value: '5',
        target_value: '2',
        measurement_unit: '%',
        measurement_frequency: 'Diario',
        process_definition_id: process._id,
        organization_id: '1',
        created_by: process.created_by
      },
      {
        name: 'Tiempo de Inspección',
        description: 'Tiempo promedio de inspección por producto',
        current_value: '25',
        target_value: '15',
        measurement_unit: 'minutos',
        measurement_frequency: 'Diario',
        process_definition_id: process._id,
        organization_id: '1',
        created_by: process.created_by
      },
      {
        name: 'Eficiencia de Inspección',
        description: 'Productos inspeccionados por hora',
        current_value: '12',
        target_value: '20',
        measurement_unit: 'productos/hora',
        measurement_frequency: 'Semanal',
        process_definition_id: process._id,
        organization_id: '1',
        created_by: process.created_by
      }
    ];

    const createdIndicators = [];
    for (const indData of indicators) {
      const indicator = new QualityIndicator(indData);
      await indicator.save();
      createdIndicators.push(indicator);
      console.log(`✅ Indicador creado: ${indicator.name}`);
    }

    // 4. Crear Mediciones
    console.log('\n📏 Creando Mediciones...');
    for (const indicator of createdIndicators) {
      const measurements = [
        {
          indicator_id: indicator._id,
          value: parseFloat(indicator.current_value),
          unit: indicator.measurement_unit,
          measurement_date: new Date(),
          responsible: 'Inspector de Calidad',
          observations: 'Medición inicial del indicador',
          status: 'aprobado',
          organization_id: '1',
          created_by: process.created_by
        },
        {
          indicator_id: indicator._id,
          value: parseFloat(indicator.current_value) + (Math.random() - 0.5) * 2,
          unit: indicator.measurement_unit,
          measurement_date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ayer
          responsible: 'Inspector de Calidad',
          observations: 'Medición del día anterior',
          status: 'aprobado',
          organization_id: '1',
          created_by: process.created_by
        }
      ];

      for (const measData of measurements) {
        const measurement = new Measurement(measData);
        await measurement.save();
        console.log(`✅ Medición creada: ${measurement.value} ${measurement.unit} para ${indicator.name}`);
      }
    }

    console.log('\n🎉 ¡Datos de prueba insertados exitosamente!');
    console.log(`- 2 Objetivos de Calidad`);
    console.log(`- 3 Indicadores de Calidad`);
    console.log(`- 6 Mediciones`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

insertSampleData();

