import { Department } from '../models/Department';
import { Position } from '../models/Position';
import { Personnel } from '../models/Personnel';

export async function seedRRHH() {
  try {
    console.log('🚀 Iniciando seeder de RRHH...');

    // 1. Crear Departamentos
    const departments = [
      {
        id: 'dept-001',
        nombre: 'Recursos Humanos',
        descripcion: 'Gestión del talento humano y desarrollo organizacional',
        organization_id: 1,
        objetivos: 'Mantener un equipo motivado y capacitado'
      },
      {
        id: 'dept-002',
        nombre: 'Ventas y Marketing',
        descripcion: 'Gestión comercial y estrategias de mercado',
        organization_id: 1,
        objetivos: 'Aumentar las ventas y mejorar la presencia en el mercado'
      },
      {
        id: 'dept-003',
        nombre: 'Producción',
        descripcion: 'Gestión de la producción y control de calidad',
        organization_id: 1,
        objetivos: 'Optimizar la producción y mantener estándares de calidad'
      },
      {
        id: 'dept-004',
        nombre: 'Administración y Finanzas',
        descripcion: 'Gestión administrativa y financiera',
        organization_id: 1,
        objetivos: 'Mantener la salud financiera y eficiencia administrativa'
      },
      {
        id: 'dept-005',
        nombre: 'Tecnología e Innovación',
        descripcion: 'Desarrollo tecnológico e innovación',
        organization_id: 1,
        objetivos: 'Impulsar la innovación y modernización tecnológica'
      }
    ];

    // Limpiar departamentos existentes
    await Department.deleteMany({});
    const createdDepartments = await Department.insertMany(departments);
    console.log(`✅ ${createdDepartments.length} departamentos creados`);

    // 2. Crear Puestos
    const positions = [
      {
        id: 'pos-001',
        nombre: 'Gerente de Recursos Humanos',
        descripcion_responsabilidades: 'Dirigir el área de RRHH, gestionar talento humano, desarrollo organizacional',
        requisitos_experiencia: '5+ años en gestión de RRHH, liderazgo de equipos',
        requisitos_formacion: 'Licenciatura en Psicología, Administración o afín',
        departamento_id: 'dept-001',
        organization_id: '1'
      },
      {
        id: 'pos-002',
        nombre: 'Especialista en Reclutamiento',
        descripcion_responsabilidades: 'Reclutar y seleccionar personal, entrevistas, evaluación de candidatos',
        requisitos_experiencia: '3+ años en reclutamiento y selección',
        requisitos_formacion: 'Licenciatura en Psicología o RRHH',
        departamento_id: 'dept-001',
        reporta_a_id: 'pos-001',
        organization_id: '1'
      },
      {
        id: 'pos-003',
        nombre: 'Gerente de Ventas',
        descripcion_responsabilidades: 'Dirigir equipo de ventas, estrategias comerciales, seguimiento de objetivos',
        requisitos_experiencia: '5+ años en ventas, liderazgo comercial',
        requisitos_formacion: 'Licenciatura en Administración, Marketing o afín',
        departamento_id: 'dept-002',
        organization_id: '1'
      },
      {
        id: 'pos-004',
        nombre: 'Ejecutivo de Ventas',
        descripcion_responsabilidades: 'Generar ventas, atención a clientes, seguimiento de leads',
        requisitos_experiencia: '2+ años en ventas',
        requisitos_formacion: 'Técnico o Licenciatura en área comercial',
        departamento_id: 'dept-002',
        reporta_a_id: 'pos-003',
        organization_id: '1'
      },
      {
        id: 'pos-005',
        nombre: 'Supervisor de Producción',
        descripcion_responsabilidades: 'Supervisar procesos productivos, control de calidad, gestión de equipos',
        requisitos_experiencia: '4+ años en producción industrial',
        requisitos_formacion: 'Ingeniería Industrial o afín',
        departamento_id: 'dept-003',
        organization_id: '1'
      },
      {
        id: 'pos-006',
        nombre: 'Contador',
        descripcion_responsabilidades: 'Contabilidad general, reportes financieros, cumplimiento fiscal',
        requisitos_experiencia: '3+ años en contabilidad',
        requisitos_formacion: 'Licenciatura en Contaduría',
        departamento_id: 'dept-004',
        organization_id: '1'
      },
      {
        id: 'pos-007',
        nombre: 'Desarrollador de Software',
        descripcion_responsabilidades: 'Desarrollo de aplicaciones, mantenimiento de sistemas, innovación tecnológica',
        requisitos_experiencia: '3+ años en desarrollo de software',
        requisitos_formacion: 'Ingeniería en Sistemas o afín',
        departamento_id: 'dept-005',
        organization_id: '1'
      }
    ];

    // Limpiar puestos existentes
    await Position.deleteMany({});
    const createdPositions = await Position.insertMany(positions);
    console.log(`✅ ${createdPositions.length} puestos creados`);

    // 3. Crear Personal
    const personnel = [
      {
        id: 'emp-001',
        organization_id: 1,
        nombres: 'María',
        apellidos: 'González Pérez',
        email: 'maria.gonzalez@empresa.com',
        telefono: '+52-55-1234-5678',
        documento_identidad: 'ABC123456789',
        fecha_nacimiento: new Date('1985-03-15'),
        nacionalidad: 'Mexicana',
        direccion: 'Av. Reforma 123, Ciudad de México',
        telefono_emergencia: '+52-55-9876-5432',
        fecha_contratacion: new Date('2020-01-15'),
        numero_legajo: 'LEG-001',
        estado: 'Activo',
        meta_mensual: 0,
        comision_porcentaje: 0,
        tipo_personal: 'gerencial'
      },
      {
        id: 'emp-002',
        organization_id: 1,
        nombres: 'Carlos',
        apellidos: 'Rodríguez López',
        email: 'carlos.rodriguez@empresa.com',
        telefono: '+52-55-2345-6789',
        documento_identidad: 'DEF987654321',
        fecha_nacimiento: new Date('1990-07-22'),
        nacionalidad: 'Mexicana',
        direccion: 'Calle Insurgentes 456, Ciudad de México',
        telefono_emergencia: '+52-55-8765-4321',
        fecha_contratacion: new Date('2021-06-01'),
        numero_legajo: 'LEG-002',
        estado: 'Activo',
        meta_mensual: 0,
        comision_porcentaje: 0,
        supervisor_id: 'emp-001',
        tipo_personal: 'administrativo'
      },
      {
        id: 'emp-003',
        organization_id: 1,
        nombres: 'Ana',
        apellidos: 'Martínez Silva',
        email: 'ana.martinez@empresa.com',
        telefono: '+52-55-3456-7890',
        documento_identidad: 'GHI456789123',
        fecha_nacimiento: new Date('1988-11-10'),
        nacionalidad: 'Mexicana',
        direccion: 'Av. Insurgentes Sur 789, Ciudad de México',
        telefono_emergencia: '+52-55-7654-3210',
        fecha_contratacion: new Date('2019-03-10'),
        numero_legajo: 'LEG-003',
        estado: 'Activo',
        meta_mensual: 500000,
        comision_porcentaje: 5,
        supervisor_id: 'emp-001',
        especialidad_ventas: 'Ventas Corporativas',
        fecha_inicio_ventas: new Date('2019-03-10'),
        tipo_personal: 'ventas',
        zona_venta: 'Centro'
      },
      {
        id: 'emp-004',
        organization_id: 1,
        nombres: 'Luis',
        apellidos: 'Hernández García',
        email: 'luis.hernandez@empresa.com',
        telefono: '+52-55-4567-8901',
        documento_identidad: 'JKL789123456',
        fecha_nacimiento: new Date('1992-05-18'),
        nacionalidad: 'Mexicana',
        direccion: 'Calle Roma 321, Ciudad de México',
        telefono_emergencia: '+52-55-6543-2109',
        fecha_contratacion: new Date('2022-01-20'),
        numero_legajo: 'LEG-004',
        estado: 'Activo',
        meta_mensual: 300000,
        comision_porcentaje: 3,
        supervisor_id: 'emp-003',
        especialidad_ventas: 'Ventas Minoristas',
        fecha_inicio_ventas: new Date('2022-01-20'),
        tipo_personal: 'ventas',
        zona_venta: 'Norte'
      },
      {
        id: 'emp-005',
        organization_id: 1,
        nombres: 'Roberto',
        apellidos: 'Fernández Torres',
        email: 'roberto.fernandez@empresa.com',
        telefono: '+52-55-5678-9012',
        documento_identidad: 'MNO123456789',
        fecha_nacimiento: new Date('1987-09-05'),
        nacionalidad: 'Mexicana',
        direccion: 'Av. Chapultepec 654, Ciudad de México',
        telefono_emergencia: '+52-55-5432-1098',
        fecha_contratacion: new Date('2018-08-15'),
        numero_legajo: 'LEG-005',
        estado: 'Activo',
        meta_mensual: 0,
        comision_porcentaje: 0,
        tipo_personal: 'técnico'
      },
      {
        id: 'emp-006',
        organization_id: 1,
        nombres: 'Patricia',
        apellidos: 'Morales Ruiz',
        email: 'patricia.morales@empresa.com',
        telefono: '+52-55-6789-0123',
        documento_identidad: 'PQR987654321',
        fecha_nacimiento: new Date('1991-12-03'),
        nacionalidad: 'Mexicana',
        direccion: 'Calle Condesa 987, Ciudad de México',
        telefono_emergencia: '+52-55-4321-0987',
        fecha_contratacion: new Date('2020-11-30'),
        numero_legajo: 'LEG-006',
        estado: 'Activo',
        meta_mensual: 0,
        comision_porcentaje: 0,
        supervisor_id: 'emp-005',
        tipo_personal: 'administrativo'
      },
      {
        id: 'emp-007',
        organization_id: 1,
        nombres: 'Diego',
        apellidos: 'Castro Jiménez',
        email: 'diego.castro@empresa.com',
        telefono: '+52-55-7890-1234',
        documento_identidad: 'STU456789123',
        fecha_nacimiento: new Date('1993-04-25'),
        nacionalidad: 'Mexicana',
        direccion: 'Av. Polanco 147, Ciudad de México',
        telefono_emergencia: '+52-55-3210-9876',
        fecha_contratacion: new Date('2023-02-14'),
        numero_legajo: 'LEG-007',
        estado: 'Activo',
        meta_mensual: 0,
        comision_porcentaje: 0,
        tipo_personal: 'técnico'
      }
    ];

    // Limpiar personal existente
    await Personnel.deleteMany({});
    const createdPersonnel = await Personnel.insertMany(personnel);
    console.log(`✅ ${createdPersonnel.length} empleados creados`);

    console.log('\n🎉 Seeder de RRHH completado exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - ${createdDepartments.length} departamentos`);
    console.log(`   - ${createdPositions.length} puestos`);
    console.log(`   - ${createdPersonnel.length} empleados`);

    return {
      departments: createdDepartments,
      positions: createdPositions,
      personnel: createdPersonnel
    };

  } catch (error) {
    console.error('❌ Error en seeder de RRHH:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedRRHH()
    .then(() => {
      console.log('✅ Seeder ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error ejecutando seeder:', error);
      process.exit(1);
    });
}

