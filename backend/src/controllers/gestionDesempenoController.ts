import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import GestionDesempeno from '../models/GestionDesempeno';

// Crear nueva evaluación de desempeño
export const crearEvaluacion = async (req: Request, res: Response) => {
    try {
        const {
            organization_id,
            empleado_id,
            empleado_nombre,
            evaluador_id,
            evaluador_nombre,
            periodo,
            fecha_inicio,
            fecha_fin,
            objetivos,
            competencias
        } = req.body;

        const nuevaEvaluacion = new GestionDesempeno({
            organization_id,
            empleado_id,
            empleado_nombre,
            evaluador_id,
            evaluador_nombre,
            periodo,
            fecha_inicio: new Date(fecha_inicio),
            fecha_fin: new Date(fecha_fin),
            objetivos: objetivos.map((obj: any) => ({ ...obj, id: obj.id || uuidv4() })),
            competencias,
            estado: 'pendiente',
            puntuacion_total: 0
        });

        await nuevaEvaluacion.save();
        res.status(201).json(nuevaEvaluacion);
    } catch (error) {
        console.error('Error al crear evaluación:', error);
        res.status(500).json({ error: 'Error al crear evaluación de desempeño' });
    }
};

// Obtener todas las evaluaciones
export const obtenerEvaluaciones = async (req: Request, res: Response) => {
    try {
        const { organization_id, empleado_id, estado } = req.query;
        
        const filtros: any = { organization_id };
        if (empleado_id) filtros.empleado_id = empleado_id;
        if (estado) filtros.estado = estado;

        const evaluaciones = await GestionDesempeno.find(filtros).sort({ created_at: -1 });
        res.json(evaluaciones);
    } catch (error) {
        console.error('Error al obtener evaluaciones:', error);
        res.status(500).json({ error: 'Error al obtener evaluaciones' });
    }
};

// Obtener evaluación por ID
export const obtenerEvaluacionPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const evaluacion = await GestionDesempeno.findById(id);

        if (!evaluacion) {
            return res.status(404).json({ error: 'Evaluación no encontrada' });
        }

        res.json(evaluacion);
    } catch (error) {
        console.error('Error al obtener evaluación:', error);
        res.status(500).json({ error: 'Error al obtener evaluación' });
    }
};

// Actualizar evaluación
export const actualizarEvaluacion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const actualizacion = { ...req.body, updated_at: new Date() };

        // Calcular puntuación total si se actualizan objetivos
        if (actualizacion.objetivos) {
            const objetivosConPuntuacion = actualizacion.objetivos.filter((obj: any) => obj.puntuacion);
            if (objetivosConPuntuacion.length > 0) {
                const sumaPonderada = objetivosConPuntuacion.reduce((acc: number, obj: any) => {
                    return acc + (obj.puntuacion * obj.peso / 100);
                }, 0);
                actualizacion.puntuacion_total = sumaPonderada;
            }
        }

        const evaluacion = await GestionDesempeno.findByIdAndUpdate(
            id,
            actualizacion,
            { new: true }
        );

        if (!evaluacion) {
            return res.status(404).json({ error: 'Evaluación no encontrada' });
        }

        res.json(evaluacion);
    } catch (error) {
        console.error('Error al actualizar evaluación:', error);
        res.status(500).json({ error: 'Error al actualizar evaluación' });
    }
};

// Actualizar estado de evaluación
export const actualizarEstado = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const evaluacion = await GestionDesempeno.findByIdAndUpdate(
            id,
            { estado, updated_at: new Date() },
            { new: true }
        );

        if (!evaluacion) {
            return res.status(404).json({ error: 'Evaluación no encontrada' });
        }

        res.json(evaluacion);
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
};

// Actualizar objetivo específico
export const actualizarObjetivo = async (req: Request, res: Response) => {
    try {
        const { id, objetivoId } = req.params;
        const { resultado, puntuacion, comentarios } = req.body;

        const evaluacion = await GestionDesempeno.findById(id);

        if (!evaluacion) {
            return res.status(404).json({ error: 'Evaluación no encontrada' });
        }

        const objetivo = evaluacion.objetivos.find(obj => obj.id === objetivoId);

        if (!objetivo) {
            return res.status(404).json({ error: 'Objetivo no encontrado' });
        }

        objetivo.resultado = resultado;
        objetivo.puntuacion = puntuacion;
        objetivo.comentarios = comentarios;

        // Recalcular puntuación total
        const objetivosConPuntuacion = evaluacion.objetivos.filter(obj => obj.puntuacion);
        if (objetivosConPuntuacion.length > 0) {
            const sumaPonderada = objetivosConPuntuacion.reduce((acc, obj) => {
                return acc + (obj.puntuacion! * obj.peso / 100);
            }, 0);
            evaluacion.puntuacion_total = sumaPonderada;
        }

        evaluacion.updated_at = new Date();
        await evaluacion.save();

        res.json(evaluacion);
    } catch (error) {
        console.error('Error al actualizar objetivo:', error);
        res.status(500).json({ error: 'Error al actualizar objetivo' });
    }
};

// Obtener estadísticas de desempeño
export const obtenerEstadisticas = async (req: Request, res: Response) => {
    try {
        const { organization_id } = req.query;

        const evaluaciones = await GestionDesempeno.find({ organization_id });

        const estadisticas = {
            total_evaluaciones: evaluaciones.length,
            por_estado: {
                pendiente: evaluaciones.filter(e => e.estado === 'pendiente').length,
                en_progreso: evaluaciones.filter(e => e.estado === 'en_progreso').length,
                completada: evaluaciones.filter(e => e.estado === 'completada').length,
                aprobada: evaluaciones.filter(e => e.estado === 'aprobada').length
            },
            promedio_puntuacion: evaluaciones.length > 0 
                ? evaluaciones.reduce((acc, e) => acc + e.puntuacion_total, 0) / evaluaciones.length 
                : 0
        };

        res.json(estadisticas);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

// Eliminar evaluación
export const eliminarEvaluacion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const evaluacion = await GestionDesempeno.findByIdAndDelete(id);

        if (!evaluacion) {
            return res.status(404).json({ error: 'Evaluación no encontrada' });
        }

        res.json({ mensaje: 'Evaluación eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar evaluación:', error);
        res.status(500).json({ error: 'Error al eliminar evaluación' });
    }
};

