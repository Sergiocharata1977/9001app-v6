import mongoose, { Document, Schema } from 'mongoose';

export interface ICRMContactos extends Document {
  id: string;
  organization_id: string;
  nombre: string;
  apellidos?: string;
  cargo?: string;
  empresa?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  zona_geografica?: string;
  tipo_contacto?: string;
  fuente_contacto?: string;
  estado_contacto?: string;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  is_active?: number;
}

const crmContactosSchema = new Schema<ICRMContactos>({
  id: { type: String, required: true, unique: true },
  organization_id: { type: String, required: true },
  nombre: { type: String, required: true },
  apellidos: { type: String },
  cargo: { type: String },
  empresa: { type: String },
  telefono: { type: String },
  email: { type: String },
  direccion: { type: String },
  ciudad: { type: String },
  estado: { type: String },
  zona_geografica: { type: String },
  tipo_contacto: { type: String, default: 'prospecto' },
  fuente_contacto: { type: String, default: 'referido' },
  estado_contacto: { type: String, default: 'activo' },
  observaciones: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: String },
  updated_by: { type: String },
  is_active: { type: Number, default: 1 }
}, {
  timestamps: true,
  collection: 'crm_contactos'
});

export const CRM_Contactos = mongoose.model<ICRMContactos>('CRM_Contactos', crmContactosSchema);