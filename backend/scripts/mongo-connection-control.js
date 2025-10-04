#!/usr/bin/env node

/**
 * Script de Control de Conexión MongoDB
 * Permite verificar, conectar, desconectar y diagnosticar la conexión a MongoDB
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI || '';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logHeader(message) {
  log(`\n${colors.bright}${colors.cyan}=== ${message} ===${colors.reset}`);
}

// Verificar configuración
function checkConfiguration() {
  logHeader('VERIFICACIÓN DE CONFIGURACIÓN');
  
  if (!MONGODB_URI) {
    logError('MONGODB_URI no está definida en las variables de entorno');
    logInfo('Asegúrate de tener un archivo .env con MONGODB_URI=mongodb://...');
    return false;
  }
  
  logSuccess('MONGODB_URI encontrada');
  
  // Ocultar credenciales en el log
  const maskedUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
  logInfo(`URI: ${maskedUri}`);
  
  return true;
}

// Verificar conexión
async function checkConnection() {
  logHeader('VERIFICACIÓN DE CONEXIÓN');
  
  try {
    const startTime = Date.now();
    
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    
    const endTime = Date.now();
    const connectionTime = endTime - startTime;
    
    logSuccess(`Conexión exitosa en ${connectionTime}ms`);
    logInfo(`Host: ${mongoose.connection.host}`);
    logInfo(`Base de datos: ${mongoose.connection.name}`);
    logInfo(`Puerto: ${mongoose.connection.port}`);
    
    return true;
  } catch (error) {
    logError(`Error de conexión: ${error.message}`);
    
    if (error.name === 'MongoServerSelectionError') {
      logWarning('Posibles causas:');
      log('  • El servidor MongoDB no está disponible');
      log('  • Problemas de red o firewall');
      log('  • Credenciales incorrectas');
      log('  • IP no autorizada en MongoDB Atlas');
    }
    
    return false;
  }
}

// Probar operaciones básicas
async function testBasicOperations() {
  logHeader('PRUEBAS DE OPERACIONES BÁSICAS');
  
  try {
    // Crear una colección de prueba
    const testCollection = mongoose.connection.db.collection('connection_test');
    
    // Insertar un documento de prueba
    logInfo('Insertando documento de prueba...');
    const insertResult = await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
      message: 'Prueba de conexión exitosa'
    });
    
    logSuccess(`Documento insertado con ID: ${insertResult.insertedId}`);
    
    // Leer el documento
    logInfo('Leyendo documento de prueba...');
    const document = await testCollection.findOne({ _id: insertResult.insertedId });
    
    if (document) {
      logSuccess('Documento leído correctamente');
      logInfo(`Contenido: ${JSON.stringify(document, null, 2)}`);
    }
    
    // Eliminar el documento de prueba
    logInfo('Eliminando documento de prueba...');
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    logSuccess('Documento de prueba eliminado');
    
    return true;
  } catch (error) {
    logError(`Error en operaciones básicas: ${error.message}`);
    return false;
  }
}

// Verificar estado de la conexión
function checkConnectionStatus() {
  logHeader('ESTADO DE LA CONEXIÓN');
  
  const states = {
    0: 'DESCONECTADO',
    1: 'CONECTADO',
    2: 'CONECTANDO',
    3: 'DESCONECTANDO'
  };
  
  const state = mongoose.connection.readyState;
  const stateName = states[state] || 'DESCONOCIDO';
  
  logInfo(`Estado: ${stateName} (${state})`);
  logInfo(`Host: ${mongoose.connection.host || 'N/A'}`);
  logInfo(`Base de datos: ${mongoose.connection.name || 'N/A'}`);
  logInfo(`Puerto: ${mongoose.connection.port || 'N/A'}`);
  
  return state === 1; // 1 = CONECTADO
}

// Desconectar
async function disconnect() {
  logHeader('DESCONEXIÓN');
  
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      logSuccess('Conexión cerrada correctamente');
    } else {
      logWarning('No hay conexión activa para cerrar');
    }
  } catch (error) {
    logError(`Error cerrando conexión: ${error.message}`);
  }
}

// Diagnóstico completo
async function fullDiagnostic() {
  logHeader('DIAGNÓSTICO COMPLETO DE MONGODB');
  
  const results = {
    configuration: false,
    connection: false,
    operations: false
  };
  
  // 1. Verificar configuración
  results.configuration = checkConfiguration();
  if (!results.configuration) {
    logError('Diagnóstico abortado: configuración incorrecta');
    return results;
  }
  
  // 2. Verificar conexión
  results.connection = await checkConnection();
  if (!results.connection) {
    logError('Diagnóstico abortado: no se puede conectar');
    return results;
  }
  
  // 3. Verificar operaciones
  results.operations = await testBasicOperations();
  
  // Resumen
  logHeader('RESUMEN DEL DIAGNÓSTICO');
  log(`${results.configuration ? '✅' : '❌'} Configuración`);
  log(`${results.connection ? '✅' : '❌'} Conexión`);
  log(`${results.operations ? '✅' : '❌'} Operaciones básicas`);
  
  if (results.configuration && results.connection && results.operations) {
    logSuccess('🎉 MongoDB está funcionando correctamente!');
  } else {
    logError('❌ MongoDB tiene problemas que requieren atención');
  }
  
  return results;
}

// Función principal
async function main() {
  const command = process.argv[2];
  
  log(`${colors.bright}${colors.magenta}MongoDB Connection Control${colors.reset}\n`);
  
  switch (command) {
    case 'check':
    case 'status':
      checkConnectionStatus();
      break;
      
    case 'connect':
      if (checkConfiguration()) {
        await checkConnection();
      }
      break;
      
    case 'test':
      if (checkConfiguration()) {
        await checkConnection();
        await testBasicOperations();
      }
      break;
      
    case 'disconnect':
      await disconnect();
      break;
      
    case 'diagnostic':
    case 'full':
      await fullDiagnostic();
      break;
      
    default:
      log('Uso: node mongo-connection-control.js [comando]');
      log('');
      log('Comandos disponibles:');
      log('  check, status    - Verificar estado de la conexión');
      log('  connect          - Conectar a MongoDB');
      log('  test             - Probar operaciones básicas');
      log('  disconnect       - Desconectar de MongoDB');
      log('  diagnostic, full - Diagnóstico completo');
      log('');
      log('Ejemplos:');
      log('  node mongo-connection-control.js check');
      log('  node mongo-connection-control.js diagnostic');
      break;
  }
  
  // Cerrar conexión si se abrió
  if (mongoose.connection.readyState === 1) {
    await disconnect();
  }
  
  process.exit(0);
}

// Manejar errores no capturados
process.on('unhandledRejection', (error) => {
  logError(`Error no manejado: ${error.message}`);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logError(`Excepción no capturada: ${error.message}`);
  process.exit(1);
});

// Ejecutar script
main().catch((error) => {
  logError(`Error ejecutando script: ${error.message}`);
  process.exit(1);
});
