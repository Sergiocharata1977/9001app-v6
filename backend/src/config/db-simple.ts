/**
 * Configuración simplificada de base de datos para MVP
 * 
 * Este archivo define las colecciones esenciales para el MVP y proporciona
 * funciones para conectarse a MongoDB Atlas de manera simplificada.
 */

import mongoose from 'mongoose';

// Colecciones esenciales para MVP
export const ESSENTIAL_COLLECTIONS = [
    'usuarios',           // Login básico
    'personal',           // RRHH
    'departamentos',      // RRHH  
    'empresas',           // CRM
    'oportunidades',      // CRM
    'documentos',         // Documentos
    'normas',             // ISO
    'auditorias',         // Auditorías básicas
    'indicadores',        // Métricas básicas
    'procesos'            // Procesos básicos
];

// Configuración de conexión simplificada
const DB_CONFIG = {
    // URL de conexión a MongoDB Atlas (usar variable de entorno en producción)
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/9001app-mvp',

    // Opciones de conexión
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
    }
};

/**
 * Conecta a la base de datos MongoDB
 * @returns Promesa que se resuelve cuando la conexión es exitosa
 */
export const connectToDatabase = async (): Promise<typeof mongoose> => {
    try {
        console.log('Conectando a MongoDB Atlas...');
        const connection = await mongoose.connect(DB_CONFIG.url, DB_CONFIG.options);
        console.log('Conexión a MongoDB Atlas establecida');
        return connection;
    } catch (error) {
        console.error('Error al conectar a MongoDB Atlas:', error);
        throw error;
    }
};

/**
 * Desconecta de la base de datos MongoDB
 */
export const disconnectFromDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('Desconexión de MongoDB Atlas completada');
    } catch (error) {
        console.error('Error al desconectar de MongoDB Atlas:', error);
        throw error;
    }
};

/**
 * Verifica si todas las colecciones esenciales existen
 * @returns Promesa que se resuelve con un objeto que indica qué colecciones existen
 */
export const checkEssentialCollections = async (): Promise<Record<string, boolean>> => {
    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('No hay conexión a la base de datos');
      }
      const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        const result: Record<string, boolean> = {};

        for (const collection of ESSENTIAL_COLLECTIONS) {
            result[collection] = collectionNames.includes(collection);
        }

        return result;
    } catch (error) {
        console.error('Error al verificar colecciones:', error);
        throw error;
    }
};

/**
 * Crea las colecciones esenciales si no existen
 */
export const createEssentialCollections = async (): Promise<void> => {
    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('No hay conexión a la base de datos');
      }
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      
      for (const collection of ESSENTIAL_COLLECTIONS) {
        if (!collectionNames.includes(collection)) {
          console.log(`Creando colección: ${collection}`);
          await db.createCollection(collection);
        }
      }

        console.log('Colecciones esenciales verificadas/creadas');
    } catch (error) {
        console.error('Error al crear colecciones esenciales:', error);
        throw error;
    }
};

/**
 * Inicializa la base de datos para el MVP
 * Conecta a MongoDB, verifica/crea colecciones esenciales
 */
export const initializeDatabase = async (): Promise<void> => {
    try {
        // Conectar a MongoDB
        await connectToDatabase();

        // Crear colecciones esenciales
        await createEssentialCollections();

        console.log('Base de datos inicializada correctamente para MVP');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        throw error;
    }
};