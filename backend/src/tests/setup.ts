import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

// Setup antes de todos los tests
beforeAll(async () => {
  // Crear instancia de MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Conectar mongoose a la base de datos en memoria
  await mongoose.connect(mongoUri);
});

// Cleanup después de cada test
afterEach(async () => {
  // Limpiar todas las colecciones después de cada test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup después de todos los tests
afterAll(async () => {
  // Cerrar conexión de mongoose
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  
  // Detener servidor MongoDB en memoria
  await mongoServer.stop();
});

// Configuración global para tests
jest.setTimeout(30000);

// Mock de console.log para tests más limpios
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};