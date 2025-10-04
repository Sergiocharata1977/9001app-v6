import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Importar TODOS los modelos CRM existentes
import { CRM_ClientesAgro } from '../models/crm_clientes_agro';
import { CRM_Contactos } from '../models/crm_contactos';
import { CRM_OportunidadesAgro } from '../models/crm_oportunidades_agro';
import { Crm_actividades_agro } from '../models/crm_actividades_agro';
import { Crm_activos_inmuebles } from '../models/crm_activos_inmuebles';
import { Crm_analisis_riesgo } from '../models/crm_analisis_riesgo';
import { Crm_balances_financieros } from '../models/crm_balances_financieros';
import { Crm_cultivos_cliente } from '../models/crm_cultivos_cliente';
import { Crm_cultivos_lote } from '../models/crm_cultivos_lote';
import { Crm_explotaciones_agricolas } from '../models/crm_explotaciones_agricolas';
import { Crm_flujo_caja } from '../models/crm_flujo_caja';
import { Crm_impuestos_mensuales } from '../models/crm_impuestos_mensuales';
import { Crm_lotes } from '../models/crm_lotes';
import { Crm_metricas_agro } from '../models/crm_metricas_agro';
import { Crm_productos_agro } from '../models/crm_productos_agro';
import { Crm_zonas_geograficas } from '../models/crm_zonas_geograficas';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/9001app';

/**
 * Script para migrar TODAS las colecciones CRM a MongoDB
 * Crea datos de ejemplo realistas para cada colección
 */
class CRMMigration {
  
  /**
   * Ejecutar migración completa de CRM
   */
  static async migrateAllCRM(): Promise<void> {
    try {
      console.log('🚀 Iniciando migración completa de CRM...');
      
      // Conectar a MongoDB
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Conectado a MongoDB');

      // Ejecutar migraciones CRM en orden lógico
      await this.migrateZonasGeograficas();
      await this.migrateContactos();
      await this.migrateClientesAgro();
      await this.migrateExplotacionesAgricolas();
      await this.migrateLotes();
      await this.migrateProductosAgro();
      await this.migrateCultivosCliente();
      await this.migrateCultivosLote();
      await this.migrateActividadesAgro();
      await this.migrateOportunidadesAgro();
      await this.migrateActivosInmuebles();
      await this.migrateAnalisisRiesgo();
      await this.migrateBalancesFinancieros();
      await this.migrateFlujosCaja();
      await this.migrateImpuestosMensuales();
      await this.migrateMetricasAgro();
      
      console.log('🎉 Migración completa de CRM exitosa!');
      
    } catch (error) {
      console.error('❌ Error durante la migración CRM:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Desconectado de MongoDB');
    }
  }

  /**
   * 1. Migrar Zonas Geográficas (base para otras colecciones)
   */
  static async migrateZonasGeograficas(): Promise<void> {
    console.log('🌍 Migrando Zonas Geográficas...');
    
    const zonasData = [
      {
        id: 'ZONA-001',
        organization_id: 1,
        nombre: 'Centro',
        descripcion: 'Zona centro del país',
        estados: 'CDMX, Estado de México, Morelos',
        clima_predominante: 'Templado',
        tipo_suelo_comun: 'Arcilloso',
        cultivos_principales: 'Maíz, Trigo, Cebada',
        temporada_siembra: 'Abril-Junio',
        temporada_cosecha: 'Octubre-Diciembre',
        supervisor_zona: 'EMP001',
        vendedores_asignados: 'EMP001,EMP002',
        observaciones: 'Zona con alta productividad agrícola'
      },
      {
        id: 'ZONA-002',
        organization_id: 1,
        nombre: 'Norte',
        descripcion: 'Zona norte del país',
        estados: 'Sonora, Sinaloa, Chihuahua',
        clima_predominante: 'Árido',
        tipo_suelo_comun: 'Arenoso',
        cultivos_principales: 'Sorgo, Algodón, Trigo',
        temporada_siembra: 'Marzo-Mayo',
        temporada_cosecha: 'Septiembre-Noviembre',
        supervisor_zona: 'EMP002',
        vendedores_asignados: 'EMP002',
        observaciones: 'Zona de agricultura tecnificada'
      }
    ];

    await Crm_zonas_geograficas.deleteMany({});
    const created = await Crm_zonas_geograficas.insertMany(zonasData);
    console.log(`✅ ${created.length} zonas geográficas migradas`);
  }

  /**
   * 2. Migrar Contactos CRM
   */
  static async migrateContactos(): Promise<void> {
    console.log('👥 Migrando Contactos CRM...');
    
    const contactosData = [
      {
        id: 'CONT-001',
        organization_id: 1,
        nombre: 'Carlos',
        apellidos: 'Mendoza García',
        cargo: 'Gerente General',
        empresa: 'AgroEmpresa S.A.',
        telefono: '+52 55 1111 2222',
        email: 'carlos.mendoza@agroempresa.com',
        direccion: 'Av. Agrícola 123, CDMX',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
        zona_geografica: 'ZONA-001',
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
        apellidos: 'López Hernández',
        cargo: 'Directora de Operaciones',
        empresa: 'Cultivos del Norte S.A.',
        telefono: '+52 66 2222 3333',
        email: 'maria.lopez@cultivosnorte.com',
        direccion: 'Carretera Norte Km 45',
        ciudad: 'Hermosillo',
        estado: 'Sonora',
        zona_geografica: 'ZONA-002',
        tipo_contacto: 'prospecto',
        fuente_contacto: 'marketing_digital',
        estado_contacto: 'activo',
        observaciones: 'Interesada en productos de alta tecnología',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011',
        is_active: 1
      }
    ];

    await CRM_Contactos.deleteMany({});
    const created = await CRM_Contactos.insertMany(contactosData);
    console.log(`✅ ${created.length} contactos CRM migrados`);
  }  /**
 
  * 3. Migrar Clientes Agro
   */
  static async migrateClientesAgro(): Promise<void> {
    console.log('🚜 Migrando Clientes Agro...');
    
    const clientesData = [
      {
        id: 'CLI-AGRO-001',
        organization_id: 1,
        contacto_id: 'CONT-001',
        razon_social: 'AgroEmpresa S.A. de C.V.',
        rfc: 'AGM850315ABC',
        tipo_cliente: 'grande',
        categoria_agro: 'A',
        zona_geografica: 'ZONA-001',
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
        razon_social: 'Cultivos del Norte S.A. de C.V.',
        rfc: 'CDN920815XYZ',
        tipo_cliente: 'mediano',
        categoria_agro: 'B',
        zona_geografica: 'ZONA-002',
        region: 'Norte',
        clima_zona: 'Árido',
        tipo_suelo: 'Arenoso',
        direccion: 'Ejido La Esperanza',
        ciudad: 'Hermosillo',
        estado: 'Sonora',
        superficie_total: 300.0,
        cultivos_principales: 'Sorgo, Algodón',
        sistema_riego: 'Goteo',
        tipo_agricultura: 'tecnificada',
        vendedor_asignado_id: 'EMP002',
        tecnico_asignado_id: 'EMP002',
        supervisor_comercial_id: 'EMP001',
        fecha_registro: new Date(),
        fecha_ultimo_contacto: new Date(),
        preferencias_estacionales: 'Siembra de invierno',
        observaciones: 'Cliente con potencial de crecimiento',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011',
        is_active: 1
      }
    ];

    await CRM_ClientesAgro.deleteMany({});
    const created = await CRM_ClientesAgro.insertMany(clientesData);
    console.log(`✅ ${created.length} clientes agro migrados`);
  }

  /**
   * 4. Migrar Explotaciones Agrícolas
   */
  static async migrateExplotacionesAgricolas(): Promise<void> {
    console.log('🏞️ Migrando Explotaciones Agrícolas...');
    
    const explotacionesData = [
      {
        id: 'EXP-001',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-001',
        nombre: 'Rancho San José',
        ubicacion: 'Texcoco, Estado de México',
        superficie_total: 500.0,
        superficie_cultivable: 450.0,
        tipo_propiedad: 'propia',
        coordenadas_gps: '19.4969,-98.8833',
        altitud: 2240,
        tipo_suelo: 'Arcilloso',
        ph_suelo: 6.8,
        sistema_riego: 'Aspersión',
        fuente_agua: 'Pozo profundo',
        infraestructura: 'Bodega, oficina, taller',
        maquinaria: 'Tractor, sembradora, cosechadora',
        certificaciones: 'Orgánico, GlobalGAP',
        observaciones: 'Explotación modelo con alta tecnificación',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'EXP-002',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-002',
        nombre: 'Ejido La Esperanza',
        ubicacion: 'Hermosillo, Sonora',
        superficie_total: 300.0,
        superficie_cultivable: 280.0,
        tipo_propiedad: 'ejidal',
        coordenadas_gps: '29.0729,-110.9559',
        altitud: 200,
        tipo_suelo: 'Arenoso',
        ph_suelo: 7.2,
        sistema_riego: 'Goteo',
        fuente_agua: 'Canal de riego',
        infraestructura: 'Bodega básica',
        maquinaria: 'Tractor, implementos básicos',
        certificaciones: 'En proceso GlobalGAP',
        observaciones: 'Explotación en proceso de tecnificación',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Crm_explotaciones_agricolas.deleteMany({});
    const created = await Crm_explotaciones_agricolas.insertMany(explotacionesData);
    console.log(`✅ ${created.length} explotaciones agrícolas migradas`);
  }

  /**
   * 5. Migrar Lotes
   */
  static async migrateLotes(): Promise<void> {
    console.log('📐 Migrando Lotes...');
    
    const lotesData = [
      {
        id: 'LOTE-001',
        organization_id: 1,
        explotacion_id: 'EXP-001',
        nombre: 'Lote Norte',
        superficie: 150.0,
        coordenadas: '19.4980,-98.8820',
        tipo_suelo: 'Arcilloso',
        ph_suelo: 6.8,
        pendiente: 2.5,
        exposicion: 'Sur',
        drenaje: 'Bueno',
        historial_cultivos: 'Maíz 2023, Trigo 2022',
        estado: 'disponible',
        observaciones: 'Lote con mejor rendimiento histórico',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'LOTE-002',
        organization_id: 1,
        explotacion_id: 'EXP-001',
        nombre: 'Lote Sur',
        superficie: 200.0,
        coordenadas: '19.4950,-98.8840',
        tipo_suelo: 'Arcilloso',
        ph_suelo: 6.5,
        pendiente: 1.8,
        exposicion: 'Norte',
        drenaje: 'Regular',
        historial_cultivos: 'Sorgo 2023, Maíz 2022',
        estado: 'ocupado',
        observaciones: 'Lote en producción actual',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'LOTE-003',
        organization_id: 1,
        explotacion_id: 'EXP-002',
        nombre: 'Lote Principal',
        superficie: 280.0,
        coordenadas: '29.0740,-110.9570',
        tipo_suelo: 'Arenoso',
        ph_suelo: 7.2,
        pendiente: 0.5,
        exposicion: 'Sur',
        drenaje: 'Excelente',
        historial_cultivos: 'Algodón 2023, Sorgo 2022',
        estado: 'disponible',
        observaciones: 'Lote único de la explotación',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Crm_lotes.deleteMany({});
    const created = await Crm_lotes.insertMany(lotesData);
    console.log(`✅ ${created.length} lotes migrados`);
  }

  /**
   * 6. Migrar Productos Agro
   */
  static async migrateProductosAgro(): Promise<void> {
    console.log('🌱 Migrando Productos Agro...');
    
    const productosData = [
      {
        id: 'PROD-001',
        organization_id: 1,
        nombre: 'Semilla Maíz Híbrido Premium',
        categoria: 'Semillas',
        subcategoria: 'Maíz',
        descripcion: 'Semilla híbrida de alto rendimiento para clima templado',
        codigo_producto: 'SEM-MAI-001',
        marca: 'AgroSeeds',
        presentacion: 'Bolsa 20kg',
        precio_unitario: 1250.00,
        moneda: 'MXN',
        unidad_medida: 'kg',
        stock_minimo: 100,
        stock_actual: 500,
        proveedor: 'Semillas Nacionales S.A.',
        temporada_uso: 'Primavera-Verano',
        ciclo_cultivo: '120 días',
        rendimiento_esperado: '12 ton/ha',
        resistencias: 'Sequía, plagas',
        certificaciones: 'SNICS, Orgánico',
        observaciones: 'Producto estrella de la línea',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'PROD-002',
        organization_id: 1,
        nombre: 'Fertilizante NPK 18-46-0',
        categoria: 'Fertilizantes',
        subcategoria: 'NPK',
        descripcion: 'Fertilizante fosfatado para arranque de cultivos',
        codigo_producto: 'FERT-NPK-002',
        marca: 'NutriCrop',
        presentacion: 'Bulto 50kg',
        precio_unitario: 850.00,
        moneda: 'MXN',
        unidad_medida: 'kg',
        stock_minimo: 50,
        stock_actual: 200,
        proveedor: 'Fertilizantes del Bajío S.A.',
        temporada_uso: 'Todo el año',
        ciclo_cultivo: 'Aplicación única',
        rendimiento_esperado: 'Incremento 15-20%',
        resistencias: 'N/A',
        certificaciones: 'COFEPRIS',
        observaciones: 'Ideal para suelos deficientes en fósforo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Crm_productos_agro.deleteMany({});
    const created = await Crm_productos_agro.insertMany(productosData);
    console.log(`✅ ${created.length} productos agro migrados`);
  }

  /**
   * 7. Migrar Cultivos Cliente
   */
  static async migrateCultivosCliente(): Promise<void> {
    console.log('🌾 Migrando Cultivos Cliente...');
    
    const cultivosData = [
      {
        id: 'CULT-CLI-001',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-001',
        cultivo: 'Maíz',
        variedad: 'Híbrido Premium',
        superficie_sembrada: 300.0,
        fecha_siembra: '2024-04-15',
        fecha_cosecha_estimada: '2024-08-15',
        rendimiento_esperado: 12.0,
        estado_cultivo: 'desarrollo',
        observaciones: 'Cultivo principal del cliente',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'CULT-CLI-002',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-001',
        cultivo: 'Trigo',
        variedad: 'Cristalino',
        superficie_sembrada: 150.0,
        fecha_siembra: '2024-11-01',
        fecha_cosecha_estimada: '2025-04-01',
        rendimiento_esperado: 8.5,
        estado_cultivo: 'siembra',
        observaciones: 'Cultivo de invierno',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'CULT-CLI-003',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-002',
        cultivo: 'Sorgo',
        variedad: 'Granífero',
        superficie_sembrada: 200.0,
        fecha_siembra: '2024-03-20',
        fecha_cosecha_estimada: '2024-07-20',
        rendimiento_esperado: 10.0,
        estado_cultivo: 'cosecha',
        observaciones: 'Excelente adaptación al clima árido',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Crm_cultivos_cliente.deleteMany({});
    const created = await Crm_cultivos_cliente.insertMany(cultivosData);
    console.log(`✅ ${created.length} cultivos cliente migrados`);
  }

  /**
   * 8. Migrar Cultivos Lote
   */
  static async migrateCultivosLote(): Promise<void> {
    console.log('🌽 Migrando Cultivos Lote...');
    
    const cultivosLoteData = [
      {
        id: 'CULT-LOTE-001',
        organization_id: 1,
        lote_id: 'LOTE-001',
        cultivo: 'Maíz',
        variedad: 'Híbrido Premium',
        fecha_siembra: '2024-04-15',
        fecha_cosecha: '2024-08-15',
        superficie: 150.0,
        densidad_siembra: 75000,
        rendimiento_obtenido: 12.5,
        calidad_grano: 'Primera',
        precio_venta: 6500.00,
        ingresos_totales: 1218750.00,
        estado: 'cosechado',
        observaciones: 'Excelente rendimiento por condiciones climáticas favorables',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'CULT-LOTE-002',
        organization_id: 1,
        lote_id: 'LOTE-002',
        cultivo: 'Sorgo',
        variedad: 'Granífero',
        fecha_siembra: '2024-05-01',
        fecha_cosecha: '2024-09-01',
        superficie: 200.0,
        densidad_siembra: 250000,
        rendimiento_obtenido: 0.0,
        calidad_grano: '',
        precio_venta: 0.0,
        ingresos_totales: 0.0,
        estado: 'en_desarrollo',
        observaciones: 'Cultivo en etapa de llenado de grano',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Crm_cultivos_lote.deleteMany({});
    const created = await Crm_cultivos_lote.insertMany(cultivosLoteData);
    console.log(`✅ ${created.length} cultivos lote migrados`);
  }

  /**
   * 9. Migrar Actividades Agro
   */
  static async migrateActividadesAgro(): Promise<void> {
    console.log('📋 Migrando Actividades Agro...');
    
    const actividadesData = [
      {
        id: 'ACT-001',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-001',
        lote_id: 'LOTE-001',
        tipo_actividad: 'siembra',
        descripcion: 'Siembra de maíz híbrido premium',
        fecha_programada: '2024-04-15',
        fecha_realizada: '2024-04-15',
        responsable: 'EMP001',
        maquinaria_utilizada: 'Sembradora John Deere 1770',
        insumos_utilizados: 'Semilla híbrida 20kg, Fertilizante 18-46-0 100kg',
        costo_actividad: 15000.00,
        superficie_trabajada: 150.0,
        condiciones_climaticas: 'Soleado, 22°C',
        estado: 'completada',
        observaciones: 'Actividad realizada en condiciones óptimas',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ACT-002',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-001',
        lote_id: 'LOTE-001',
        tipo_actividad: 'fertilizacion',
        descripcion: 'Primera fertilización con urea',
        fecha_programada: '2024-05-15',
        fecha_realizada: '2024-05-16',
        responsable: 'EMP002',
        maquinaria_utilizada: 'Fertilizadora de precisión',
        insumos_utilizados: 'Urea 46% 150kg',
        costo_actividad: 8500.00,
        superficie_trabajada: 150.0,
        condiciones_climaticas: 'Nublado, 18°C',
        estado: 'completada',
        observaciones: 'Aplicación retrasada un día por lluvia',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Crm_actividades_agro.deleteMany({});
    const created = await Crm_actividades_agro.insertMany(actividadesData);
    console.log(`✅ ${created.length} actividades agro migradas`);
  }

  /**
   * 10. Migrar Oportunidades Agro
   */
  static async migrateOportunidadesAgro(): Promise<void> {
    console.log('💼 Migrando Oportunidades Agro...');
    
    const oportunidadesData = [
      {
        id: 'OPP-AGRO-001',
        organization_id: 1,
        tipo_oportunidad: 'cliente_existente',
        cliente_id: 'CLI-AGRO-001',
        contacto_id: 'CONT-001',
        titulo: 'Venta de Semillas de Maíz Híbrido 2025',
        descripcion: 'Oportunidad para venta de 50 toneladas de semillas de maíz híbrido para ciclo 2025',
        categoria_oportunidad: 'nueva',
        etapa: 'negociacion',
        cultivo_objetivo: 'Maíz',
        superficie_objetivo: 500.0,
        temporada_objetivo: 'Primavera 2025',
        necesidad_tecnica: 'Asesoría técnica en siembra y nutrición',
        probabilidad: 85,
        valor_estimado: 3750000,
        moneda: 'MXN',
        fecha_cierre_esperada: new Date('2025-02-15'),
        fecha_siembra_objetivo: new Date('2025-04-01'),
        vendedor_id: 'EMP001',
        tecnico_id: 'EMP002',
        supervisor_id: 'EMP001',
        competencia: 'Syngenta, Bayer, Pioneer',
        estrategia_venta: 'Enfoque en rendimiento superior y soporte técnico integral',
        observaciones: 'Cliente muy interesado, ya confirmó presupuesto',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011',
        is_active: 1
      },
      {
        id: 'OPP-AGRO-002',
        organization_id: 1,
        tipo_oportunidad: 'prospecto',
        cliente_id: 'CLI-AGRO-002',
        contacto_id: 'CONT-002',
        titulo: 'Programa Integral de Nutrición Sorgo',
        descripcion: 'Oportunidad para implementar programa completo de nutrición en cultivo de sorgo',
        categoria_oportunidad: 'expansion',
        etapa: 'prospeccion',
        cultivo_objetivo: 'Sorgo',
        superficie_objetivo: 300.0,
        temporada_objetivo: 'Otoño-Invierno 2024',
        necesidad_tecnica: 'Análisis de suelo y programa nutricional',
        probabilidad: 60,
        valor_estimado: 1200000,
        moneda: 'MXN',
        fecha_cierre_esperada: new Date('2024-12-01'),
        fecha_siembra_objetivo: new Date('2024-12-15'),
        vendedor_id: 'EMP002',
        tecnico_id: 'EMP002',
        supervisor_id: 'EMP001',
        competencia: 'Yara, Haifa',
        estrategia_venta: 'Demostración de resultados con parcelas demostrativas',
        observaciones: 'Cliente requiere evidencia técnica sólida',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011',
        is_active: 1
      }
    ];

    await CRM_OportunidadesAgro.deleteMany({});
    const created = await CRM_OportunidadesAgro.insertMany(oportunidadesData);
    console.log(`✅ ${created.length} oportunidades agro migradas`);
  }
}