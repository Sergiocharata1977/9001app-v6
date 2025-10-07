"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const database_1 = require("./config/database");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.'
});
app.use(limiter);
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
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
require("./models/Department");
require("./models/Personnel");
require("./models/Position");
require("./models/PROCESO");
require("./models/ProcessDefinition");
require("./models/ProcessRecord");
require("./models/ProcessDocument");
require("./models/NormProcessDocRelation");
require("./models/User");
require("./models/Audit");
require("./models/hallazgos");
require("./models/acciones");
require("./models/EmployeeDeclaration");
require("./models/DocumentCategory");
require("./models/DocumentVersion");
require("./models/DocumentTemplate");
require("./models/crm_clientes_agro");
require("./models/crm_contactos");
require("./models/crm_oportunidades_agro");
require("./models/crm_actividades_agro");
require("./models/crm_productos_agro");
const processRoutes_1 = __importDefault(require("./routes/processRoutes"));
const processDocumentRoutes_1 = __importDefault(require("./routes/processDocumentRoutes"));
const processDefinitionRoutes_1 = __importDefault(require("./routes/processDefinitionRoutes"));
const processRecordRoutes_1 = __importDefault(require("./routes/processRecordRoutes"));
const processUnifiedRoutes_1 = __importDefault(require("./routes/processUnifiedRoutes"));
const normPointRoutes_1 = __importDefault(require("./routes/normPointRoutes"));
const normProcessDocRelationRoutes_1 = __importDefault(require("./routes/normProcessDocRelationRoutes"));
const qualityObjectiveRoutes_1 = __importDefault(require("./routes/qualityObjectiveRoutes"));
const qualityIndicatorRoutes_1 = __importDefault(require("./routes/qualityIndicatorRoutes"));
const measurementRoutes_1 = __importDefault(require("./routes/measurementRoutes"));
const departmentRoutes_1 = __importDefault(require("./routes/departmentRoutes"));
const personnelRoutes_1 = __importDefault(require("./routes/personnelRoutes"));
const positionRoutes_1 = __importDefault(require("./routes/positionRoutes"));
const auditRoutes_1 = __importDefault(require("./routes/auditRoutes"));
const findingRoutes_1 = __importDefault(require("./routes/findingRoutes"));
const actionRoutes_1 = __importDefault(require("./routes/actionRoutes"));
const employeeDeclarationRoutes_1 = __importDefault(require("./routes/employeeDeclarationRoutes"));
const documentCategoryRoutes_1 = __importDefault(require("./routes/documentCategoryRoutes"));
const documentVersionRoutes_1 = __importDefault(require("./routes/documentVersionRoutes"));
const documentTemplateRoutes_1 = __importDefault(require("./routes/documentTemplateRoutes"));
const crmClienteRoutes_1 = __importDefault(require("./routes/crmClienteRoutes"));
const crmContactoRoutes_1 = __importDefault(require("./routes/crmContactoRoutes"));
const crmOportunidadRoutes_1 = __importDefault(require("./routes/crmOportunidadRoutes"));
const crmActividadRoutes_1 = __importDefault(require("./routes/crmActividadRoutes"));
const crmProductoRoutes_1 = __importDefault(require("./routes/crmProductoRoutes"));
app.use('/api/processes', processRoutes_1.default);
app.use('/api/process-definitions', processDefinitionRoutes_1.default);
app.use('/api/process-records', processRecordRoutes_1.default);
app.use('/api/documents', processDocumentRoutes_1.default);
app.use('/api/procesos-unificados', processUnifiedRoutes_1.default);
app.use('/api/norm-points', normPointRoutes_1.default);
app.use('/api/norm-relations', normProcessDocRelationRoutes_1.default);
app.use('/api/quality-objectives', qualityObjectiveRoutes_1.default);
app.use('/api/quality-indicators', qualityIndicatorRoutes_1.default);
app.use('/api/measurements', measurementRoutes_1.default);
app.use('/api/departments', departmentRoutes_1.default);
app.use('/api/personnel', personnelRoutes_1.default);
app.use('/api/positions', positionRoutes_1.default);
app.use('/api/audits', auditRoutes_1.default);
app.use('/api/findings', findingRoutes_1.default);
app.use('/api/actions', actionRoutes_1.default);
app.use('/api/employee-declarations', employeeDeclarationRoutes_1.default);
app.use('/api/document-categories', documentCategoryRoutes_1.default);
app.use('/api/document-versions', documentVersionRoutes_1.default);
app.use('/api/document-templates', documentTemplateRoutes_1.default);
app.use('/api/crm/clientes', crmClienteRoutes_1.default);
app.use('/api/crm/contactos', crmContactoRoutes_1.default);
app.use('/api/crm/oportunidades', crmOportunidadRoutes_1.default);
app.use('/api/crm/actividades', crmActividadRoutes_1.default);
app.use('/api/crm/productos', crmProductoRoutes_1.default);
app.post('/api/admin/seed-all', async (req, res) => {
    try {
        console.log('🌱 Ejecutando seeder maestro...');
        const { masterSeeder } = await Promise.resolve().then(() => __importStar(require('./seeders/masterSeeder')));
        const result = await masterSeeder.seedAll();
        res.json({
            success: true,
            message: 'Seeder maestro ejecutado exitosamente',
            data: result
        });
    }
    catch (error) {
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
        const { processDefinitionSeeder } = await Promise.resolve().then(() => __importStar(require('./seeders/processDefinitionSeeder')));
        const result = await processDefinitionSeeder.seed();
        res.json({
            success: true,
            message: 'Seeder de procesos ejecutado exitosamente',
            data: result
        });
    }
    catch (error) {
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
        const { masterSeeder } = await Promise.resolve().then(() => __importStar(require('./seeders/masterSeeder')));
        const result = await masterSeeder.clearAll();
        res.json({
            success: true,
            message: 'Todos los datos han sido limpiados',
            data: result
        });
    }
    catch (error) {
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
        const { exec } = require('child_process');
        const path = require('path');
        exec(`node ${path.join(__dirname, 'scripts', 'cleanupCollections.js')}`, (error, stdout, stderr) => {
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
    }
    catch (error) {
        console.error('❌ Error ejecutando limpieza:', error);
        res.status(500).json({
            error: 'Error ejecutando limpieza',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method
    });
});
app.use((err, _req, res, _next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Error interno del servidor'
            : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});
async function startServer() {
    try {
        await (0, database_1.connectDB)();
        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('❌ Error iniciando servidor:', error);
        process.exit(1);
    }
}
process.on('SIGTERM', () => {
    console.log('🔄 SIGTERM recibido, cerrando servidor...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('🔄 SIGINT recibido, cerrando servidor...');
    process.exit(0);
});
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map