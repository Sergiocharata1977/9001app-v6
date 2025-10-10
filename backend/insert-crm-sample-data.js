// ============================================
// INSERTAR DATOS DE MUESTRA PARA CRM
// ============================================

const mongoose = require('mongoose');

// Cargar variables de entorno
require('dotenv').config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/iso9001-crm';
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Esquemas (simplificados para el script)
const crmClientesSchema = new mongoose.Schema({
  id: String,
  organization_id: String,
  razon_social: String,
  rfc: String,
  tipo_cliente: String,
  zona_geografica: String,
  ciudad: String,
  superficie_total: Number,
  created_at: { type: Date, default: Date.now },
  is_active: { type: Number, default: 1 }
}, { collection: 'crm_clientes_agro' });

const crmContactosSchema = new mongoose.Schema({
  id: String,
  organization_id: String,
  nombre: String,
  apellidos: String,
  cargo: String,
  empresa: String,
  email: String,
  telefono: String,
  tipo_contacto: String,
  estado_contacto: String,
  created_at: { type: Date, default: Date.now },
  is_active: { type: Number, default: 1 }
}, { collection: 'crm_contactos' });

const crmOportunidadesSchema = new mongoose.Schema({
  id: String,
  organization_id: String,
  contacto_id: String,
  titulo: String,
  descripcion: String,
  etapa: String,
  probabilidad: Number,
  valor_estimado: Number,
  moneda: String,
  vendedor_id: String,
  created_at: { type: Date, default: Date.now },
  is_active: { type: Number, default: 1 }
}, { collection: 'crm_oportunidades_agro' });

const crmActividadesSchema = new mongoose.Schema({
  id: String,
  organization_id: String,
  titulo: String,
  descripcion: String,
  tipo_actividad: String,
  fecha_actividad: String,
  estado: String,
  prioridad: String,
  vendedor_id: String,
  created_at: { type: String, default: () => new Date().toISOString() },
  is_active: { type: Number, default: 1 }
}, { collection: 'crm_actividades_agro' });

const CRMCliente = mongoose.model('CRMCliente', crmClientesSchema);
const CRMContacto = mongoose.model('CRMContacto', crmContactosSchema);
const CRMOportunidad = mongoose.model('CRMOportunidad', crmOportunidadesSchema);
const CRMActividad = mongoose.model('CRMActividad', crmActividadesSchema);

// Datos de muestra
const sampleData = {
  organizationId: 'ORG-2024-001',
  clientes: [
    {
      id: 'CLI-2024-001',
      organization_id: 'ORG-2024-001',
      razon_social: 'Estancia San Miguel S.A.',
      rfc: 'ESM-123456',
      tipo_cliente: 'grande',
      zona_geografica: 'Pampa Húmeda',
      ciudad: 'Buenos Aires',
      superficie_total: 5000,
    },
    {
      id: 'CLI-2024-002',
      organization_id: 'ORG-2024-001',
      razon_social: 'Agropecuaria Los Pinos',
      rfc: 'ALP-789012',
      tipo_cliente: 'mediano',
      zona_geografica: 'Región Centro',
      ciudad: 'Córdoba',
      superficie_total: 2500,
    },
    {
      id: 'CLI-2024-003',
      organization_id: 'ORG-2024-001',
      razon_social: 'Campo Verde S.A.',
      rfc: 'CVS-345678',
      tipo_cliente: 'corporativo',
      zona_geografica: 'Litoral',
      ciudad: 'Santa Fe',
      superficie_total: 8000,
    },
    {
      id: 'CLI-2024-004',
      organization_id: 'ORG-2024-001',
      razon_social: 'Estancia El Progreso',
      rfc: 'EPR-901234',
      tipo_cliente: 'pequeño',
      zona_geografica: 'Norte',
      ciudad: 'Salta',
      superficie_total: 1200,
    }
  ],
  contactos: [
    {
      id: 'CONT-2024-001',
      organization_id: 'ORG-2024-001',
      nombre: 'Carlos',
      apellidos: 'Rodriguez',
      cargo: 'Gerente General',
      empresa: 'Estancia San Miguel S.A.',
      email: 'carlos.rodriguez@estanciasanmiguel.com',
      telefono: '+54 11 1234-5678',
      tipo_contacto: 'cliente',
      estado_contacto: 'activo'
    },
    {
      id: 'CONT-2024-002',
      organization_id: 'ORG-2024-001',
      nombre: 'María',
      apellidos: 'González',
      cargo: 'Directora de Compras',
      empresa: 'Agropecuaria Los Pinos',
      email: 'maria.gonzalez@lospinos.com',
      telefono: '+54 351 987-6543',
      tipo_contacto: 'cliente',
      estado_contacto: 'activo'
    },
    {
      id: 'CONT-2024-003',
      organization_id: 'ORG-2024-001',
      nombre: 'Roberto',
      apellidos: 'Silva',
      cargo: 'Ingeniero Agrónomo',
      empresa: 'Campo Verde S.A.',
      email: 'roberto.silva@campoverde.com',
      telefono: '+54 342 555-1234',
      tipo_contacto: 'cliente',
      estado_contacto: 'activo'
    }
  ],
  oportunidades: [
    {
      id: 'OPP-2024-001',
      organization_id: 'ORG-2024-001',
      contacto_id: 'CONT-2024-001',
      titulo: 'Estancia San Miguel - Semillas de Soja',
      descripcion: 'Venta de semillas de soja para 500 hectáreas en la próxima temporada',
      etapa: 'negociacion',
      probabilidad: 75,
      valor_estimado: 125000,
      moneda: 'USD',
      vendedor_id: 'USER-2024-001'
    },
    {
      id: 'OPP-2024-002',
      organization_id: 'ORG-2024-001',
      contacto_id: 'CONT-2024-002',
      titulo: 'Agropecuaria Los Pinos - Agroquímicos',
      descripcion: 'Provisión completa de agroquímicos para temporada de siembra',
      etapa: 'propuesta',
      probabilidad: 60,
      valor_estimado: 89500,
      moneda: 'USD',
      vendedor_id: 'USER-2024-001'
    },
    {
      id: 'OPP-2024-003',
      organization_id: 'ORG-2024-001',
      contacto_id: 'CONT-2024-003',
      titulo: 'Campo Verde SA - Fertilizantes',
      descripcion: 'Fertilizantes para 800 hectáreas de maíz',
      etapa: 'calificacion',
      probabilidad: 40,
      valor_estimado: 210000,
      moneda: 'USD',
      vendedor_id: 'USER-2024-001'
    },
    {
      id: 'OPP-2024-004',
      organization_id: 'ORG-2024-001',
      contacto_id: 'CONT-2024-001',
      titulo: 'Estancia San Miguel - Maquinaria',
      descripcion: 'Venta de equipamiento agrícola nuevo',
      etapa: 'prospecto',
      probabilidad: 25,
      valor_estimado: 450000,
      moneda: 'USD',
      vendedor_id: 'USER-2024-001'
    },
    {
      id: 'OPP-2024-005',
      organization_id: 'ORG-2024-001',
      contacto_id: 'CONT-2024-002',
      titulo: 'Agropecuaria Los Pinos - Cierre',
      descripcion: 'Oportunidad en proceso de cierre',
      etapa: 'cierre',
      probabilidad: 90,
      valor_estimado: 67500,
      moneda: 'USD',
      vendedor_id: 'USER-2024-001'
    }
  ],
  actividades: [
    {
      id: 'ACT-2024-001',
      organization_id: 'ORG-2024-001',
      titulo: 'Llamada de seguimiento - Estancia San Miguel',
      descripcion: 'Seguimiento de propuesta de semillas de soja',
      tipo_actividad: 'llamada',
      fecha_actividad: new Date().toISOString(),
      estado: 'completada',
      prioridad: 'alta',
      vendedor_id: 'USER-2024-001'
    },
    {
      id: 'ACT-2024-002',
      organization_id: 'ORG-2024-001',
      titulo: 'Visita técnica - Agropecuaria Los Pinos',
      descripcion: 'Evaluación de necesidades de agroquímicos',
      tipo_actividad: 'visita',
      fecha_actividad: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // mañana
      estado: 'programada',
      prioridad: 'media',
      vendedor_id: 'USER-2024-001'
    },
    {
      id: 'ACT-2024-003',
      organization_id: 'ORG-2024-001',
      titulo: 'Envío de propuesta - Campo Verde',
      descripcion: 'Envío de propuesta técnica de fertilizantes',
      tipo_actividad: 'email',
      fecha_actividad: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // pasado mañana
      estado: 'programada',
      prioridad: 'alta',
      vendedor_id: 'USER-2024-001'
    },
    {
      id: 'ACT-2024-004',
      organization_id: 'ORG-2024-001',
      titulo: 'Reunión con gerencia - Estancia El Progreso',
      descripcion: 'Presentación de propuesta integral',
      tipo_actividad: 'reunion',
      fecha_actividad: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // en 3 días
      estado: 'programada',
      prioridad: 'urgente',
      vendedor_id: 'USER-2024-001'
    }
  ]
};

// Función para insertar datos
const insertSampleData = async () => {
  try {
    console.log('🌱 Insertando datos de muestra para CRM...');

    // Limpiar datos existentes
    await CRMCliente.deleteMany({ organization_id: sampleData.organizationId });
    await CRMContacto.deleteMany({ organization_id: sampleData.organizationId });
    await CRMOportunidad.deleteMany({ organization_id: sampleData.organizationId });
    await CRMActividad.deleteMany({ organization_id: sampleData.organizationId });

    console.log('🗑️ Datos anteriores eliminados');

    // Insertar nuevos datos
    await CRMCliente.insertMany(sampleData.clientes);
    console.log(`✅ ${sampleData.clientes.length} clientes insertados`);

    await CRMContacto.insertMany(sampleData.contactos);
    console.log(`✅ ${sampleData.contactos.length} contactos insertados`);

    await CRMOportunidad.insertMany(sampleData.oportunidades);
    console.log(`✅ ${sampleData.oportunidades.length} oportunidades insertadas`);

    await CRMActividad.insertMany(sampleData.actividades);
    console.log(`✅ ${sampleData.actividades.length} actividades insertadas`);

    console.log('\n🎉 ¡Datos de muestra insertados correctamente!');
    console.log('\n📊 Resumen:');
    console.log(`   • ${sampleData.clientes.length} Empresas/Clientes`);
    console.log(`   • ${sampleData.contactos.length} Contactos`);
    console.log(`   • ${sampleData.oportunidades.length} Oportunidades`);
    console.log(`   • ${sampleData.actividades.length} Actividades`);
    console.log('\n🚀 Ahora puedes probar el CRM en: http://localhost:3000/crm/dashboard');

  } catch (error) {
    console.error('❌ Error insertando datos:', error);
  }
};

// Ejecutar script
const run = async () => {
  await connectDB();
  await insertSampleData();
  mongoose.connection.close();
  console.log('\n👋 Conexión cerrada');
  process.exit(0);
};

run();
