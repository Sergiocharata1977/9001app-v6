import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Importar TODOS los modelos CRM existentes
import { CRM_ClientesAgro } from '../models/crm_clientes_agro';
import { CRM_Contactos } from '../models/crm_contactos';
import { CRM_OportunidadesAgro } from '../models/crm_oportunidades_agro';
import { CRM_ActivosInmuebles } from '../models/crm_activos_inmuebles';
import { CRM_AnalisisRiesgo } from '../models/crm_analisis_riesgo';

// Importar modelos CRM que necesitan datos
import { Crm_actividades_agro } from '../models/crm_actividades_agro';
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
 * Script para crear TODAS las colecciones CRM con datos de ejemplo
 */
class CreateCRMCollections {
  
  static async createAll(): Promise<void> {
    try {
      console.log('🚀 Iniciando creación de TODAS las colecciones CRM...');
      
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Conectado a MongoDB');

      // Crear colecciones CRM en orden lógico
      await this.createZonasGeograficas();
      await this.createContactos();
      await this.createClientesAgro();
      await this.createExplotacionesAgricolas();
      await this.createLotes();
      await this.createProductosAgro();
      await this.createCultivosCliente();
      await this.createCultivosLote();
      await this.createActividadesAgro();
      await this.createOportunidadesAgro();
      await this.createActivosInmuebles();
      await this.createAnalisisRiesgo();
      await this.createBalancesFinancieros();
      await this.createFlujosCaja();
      await this.createImpuestosMensuales();
      await this.createMetricasAgro();
      
      console.log('🎉 ¡TODAS las colecciones CRM creadas exitosamente!');
      
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Desconectado de MongoDB');
    }
  }

  static async createZonasGeograficas(): Promise<void> {
    console.log('🌍 Creando Zonas Geográficas...');
    
    const data = [
      {
        id: 'ZONA-001',
        organization_id: 1,
        nombre: 'Centro',
        descripcion: 'Zona centro del país - Estados de México, CDMX, Morelos',
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
        descripcion: 'Zona norte del país - Sonora, Sinaloa, Chihuahua',
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
    const created = await Crm_zonas_geograficas.insertMany(data);
    console.log(`✅ ${created.length} zonas geográficas creadas`);
  }

  static async createContactos(): Promise<void> {
    console.log('👥 Creando Contactos CRM...');
    
    const data = [
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
    const created = await CRM_Contactos.insertMany(data);
    console.log(`✅ ${created.length} contactos CRM creados`);
  }

  static async createClientesAgro(): Promise<void> {
    console.log('🚜 Creando Clientes Agro...');
    
    const data = [
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
      }
    ];

    await CRM_ClientesAgro.deleteMany({});
    const created = await CRM_ClientesAgro.insertMany(data);
    console.log(`✅ ${created.length} clientes agro creados`);
  }

  static async createExplotacionesAgricolas(): Promise<void> {
    console.log('🏞️ Creando Explotaciones Agrícolas...');
    
    const data = [
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
        observaciones: 'Explotación modelo con alta tecnificación'
      }
    ];

    await Crm_explotaciones_agricolas.deleteMany({});
    const created = await Crm_explotaciones_agricolas.insertMany(data);
    console.log(`✅ ${created.length} explotaciones agrícolas creadas`);
  }

  static async createLotes(): Promise<void> {
    console.log('📐 Creando Lotes...');
    
    const data = [
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
        observaciones: 'Lote con mejor rendimiento histórico'
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
        observaciones: 'Lote en producción actual'
      }
    ];

    await Crm_lotes.deleteMany({});
    const created = await Crm_lotes.insertMany(data);
    console.log(`✅ ${created.length} lotes creados`);
  }

  static async createProductosAgro(): Promise<void> {
    console.log('🌱 Creando Productos Agro...');
    
    const data = [
      {
        id: 'PROD-AGRO-001',
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
        observaciones: 'Producto estrella de la línea'
      }
    ];

    await Crm_productos_agro.deleteMany({});
    const created = await Crm_productos_agro.insertMany(data);
    console.log(`✅ ${created.length} productos agro creados`);
  }

  static async createCultivosCliente(): Promise<void> {
    console.log('🌾 Creando Cultivos Cliente...');
    
    const data = [
      {
        id: 'CULT-CLI-001',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-001',
        cultivo: 'Maíz',
        variedad: 'Híbrido Premium',
        superficie_sembrada: 200.0,
        fecha_siembra: new Date('2024-04-15'),
        fecha_cosecha_estimada: new Date('2024-08-15'),
        rendimiento_esperado: 12.0,
        estado_cultivo: 'desarrollo',
        observaciones: 'Cultivo principal del cliente'
      }
    ];

    await Crm_cultivos_cliente.deleteMany({});
    const created = await Crm_cultivos_cliente.insertMany(data);
    console.log(`✅ ${created.length} cultivos cliente creados`);
  }

  static async createCultivosLote(): Promise<void> {
    console.log('🌱 Creando Cultivos Lote...');
    
    const data = [
      {
        id: 'CULT-LOTE-001',
        organization_id: 1,
        lote_id: 'LOTE-001',
        cultivo: 'Maíz',
        variedad: 'Híbrido Premium',
        fecha_siembra: new Date('2024-04-15'),
        fecha_cosecha: new Date('2024-08-15'),
        superficie_sembrada: 150.0,
        densidad_siembra: 75000,
        rendimiento_obtenido: 11.5,
        calidad_cosecha: 'Excelente',
        observaciones: 'Excelente rendimiento obtenido'
      }
    ];

    await Crm_cultivos_lote.deleteMany({});
    const created = await Crm_cultivos_lote.insertMany(data);
    console.log(`✅ ${created.length} cultivos lote creados`);
  }

  static async createActividadesAgro(): Promise<void> {
    console.log('🚜 Creando Actividades Agro...');
    
    const data = [
      {
        id: 'ACT-001',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-001',
        lote_id: 'LOTE-001',
        tipo_actividad: 'siembra',
        descripcion: 'Siembra de maíz híbrido',
        fecha_actividad: new Date('2024-04-15'),
        responsable: 'EMP001',
        maquinaria_utilizada: 'Sembradora John Deere',
        insumos_utilizados: 'Semilla híbrida, fertilizante',
        costo_actividad: 15000.00,
        observaciones: 'Actividad realizada en condiciones óptimas'
      }
    ];

    await Crm_actividades_agro.deleteMany({});
    const created = await Crm_actividades_agro.insertMany(data);
    console.log(`✅ ${created.length} actividades agro creadas`);
  }

  static async createOportunidadesAgro(): Promise<void> {
    console.log('💼 Creando Oportunidades Agro...');
    
    const data = [
      {
        id: 'OPP-AGRO-001',
        organization_id: 1,
        tipo_oportunidad: 'cliente_existente',
        cliente_id: 'CLI-AGRO-001',
        contacto_id: 'CONT-001',
        titulo: 'Venta de Semillas de Maíz Híbrido',
        descripcion: 'Oportunidad para venta de 50 toneladas de semillas',
        categoria_oportunidad: 'nueva',
        etapa: 'prospeccion',
        cultivo_objetivo: 'Maíz',
        superficie_objetivo: 100.0,
        temporada_objetivo: 'Primavera 2024',
        necesidad_tecnica: 'Asesoría técnica en siembra',
        probabilidad: 75,
        valor_estimado: 2500000,
        moneda: 'MXN',
        fecha_cierre_esperada: new Date('2024-03-15'),
        fecha_siembra_objetivo: new Date('2024-04-01'),
        vendedor_id: 'EMP001',
        tecnico_id: 'EMP002',
        supervisor_id: 'EMP001',
        competencia: 'Syngenta, Bayer',
        estrategia_venta: 'Enfoque en rendimiento y soporte técnico',
        observaciones: 'Cliente interesado en tecnología de punta',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '507f1f77bcf86cd799439011',
        updated_by: '507f1f77bcf86cd799439011',
        is_active: 1
      }
    ];

    await CRM_OportunidadesAgro.deleteMany({});
    const created = await CRM_OportunidadesAgro.insertMany(data);
    console.log(`✅ ${created.length} oportunidades agro creadas`);
  }

  static async createActivosInmuebles(): Promise<void> {
    console.log('🏠 Creando Activos Inmuebles...');
    
    const data = [
      {
        id: 'ACTIVO-001',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-001',
        tipo_inmueble: 'terreno',
        nombre_inmueble: 'Rancho San José',
        direccion: 'Km 15 Carretera Texcoco-Lechería',
        ciudad: 'Texcoco',
        estado: 'Estado de México',
        superficie_total: 500.0,
        valor_comercial: 25000000,
        moneda: 'MXN',
        uso_actual: 'Agricultura',
        estado_conservacion: 'bueno',
        potencial_agricola: true,
        acceso_agua: true,
        acceso_electricidad: true,
        observaciones: 'Terreno ideal para cultivos de temporal',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await CRM_ActivosInmuebles.deleteMany({});
    const created = await CRM_ActivosInmuebles.insertMany(data);
    console.log(`✅ ${created.length} activos inmuebles creados`);
  }

  static async createAnalisisRiesgo(): Promise<void> {
    console.log('⚠️ Creando Análisis de Riesgo...');
    
    const data = [
      {
        id: 'RIESGO-001',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-001',
        tipo_analisis: 'integral',
        fecha_analisis: new Date(),
        periodo_evaluacion: '2024',
        analista_responsable: 'EMP001',
        zona_climatica: 'Templado subhúmedo',
        nivel_riesgo_general: 'bajo',
        puntuacion_maxima: 100,
        fecha_proxima_revision: new Date('2024-12-31'),
        frecuencia_revision: 'anual',
        estado: 'aprobado',
        observaciones: 'Cliente de bajo riesgo con excelente historial',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await CRM_AnalisisRiesgo.deleteMany({});
    const created = await CRM_AnalisisRiesgo.insertMany(data);
    console.log(`✅ ${created.length} análisis de riesgo creados`);
  }

  static async createBalancesFinancieros(): Promise<void> {
    console.log('💰 Creando Balances Financieros...');
    
    const data = [
      {
        id: 'BAL-001',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-001',
        periodo: '2024',
        fecha_balance: new Date('2024-12-31'),
        activos_corrientes: 5000000,
        activos_fijos: 25000000,
        total_activos: 30000000,
        pasivos_corrientes: 2000000,
        pasivos_largo_plazo: 8000000,
        total_pasivos: 10000000,
        patrimonio: 20000000,
        ingresos_operacionales: 15000000,
        gastos_operacionales: 12000000,
        utilidad_neta: 3000000,
        observaciones: 'Balance sólido con buena liquidez'
      }
    ];

    await Crm_balances_financieros.deleteMany({});
    const created = await Crm_balances_financieros.insertMany(data);
    console.log(`✅ ${created.length} balances financieros creados`);
  }

  static async createFlujosCaja(): Promise<void> {
    console.log('💸 Creando Flujos de Caja...');
    
    const data = [
      {
        id: 'FLUJO-001',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-001',
        periodo: '2024-01',
        fecha_flujo: new Date('2024-01-31'),
        ingresos_operativos: 1200000,
        egresos_operativos: 800000,
        flujo_operativo: 400000,
        ingresos_inversion: 0,
        egresos_inversion: 200000,
        flujo_inversion: -200000,
        flujo_neto: 200000,
        saldo_inicial: 500000,
        saldo_final: 700000,
        observaciones: 'Flujo positivo del mes'
      }
    ];

    await Crm_flujo_caja.deleteMany({});
    const created = await Crm_flujo_caja.insertMany(data);
    console.log(`✅ ${created.length} flujos de caja creados`);
  }

  static async createImpuestosMensuales(): Promise<void> {
    console.log('📊 Creando Impuestos Mensuales...');
    
    const data = [
      {
        id: 'IMP-001',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-001',
        periodo: '2024-01',
        fecha_declaracion: new Date('2024-02-15'),
        ingresos_gravables: 1200000,
        iva_causado: 192000,
        iva_acreditable: 80000,
        iva_pagar: 112000,
        isr_provisional: 36000,
        retenciones_isr: 15000,
        total_impuestos: 148000,
        estado_declaracion: 'presentada',
        observaciones: 'Declaración presentada en tiempo'
      }
    ];

    await Crm_impuestos_mensuales.deleteMany({});
    const created = await Crm_impuestos_mensuales.insertMany(data);
    console.log(`✅ ${created.length} impuestos mensuales creados`);
  }

  static async createMetricasAgro(): Promise<void> {
    console.log('📈 Creando Métricas Agro...');
    
    const data = [
      {
        id: 'MET-001',
        organization_id: 1,
        cliente_id: 'CLI-AGRO-001',
        lote_id: 'LOTE-001',
        cultivo: 'Maíz',
        ciclo_agricola: '2024-PV',
        fecha_medicion: new Date('2024-07-15'),
        tipo_metrica: 'rendimiento',
        valor_medido: 11.5,
        unidad_medida: 'ton/ha',
        valor_esperado: 12.0,
        desviacion: -0.5,
        calificacion: 'bueno',
        observaciones: 'Rendimiento ligeramente por debajo del esperado'
      }
    ];

    await Crm_metricas_agro.deleteMany({});
    const created = await Crm_metricas_agro.insertMany(data);
    console.log(`✅ ${created.length} métricas agro creadas`);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  CreateCRMCollections.createAll()
    .then(() => {
      console.log('🎉 ¡Proceso CRM completado!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

export { CreateCRMCollections };