import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Importar modelos existentes
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { Department } from '../models/Department';
import { Personnel } from '../models/Personnel';
import { Position } from '../models/Position';
import { QualityObjective } from '../models/QualityObjective';
import { QualityIndicator } from '../models/QualityIndicator';
import { Measurement } from '../models/Measurement';
import { NormPoint } from '../models/NormPoint';
import { Proceso } from '../models/PROCESO';

// Importar modelos basados en Turso
import { Documentos } from '../models/documentos';
import { Hallazgos } from '../models/hallazgos';
import { Indicadores } from '../models/indicadores';
import { Mediciones } from '../models/mediciones';
import { Departamentos } from '../models/departamentos';
import { Competencias } from '../models/competencias';
import { Encuestas } from '../models/encuestas';
import { Minutas } from '../models/minutas';
import { Limites_uso } from '../models/limites_uso';

// Importar modelos CRM
import { CRM_ClientesAgro } from '../models/crm_clientes_agro';
import { CRM_Contactos } from '../models/crm_contactos';
import { CRM_OportunidadesAgro } from '../models/crm_oportunidades_agro';

// Importar modelos del sistema
import { OrganizationFeatures } from '../models/OrganizationFeatures';
import { Planes } from '../models/Planes';
import { RefreshTokens } from '../models/RefreshTokens';
import { Suscripciones } from '../models/Suscripciones';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/9001app';

/**
 * Script para migrar datos de Turso a MongoDB
 * Adapta las estructuras SQL a colecciones MongoDB
 */
class TursoToMongoMigration {
  
  /**
   * Ejecutar migración completa
   */
  static async migrateAll(): Promise<void> {
    try {
      console.log('🚀 Iniciando migración de Turso a MongoDB...');
      
      // Conectar a MongoDB
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Conectado a MongoDB');

      // Ejecutar migraciones en orden
      await this.migrateOrganizations();
      await this.migrateUsers();
      await this.migrateDepartments();
      await this.migratePersonnel();
      await this.migratePositions();
      await this.migrateProcesses();
      await this.migrateQualityObjectives();
      await this.migrateQualityIndicators();
      await this.migrateMeasurements();
      await this.migrateNormPoints();
      await this.migrateDocuments();
      await this.migrateFindings();
      await this.migrateIndicators();
      await this.migrateMeasurementsTurso();
      await this.migrateCompetencies();
      await this.migrateSurveys();
      await this.migrateMinutes();
      await this.migrateUsageLimits();
      await this.migrateCRMCollections();
      
      // Migrar colecciones del sistema
      await this.migrateSystemCollections();
      
      console.log('🎉 Migración completada exitosamente!');
      
    } catch (error) {
      console.error('❌ Error durante la migración:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Desconectado de MongoDB');
    }
  }
  /**

   * Migrar Organizaciones (ORGANIZATIONS -> organizations)
   */
  static async migrateOrganizations(): Promise<void> {
    console.log('📋 Migrando Organizaciones...');
    
    const organizationsData = [
      {
        name: 'Empresa Demo ISO 9001',
        email: 'admin@empresa.com',
        phone: '+52 55 1234 5678',
        plan: 'premium',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Organization.deleteMany({});
    const created = await Organization.insertMany(organizationsData);
    console.log(`✅ ${created.length} organizaciones migradas`);
  }

  /**
   * Migrar Usuarios (USUARIOS -> users)
   */
  static async migrateUsers(): Promise<void> {
    console.log('👥 Migrando Usuarios...');
    
    const usersData = [
      {
        name: 'Juan Pérez',
        email: 'juan.perez@empresa.com',
        role: 'admin',
        organization_id: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'María García',
        email: 'maria.garcia@empresa.com',
        role: 'manager',
        organization_id: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Carlos López',
        email: 'carlos.lopez@empresa.com',
        role: 'user',
        organization_id: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await User.deleteMany({});
    const created = await User.insertMany(usersData);
    console.log(`✅ ${created.length} usuarios migrados`);
  }

  /**
   * Migrar Departamentos (DEPARTAMENTOS -> departments)
   */
  static async migrateDepartments(): Promise<void> {
    console.log('🏢 Migrando Departamentos...');
    
    const departmentsData = [
      {
        name: 'Gerencia General',
        description: 'Dirección estratégica de la organización',
        responsible_user_id: '507f1f77bcf86cd799439011',
        organization_id: 1,
        objectives: 'Liderar la organización hacia la excelencia operativa',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Recursos Humanos',
        description: 'Gestión del talento humano',
        responsible_user_id: '507f1f77bcf86cd799439012',
        organization_id: 1,
        objectives: 'Desarrollar y retener el talento organizacional',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Producción',
        description: 'Operaciones de producción',
        responsible_user_id: '507f1f77bcf86cd799439013',
        organization_id: 1,
        objectives: 'Producir bienes y servicios de calidad',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Department.deleteMany({});
    const created = await Department.insertMany(departmentsData);
    console.log(`✅ ${created.length} departamentos migrados`);
  }

  /**
   * Migrar Personal (PERSONAL -> personnel)
   */
  static async migratePersonnel(): Promise<void> {
    console.log('👨‍💼 Migrando Personal...');
    
    const personnelData = [
      {
        id: 'EMP001',
        organization_id: 1,
        nombres: 'Juan',
        apellidos: 'Pérez',
        email: 'juan.perez@empresa.com',
        telefono: '+52 55 1234 5678',
        documento_identidad: 'RFC123456789',
        fecha_nacimiento: '1980-01-15',
        nacionalidad: 'Mexicana',
        direccion: 'Av. Principal 123, CDMX',
        telefono_emergencia: '+52 55 9876 5432',
        fecha_contratacion: '2020-01-15',
        numero_legajo: 'EMP001',
        estado: 'Activo',
        meta_mensual: 100000,
        comision_porcentaje: 5.0,
        supervisor_id: null,
        especialidad_ventas: 'Ventas Corporativas',
        fecha_inicio_ventas: '2020-01-15',
        tipo_personal: 'gerencial',
        zona_venta: 'Centro',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'EMP002',
        organization_id: 1,
        nombres: 'María',
        apellidos: 'García',
        email: 'maria.garcia@empresa.com',
        telefono: '+52 55 2345 6789',
        documento_identidad: 'RFC987654321',
        fecha_nacimiento: '1985-03-20',
        nacionalidad: 'Mexicana',
        direccion: 'Calle Secundaria 456, CDMX',
        telefono_emergencia: '+52 55 8765 4321',
        fecha_contratacion: '2020-03-01',
        numero_legajo: 'EMP002',
        estado: 'Activo',
        meta_mensual: 80000,
        comision_porcentaje: 4.5,
        supervisor_id: 'EMP001',
        especialidad_ventas: 'Ventas Técnicas',
        fecha_inicio_ventas: '2020-03-01',
        tipo_personal: 'administrativo',
        zona_venta: 'Norte',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Personnel.deleteMany({});
    const created = await Personnel.insertMany(personnelData);
    console.log(`✅ ${created.length} personal migrado`);
  }  /**
  
 * Migrar Puestos (PUESTOS -> positions)
   */
  static async migratePositions(): Promise<void> {
    console.log('💼 Migrando Puestos...');
    
    const positionsData = [
      {
        id: 'POS-001',
        nombre: 'Director General',
        descripcion_responsabilidades: 'Liderar la organización y definir estrategias corporativas',
        requisitos_experiencia: 'Mínimo 10 años en puestos directivos',
        requisitos_formacion: 'Licenciatura en Administración o afín',
        departamento_id: 'DEPT-001',
        reporta_a_id: null,
        organization_id: '1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'POS-002',
        nombre: 'Gerente de RRHH',
        descripcion_responsabilidades: 'Gestionar el talento humano y desarrollo organizacional',
        requisitos_experiencia: 'Mínimo 5 años en gestión de recursos humanos',
        requisitos_formacion: 'Licenciatura en Psicología o Administración',
        departamento_id: 'DEPT-002',
        reporta_a_id: 'POS-001',
        organization_id: '1',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Position.deleteMany({});
    const created = await Position.insertMany(positionsData);
    console.log(`✅ ${created.length} puestos migrados`);
  }

  /**
   * Migrar Procesos (PROCESOS -> procesos)
   */
  static async migrateProcesses(): Promise<void> {
    console.log('⚙️ Migrando Procesos...');
    
    const processesData = [
      {
        id: 'PROC-001',
        nombre: 'Gestión de Calidad',
        responsable: 'Gerente de Calidad',
        descripcion: 'Proceso de gestión y mejora continua de la calidad',
        organization_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        tipo: 'operativo',
        categoria: 'proceso',
        nivel_critico: 'alto',
        responsable_id: 'EMP001',
        departamento_id: 'DEPT001',
        supervisor_id: 'EMP001',
        proveedores: 'Proveedores de insumos',
        clientes: 'Clientes internos y externos',
        recursos_requeridos: 'Personal, equipos, sistemas',
        competencias_requeridas: 'Gestión de calidad, ISO 9001',
        metodos_seguimiento: 'Indicadores KPI, auditorías',
        criterios_control: 'Cumplimiento de especificaciones',
        procedimientos_documentados: 'Manual de calidad, procedimientos',
        registros_requeridos: 'Registros de calidad, certificados',
        riesgos_identificados: 'No conformidades, desviaciones',
        oportunidades_mejora: 'Optimización de procesos',
        historial_cambios: 'Registro de cambios y versiones',
        fecha_vigencia: '2024-12-31',
        fecha_revision: '2024-06-30',
        motivo_cambio: 'Actualización por mejoras',
        created_by: 1,
        updated_by: 1,
        is_active: 1,
        codigo: 'GC-001',
        objetivo: 'Asegurar la calidad de productos y servicios',
        alcance: 'Todos los procesos de la organización',
        version: '2.0',
        entradas: 'Requisitos de calidad, especificaciones',
        salidas: 'Productos conformes, servicios de calidad',
        indicadores: 'Índice de conformidad, satisfacción del cliente',
        estado: 'activo'
      }
    ];

    await Proceso.deleteMany({});
    const created = await Proceso.insertMany(processesData);
    console.log(`✅ ${created.length} procesos migrados`);
  }

  /**
   * Migrar Objetivos de Calidad
   */
  static async migrateQualityObjectives(): Promise<void> {
    console.log('🎯 Migrando Objetivos de Calidad...');
    
    const objectivesData = [
      {
        id: 'OBJ-001',
        nombre_objetivo: 'Reducir no conformidades en 25%',
        descripcion: 'Disminuir las no conformidades identificadas en auditorías',
        proceso_id: 'PROC-001',
        indicador_asociado_id: 2024001,
        meta: 'Reducir NC de 40 a 30 por año',
        responsable: 'Gerente de Calidad',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      }
    ];

    await QualityObjective.deleteMany({});
    const created = await QualityObjective.insertMany(objectivesData);
    console.log(`✅ ${created.length} objetivos de calidad migrados`);
  }

  /**
   * Migrar Indicadores de Calidad
   */
  static async migrateQualityIndicators(): Promise<void> {
    console.log('📊 Migrando Indicadores de Calidad...');
    
    const indicatorsData = [
      {
        id: 2024001,
        nombre: 'Índice de No Conformidades',
        descripcion: 'Número de no conformidades por proceso',
        proceso_id: 'PROC-001',
        frecuencia_medicion: 'mensual',
        meta: 2.5,
        formula: 'Número de NC / Número de procesos auditados',
        organization_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: '507f1f77bcf86cd799439011'
      }
    ];

    await QualityIndicator.deleteMany({});
    const created = await QualityIndicator.insertMany(indicatorsData);
    console.log(`✅ ${created.length} indicadores de calidad migrados`);
  }

  /**
   * Migrar Mediciones
   */
  static async migrateMeasurements(): Promise<void> {
    console.log('📈 Migrando Mediciones...');
    
    const measurementsData = [
      {
        id: 'MED-001',
        indicador_id: '2024001',
        valor: 3.2,
        fecha_medicion: '2024-01-31',
        observaciones: 'Medición del mes de enero',
        responsable: 'Gerente de Calidad',
        fecha_creacion: new Date(),
        organization_id: 1,
        created_by: '507f1f77bcf86cd799439011'
      }
    ];

    await Measurement.deleteMany({});
    const created = await Measurement.insertMany(measurementsData);
    console.log(`✅ ${created.length} mediciones migradas`);
  }

  /**
   * Migrar Puntos de Norma
   */
  static async migrateNormPoints(): Promise<void> {
    console.log('📋 Migrando Puntos de Norma...');
    
    const normPointsData = [
      {
        id: 'NP-001',
        codigo: 'ISO 9001:2015',
        titulo: 'Sistemas de gestión de la calidad - Requisitos',
        descripcion: 'Norma internacional que especifica los requisitos para un sistema de gestión de la calidad',
        version: '2015',
        tipo: 'ISO 9001',
        estado: 'activo',
        categoria: 'Sistema de Gestión',
        responsable: 'Gerente de Calidad',
        fecha_revision: new Date('2024-01-01'),
        observaciones: 'Norma principal del sistema de gestión',
        organization_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 1
      }
    ];

    await NormPoint.deleteMany({});
    const created = await NormPoint.insertMany(normPointsData);
    console.log(`✅ ${created.length} puntos de norma migrados`);
  } 
 /**
   * Migrar Documentos (DOCUMENTOS -> documentos)
   */
  static async migrateDocuments(): Promise<void> {
    console.log('📄 Migrando Documentos...');
    
    const documentsData = [
      {
        id: 1,
        titulo: 'Manual de Calidad',
        nombre: 'Manual de Calidad v2.0',
        descripcion: 'Manual principal del sistema de gestión de calidad',
        version: '2.0',
        archivo_nombre: 'manual_calidad_v2.pdf',
        archivo_path: '/documents/manual_calidad_v2.pdf',
        tipo_archivo: 'application/pdf',
        tamaño: 2048000,
        organization_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Documentos.deleteMany({});
    const created = await Documentos.insertMany(documentsData);
    console.log(`✅ ${created.length} documentos migrados`);
  }

  /**
   * Migrar Hallazgos (HALLAZGOS -> hallazgos)
   */
  static async migrateFindings(): Promise<void> {
    console.log('🔍 Migrando Hallazgos...');
    
    const findingsData = [
      {
        id: 'HAL-001',
        numeroHallazgo: 'HAL-2024-001',
        titulo: 'Documentación de Procesos Incompleta',
        descripcion: 'Se encontraron procesos sin documentación actualizada',
        estado: 'identificado',
        origen: 'Auditoría Interna',
        tipo_hallazgo: 'No Conformidad Menor',
        prioridad: 'media',
        fecha_deteccion: '2024-01-15',
        fecha_cierre: null,
        proceso_id: 'PROC-001',
        requisito_incumplido: 'ISO 9001:2015 - Cláusula 4.4',
        orden: 1,
        organization_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        is_active: 1,
        created_by: 1,
        updated_by: 1
      }
    ];

    await Hallazgos.deleteMany({});
    const created = await Hallazgos.insertMany(findingsData);
    console.log(`✅ ${created.length} hallazgos migrados`);
  }

  /**
   * Migrar Indicadores (INDICADORES -> indicadores)
   */
  static async migrateIndicators(): Promise<void> {
    console.log('📊 Migrando Indicadores...');
    
    const indicatorsData = [
      {
        id: 1,
        nombre: 'Eficiencia de Procesos',
        descripcion: 'Medición de la eficiencia operativa',
        proceso_id: 1,
        frecuencia_medicion: 'mensual',
        meta: 95.0,
        formula: '(Tiempo real / Tiempo estándar) * 100',
        organization_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Indicadores.deleteMany({});
    const created = await Indicadores.insertMany(indicatorsData);
    console.log(`✅ ${created.length} indicadores migrados`);
  }

  /**
   * Migrar Mediciones de Turso (MEDICIONES -> mediciones)
   */
  static async migrateMeasurementsTurso(): Promise<void> {
    console.log('📈 Migrando Mediciones de Turso...');
    
    const measurementsData = [
      {
        id: 'MED-TURSO-001',
        indicador_id: '1',
        valor: 92.5,
        fecha_medicion: '2024-01-31',
        observaciones: 'Medición del mes de enero',
        responsable: 'Supervisor de Producción',
        fecha_creacion: new Date(),
        organization_id: 1
      }
    ];

    await Mediciones.deleteMany({});
    const created = await Mediciones.insertMany(measurementsData);
    console.log(`✅ ${created.length} mediciones de Turso migradas`);
  }

  /**
   * Migrar Competencias (COMPETENCIAS -> competencias)
   */
  static async migrateCompetencies(): Promise<void> {
    console.log('🎓 Migrando Competencias...');
    
    const competenciesData = [
      {
        id: 1,
        nombre: 'Gestión de Procesos ISO 9001',
        descripcion: 'Competencia en gestión y mejora de procesos según norma ISO 9001',
        organization_id: 1,
        estado: 'activa',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Competencias.deleteMany({});
    const created = await Competencias.insertMany(competenciesData);
    console.log(`✅ ${created.length} competencias migradas`);
  }

  /**
   * Migrar Encuestas (ENCUESTAS -> encuestas)
   */
  static async migrateSurveys(): Promise<void> {
    console.log('📝 Migrando Encuestas...');
    
    const surveysData = [
      {
        id: 1,
        titulo: 'Encuesta de Satisfacción del Cliente',
        descripcion: 'Evaluación de la satisfacción del cliente con nuestros servicios',
        fecha_creacion: '2024-01-01',
        fecha_cierre: '2024-12-31',
        estado: 'activa',
        organization_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Encuestas.deleteMany({});
    const created = await Encuestas.insertMany(surveysData);
    console.log(`✅ ${created.length} encuestas migradas`);
  }

  /**
   * Migrar Minutas (MINUTAS -> minutas)
   */
  static async migrateMinutes(): Promise<void> {
    console.log('📋 Migrando Minutas...');
    
    const minutesData = [
      {
        id: 'MIN-001',
        organization_id: 1,
        titulo: 'Reunión de Revisión Gerencial',
        fecha: '2024-01-15',
        hora_inicio: '09:00',
        hora_fin: '11:00',
        lugar: 'Sala de Juntas Principal',
        tipo: 'reunion',
        organizador_id: 1,
        agenda: 'Revisión de objetivos Q1 2024',
        conclusiones: 'Se aprobaron los objetivos propuestos',
        acuerdos: 'Implementar mejoras en documentación',
        proxima_reunion: '2024-02-15',
        estado: 'completada',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 1,
        updated_by: 1,
        is_active: 1
      }
    ];

    await Minutas.deleteMany({});
    const created = await Minutas.insertMany(minutesData);
    console.log(`✅ ${created.length} minutas migradas`);
  }

  /**
   * Migrar Límites de Uso (LIMITES_USO -> limites_uso)
   */
  static async migrateUsageLimits(): Promise<void> {
    console.log('🔒 Migrando Límites de Uso...');
    
    const limitsData = [
      {
        id: 1,
        organization_id: 1,
        tipo_recurso: 'usuarios',
        limite_actual: 5,
        limite_maximo: 50,
        fecha_reset: new Date('2024-02-01'),
        periodo_reset: 'mensual',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Limites_uso.deleteMany({});
    const created = await Limites_uso.insertMany(limitsData);
    console.log(`✅ ${created.length} límites de uso migrados`);
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
        descripcion: 'Oportunidad para venta de 50 toneladas de semillas de maíz híbrido',
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
    const createdOportunidades = await CRM_OportunidadesAgro.insertMany(oportunidadesData);
    console.log(`✅ ${createdOportunidades.length} oportunidades agro migradas`);

    console.log('✅ Migración de colecciones CRM completada');
  }  /*
*
   * Migrar Colecciones del Sistema
   */
  static async migrateSystemCollections(): Promise<void> {
    console.log('🔧 Migrando Colecciones del Sistema...');

    // 1. Migrar Planes
    console.log('📋 Creando Planes...');
    const planesData = [
      {
        id: 1,
        nombre: 'Plan Gratuito',
        descripcion: 'Plan básico gratuito para organizaciones pequeñas',
        precio_mensual: 0.00,
        precio_anual: 0.00,
        max_usuarios: 3,
        max_departamentos: 2,
        max_documentos: 50,
        max_auditorias: 2,
        max_hallazgos: 20,
        max_acciones: 30,
        caracteristicas: 'Funcionalidades básicas, soporte por email',
        estado: 'activo',
        es_plan_gratuito: true,
        orden_display: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        nombre: 'Plan Profesional',
        descripcion: 'Plan profesional para organizaciones medianas',
        precio_mensual: 2500.00,
        precio_anual: 25000.00,
        max_usuarios: 15,
        max_departamentos: 8,
        max_documentos: 500,
        max_auditorias: 12,
        max_hallazgos: 100,
        max_acciones: 200,
        caracteristicas: 'Todas las funcionalidades, reportes avanzados, soporte prioritario',
        estado: 'activo',
        es_plan_gratuito: false,
        orden_display: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        nombre: 'Plan Empresarial',
        descripcion: 'Plan empresarial para organizaciones grandes',
        precio_mensual: 5000.00,
        precio_anual: 50000.00,
        max_usuarios: 100,
        max_departamentos: 25,
        max_documentos: 2000,
        max_auditorias: 50,
        max_hallazgos: 500,
        max_acciones: 1000,
        caracteristicas: 'Funcionalidades ilimitadas, integraciones API, soporte 24/7',
        estado: 'activo',
        es_plan_gratuito: false,
        orden_display: 3,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await Planes.deleteMany({});
    const createdPlanes = await Planes.insertMany(planesData);
    console.log(`✅ ${createdPlanes.length} planes creados`);

    // 2. Migrar Organization Features
    console.log('🔧 Creando Organization Features...');
    const organizationFeaturesData = [
      {
        id: 1,
        organization_id: 1,
        feature_name: 'crm_module',
        is_enabled: true,
        created_at: new Date()
      },
      {
        id: 2,
        organization_id: 1,
        feature_name: 'rrhh_module',
        is_enabled: true,
        created_at: new Date()
      },
      {
        id: 3,
        organization_id: 1,
        feature_name: 'sgc_module',
        is_enabled: true,
        created_at: new Date()
      },
      {
        id: 4,
        organization_id: 1,
        feature_name: 'auditorias_module',
        is_enabled: true,
        created_at: new Date()
      },
      {
        id: 5,
        organization_id: 1,
        feature_name: 'documentos_module',
        is_enabled: true,
        created_at: new Date()
      },
      {
        id: 6,
        organization_id: 1,
        feature_name: 'indicadores_module',
        is_enabled: true,
        created_at: new Date()
      },
      {
        id: 7,
        organization_id: 1,
        feature_name: 'procesos_module',
        is_enabled: true,
        created_at: new Date()
      },
      {
        id: 8,
        organization_id: 1,
        feature_name: 'reportes_avanzados',
        is_enabled: true,
        created_at: new Date()
      },
      {
        id: 9,
        organization_id: 1,
        feature_name: 'soporte_prioritario',
        is_enabled: true,
        created_at: new Date()
      }
    ];

    await OrganizationFeatures.deleteMany({});
    const createdFeatures = await OrganizationFeatures.insertMany(organizationFeaturesData);
    console.log(`✅ ${createdFeatures.length} organization features creadas`);

    // 3. Migrar Suscripciones
    console.log('💳 Creando Suscripciones...');
    const suscripcionesData = [
      {
        id: 1,
        organization_id: 1,
        plan_id: 2, // Plan Profesional
        estado: 'activa',
        fecha_inicio: new Date('2024-01-01'),
        fecha_fin: new Date('2024-12-31'),
        fecha_proximo_pago: new Date('2024-02-01'),
        metodo_pago: 'tarjeta_credito',
        precio_actual: 2500.00,
        moneda: 'MXN',
        periodo_facturacion: 'mensual',
        auto_renovacion: true,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 1,
        updated_by: 1
      }
    ];

    await Suscripciones.deleteMany({});
    const createdSuscripciones = await Suscripciones.insertMany(suscripcionesData);
    console.log(`✅ ${createdSuscripciones.length} suscripciones creadas`);

    // 4. Migrar Refresh Tokens (ejemplos para testing)
    console.log('🔑 Creando Refresh Tokens de ejemplo...');
    const refreshTokensData = [
      {
        id: 1,
        user_id: 1,
        token: 'refresh_token_example_1_' + Date.now(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        created_at: new Date()
      },
      {
        id: 2,
        user_id: 2,
        token: 'refresh_token_example_2_' + Date.now(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        created_at: new Date()
      }
    ];

    await RefreshTokens.deleteMany({});
    const createdTokens = await RefreshTokens.insertMany(refreshTokensData);
    console.log(`✅ ${createdTokens.length} refresh tokens creados`);

    console.log('✅ Migración de colecciones del sistema completada');
  }
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  TursoToMongoMigration.migrateAll()
    .then(() => {
      console.log('🎉 Migración completada exitosamente!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error durante la migración:', error);
      process.exit(1);
    });
}

export { TursoToMongoMigration };