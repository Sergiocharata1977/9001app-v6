import { Request, Response } from 'express';
import ControlAusencias from '../models/ControlAusencias';
import GestionDesempeno from '../models/GestionDesempeno';
import IndicadoresRRHH from '../models/IndicadoresRRHH';
import Personnel from '../models/Personnel';
import ReclutamientoSeleccion from '../models/ReclutamientoSeleccion';

// Crear indicador personalizado
export const crearIndicador = async (req: Request, res: Response) => {
    try {
        const {
            organization_id,
            nombre,
            categoria,
            valor_actual,
            valor_meta,
            unidad,
            periodo,
            formula_calculo,
            fuente_datos
        } = req.body;

        const nuevoIndicador = new IndicadoresRRHH({
            organization_id,
            nombre,
            categoria,
            valor_actual,
            valor_meta,
            unidad,
            periodo,
            formula_calculo,
            fuente_datos,
            tendencia: 'estable',
            fecha_calculo: new Date()
        });

        await nuevoIndicador.save();
        res.status(201).json(nuevoIndicador);
    } catch (error) {
        console.error('Error al crear indicador:', error);
        res.status(500).json({ error: 'Error al crear indicador' });
    }
};

// Obtener todos los indicadores
export const obtenerIndicadores = async (req: Request, res: Response) => {
    try {
        const { organization_id, categoria } = req.query;
        
        const filtros: any = { organization_id };
        if (categoria) filtros.categoria = categoria;

        const indicadores = await IndicadoresRRHH.find(filtros).sort({ categoria: 1, nombre: 1 });
        res.json(indicadores);
    } catch (error) {
        console.error('Error al obtener indicadores:', error);
        res.status(500).json({ error: 'Error al obtener indicadores' });
    }
};

// Calcular indicador de Tasa de Capacitación
const calcularTasaCapacitacion = async (organization_id: string): Promise<number> => {
    // TODO: Implementar cuando exista el modelo de capacitaciones
    // Por ahora retornar un valor de ejemplo
    return 75;
};

// Calcular índice de Ausentismo
const calcularIndiceAusentismo = async (organization_id: string): Promise<number> => {
    try {
        const year = new Date().getFullYear();
        const inicioAno = new Date(year, 0, 1);
        const finAno = new Date(year, 11, 31);

        // Obtener total de empleados
        const totalEmpleados = await Personnel.countDocuments({ 
            organization_id,
            status: 'active'
        });

        if (totalEmpleados === 0) return 0;

        // Obtener ausencias aprobadas del año
        const ausencias = await ControlAusencias.find({
            organization_id,
            estado: 'aprobada',
            fecha_inicio: { $gte: inicioAno, $lte: finAno }
        });

        const totalDiasAusencia = ausencias.reduce((acc, a) => acc + a.dias_solicitados, 0);
        
        // Días laborables en el año (aproximado: 260 días)
        const diasLaborables = 260;
        const totalDiasDisponibles = totalEmpleados * diasLaborables;

        const indiceAusentismo = (totalDiasAusencia / totalDiasDisponibles) * 100;
        
        return Math.round(indiceAusentismo * 10) / 10;
    } catch (error) {
        console.error('Error al calcular ausentismo:', error);
        return 0;
    }
};

// Calcular Satisfacción Promedio (Clima Laboral)
const calcularSatisfaccionPromedio = async (organization_id: string): Promise<number> => {
    // TODO: Implementar cuando tengamos encuestas de clima completadas
    // Por ahora retornar un valor de ejemplo
    return 85;
};

// Calcular Cumplimiento de Objetivos
const calcularCumplimientoObjetivos = async (organization_id: string): Promise<number> => {
    try {
        const evaluaciones = await GestionDesempeno.find({
            organization_id,
            estado: { $in: ['completada', 'aprobada'] }
        });

        if (evaluaciones.length === 0) return 0;

        let totalObjetivos = 0;
        let objetivosCompletados = 0;

        evaluaciones.forEach(evaluacion => {
            evaluacion.objetivos.forEach(objetivo => {
                totalObjetivos++;
                if (objetivo.puntuacion && objetivo.puntuacion >= 7) {
                    objetivosCompletados++;
                }
            });
        });

        if (totalObjetivos === 0) return 0;

        const porcentajeCumplimiento = (objetivosCompletados / totalObjetivos) * 100;
        return Math.round(porcentajeCumplimiento * 10) / 10;
    } catch (error) {
        console.error('Error al calcular cumplimiento de objetivos:', error);
        return 0;
    }
};

// Calcular Tiempo Promedio de Reclutamiento
const calcularTiempoPromedioReclutamiento = async (organization_id: string): Promise<number> => {
    try {
        const vacantes = await ReclutamientoSeleccion.find({
            organization_id,
            estado: { $in: ['cerrada', 'publicada'] }
        });

        if (vacantes.length === 0) return 0;

        let totalDias = 0;
        let vacantesCerradas = 0;

        vacantes.forEach(vacante => {
            if (vacante.estado === 'cerrada') {
                const dias = Math.floor((vacante.updated_at.getTime() - vacante.fecha_publicacion.getTime()) / (1000 * 60 * 60 * 24));
                totalDias += dias;
                vacantesCerradas++;
            }
        });

        if (vacantesCerradas === 0) return 0;

        return Math.round(totalDias / vacantesCerradas);
    } catch (error) {
        console.error('Error al calcular tiempo de reclutamiento:', error);
        return 0;
    }
};

// Calcular Rotación de Personal
const calcularRotacionPersonal = async (organization_id: string): Promise<number> => {
    try {
        const year = new Date().getFullYear();
        const inicioAno = new Date(year, 0, 1);

        // Total de empleados activos al inicio del año
        const empleadosInicioAno = await Personnel.countDocuments({
            organization_id,
            created_at: { $lt: inicioAno }
        });

        // Empleados que dejaron la empresa este año
        const empleadosInactivos = await Personnel.countDocuments({
            organization_id,
            status: 'inactive',
            updated_at: { $gte: inicioAno }
        });

        if (empleadosInicioAno === 0) return 0;

        const tasaRotacion = (empleadosInactivos / empleadosInicioAno) * 100;
        return Math.round(tasaRotacion * 10) / 10;
    } catch (error) {
        console.error('Error al calcular rotación:', error);
        return 0;
    }
};

// Recalcular todos los indicadores automáticamente
export const recalcularIndicadores = async (req: Request, res: Response) => {
    try {
        const { organization_id } = req.body;

        if (!organization_id) {
            return res.status(400).json({ error: 'organization_id es requerido' });
        }

        const periodo = new Date().toISOString().substring(0, 7); // YYYY-MM

        // Calcular todos los indicadores
        const indicadoresCalculados = [
            {
                nombre: 'Tasa de Capacitación',
                categoria: 'capacitacion',
                valor_actual: await calcularTasaCapacitacion(organization_id),
                valor_meta: 80,
                unidad: '%',
                periodo,
                formula_calculo: '(Empleados capacitados / Total empleados) * 100',
                fuente_datos: ['RRHH_Capacitaciones', 'Personnel']
            },
            {
                nombre: 'Índice de Ausentismo',
                categoria: 'ausentismo',
                valor_actual: await calcularIndiceAusentismo(organization_id),
                valor_meta: 5,
                unidad: '%',
                periodo,
                formula_calculo: '(Días ausencia / Días laborables) * 100',
                fuente_datos: ['ControlAusencias', 'Personnel']
            },
            {
                nombre: 'Satisfacción Promedio',
                categoria: 'satisfaccion',
                valor_actual: await calcularSatisfaccionPromedio(organization_id),
                valor_meta: 85,
                unidad: '%',
                periodo,
                formula_calculo: 'Promedio de última encuesta clima laboral',
                fuente_datos: ['ClimaLaboral', 'RespuestaClimaLaboral']
            },
            {
                nombre: 'Cumplimiento de Objetivos',
                categoria: 'productividad',
                valor_actual: await calcularCumplimientoObjetivos(organization_id),
                valor_meta: 90,
                unidad: '%',
                periodo,
                formula_calculo: '% de objetivos completados en el período',
                fuente_datos: ['GestionDesempeno']
            },
            {
                nombre: 'Tiempo Promedio de Reclutamiento',
                categoria: 'productividad',
                valor_actual: await calcularTiempoPromedioReclutamiento(organization_id),
                valor_meta: 30,
                unidad: 'días',
                periodo,
                formula_calculo: 'Días desde vacante hasta contratación',
                fuente_datos: ['ReclutamientoSeleccion']
            },
            {
                nombre: 'Rotación de Personal',
                categoria: 'rotacion',
                valor_actual: await calcularRotacionPersonal(organization_id),
                valor_meta: 10,
                unidad: '%',
                periodo,
                formula_calculo: '% empleados que dejaron la empresa',
                fuente_datos: ['Personnel']
            }
        ];

        // Guardar o actualizar cada indicador
        const resultados = [];
        for (const indicador of indicadoresCalculados) {
            // Determinar tendencia
            const indicadorAnterior = await IndicadoresRRHH.findOne({
                organization_id,
                nombre: indicador.nombre
            }).sort({ fecha_calculo: -1 });

            let tendencia: 'positiva' | 'negativa' | 'estable' = 'estable';
            if (indicadorAnterior) {
                const diferencia = indicador.valor_actual - indicadorAnterior.valor_actual;
                
                // Para algunos indicadores, menor es mejor (ausentismo, rotación)
                const menorEsMejor = ['Índice de Ausentismo', 'Rotación de Personal', 'Tiempo Promedio de Reclutamiento'].includes(indicador.nombre);
                
                if (Math.abs(diferencia) > 0.5) {
                    if (menorEsMejor) {
                        tendencia = diferencia < 0 ? 'positiva' : 'negativa';
                    } else {
                        tendencia = diferencia > 0 ? 'positiva' : 'negativa';
                    }
                }
            }

            const nuevoIndicador = new IndicadoresRRHH({
                organization_id,
                ...indicador,
                tendencia,
                fecha_calculo: new Date()
            });

            await nuevoIndicador.save();
            resultados.push(nuevoIndicador);
        }

        res.json({
            mensaje: 'Indicadores recalculados exitosamente',
            indicadores: resultados
        });
    } catch (error) {
        console.error('Error al recalcular indicadores:', error);
        res.status(500).json({ error: 'Error al recalcular indicadores' });
    }
};

// Obtener dashboard de indicadores
export const obtenerDashboard = async (req: Request, res: Response) => {
    try {
        const { organization_id } = req.query;

        // Obtener los indicadores más recientes de cada categoría
        const indicadores = await IndicadoresRRHH.aggregate([
            { $match: { organization_id: organization_id as string } },
            { $sort: { fecha_calculo: -1 } },
            {
                $group: {
                    _id: '$nombre',
                    indicador: { $first: '$$ROOT' }
                }
            },
            { $replaceRoot: { newRoot: '$indicador' } },
            { $sort: { categoria: 1, nombre: 1 } }
        ]);

        // Agrupar por categoría
        const dashboard = {
            productividad: indicadores.filter(i => i.categoria === 'productividad'),
            satisfaccion: indicadores.filter(i => i.categoria === 'satisfaccion'),
            rotacion: indicadores.filter(i => i.categoria === 'rotacion'),
            capacitacion: indicadores.filter(i => i.categoria === 'capacitacion'),
            ausentismo: indicadores.filter(i => i.categoria === 'ausentismo')
        };

        res.json(dashboard);
    } catch (error) {
        console.error('Error al obtener dashboard:', error);
        res.status(500).json({ error: 'Error al obtener dashboard' });
    }
};

// Obtener histórico de un indicador
export const obtenerHistorico = async (req: Request, res: Response) => {
    try {
        const { organization_id, nombre } = req.query;

        const historico = await IndicadoresRRHH.find({
            organization_id,
            nombre
        }).sort({ fecha_calculo: 1 }).limit(12); // Últimos 12 meses

        res.json(historico);
    } catch (error) {
        console.error('Error al obtener histórico:', error);
        res.status(500).json({ error: 'Error al obtener histórico' });
    }
};

// Actualizar indicador
export const actualizarIndicador = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const actualizacion = { ...req.body, fecha_calculo: new Date() };

        const indicador = await IndicadoresRRHH.findByIdAndUpdate(
            id,
            actualizacion,
            { new: true }
        );

        if (!indicador) {
            return res.status(404).json({ error: 'Indicador no encontrado' });
        }

        res.json(indicador);
    } catch (error) {
        console.error('Error al actualizar indicador:', error);
        res.status(500).json({ error: 'Error al actualizar indicador' });
    }
};

// Eliminar indicador
export const eliminarIndicador = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const indicador = await IndicadoresRRHH.findByIdAndDelete(id);

        if (!indicador) {
            return res.status(404).json({ error: 'Indicador no encontrado' });
        }

        res.json({ mensaje: 'Indicador eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar indicador:', error);
        res.status(500).json({ error: 'Error al eliminar indicador' });
    }
};

