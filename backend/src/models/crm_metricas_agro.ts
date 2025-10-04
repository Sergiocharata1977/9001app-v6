import mongoose from 'mongoose';

const crm_metricas_agroSchema = new mongoose.Schema({
  id: { type: String, required: true },
  organization_id: { type: String },
  vendedor_id: { type: String },
  periodo: { type: String },
  clientes_asignados: { type: Number },
  clientes_activos: { type: Number },
  clientes_nuevos: { type: Number },
  prospectos_calificados: { type: Number },
  oportunidades_activas: { type: Number },
  oportunidades_ganadas: { type: Number },
  oportunidades_perdidas: { type: Number },
  valor_ventas_semillas: { type: Number },
  valor_ventas_fertilizantes: { type: Number },
  valor_ventas_maquinaria: { type: Number },
  valor_ventas_servicios: { type: Number },
  total_ventas: { type: Number },
  superficie_atendida: { type: Number },
  cultivos_atendidos: { type: Number },
  visitas_tecnicas: { type: Number },
  capacitaciones_realizadas: { type: Number },
  tasa_conversion: { type: Number },
  ticket_promedio: { type: Number },
  tiempo_promedio_cierre: { type: Number },
  created_at: { type: String },
  updated_at: { type: String }
}, {
  timestamps: true,
  collection: 'crm_metricas_agro'
});

export const Crm_metricas_agro = mongoose.model('Crm_metricas_agro', crm_metricas_agroSchema);
