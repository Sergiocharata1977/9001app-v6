import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import ClimaLaboral from '../models/ClimaLaboral';
import { RespuestaClimaLaboral } from '../models/RespuestaClimaLaboral';
// Los imports en líneas 185-187 son duplicados y deben eliminarse

// Crear nueva encuesta de clima laboral
export const crearEncuesta = async (req: Request, res: Response) => {
    try {
        const { organization_id, titulo, descripcion, fecha_inicio, fecha_fin, preguntas, anonima } = req.body;

        const nuevaEncuesta = new ClimaLaboral({
            id: uuidv4(),
            organization_id,
            titulo,
            descripcion,
            fecha_inicio,
            fecha_fin,
            preguntas: preguntas.map((p: any) => ({ ...p, id: uuidv4() })),
            anonima,
            estado: 'borrador'
        });

        await nuevaEncuesta.save();
        res.status(201).json(nuevaEncuesta);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear encuesta de clima laboral' });
    }
};

// Obtener todas las encuestas
export const obtenerEncuestas = async (req: Request, res: Response) => {
    try {
        const { organization_id } = req.query;
        const encuestas = await ClimaLaboral.find({ organization_id });
        res.json(encuestas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener encuestas' });
    }
};

// Obtener encuesta por ID
export const obtenerEncuestaPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const encuesta = await ClimaLaboral.findOne({ id });

        if (!encuesta) {
            return res.status(404).json({ error: 'Encuesta no encontrada' });
        }

        res.json(encuesta);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener encuesta' });
    }
};

// Actualizar encuesta
export const actualizarEncuesta = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const actualizacion = { ...req.body, updated_at: new Date() };

        const encuesta = await ClimaLaboral.findOneAndUpdate(
            { id },
            actualizacion,
            { new: true }
        );

        if (!encuesta) {
            return res.status(404).json({ error: 'Encuesta no encontrada' });
        }

        res.json(encuesta);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar encuesta' });
    }
};

// Activar encuesta
export const activarEncuesta = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const encuesta = await ClimaLaboral.findOneAndUpdate(
            { id },
            { estado: 'activa', updated_at: new Date() },
            { new: true }
        );

        if (!encuesta) {
            return res.status(404).json({ error: 'Encuesta no encontrada' });
        }

        res.json(encuesta);
    } catch (error) {
        res.status(500).json({ error: 'Error al activar encuesta' });
    }
};

// Responder encuesta
export const responderEncuesta = async (req: Request, res: Response) => {
    try {
        const { encuesta_id, empleado_id, respuestas } = req.body;
        const ip_address = req.ip;

        const nuevaRespuesta = new RespuestaClimaLaboral({
            id: uuidv4(),
            organization_id: req.body.organization_id,
            encuesta_id,
            empleado_id,
            respuestas,
            ip_address
        });

        await nuevaRespuesta.save();
        res.status(201).json({ mensaje: 'Respuesta guardada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar respuesta' });
    }
};

// Obtener resultados de encuesta
export const obtenerResultados = async (req: Request, res: Response) => {
    try {
        const { encuesta_id } = req.params;

        const encuesta = await ClimaLaboral.findOne({ id: encuesta_id });
        const respuestas = await RespuestaClimaLaboral.find({ encuesta_id });

        if (!encuesta) {
            return res.status(404).json({ error: 'Encuesta no encontrada' });
        }

        // Procesar estadísticas
        const estadisticas = {
            total_respuestas: respuestas.length,
            preguntas_estadisticas: encuesta.preguntas.map((pregunta: any) => {
                const respuestasPregunta = respuestas.map((r: any) =>
                    r.respuestas.find((resp: any) => resp.pregunta_id === pregunta.id)
                ).filter(Boolean);

                if (pregunta.tipo === 'escala') {
                    const valores = respuestasPregunta.map((r: any) => Number(r?.valor)).filter((v: number) => !isNaN(v));
                    return {
                        pregunta_id: pregunta.id,
                        texto: pregunta.texto,
                        promedio: valores.length > 0 ? valores.reduce((a: number, b: number) => a + b, 0) / valores.length : 0,
                        total_respuestas: valores.length
                    };
                }

                return {
                    pregunta_id: pregunta.id,
                    texto: pregunta.texto,
                    total_respuestas: respuestasPregunta.length
                };
            })
        };

        res.json({ encuesta, estadisticas });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener resultados' });
    }
};

// Eliminar encuesta
export const eliminarEncuesta = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const encuesta = await ClimaLaboral.findOneAndDelete({ id });

        if (!encuesta) {
            return res.status(404).json({ error: 'Encuesta no encontrada' });
        }

        // Eliminar también las respuestas asociadas
        await RespuestaClimaLaboral.deleteMany({ encuesta_id: id });

        res.json({ mensaje: 'Encuesta eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar encuesta' });
    }
};

// Imports duplicados eliminados - ya están al inicio del archivo

export class ClimaLaboralController {
    // Crear encuesta
    static async crear(req: Request, res: Response) {
        try {
            const { organization_id, periodo, titulo, descripcion, preguntas, fecha_inicio, fecha_fin, anonima } = req.body;

            const encuesta = new ClimaLaboral({
                id: uuidv4(),
                organization_id,
                periodo,
                titulo,
                descripcion,
                preguntas: preguntas.map((p: any) => ({ ...p, id: uuidv4() })),
                fecha_inicio: new Date(fecha_inicio),
                fecha_fin: new Date(fecha_fin),
                anonima,
                estado: 'borrador'
            });

            await encuesta.save();
            res.status(201).json(encuesta);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear encuesta de clima laboral' });
        }
    }

    // Listar encuestas
    static async listar(req: Request, res: Response) {
        try {
            const { organization_id } = req.query;
            const encuestas = await ClimaLaboral.find({ organization_id: organization_id as string }).sort({ created_at: -1 });
            res.json(encuestas);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener encuestas' });
        }
    }

    // Activar encuesta
    static async activar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const encuesta = await ClimaLaboral.findOneAndUpdate(
                { id },
                { estado: 'activa' },
                { new: true }
            );
            res.json(encuesta);
        } catch (error) {
            res.status(500).json({ error: 'Error al activar encuesta' });
        }
    }

    // Responder encuesta
    static async responder(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { personal_id, respuestas } = req.body;

            const respuesta = new RespuestaClimaLaboral({
                id: uuidv4(),
                encuesta_id: id,
                personal_id,
                respuestas,
                organization_id: req.body.organization_id
            });

            await respuesta.save();

            // Actualizar contador de respuestas
            await ClimaLaboral.findOneAndUpdate(
                { id },
                { $inc: { total_respuestas: 1 } }
            );

            res.status(201).json({ mensaje: 'Respuesta registrada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al registrar respuesta' });
        }
    }

    // Obtener resultados
    static async resultados(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const encuesta = await ClimaLaboral.findOne({ id });
            const respuestas = await RespuestaClimaLaboral.find({ encuesta_id: id });

            // Calcular estadísticas
            const estadisticas = {
                total_respuestas: respuestas.length,
                promedio_general: 0,
                resultados_por_pregunta: []
            };

            // Calcular promedio para preguntas tipo Likert
            if (respuestas.length > 0) {
                const preguntasLikert = encuesta?.preguntas.filter((p: any) => p.tipo === 'escala') || [];
                let sumaTotal = 0;
                let contadorTotal = 0;

                preguntasLikert.forEach((pregunta: any) => {
                    const respuestasPregunta = respuestas.map((r: any) =>
                        r.respuestas.find((resp: any) => resp.pregunta_id === pregunta.id)?.valor as number
                    ).filter((v: number) => v !== undefined);

                    if (respuestasPregunta.length > 0) {
                        const promedio = respuestasPregunta.reduce((a: number, b: number) => a + b, 0) / respuestasPregunta.length;
                        sumaTotal += promedio;
                        contadorTotal++;
                    }
                });

                estadisticas.promedio_general = contadorTotal > 0 ? sumaTotal / contadorTotal : 0;
            }

            res.json({ encuesta, estadisticas });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener resultados' });
        }
    }
}