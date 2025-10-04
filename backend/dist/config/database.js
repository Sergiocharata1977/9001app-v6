"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || '';
if (!MONGODB_URI) {
    throw new Error('MONGODB_URI no está definida en las variables de entorno');
}
const connectDB = async () => {
    try {
        console.log('🔄 Conectando a MongoDB Atlas...');
        const conn = await mongoose_1.default.connect(MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
        });
        console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
        console.log(`📊 Base de datos: ${conn.connection.name}`);
        mongoose_1.default.connection.on('error', (err) => {
            console.error('❌ Error de conexión MongoDB:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB desconectado');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconectado');
        });
    }
    catch (error) {
        console.error('❌ Error conectando a MongoDB Atlas:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('🔌 Conexión a MongoDB cerrada');
    }
    catch (error) {
        console.error('❌ Error cerrando conexión MongoDB:', error);
    }
};
exports.disconnectDB = disconnectDB;
process.on('SIGINT', async () => {
    await (0, exports.disconnectDB)();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await (0, exports.disconnectDB)();
    process.exit(0);
});
//# sourceMappingURL=database.js.map