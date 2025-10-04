import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Importar modelos CRM
import { CRM_ClientesAgro } from '../models/crm_clientes_agro';
import { CRM_Contactos } from '../models/crm_contactos';
import { CRM_OportunidadesAgro } from '../models/crm_oportunidades_agro';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/9001app';

/**
 * Script SOLO para migrar colecciones CRM
 */
class CRMMigration {
  
  static async migrateCRM(): Promise<void> {
    try {
      console.log('🎯 Iniciando migración SOLO de colecciones CRM...');
      
      // Conectar a MongoDB
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Conectado a MongoDB');

      await this.migrateCRMCollections();
      
      console.log('🎉 Migración CRM completada exitosamente!');
      
    } catch (error) {
      console.error('❌ Error durante la migración CRM:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Desconectado de MongoDB');
    }
  }

  /**
   * Migrar Colecciones CRM
   */
  static async migrateCRMCollections(): Promise<void> {
    console.log('🎯 Migrando Colecciones CRM...');

    // 1. Migrar Contactos CRM
    const contactosData = [
      {
        id: 'CONT-001',
        organization_id: 1,
        nombre: 'Carlos',
        apellidos: 'Mendoza',
        cargo: 'Gerente General',
        empresa: 'AgroEmpresa S.A.',
        telefono: '+52 55 1111 2222',
        email: 'carlos.mendoza@agroempresa.com',
        direccion: 'Av. Agrícola 123, CDMX',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
        zona_geografica: 'Centro',
        tipo_contacto: 'cliente',
        fuente_contacto: 'referido',
        estado_contacto: 'activo',
        observaciones: 'Cliente principal del sector agrícola',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011',
        is_active: 1
      },
      {
        id: 'CONT-002',
        organization_id: 1,
        nombre: 'María',
        apellidos: 'López',
        cargo: 'Directora Comercial',
        empresa: 'AgroTech Solutions',
        telefono: '+52 55 2222 3333',
        email: 'maria.lopez@agrotech.com',
        direccion: 'Calle Industrial 456, Guadalajara',
        ciudad: 'Guadalajara',
        estado: 'Jalisco',
        zona_geografica: 'Occidente',
        tipo_contacto: 'prospecto',
        fuente_contacto: 'web',
        estado_contacto: 'activo',
        observaciones: 'Interesada en tecnología agrícola',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011',
        is_active: 1
      }
    ];

    await CRM_Contactos.deleteMany({});
    const createdContactos = await CRM_Contactos.insertMany(contactosData);
    console.log(`✅ ${createdContactos.length} contactos CRM migrados`);

    // 2. Migrar Clientes Agro
    const clientesAgroData = [
      {
        id: 'CLI-AGRO-001',
        organization_id: 1,
        contacto_id: 'CONT-001',
        razon_social: 'AgroEmpresa S.A. de C.V.',
        rfc: 'AGM850315ABC',
        tipo_cliente: 'grande',
        categoria_agro: 'A',
        zona_geografica: 'Centro',
        region: 'Centro',
        clima_zona: 'Templado',
        tipo_suelo: 'Arcilloso',
        direccion: 'Rancho San José, Km 15',
        ciudad: 'Texcoco',
        estado: 'Estado de México',
        superficie_total: 500.0,
        cultivos_principales: 'Maíz, Sorgo, Trigo',
        sistema_riego: 'Aspersión',
        tipo_agricultura: 'convencional',
        vendedor_asignado_id: 'EMP001',
        tecnico_asignado_id: 'EMP002',
        supervisor_comercial_id: 'EMP001',
        fecha_registro: new Date(),
        fecha_ultimo_contacto: new Date(),
        preferencias_estacionales: 'Siembra de primavera',
        observaciones: 'Cliente estratégico con alto potencial',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011',
        is_active: 1
      },
      {
        id: 'CLI-AGRO-002',
        organization_id: 1,
        contacto_id: 'CONT-002',
        razon_social: 'AgroTech Solutions S.A. de C.V.',
        rfc: 'ATS900415DEF',
        tipo_cliente: 'mediano',
        categoria_agro: 'B',
        zona_geografica: 'Occidente',
        region: 'Occidente',
        clima_zona: 'Templado',
        tipo_suelo: 'Volcánico',
        direccion: 'Finca La Esperanza, Ejido El Progreso',
        ciudad: 'Zapopan',
        estado: 'Jalisco',
        superficie_total: 250.0,
        cultivos_principales: 'Aguacate, Limón, Berries',
        sistema_riego: 'Goteo',
        tipo_agricultura: 'orgánica',
        vendedor_asignado_id: 'EMP002',
        tecnico_asignado_id: 'EMP001',
        supervisor_comercial_id: 'EMP001',
        fecha_registro: new Date(),
        fecha_ultimo_contacto: new Date(),
        preferencias_estacionales: 'Cosecha de otoño',
        observaciones: 'Cliente innovador en agricultura sostenible',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011',
        is_active: 1
      }
    ];

    await CRM_ClientesAgro.deleteMany({});
    const createdClientes = await CRM_ClientesAgro.insertMany(clientesAgroData);
    console.log(`✅ ${createdClientes.length} clientes agro migrados`);

    // 3. Migrar Oportunidades Agro
    const oportunidadesData = [
      {
        id: 'OPP-AGRO-001',
        organization_id: 1,
        tipo_oportunidad: 'cliente_existente',
        cliente_id: 'CLI-AGRO-001',
        contacto_id: 'CONT-001',
        titulo: 'Venta de Semillas de Maíz Híbrido',
        descripcion: 'Oportunidad para venta de 50 toneladas de semillas de maíz híbrido para la temporada de primavera 2024',
        categoria_oportunidad: 'nueva',
        etapa: 'prospeccion',
        cultivo_objetivo: 'Maíz',
        superficie_objetivo: 100.0,
        temporada_objetivo: 'Primavera 2024',
        necesidad_tecnica: 'Asesoría técnica en siembra y fertilización',
        probabilidad: 75,
        valor_estimado: 2500000,
        moneda: 'MXN',
        fecha_cierre_esperada: new Date('2024-03-15'),
        fecha_siembra_objetivo: new Date('2024-04-01'),
        vendedor_id: 'EMP001',
        tecnico_id: 'EMP002',
        supervisor_id: 'EMP001',
        competencia: 'Syngenta, Bayer',
        estrategia_venta: 'Enfoque en rendimiento y soporte técnico especializado',
        observaciones: 'Cliente interesado en tecnología de punta y variedades resistentes',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011',
        is_active: 1
      },
      {
        id: 'OPP-AGRO-002',
        organization_id: 1,
        tipo_oportunidad: 'nuevo_cliente',
        cliente_id: 'CLI-AGRO-002',
        contacto_id: 'CONT-002',
        titulo: 'Sistema de Riego Inteligente',
        descripcion: 'Implementación de sistema de riego por goteo inteligente para optimizar el uso de agua',
        categoria_oportunidad: 'nueva',
        etapa: 'calificacion',
        cultivo_objetivo: 'Aguacate',
        superficie_objetivo: 50.0,
        temporada_objetivo: 'Verano 2024',
        necesidad_tecnica: 'Diseño e instalación de sistema automatizado',
        probabilidad: 60,
        valor_estimado: 1800000,
        moneda: 'MXN',
        fecha_cierre_esperada: new Date('2024-06-30'),
        fecha_siembra_objetivo: new Date('2024-07-15'),
        vendedor_id: 'EMP002',
        tecnico_id: 'EMP001',
        supervisor_id: 'EMP001',
        competencia: 'Netafim, Rivulis',
        estrategia_venta: 'Enfoque en sostenibilidad y eficiencia hídrica',
        observaciones: 'Cliente muy interesado en tecnología verde y ahorro de agua',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011',
        is_active: 1
      }
    ];

    await CRM_OportunidadesAgro.deleteMany({});
    const createdOportunidades = await CRM_OportunidadesAgro.insertMany(oportunidadesData);
    console.log(`✅ ${createdOportunidades.length} oportunidades agro migradas`);

    console.log('✅ Migración de colecciones CRM completada');
    console.log('\n📊 Resumen CRM:');
    console.log(`   - ${createdContactos.length} contactos`);
    console.log(`   - ${createdClientes.length} clientes agro`);
    console.log(`   - ${createdOportunidades.length} oportunidades`);
  }
}

// Ejecutar migración CRM si se llama directamente
if (require.main === module) {
  CRMMigration.migrateCRM()
    .then(() => {
      console.log('🎉 Migración CRM completada exitosamente!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error durante la migración CRM:', error);
      process.exit(1);
    });
}

export { CRMMigration };
