const mongoose = require('mongoose');

async function main() {
  try {
    await mongoose.connect('mongodb+srv://usuario:usuario@cluster0.hatcfri.mongodb.net/9001app-v6');
    console.log('Conectado a MongoDB');

    const ProcessDefinition = require('./dist/models/ProcessDefinition').default;
    const QualityObjective = require('./dist/models/QualityObjective').default;
    const QualityIndicator = require('./dist/models/QualityIndicator').default;
    const Measurement = require('./dist/models/Measurement').default;

    // Buscar proceso Control de Calidad
    const process = await ProcessDefinition.findOne({ name: 'Control de Calidad' });
    if (!process) {
      console.log('No se encontró el proceso');
      return;
    }

    console.log('Proceso encontrado:', process.name);

    // Crear objetivo
    const objective = new QualityObjective({
      title: 'Reducir defectos',
      description: 'Disminuir defectos de calidad',
      target_value: 2,
      current_value: 5,
      unit: '%',
      process_definition_id: process._id,
      priority: 'alto',
      due_date: new Date('2024-12-31'),
      organization_id: '1',
      created_by: process.created_by,
      status: 'en_progreso'
    });
    await objective.save();
    console.log('Objetivo creado');

    // Crear indicador
    const indicator = new QualityIndicator({
      name: 'Porcentaje de Defectos',
      description: 'Defectos detectados',
      current_value: '5',
      target_value: '2',
      measurement_unit: '%',
      measurement_frequency: 'Diario',
      process_definition_id: process._id,
      organization_id: '1',
      created_by: process.created_by
    });
    await indicator.save();
    console.log('Indicador creado');

    // Crear medición
    const measurement = new Measurement({
      indicator_id: indicator._id,
      value: 5,
      unit: '%',
      measurement_date: new Date(),
      responsible: 'Inspector',
      observations: 'Medición inicial',
      status: 'aprobado',
      organization_id: '1',
      created_by: process.created_by
    });
    await measurement.save();
    console.log('Medición creada');

    console.log('Datos insertados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
