import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { initializeDatabase } from './config/db-simple';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS simplificado para MVP
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    })
);

// Logging básico
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas básicas
app.get('/', (req, res) => {
    res.json({
        message: '9001App MVP Backend API',
        version: '1.0.0-mvp',
        status: 'running',
        timestamp: new Date().toISOString(),
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// Health check para base de datos
app.get('/api/health/database', async (req, res) => {
    try {
        const mongoose = require('mongoose');

        if (mongoose.connection.readyState === 1) {
            res.json({
                status: 'connected',
                database: 'MongoDB',
                timestamp: new Date().toISOString(),
            });
        } else {
            res.status(503).json({
                status: 'disconnected',
                database: 'MongoDB',
                timestamp: new Date().toISOString(),
            });
        }
    } catch (error) {
        res.status(503).json({
            status: 'error',
            database: 'MongoDB',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        });
    }
});

// Importar solo los modelos esenciales para MVP
// Estos modelos se crearán automáticamente al inicializar la base de datos

// Importar rutas esenciales para MVP
import crmClienteRoutes from './routes/crmClienteRoutes';
import crmOportunidadRoutes from './routes/crmOportunidadRoutes';
import departmentRoutes from './routes/departmentRoutes';
import documentVersionRoutes from './routes/documentVersionRoutes';
import normPointRoutes from './routes/normPointRoutes';
import personnelRoutes from './routes/personnelRoutes';
import processDocumentRoutes from './routes/processDocumentRoutes';

// Rutas de API para MVP
app.use('/api/departments', departmentRoutes);
app.use('/api/personnel', personnelRoutes);
app.use('/api/documents', processDocumentRoutes);
app.use('/api/norm-points', normPointRoutes);
app.use('/api/document-versions', documentVersionRoutes);
app.use('/api/crm/clientes', crmClienteRoutes);
app.use('/api/crm/oportunidades', crmOportunidadRoutes);

// Ruta para inicializar datos de prueba
app.post('/api/admin/seed-mvp', async (req, res) => {
    try {
        console.log('🌱 Ejecutando seeder MVP...');

        const { seedAllCollections } = await import('./scripts/seed-mvp-data');
        await seedAllCollections();

        res.json({
            success: true,
            message: 'Datos de prueba para MVP insertados correctamente',
        });
    } catch (error) {
        console.error('❌ Error ejecutando seeder MVP:', error);
        res.status(500).json({
            error: 'Error ejecutando seeder MVP',
            message: error instanceof Error ? error.message : 'Error desconocido',
        });
    }
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method,
    });
});

// Manejo global de errores simplificado
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor',
    });
});

// Función para iniciar el servidor
async function startServer() {
    try {
        // Inicializar la base de datos simplificada
        await initializeDatabase();

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor MVP ejecutándose en puerto ${PORT}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Error iniciando servidor MVP:', error);
        process.exit(1);
    }
}

// Iniciar servidor
startServer();

export default app;