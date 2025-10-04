import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para RefreshTokens basada en tabla REFRESH_TOKENS de Turso
export interface IRefreshTokens extends Document {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
}

// Schema de RefreshTokens
const RefreshTokensSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  user_id: {
    type: Number,
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  expires_at: {
    type: Date,
    required: true,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false, // Usamos created_at manual
  collection: 'refresh_tokens'
});

// Índices para performance y seguridad
RefreshTokensSchema.index({ user_id: 1, created_at: -1 });
RefreshTokensSchema.index({ token: 1 }, { unique: true });
RefreshTokensSchema.index({ expires_at: 1 }); // Para limpieza automática de tokens expirados
RefreshTokensSchema.index({ user_id: 1, expires_at: 1 });

// Middleware para validar que user_id existe
RefreshTokensSchema.pre('save', function(next) {
  if (!this.user_id) {
    return next(new Error('user_id es requerido para RefreshTokens'));
  }
  
  if (!this.token) {
    return next(new Error('token es requerido para RefreshTokens'));
  }
  
  if (!this.expires_at) {
    return next(new Error('expires_at es requerido para RefreshTokens'));
  }
  
  next();
});

// Método estático para limpiar tokens expirados
RefreshTokensSchema.statics.limpiarTokensExpirados = function() {
  return this.deleteMany({ 
    expires_at: { $lt: new Date() } 
  });
};

// Método estático para obtener token válido por usuario
RefreshTokensSchema.statics.obtenerTokenValido = function(userId: number, token: string) {
  return this.findOne({ 
    user_id: userId,
    token: token,
    expires_at: { $gt: new Date() }
  });
};

// Método estático para revocar todos los tokens de un usuario
RefreshTokensSchema.statics.revocarTokensUsuario = function(userId: number) {
  return this.deleteMany({ user_id: userId });
};

// Método estático para revocar token específico
RefreshTokensSchema.statics.revocarToken = function(token: string) {
  return this.deleteOne({ token: token });
};

// Método para verificar si el token está expirado
RefreshTokensSchema.methods.estaExpirado = function(): boolean {
  return this.expires_at < new Date();
};

// Método para obtener tiempo restante en segundos
RefreshTokensSchema.methods.tiempoRestante = function(): number {
  const ahora = new Date().getTime();
  const expiracion = this.expires_at.getTime();
  return Math.max(0, Math.floor((expiracion - ahora) / 1000));
};

export const RefreshTokens = mongoose.model<IRefreshTokens>('RefreshTokens', RefreshTokensSchema);