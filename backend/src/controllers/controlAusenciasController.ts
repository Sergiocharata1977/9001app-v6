import { Request, Response } from 'express';
import ControlAusencias from '../models/ControlAusencias';

// Crear solicitud de ausencia
export const crearSolicitud = async (req: Request, res: Response) => {
    try {
        const {
            organization_id,
            empleado_id,
            empleado_nombre,
            tipo_ausencia,
            fecha_inicio,
            fecha_fin,
            dias_solicitados,
            motivo,
            documentacion
        } = req.body;

        const nuevaSolicitud = new ControlAusencias({
            organization_id,
            empleado_id,
            empleado_nombre,
            tipo_ausencia,
            fecha_inicio: new Date(fecha_inicio),
            fecha_fin: new Date(fecha_fin),
            dias_solicitados,
            motivo,
            documentacion,
            estado: 'pendiente'
        });

        await nuevaSolicitud.save();
        res.status(201).json(nuevaSolicitud);
    } catch (error) {
        console.error('Error al crear solicitud:', error);
        res.status(500).json({ error: 'Error al crear solicitud de ausencia' });
    }
};

// Obtener todas las solicitudes
export const obtenerSolicitudes = async (req: Request, res: Response) => {
    try {
        const { organization_id, empleado_id, estado, tipo_ausencia } = req.query;
        
        const filtros: any = { organization_id };
        if (empleado_id) filtros.empleado_id = empleado_id;
        if (estado) filtros.estado = estado;
        if (tipo_ausencia) filtros.tipo_ausencia = tipo_ausencia;

        const solicitudes = await ControlAusencias.find(filtros).sort({ created_at: -1 });
        res.json(solicitudes);
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({ error: 'Error al obtener solicitudes' });
    }
};

// Obtener solicitud por ID
export const obtenerSolicitudPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const solicitud = await ControlAusencias.findById(id);

        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        res.json(solicitud);
    } catch (error) {
        console.error('Error al obtener solicitud:', error);
        res.status(500).json({ error: 'Error al obtener solicitud' });
    }
};

// Aprobar o rechazar solicitud
export const procesarSolicitud = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { estado, aprobado_por, comentarios_aprobacion } = req.body;

        if (!['aprobada', 'rechazada'].includes(estado)) {
            return res.status(400).json({ error: 'Estado inválido. Debe ser "aprobada" o "rechazada"' });
        }

        const solicitud = await ControlAusencias.findByIdAndUpdate(
            id,
            {
                estado,
                aprobado_por,
                fecha_aprobacion: new Date(),
                comentarios_aprobacion,
                updated_at: new Date()
            },
            { new: true }
        );

        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        res.json(solicitud);
    } catch (error) {
        console.error('Error al procesar solicitud:', error);
        res.status(500).json({ error: 'Error al procesar solicitud' });
    }
};

// Cancelar solicitud
export const cancelarSolicitud = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const solicitud = await ControlAusencias.findById(id);

        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        if (solicitud.estado !== 'pendiente') {
            return res.status(400).json({ error: 'Solo se pueden cancelar solicitudes pendientes' });
        }

        solicitud.estado = 'cancelada';
        solicitud.updated_at = new Date();
        await solicitud.save();

        res.json(solicitud);
    } catch (error) {
        console.error('Error al cancelar solicitud:', error);
        res.status(500).json({ error: 'Error al cancelar solicitud' });
    }
};

// Obtener balance de ausencias por empleado
export const obtenerBalance = async (req: Request, res: Response) => {
    try {
        const { empleado_id, organization_id } = req.query;

        const year = new Date().getFullYear();
        const inicioAno = new Date(year, 0, 1);
        const finAno = new Date(year, 11, 31);

        const ausenciasAprobadas = await ControlAusencias.find({
            organization_id,
            empleado_id,
            estado: 'aprobada',
            fecha_inicio: { $gte: inicioAno, $lte: finAno }
        });

        const balance = {
            ano: year,
            vacaciones_disponibles: 14, // Días disponibles por año (configurable)
            vacaciones_tomadas: 0,
            permisos_tomados: 0,
            licencias_medicas: 0,
            ausencias_justificadas: 0,
            ausencias_injustificadas: 0
        };

        ausenciasAprobadas.forEach(ausencia => {
            switch (ausencia.tipo_ausencia) {
                case 'vacaciones':
                    balance.vacaciones_tomadas += ausencia.dias_solicitados;
                    break;
                case 'permiso':
                    balance.permisos_tomados += ausencia.dias_solicitados;
                    break;
                case 'licencia_medica':
                case 'licencia_maternidad':
                case 'licencia_paternidad':
                    balance.licencias_medicas += ausencia.dias_solicitados;
                    break;
                case 'ausencia_justificada':
                    balance.ausencias_justificadas += ausencia.dias_solicitados;
                    break;
                case 'ausencia_injustificada':
                    balance.ausencias_injustificadas += ausencia.dias_solicitados;
                    break;
            }
        });

        balance.vacaciones_disponibles = 14 - balance.vacaciones_tomadas;

        res.json(balance);
    } catch (error) {
        console.error('Error al obtener balance:', error);
        res.status(500).json({ error: 'Error al obtener balance de ausencias' });
    }
};

// Obtener calendario de ausencias
export const obtenerCalendario = async (req: Request, res: Response) => {
    try {
        const { organization_id, mes, ano } = req.query;

        const inicioMes = new Date(Number(ano), Number(mes) - 1, 1);
        const finMes = new Date(Number(ano), Number(mes), 0);

        const ausencias = await ControlAusencias.find({
            organization_id,
            estado: 'aprobada',
            $or: [
                { fecha_inicio: { $gte: inicioMes, $lte: finMes } },
                { fecha_fin: { $gte: inicioMes, $lte: finMes } },
                {
                    fecha_inicio: { $lte: inicioMes },
                    fecha_fin: { $gte: finMes }
                }
            ]
        }).sort({ fecha_inicio: 1 });

        res.json(ausencias);
    } catch (error) {
        console.error('Error al obtener calendario:', error);
        res.status(500).json({ error: 'Error al obtener calendario de ausencias' });
    }
};

// Obtener estadísticas
export const obtenerEstadisticas = async (req: Request, res: Response) => {
    try {
        const { organization_id } = req.query;

        const year = new Date().getFullYear();
        const inicioAno = new Date(year, 0, 1);

        const solicitudes = await ControlAusencias.find({
            organization_id,
            created_at: { $gte: inicioAno }
        });

        const estadisticas = {
            total_solicitudes: solicitudes.length,
            por_estado: {
                pendiente: solicitudes.filter(s => s.estado === 'pendiente').length,
                aprobada: solicitudes.filter(s => s.estado === 'aprobada').length,
                rechazada: solicitudes.filter(s => s.estado === 'rechazada').length,
                cancelada: solicitudes.filter(s => s.estado === 'cancelada').length
            },
            por_tipo: {
                vacaciones: solicitudes.filter(s => s.tipo_ausencia === 'vacaciones').length,
                permisos: solicitudes.filter(s => s.tipo_ausencia === 'permiso').length,
                licencias_medicas: solicitudes.filter(s => s.tipo_ausencia === 'licencia_medica').length
            },
            total_dias_ausencia: solicitudes
                .filter(s => s.estado === 'aprobada')
                .reduce((acc, s) => acc + s.dias_solicitados, 0)
        };

        res.json(estadisticas);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

// Eliminar solicitud
export const eliminarSolicitud = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const solicitud = await ControlAusencias.findByIdAndDelete(id);

        if (!solicitud) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        res.json({ mensaje: 'Solicitud eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar solicitud:', error);
        res.status(500).json({ error: 'Error al eliminar solicitud' });
    }
};

