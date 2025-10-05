import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de seguridad
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por ventana de tiempo
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.'
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({
    message: '9001App v6 Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Importar modelos principales (para registrarlos)
import './models/Department';
import './models/Personnel';
import './models/Position';
import './models/PROCESO';
import './models/ProcessDefinition';
import './models/ProcessRecord';
import './models/ProcessDocument';
import './models/Audit';
import './models/hallazgos';
import './models/acciones';
import './models/EmployeeDeclaration';
// import './models/CustomerSurvey'; // TEMPORALMENTE DESACTIVADO - tiene errores
// Modelos CRM
import './models/crm_clientes_agro';
import './models/crm_contactos';
import './models/crm_oportunidades_agro';
import './models/crm_actividades_agro';
import './models/crm_productos_agro';

// Importar rutas
import processRoutes from './routes/processRoutes';
import processDocumentRoutes from './routes/processDocumentRoutes';
import processDefinitionRoutes from './routes/processDefinitionRoutes';
import processRecordRoutes from './routes/processRecordRoutes';
import processUnifiedRoutes from './routes/processUnifiedRoutes';
import normPointRoutes from './routes/normPointRoutes';
import qualityObjectiveRoutes from './routes/qualityObjectiveRoutes';
import qualityIndicatorRoutes from './routes/qualityIndicatorRoutes';
import measurementRoutes from './routes/measurementRoutes';
import departmentRoutes from './routes/departmentRoutes';
import personnelRoutes from './routes/personnelRoutes';
import positionRoutes from './routes/positionRoutes';
import auditRoutes from './routes/auditRoutes';
import findingRoutes from './routes/findingRoutes';
import actionRoutes from './routes/actionRoutes';
import employeeDeclarationRoutes from './routes/employeeDeclarationRoutes';
// import customerSurveyRoutes from './routes/customerSurveyRoutes'; // TEMPORALMENTE DESACTIVADO
// Rutas CRM
import crmClienteRoutes from './routes/crmClienteRoutes';
import crmContactoRoutes from './routes/crmContactoRoutes';
import crmOportunidadRoutes from './routes/crmOportunidadRoutes';
import crmActividadRoutes from './routes/crmActividadRoutes';
import crmProductoRoutes from './routes/crmProductoRoutes';

// Rutas de API
app.use('/api/processes', processRoutes);
app.use('/api/process-definitions', processDefinitionRoutes);
app.use('/api/process-records', processRecordRoutes);
app.use('/api/documents', processDocumentRoutes);
app.use('/api/procesos-unificados', processUnifiedRoutes);
app.use('/api/norm-points', normPointRoutes);
app.use('/api/quality-objectives', qualityObjectiveRoutes);
app.use('/api/quality-indicators', qualityIndicatorRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/personnel', personnelRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/findings', findingRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/employee-declarations', employeeDeclarationRoutes);
// app.use('/api/customer-surveys', customerSurveyRoutes); // TEMPORALMENTE DESACTIVADO
// Rutas CRM
app.use('/api/crm/clientes', crmClienteRoutes);
app.use('/api/crm/contactos', crmContactoRoutes);
app.use('/api/crm/oportunidades', crmOportunidadRoutes);
app.use('/api/crm/actividades', crmActividadRoutes);
app.use('/api/crm/productos', crmProductoRoutes);

// Rutas de mantenimiento (solo para desarrollo/admin)
app.post('/api/admin/seed-all', async (req, res) => {
  try {
    console.log('🌱 Ejecutando seeder maestro...');

    const { masterSeeder } = await import('./seeders/masterSeeder');
    const result = await masterSeeder.seedAll();

    res.json({
      success: true,
      message: 'Seeder maestro ejecutado exitosamente',
      data: result
    });
  } catch (error) {
    console.error('❌ Error ejecutando seeder maestro:', error);
    res.status(500).json({
      error: 'Error ejecutando seeder maestro',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

app.post('/api/admin/seed-processes', async (req, res) => {
  try {
    console.log('🌱 Ejecutando seeder de procesos...');

    const { processDefinitionSeeder } = await import('./seeders/processDefinitionSeeder');
    const result = await processDefinitionSeeder.seed();

    res.json({
      success: true,
      message: 'Seeder de procesos ejecutado exitosamente',
      data: result
    });
  } catch (error) {
    console.error('❌ Error ejecutando seeder:', error);
    res.status(500).json({
      error: 'Error ejecutando seeder',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

app.delete('/api/admin/clear-all', async (req, res) => {
  try {
    console.log('🗑️ Limpiando todos los datos...');

    const { masterSeeder } = await import('./seeders/masterSeeder');
    const result = await masterSeeder.clearAll();

    res.json({
      success: true,
      message: 'Todos los datos han sido limpiados',
      data: result
    });
  } catch (error) {
    console.error('❌ Error limpiando datos:', error);
    res.status(500).json({
      error: 'Error limpiando datos',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

app.post('/api/admin/cleanup-collections', async (req, res) => {
  try {
    console.log('🗑️ Ejecutando limpieza de colecciones...');

    // Ejecutar script de limpieza usando child_process para evitar problemas de tipos
    const { exec } = require('child_process');
    const path = require('path');

    exec(`node ${path.join(__dirname, 'scripts', 'cleanupCollections.js')}`, (error: any, stdout: string, stderr: string) => {
      if (error) {
        console.error('❌ Error ejecutando limpieza:', error);
        res.status(500).json({
          error: 'Error ejecutando limpieza',
          message: error.message
        });
        return;
      }

      console.log('✅ Limpieza ejecutada exitosamente');
      res.json({
        success: true,
        message: 'Limpieza ejecutada exitosamente',
        output: stdout
      });
    });

  } catch (error) {
    console.error('❌ Error ejecutando limpieza:', error);
    res.status(500).json({
      error: 'Error ejecutando limpieza',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});



// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Manejo global de errores
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Función para iniciar el servidor
async function startServer() {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Manejo graceful de cierre
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT recibido, cerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
startServer();

export default app;