import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import ReclutamientoSeleccion from '../models/ReclutamientoSeleccion';

// ==================== VACANTES ====================

// Crear vacante
export const crearVacante = async (req: Request, res: Response) => {
    try {
        const {
            organization_id,
            titulo_puesto,
            departamento,
            descripcion,
            requisitos,
            salario_min,
            salario_max,
            tipo_contrato,
            modalidad,
            fecha_publicacion,
            fecha_cierre,
            responsable_rrhh
        } = req.body;

        const nuevaVacante = new ReclutamientoSeleccion({
            organization_id,
            titulo_puesto,
            departamento,
            descripcion,
            requisitos,
            salario_min,
            salario_max,
            tipo_contrato,
            modalidad,
            fecha_publicacion: new Date(fecha_publicacion),
            fecha_cierre: new Date(fecha_cierre),
            responsable_rrhh,
            estado: 'borrador',
            candidatos: []
        });

        await nuevaVacante.save();
        res.status(201).json(nuevaVacante);
    } catch (error) {
        console.error('Error al crear vacante:', error);
        res.status(500).json({ error: 'Error al crear vacante' });
    }
};

// Obtener todas las vacantes
export const obtenerVacantes = async (req: Request, res: Response) => {
    try {
        const { organization_id, estado, tipo_contrato } = req.query;
        
        const filtros: any = { organization_id };
        if (estado) filtros.estado = estado;
        if (tipo_contrato) filtros.tipo_contrato = tipo_contrato;

        const vacantes = await ReclutamientoSeleccion.find(filtros).sort({ created_at: -1 });
        res.json(vacantes);
    } catch (error) {
        console.error('Error al obtener vacantes:', error);
        res.status(500).json({ error: 'Error al obtener vacantes' });
    }
};

// Obtener vacante por ID
export const obtenerVacantePorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const vacante = await ReclutamientoSeleccion.findById(id);

        if (!vacante) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        res.json(vacante);
    } catch (error) {
        console.error('Error al obtener vacante:', error);
        res.status(500).json({ error: 'Error al obtener vacante' });
    }
};

// Actualizar vacante
export const actualizarVacante = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const actualizacion = { ...req.body, updated_at: new Date() };

        const vacante = await ReclutamientoSeleccion.findByIdAndUpdate(
            id,
            actualizacion,
            { new: true }
        );

        if (!vacante) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        res.json(vacante);
    } catch (error) {
        console.error('Error al actualizar vacante:', error);
        res.status(500).json({ error: 'Error al actualizar vacante' });
    }
};

// Publicar vacante
export const publicarVacante = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const vacante = await ReclutamientoSeleccion.findByIdAndUpdate(
            id,
            { estado: 'publicada', updated_at: new Date() },
            { new: true }
        );

        if (!vacante) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        res.json(vacante);
    } catch (error) {
        console.error('Error al publicar vacante:', error);
        res.status(500).json({ error: 'Error al publicar vacante' });
    }
};

// Cerrar vacante
export const cerrarVacante = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const vacante = await ReclutamientoSeleccion.findByIdAndUpdate(
            id,
            { estado: 'cerrada', updated_at: new Date() },
            { new: true }
        );

        if (!vacante) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        res.json(vacante);
    } catch (error) {
        console.error('Error al cerrar vacante:', error);
        res.status(500).json({ error: 'Error al cerrar vacante' });
    }
};

// ==================== CANDIDATOS ====================

// Agregar candidato a vacante
export const agregarCandidato = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, email, telefono, cv_url } = req.body;

        const vacante = await ReclutamientoSeleccion.findById(id);

        if (!vacante) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        if (vacante.estado === 'cerrada' || vacante.estado === 'cancelada') {
            return res.status(400).json({ error: 'No se pueden agregar candidatos a esta vacante' });
        }

        // Verificar si el candidato ya aplicó
        const candidatoExistente = vacante.candidatos.find(c => c.email === email);
        if (candidatoExistente) {
            return res.status(400).json({ error: 'El candidato ya aplicó a esta vacante' });
        }

        const nuevoCandidato = {
            id: uuidv4(),
            nombre,
            email,
            telefono,
            cv_url,
            estado_aplicacion: 'aplicado' as const,
            fecha_aplicacion: new Date(),
            puntuacion: undefined,
            comentarios: undefined
        };

        vacante.candidatos.push(nuevoCandidato);
        vacante.updated_at = new Date();
        await vacante.save();

        res.status(201).json(nuevoCandidato);
    } catch (error) {
        console.error('Error al agregar candidato:', error);
        res.status(500).json({ error: 'Error al agregar candidato' });
    }
};

// Obtener candidatos de una vacante
export const obtenerCandidatos = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { estado_aplicacion } = req.query;

        const vacante = await ReclutamientoSeleccion.findById(id);

        if (!vacante) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        let candidatos = vacante.candidatos;

        if (estado_aplicacion) {
            candidatos = candidatos.filter(c => c.estado_aplicacion === estado_aplicacion);
        }

        res.json(candidatos);
    } catch (error) {
        console.error('Error al obtener candidatos:', error);
        res.status(500).json({ error: 'Error al obtener candidatos' });
    }
};

// Actualizar estado de candidato
export const actualizarEstadoCandidato = async (req: Request, res: Response) => {
    try {
        const { id, candidatoId } = req.params;
        const { estado_aplicacion, puntuacion, comentarios } = req.body;

        const vacante = await ReclutamientoSeleccion.findById(id);

        if (!vacante) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        const candidato = vacante.candidatos.find(c => c.id === candidatoId);

        if (!candidato) {
            return res.status(404).json({ error: 'Candidato no encontrado' });
        }

        if (estado_aplicacion) candidato.estado_aplicacion = estado_aplicacion;
        if (puntuacion !== undefined) candidato.puntuacion = puntuacion;
        if (comentarios !== undefined) candidato.comentarios = comentarios;

        vacante.updated_at = new Date();
        await vacante.save();

        res.json(candidato);
    } catch (error) {
        console.error('Error al actualizar candidato:', error);
        res.status(500).json({ error: 'Error al actualizar candidato' });
    }
};

// Evaluar candidato
export const evaluarCandidato = async (req: Request, res: Response) => {
    try {
        const { id, candidatoId } = req.params;
        const { puntuacion, comentarios, estado_aplicacion } = req.body;

        const vacante = await ReclutamientoSeleccion.findById(id);

        if (!vacante) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        const candidato = vacante.candidatos.find(c => c.id === candidatoId);

        if (!candidato) {
            return res.status(404).json({ error: 'Candidato no encontrado' });
        }

        candidato.puntuacion = puntuacion;
        candidato.comentarios = comentarios;
        
        if (estado_aplicacion) {
            candidato.estado_aplicacion = estado_aplicacion;
        } else {
            // Actualizar estado basado en puntuación
            if (puntuacion >= 8) {
                candidato.estado_aplicacion = 'entrevista';
            } else if (puntuacion >= 6) {
                candidato.estado_aplicacion = 'en_revision';
            }
        }

        vacante.updated_at = new Date();
        await vacante.save();

        res.json(candidato);
    } catch (error) {
        console.error('Error al evaluar candidato:', error);
        res.status(500).json({ error: 'Error al evaluar candidato' });
    }
};

// Seleccionar candidato
export const seleccionarCandidato = async (req: Request, res: Response) => {
    try {
        const { id, candidatoId } = req.params;

        const vacante = await ReclutamientoSeleccion.findById(id);

        if (!vacante) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        const candidato = vacante.candidatos.find(c => c.id === candidatoId);

        if (!candidato) {
            return res.status(404).json({ error: 'Candidato no encontrado' });
        }

        candidato.estado_aplicacion = 'seleccionado';
        vacante.updated_at = new Date();
        await vacante.save();

        res.json({ mensaje: 'Candidato seleccionado exitosamente', candidato });
    } catch (error) {
        console.error('Error al seleccionar candidato:', error);
        res.status(500).json({ error: 'Error al seleccionar candidato' });
    }
};

// Rechazar candidato
export const rechazarCandidato = async (req: Request, res: Response) => {
    try {
        const { id, candidatoId } = req.params;
        const { motivo } = req.body;

        const vacante = await ReclutamientoSeleccion.findById(id);

        if (!vacante) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        const candidato = vacante.candidatos.find(c => c.id === candidatoId);

        if (!candidato) {
            return res.status(404).json({ error: 'Candidato no encontrado' });
        }

        candidato.estado_aplicacion = 'rechazado';
        if (motivo) candidato.comentarios = motivo;
        
        vacante.updated_at = new Date();
        await vacante.save();

        res.json({ mensaje: 'Candidato rechazado', candidato });
    } catch (error) {
        console.error('Error al rechazar candidato:', error);
        res.status(500).json({ error: 'Error al rechazar candidato' });
    }
};

// ==================== ESTADÍSTICAS ====================

// Obtener estadísticas de reclutamiento
export const obtenerEstadisticas = async (req: Request, res: Response) => {
    try {
        const { organization_id } = req.query;

        const vacantes = await ReclutamientoSeleccion.find({ organization_id });

        const estadisticas = {
            total_vacantes: vacantes.length,
            por_estado: {
                borrador: vacantes.filter(v => v.estado === 'borrador').length,
                publicada: vacantes.filter(v => v.estado === 'publicada').length,
                cerrada: vacantes.filter(v => v.estado === 'cerrada').length,
                cancelada: vacantes.filter(v => v.estado === 'cancelada').length
            },
            total_candidatos: vacantes.reduce((acc, v) => acc + v.candidatos.length, 0),
            candidatos_por_estado: {
                aplicado: 0,
                en_revision: 0,
                entrevista: 0,
                seleccionado: 0,
                rechazado: 0
            },
            promedio_candidatos_por_vacante: 0,
            tasa_conversion: 0
        };

        vacantes.forEach(vacante => {
            vacante.candidatos.forEach(candidato => {
                estadisticas.candidatos_por_estado[candidato.estado_aplicacion]++;
            });
        });

        if (estadisticas.total_vacantes > 0) {
            estadisticas.promedio_candidatos_por_vacante = 
                Math.round(estadisticas.total_candidatos / estadisticas.total_vacantes * 10) / 10;
        }

        if (estadisticas.total_candidatos > 0) {
            estadisticas.tasa_conversion = 
                Math.round((estadisticas.candidatos_por_estado.seleccionado / estadisticas.total_candidatos) * 100 * 10) / 10;
        }

        res.json(estadisticas);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

// Eliminar vacante
export const eliminarVacante = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const vacante = await ReclutamientoSeleccion.findByIdAndDelete(id);

        if (!vacante) {
            return res.status(404).json({ error: 'Vacante no encontrada' });
        }

        res.json({ mensaje: 'Vacante eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar vacante:', error);
        res.status(500).json({ error: 'Error al eliminar vacante' });
    }
};

