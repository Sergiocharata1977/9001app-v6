const mongoose = require('mongoose');
require('dotenv').config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const RoadmapTask = mongoose.model('RoadmapTask', new mongoose.Schema({
      organization_id: String,
      title: String,
      description: String,
      module: String,
      status: String,
      priority: String,
      type: String,
      assignedTo: String,
      estimatedDays: Number,
      tags: [String],
      abmType: String,
      phase: String,
      order: Number,
      createdBy: String,
      isActive: Boolean
    }, { timestamps: true }));

    // Clear existing
    await RoadmapTask.deleteMany({ organization_id: 'org-default' });
    
    // Insert test data
    await RoadmapTask.insertMany([
      {
        organization_id: 'org-default',
        title: 'Setup Playwright',
        description: 'Configurar framework de testing',
        module: 'testing',
        status: 'done',
        priority: 'critical',
        type: 'testing',
        assignedTo: 'developer',
        estimatedDays: 2,
        phase: 'v6.1',
        tags: ['testing', 'setup'],
        order: 1,
        createdBy: 'seeder',
        isActive: true
      },
      {
        organization_id: 'org-default',
        title: 'Tests CRM: Oportunidades',
        description: 'Tests E2E para CRUD de oportunidades',
        module: 'crm',
        status: 'in_progress',
        priority: 'high',
        type: 'testing',
        abmType: 'create',
        assignedTo: 'ia',
        estimatedDays: 2,
        phase: 'v6.1',
        tags: ['crm', 'testing'],
        order: 1,
        createdBy: 'seeder',
        isActive: true
      },
      {
        organization_id: 'org-default',
        title: 'Tests Auditorías',
        description: 'Tests para módulo de auditorías',
        module: 'auditorias',
        status: 'todo',
        priority: 'high',
        type: 'testing',
        assignedTo: 'developer',
        estimatedDays: 3,
        phase: 'v6.1',
        tags: ['auditorias', 'testing'],
        order: 2,
        createdBy: 'seeder',
        isActive: true
      },
      {
        organization_id: 'org-default',
        title: 'CI/CD GitHub Actions',
        description: 'Configurar pipeline automático',
        module: 'general',
        status: 'todo',
        priority: 'critical',
        type: 'feature',
        assignedTo: 'developer',
        estimatedDays: 1,
        phase: 'v6.1',
        tags: ['ci/cd', 'github'],
        order: 3,
        createdBy: 'seeder',
        isActive: true
      },
      {
        organization_id: 'org-default',
        title: 'Dashboard de Trazabilidad',
        description: 'Vista interactiva de relaciones',
        module: 'general',
        status: 'backlog',
        priority: 'medium',
        type: 'feature',
        assignedTo: 'developer',
        estimatedDays: 5,
        phase: 'v6.5',
        tags: ['dashboard', 'trazabilidad'],
        order: 1,
        createdBy: 'seeder',
        isActive: true
      }
    ]);
    
    console.log('✅ Seeded successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

seed();
