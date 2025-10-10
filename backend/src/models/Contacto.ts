import mongoose, { Schema, Document } from 'mongoose';

export interface IContacto extends Document {
  id: string;
  organization_id: string;
  empresa_id: string;
  nombre: string;
  apellido?: string;
  cargo?: string;
  telefono?: string;
  email?: string;
  tipo: 'principal' | 'secundario' | 'tecnico' | 'financiero';
  fuente?: string;
  estado: 'activo' | 'inactivo';
  notas?: string;
  
  // Metadatos
  is_active: number;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by?: string;
}

const contactoSchema = new Schema<IContacto>({
  id: { type: String, required: true, unique: true },
  organization_id: { type: String, required: true, index: true },
  empresa_id: { type: String, required: true, index: true },
  nombre: { type: String, required: true },
  apellido: { type: String },
  cargo: { type: String },
  telefono: { type: String },
  email: { type: String, sparse: true },
  tipo: { 
    type: String, 
    enum: ['principal', 'secundario', 'tecnico', 'financiero'],
    default: 'principal',
    index: true
  },
  fuente: { type: String },
  estado: { 
    type: String, 
    enum: ['activo', 'inactivo'],
    default: 'activo',
    index: true
  },
  notas: { type: String },
  
  // Metadatos
  is_active: { type: Number, default: 1, index: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: String, required: true },
  updated_by: { type: String }
}, {
  timestamps: false,
  collection: 'contactos'
});

// Índices compuestos
contactoSchema.index({ organization_id: 1, empresa_id: 1 });
contactoSchema.index({ organization_id: 1, tipo: 1 });
contactoSchema.index({ organization_id: 1, is_active: 1 });

export const Contacto = mongoose.model<IContacto>('Contacto', contactoSchema);