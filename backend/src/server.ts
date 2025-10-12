import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/database';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de seguridad
app.use(helmet());

// Rate limiting - Configuración más permisiva para desarrollo
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // límite aumentado a 1000 requests por ventana de tiempo
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS optimizado
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200, // Para soporte de navegadores legacy
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Logging optimizado para desarrollo
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing optimizado
app.use(express.json({
  limit: '10mb',
  type: ['application/json', 'text/plain']
}));
app.use(express.urlencoded({
  extended: true,
  limit: '10mb',
  parameterLimit: 50000
}));

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

// Health check para base de datos
app.get('/api/health/database', async (req, res) => {
  try {
    // Importar mongoose para verificar conexión
    const mongoose = require('mongoose');

    if (mongoose.connection.readyState === 1) {
      res.json({
        status: 'connected',
        database: 'MongoDB',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'disconnected',
        database: 'MongoDB',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'MongoDB',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Importar modelos principales (para registrarlos)
import './models/Audit';
import './models/Department';
import './models/DocumentCategory';
import './models/DocumentTemplate';
import './models/DocumentVersion';
import './models/EmployeeDeclaration';
import './models/NormProcessDocRelation';
import './models/PROCESO';
import './models/Personnel';
import './models/Position';
import './models/ProcessDefinition';
import './models/ProcessDocument';
import './models/ProcessRecord';
import './models/User';
import './models/acciones';
import './models/hallazgos';
// import './models/CustomerSurvey'; // TEMPORALMENTE DESACTIVADO - tiene errores
// Modelos CRM
import './models/AnalisisCredito';
import './models/crm_actividades_agro';
import './models/crm_clientes_agro';
import './models/crm_contactos';
import './models/crm_oportunidades_agro';
import './models/crm_productos_agro';
// Modelos Roadmap
import './models/RoadmapTask';

// Importar rutas
import actionRoutes from './routes/actionRoutes';
import auditRoutes from './routes/auditRoutes';
import departmentRoutes from './routes/departmentRoutes';
import documentCategoryRoutes from './routes/documentCategoryRoutes';
import documentTemplateRoutes from './routes/documentTemplateRoutes';
import documentVersionRoutes from './routes/documentVersionRoutes';
import employeeDeclarationRoutes from './routes/employeeDeclarationRoutes';
import findingRoutes from './routes/findingRoutes';
import measurementRoutes from './routes/measurementRoutes';
import normPointRoutes from './routes/normPointRoutes';
import normProcessDocRelationRoutes from './routes/normProcessDocRelationRoutes';
import personnelRoutes from './routes/personnelRoutes';
import positionRoutes from './routes/positionRoutes';
import processDefinitionRoutes from './routes/processDefinitionRoutes';
import processDocumentRoutes from './routes/processDocumentRoutes';
import processRecordRoutes from './routes/processRecordRoutes';
import processRoutes from './routes/processRoutes';
import processUnifiedRoutes from './routes/processUnifiedRoutes';
import qualityIndicatorRoutes from './routes/qualityIndicatorRoutes';
import qualityObjectiveRoutes from './routes/qualityObjectiveRoutes';
import roadmapRoutes from './routes/roadmapRoutes';
// import customerSurveyRoutes from './routes/customerSurveyRoutes';
import crmRequisitosRoutes from './routes/crmRequisitosRoutes';
import customerSatisfactionISORoutes from './routes/customerSatisfactionISORoutes'; // TEMPORALMENTE DESACTIVADO
// Rutas CRM
import analisisCreditoRoutes from './routes/analisisCredito';
import crmActividadRoutes from './routes/crmActividadRoutes';
import crmClienteRoutes from './routes/crmClienteRoutes';
import crmContactoRoutes from './routes/crmContactoRoutes';
import crmOportunidadRoutes from './routes/crmOportunidadRoutes';
import crmProductoRoutes from './routes/crmProductoRoutes';
import legajoRoutes from './routes/legajo';

// Rutas RRHH
import climaLaboralRoutes from './routes/climaLaboralRoutes';
import controlAusenciasRoutes from './routes/controlAusenciasRoutes';
import gestionDesempenoRoutes from './routes/gestionDesempenoRoutes';
import indicadoresRRHHRoutes from './routes/indicadoresRRHHRoutes';
import reclutamientoRoutes from './routes/reclutamientoRoutes';

// Rutas de API
app.use('/api/processes', processRoutes);
app.use('/api/process-definitions', processDefinitionRoutes);
app.use('/api/process-records', processRecordRoutes);
app.use('/api/documents', processDocumentRoutes);
app.use('/api/procesos-unificados', processUnifiedRoutes);
app.use('/api/norm-points', normPointRoutes);
app.use('/api/norm-relations', normProcessDocRelationRoutes);
app.use('/api/quality-objectives', qualityObjectiveRoutes);
app.use('/api/quality-indicators', qualityIndicatorRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/personnel', personnelRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/findings', findingRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/employee-declarations', employeeDeclarationRoutes);
app.use('/api/document-categories', documentCategoryRoutes);
app.use('/api/document-versions', documentVersionRoutes);
app.use('/api/document-templates', documentTemplateRoutes);
// // app.use('/api/customer-surveys', customerSurveyRoutes); // TEMPORALMENTE DESACTIVADO
app.use('/api/customer-satisfaction', customerSatisfactionISORoutes); // TEMPORALMENTE DESACTIVADO
app.use('/api/crm', crmRequisitosRoutes);
// Rutas CRM
app.use('/api/crm/clientes', crmClienteRoutes);
app.use('/api/crm/contactos', crmContactoRoutes);
app.use('/api/crm/oportunidades', crmOportunidadRoutes);
app.use('/api/crm/actividades', crmActividadRoutes);
app.use('/api/crm/productos', crmProductoRoutes);
app.use('/api/crm/analisis-credito', analisisCreditoRoutes);
app.use('/api/legajos', legajoRoutes);

// Rutas RRHH
app.use('/api/rrhh/clima-laboral', climaLaboralRoutes);
app.use('/api/rrhh/desempeno', gestionDesempenoRoutes);
app.use('/api/rrhh/ausencias', controlAusenciasRoutes);
app.use('/api/rrhh/reclutamiento', reclutamientoRoutes);
app.use('/api/rrhh/indicadores', indicadoresRRHHRoutes);

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