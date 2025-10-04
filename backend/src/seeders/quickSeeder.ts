import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import { Department } from '../models/Department';
import { Personnel } from '../models/Personnel';
import { Position } from '../models/Position';
import { Proceso } from '../models/PROCESO';

const ORGANIZATION_ID = 1;

// Datos de prueba para departamentos
const departmentsData = [
  {
    name: 'Recursos Humanos',
    description: 'Gestión del talento humano y desarrollo organizacional',
    organization_id: ORGANIZATION_ID,
    is_active: true
  },
  {
    name: 'Calidad',
    description: 'Control y aseguramiento de la calidad según ISO 9001',
    organization_id: ORGANIZATION_ID,
    is_active: true
  },
  {
    name: 'Producción',
    description: 'Operaciones de manufactura y producción',
    organization_id: ORGANIZATION_ID,
    is_active: true
  },
  {
    name: 'Auditoría Interna',
    description: 'Auditorías internas del sistema de gestión de calidad',
    organization_id: ORGANIZATION_ID,
    is_active: true
  },
  {
    name: 'Diseño y Desarrollo',
    description: 'Diseño y desarrollo de productos y servicios',
    organization_id: ORGANIZATION_ID,
    is_active: true
  }
];

// Datos de prueba para puestos
const positionsData = [
  {
    id: 'POS-001',
    nombre: 'Gerente de Calidad',
    descripcion_responsabilidades: 'Supervisar el sistema de gestión de calidad ISO 9001',
    requisitos_experiencia: '5+ años en gestión de calidad',
    requisitos_formacion: 'Ingeniería Industrial o afín, certificación ISO 9001',
    organization_id: ORGANIZATION_ID.toString()
  },
  {
    id: 'POS-002',
    nombre: 'Auditor Interno',
    descripcion_responsabilidades: 'Realizar auditorías internas del SGC',
    requisitos_experiencia: '3+ años en auditoría',
    requisitos_formacion: 'Certificación en auditoría ISO 9001',
    organization_id: ORGANIZATION_ID.toString()
  },
  {
    id: 'POS-003',
    nombre: 'Analista de Procesos',
    descripcion_responsabilidades: 'Documentar y mejorar procesos organizacionales',
    requisitos_experiencia: '2+ años en análisis de procesos',
    requisitos_formacion: 'Ingeniería Industrial o Administración',
    organization_id: ORGANIZATION_ID.toString()
  },
  {
    id: 'POS-004',
    nombre: 'Especialista RRHH',
    descripcion_responsabilidades: 'Gestionar el talento humano y capacitaciones',
    requisitos_experiencia: '3+ años en recursos humanos',
    requisitos_formacion: 'Psicología o Administración de RRHH',
    organization_id: ORGANIZATION_ID.toString()
  }
];

// Datos de prueba para personal
const personnelData = [
  {
    id: 'PER-001',
    organization_id: ORGANIZATION_ID,
    nombres: 'María Elena',
    apellidos: 'García López',
    email: 'maria.garcia@empresa.com',
    telefono: '+1234567890',
    documento_identidad: '12345678',
    fecha_nacimiento: new Date('1985-03-15'),
    nacionalidad: 'Mexicana',
    direccion: 'Av. Principal 123, Ciudad',
    fecha_contratacion: new Date('2020-01-15'),
    numero_legajo: 'LEG-001',
    estado: 'Activo',
    tipo_personal: 'gerencial'
  },
  {
    id: 'PER-002',
    organization_id: ORGANIZATION_ID,
    nombres: 'Carlos Alberto',
    apellidos: 'Rodríguez Pérez',
    email: 'carlos.rodriguez@empresa.com',
    telefono: '+1234567891',
    documento_identidad: '87654321',
    fecha_nacimiento: new Date('1988-07-22'),
    nacionalidad: 'Mexicana',
    direccion: 'Calle Secundaria 456, Ciudad',
    fecha_contratacion: new Date('2021-03-10'),
    numero_legajo: 'LEG-002',
    estado: 'Activo',
    tipo_personal: 'técnico'
  },
  {
    id: 'PER-003',
    organization_id: ORGANIZATION_ID,
    nombres: 'Ana Patricia',
    apellidos: 'Martínez Silva',
    email: 'ana.martinez@empresa.com',
    telefono: '+1234567892',
    documento_identidad: '11223344',
    fecha_nacimiento: new Date('1990-11-08'),
    nacionalidad: 'Mexicana',
    direccion: 'Boulevard Norte 789, Ciudad',
    fecha_contratacion: new Date('2022-06-01'),
    numero_legajo: 'LEG-003',
    estado: 'Activo',
    tipo_personal: 'administrativo'
  }
];

// Datos de prueba para procesos
const processData = [
  {
    codigo: 'PROC-2024-001',
    nombre: 'Gestión de Recursos Humanos',
    descripcion: 'Proceso integral para la gestión del talento humano',
    objetivo: 'Asegurar la disponibilidad de personal competente',
    alcance: 'Desde reclutamiento hasta desarrollo del personal',
    responsable: 'Gerente de RRHH',
    entradas: 'Necesidades de personal, perfiles de cargo',
    salidas: 'Personal competente, registros de capacitación',
    etapas_kanban: [
      { nombre: 'Planificación', color: '#3B82F6', orden: 1, es_inicial: true },
      { nombre: 'Reclutamiento', color: '#F59E0B', orden: 2 },
      { nombre: 'Selección', color: '#8B5CF6', orden: 3 },
      { nombre: 'Contratación', color: '#10B981', orden: 4, es_final: true }
    ],
    tipo: 'estratégico',
    categoria: 'proceso',
    nivel_critico: 'alto',
    estado: 'activo',
    organization_id: ORGANIZATION_ID,
    is_active: true
  },
  {
    codigo: 'PROC-2024-002',
    nombre: 'Control de Calidad',
    descripcion: 'Proceso para asegurar la calidad de productos y servicios',
    objetivo: 'Garantizar que los productos cumplan con los requisitos',
    alcance: 'Desde inspección hasta liberación de productos',
    responsable: 'Gerente de Calidad',
    entradas: 'Productos terminados, especificaciones',
    salidas: 'Productos conformes, registros de calidad',
    etapas_kanban: [
      { nombre: 'Recepción', color: '#3B82F6', orden: 1, es_inicial: true },
      { nombre: 'Inspección', color: '#F59E0B', orden: 2 },
      { nombre: 'Análisis', color: '#8B5CF6', orden: 3 },
      { nombre: 'Liberación', color: '#10B981', orden: 4, es_final: true }
    ],
    tipo: 'operativo',
    categoria: 'proceso',
    nivel_critico: 'alto',
    estado: 'activo',
    organization_id: ORGANIZATION_ID,
    is_active: true
  },
  {
    codigo: 'PROC-2024-003',
    nombre: 'Auditoría Interna',
    descripcion: 'Proceso de auditoría interna del sistema de gestión',
    objetivo: 'Verificar la conformidad del sistema de gestión',
    alcance: 'Todos los procesos del sistema de gestión',
    responsable: 'Auditor Líder',
    entradas: 'Programa de auditoría, criterios de auditoría',
    salidas: 'Informe de auditoría, hallazgos',
    etapas_kanban: [
      { nombre: 'Planificación', color: '#3B82F6', orden: 1, es_inicial: true },
      { nombre: 'Ejecución', color: '#F59E0B', orden: 2 },
      { nombre: 'Reporte', color: '#8B5CF6', orden: 3 },
      { nombre: 'Seguimiento', color: '#10B981', orden: 4, es_final: true }
    ],
    tipo: 'apoyo',
    categoria: 'proceso',
    nivel_critico: 'medio',
    estado: 'activo',
    organization_id: ORGANIZATION_ID,
    is_active: true
  }
];

export async function runQuickSeeder() {
  try {
    console.log('🌱 Iniciando seeder rápido...');
    
    await connectDB();
    
    // Limpiar colecciones existentes
    console.log('🧹 Limpiando colecciones...');
    await Department.deleteMany({});
    await Position.deleteMany({});
    await Personnel.deleteMany({});
    await Proceso.deleteMany({});
    
    // Insertar departamentos
    console.log('📁 Insertando departamentos...');
    const departments = await Department.insertMany(departmentsData);
    console.log(`✅ ${departments.length} departamentos insertados`);
    
    // Insertar puestos
    console.log('💼 Insertando puestos...');
    const positions = await Position.insertMany(positionsData);
    console.log(`✅ ${positions.length} puestos insertados`);
    
    // Insertar personal
    console.log('👥 Insertando personal...');
    const personnel = await Personnel.insertMany(personnelData);
    console.log(`✅ ${personnel.length} empleados insertados`);
    
    // Insertar procesos
    console.log('⚙️ Insertando procesos...');
    const processes = await Proceso.insertMany(processData);
    console.log(`✅ ${processes.length} procesos insertados`);
    
    console.log('🎉 Seeder completado exitosamente!');
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE DATOS INSERTADOS:');
    console.log(`- Departamentos: ${departments.length}`);
    console.log(`- Puestos: ${positions.length}`);
    console.log(`- Personal: ${personnel.length}`);
    console.log(`- Procesos: ${processes.length}`);
    
  } catch (error) {
    console.error('❌ Error en el seeder:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runQuickSeeder()
    .then(() => {
      console.log('✅ Seeder ejecutado correctamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error ejecutando seeder:', error);
      process.exit(1);
    });
}