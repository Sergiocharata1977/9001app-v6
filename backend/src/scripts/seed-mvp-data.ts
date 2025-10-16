/**
 * Script para inicializar la base de datos con datos de prueba para MVP
 * 
 * Este script crea datos de prueba para todas las colecciones esenciales
 * definidas en la configuración de la base de datos simplificada.
 */

import mongoose from 'mongoose';
import { ESSENTIAL_COLLECTIONS, initializeDatabase } from '../config/db-simple';

// Datos de prueba para cada colección
const sampleData: Record<string, any[]> = {
    // Usuarios para login básico
    usuarios: [
        {
            email: 'admin@9001app.com',
            password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGq4V9//8iBp4o4FfMCpNu', // admin123
            role: 'admin',
            name: 'Administrador MVP',
            active: true,
            createdAt: new Date()
        },
        {
            email: 'usuario@9001app.com',
            password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGq4V9//8iBp4o4FfMCpNu', // admin123
            role: 'user',
            name: 'Usuario Estándar',
            active: true,
            createdAt: new Date()
        }
    ],

    // Personal para RRHH
    personal: [
        {
            nombre: 'Juan Pérez',
            puesto: 'Gerente de Calidad',
            departamento: 'Calidad',
            email: 'juan.perez@empresa.com',
            telefono: '555-1234',
            fechaIngreso: new Date('2020-01-15'),
            activo: true
        },
        {
            nombre: 'María López',
            puesto: 'Analista de RRHH',
            departamento: 'RRHH',
            email: 'maria.lopez@empresa.com',
            telefono: '555-5678',
            fechaIngreso: new Date('2021-03-10'),
            activo: true
        },
        {
            nombre: 'Carlos Rodríguez',
            puesto: 'Desarrollador Senior',
            departamento: 'IT',
            email: 'carlos.rodriguez@empresa.com',
            telefono: '555-9012',
            fechaIngreso: new Date('2019-07-22'),
            activo: true
        }
    ],

    // Departamentos para RRHH
    departamentos: [
        {
            nombre: 'Calidad',
            descripcion: 'Departamento de Gestión de Calidad',
            responsable: 'Juan Pérez',
            activo: true
        },
        {
            nombre: 'RRHH',
            descripcion: 'Departamento de Recursos Humanos',
            responsable: 'María López',
            activo: true
        },
        {
            nombre: 'IT',
            descripcion: 'Departamento de Tecnología de la Información',
            responsable: 'Carlos Rodríguez',
            activo: true
        }
    ],

    // Empresas para CRM
    empresas: [
        {
            nombre: 'Empresa A',
            rubro: 'Tecnología',
            contactoPrincipal: 'Roberto Gómez',
            email: 'contacto@empresaa.com',
            telefono: '555-1111',
            direccion: 'Calle Principal 123',
            activo: true
        },
        {
            nombre: 'Empresa B',
            rubro: 'Manufactura',
            contactoPrincipal: 'Laura Torres',
            email: 'contacto@empresab.com',
            telefono: '555-2222',
            direccion: 'Avenida Central 456',
            activo: true
        }
    ],

    // Oportunidades para CRM
    oportunidades: [
        {
            empresa: 'Empresa A',
            titulo: 'Implementación ISO 9001',
            descripcion: 'Implementación completa de sistema de gestión de calidad',
            valor: 50000,
            estado: 'En progreso',
            fechaCreacion: new Date('2025-09-01'),
            responsable: 'Juan Pérez'
        },
        {
            empresa: 'Empresa B',
            titulo: 'Consultoría de procesos',
            descripcion: 'Optimización de procesos de producción',
            valor: 30000,
            estado: 'Inicial',
            fechaCreacion: new Date('2025-10-05'),
            responsable: 'María López'
        }
    ],

    // Documentos
    documentos: [
        {
            titulo: 'Manual de Calidad',
            codigo: 'MC-001',
            version: '1.0',
            estado: 'Aprobado',
            fechaCreacion: new Date('2025-01-10'),
            fechaAprobacion: new Date('2025-01-15'),
            autor: 'Juan Pérez',
            ruta: '/documentos/manual-calidad-v1.pdf'
        },
        {
            titulo: 'Procedimiento de Auditorías Internas',
            codigo: 'PR-AUD-001',
            version: '1.0',
            estado: 'Aprobado',
            fechaCreacion: new Date('2025-02-05'),
            fechaAprobacion: new Date('2025-02-10'),
            autor: 'Juan Pérez',
            ruta: '/documentos/procedimiento-auditorias-v1.pdf'
        }
    ],

    // Normas ISO
    normas: [
        {
            codigo: '4.1',
            titulo: 'Comprensión de la organización y su contexto',
            descripcion: 'La organización debe determinar las cuestiones externas e internas...',
            categoria: 'Contexto de la organización'
        },
        {
            codigo: '4.2',
            titulo: 'Comprensión de las necesidades y expectativas de las partes interesadas',
            descripcion: 'La organización debe determinar las partes interesadas...',
            categoria: 'Contexto de la organización'
        },
        {
            codigo: '5.1',
            titulo: 'Liderazgo y compromiso',
            descripcion: 'La alta dirección debe demostrar liderazgo y compromiso...',
            categoria: 'Liderazgo'
        }
    ],

    // Auditorías
    auditorias: [
        {
            tipo: 'Interna',
            fechaInicio: new Date('2025-03-15'),
            fechaFin: new Date('2025-03-16'),
            alcance: 'Todos los procesos',
            responsable: 'Juan Pérez',
            estado: 'Completada',
            resultado: 'Conforme con observaciones'
        },
        {
            tipo: 'Externa',
            fechaInicio: new Date('2025-06-10'),
            fechaFin: new Date('2025-06-12'),
            alcance: 'Sistema de gestión completo',
            responsable: 'Entidad Certificadora',
            estado: 'Planificada',
            resultado: 'Pendiente'
        }
    ],

    // Indicadores
    indicadores: [
        {
            nombre: 'Satisfacción del cliente',
            descripcion: 'Nivel de satisfacción de clientes según encuestas',
            formula: 'Promedio de puntuaciones en encuestas',
            unidad: 'Porcentaje',
            meta: 85,
            frecuencia: 'Mensual',
            responsable: 'Juan Pérez'
        },
        {
            nombre: 'Eficacia de procesos',
            descripcion: 'Cumplimiento de objetivos de procesos clave',
            formula: 'Objetivos cumplidos / Objetivos totales',
            unidad: 'Porcentaje',
            meta: 90,
            frecuencia: 'Trimestral',
            responsable: 'Carlos Rodríguez'
        }
    ],

    // Procesos
    procesos: [
        {
            nombre: 'Gestión de Ventas',
            tipo: 'Clave',
            responsable: 'Departamento Comercial',
            entradas: ['Requisitos del cliente', 'Información de mercado'],
            salidas: ['Contratos', 'Pedidos'],
            indicadores: ['Ventas mensuales', 'Satisfacción del cliente']
        },
        {
            nombre: 'Gestión de Compras',
            tipo: 'Apoyo',
            responsable: 'Departamento de Compras',
            entradas: ['Requisitos de producción', 'Evaluación de proveedores'],
            salidas: ['Órdenes de compra', 'Materiales'],
            indicadores: ['Tiempo de entrega', 'Calidad de materiales']
        }
    ]
};

/**
 * Inserta datos de prueba en una colección
 * @param collectionName Nombre de la colección
 */
const seedCollection = async (collectionName: string): Promise<void> => {
    try {
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('No hay conexión a la base de datos');
        }

        const collection = db.collection(collectionName);

        // Verificar si la colección ya tiene datos
        const count = await collection.countDocuments();

        if (count > 0) {
            console.log(`La colección ${collectionName} ya tiene datos (${count} documentos)`);
            return;
        }

        // Insertar datos de prueba
        const data = sampleData[collectionName] || [];

        if (data.length === 0) {
            console.log(`No hay datos de prueba definidos para la colección ${collectionName}`);
            return;
        }

        const result = await collection.insertMany(data);
        console.log(`Insertados ${result.insertedCount} documentos en la colección ${collectionName}`);
    } catch (error) {
        console.error(`Error al insertar datos en la colección ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Inicializa todas las colecciones con datos de prueba
 */
const seedAllCollections = async (): Promise<void> => {
    try {
        // Inicializar la base de datos
        await initializeDatabase();

        // Insertar datos en cada colección
        for (const collection of ESSENTIAL_COLLECTIONS) {
            await seedCollection(collection);
        }

        console.log('Datos de prueba insertados correctamente');
    } catch (error) {
        console.error('Error al insertar datos de prueba:', error);
    } finally {
        // Cerrar conexión
        await mongoose.disconnect();
    }
};

// Ejecutar el script si se llama directamente
if (require.main === module) {
    seedAllCollections()
        .then(() => {
            console.log('Script de inicialización completado');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Error en script de inicialización:', error);
            process.exit(1);
        });
}

export { seedAllCollections };
