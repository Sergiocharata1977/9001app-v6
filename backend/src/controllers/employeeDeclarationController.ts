import { Request, Response } from 'express';
import { DeclaracionEmpleado, IDeclaracionEmpleado } from '../models/EmployeeDeclaration';
import { Hallazgos } from '../models/hallazgos';
import { TraceabilityService } from '../services/traceabilityService';
import { z } from 'zod';

// Esquemas de validación
const employeeDeclarationSchema = z.object({
  employeeCode: z.string().optional(),
  employeeName: z.string().min(1),
  department: z.string().min(1),
  area: z.string().min(1),
  issueDescription: z.string().min(1),
  suggestedImprovement: z.string().optional(),
  evidencePhotos: z.array(z.string()).optional(),
  contactEmail: z.string().email().optional(),
  isAnonymous: z.boolean().optional()
});

// POST /api/employee-declarations - Crear declaración de empleado
export const submitDeclaration = async (req: Request, res: Response) => {
  try {
    // Validar datos
    const validatedData = employeeDeclarationSchema.parse(req.body);

    // Generar número de declaración
    const traceabilityService = new TraceabilityService(req.body.organization_id || 'default');
    const declarationNumber = await traceabilityService.generateEmployeeDeclarationNumber();

    // Crear declaración
    const declarationData: Partial<IDeclaracionEmpleado> = {
      organization_id: req.body.organization_id || 'default',
      numeroDeclaracion: declarationNumber,
      codigoEmpleado: validatedData.employeeCode,
      nombreEmpleado: validatedData.employeeName,
      departamento: validatedData.department,
      area: validatedData.area,
      descripcionProblema: validatedData.issueDescription,
      mejoraSugerida: validatedData.suggestedImprovement,
      fotosEvidencia: validatedData.evidencePhotos,
      emailContacto: validatedData.contactEmail,
      esAnonimo: validatedData.isAnonymous,
      estado: 'pendiente_revision',
      estaActivo: true
    };

    const declaration = new DeclaracionEmpleado(declarationData);
    await declaration.save();

    res.status(201).json({
      success: true,
      data: declaration,
      message: 'Declaración enviada exitosamente'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.issues
      });
    }

    console.error('Error al crear declaración:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/employee-declarations - Obtener todas las declaraciones
export const getAllDeclarations = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filters: any = { organization_id };

    if (status) {
      filters.status = status;
    }

    // Construir ordenamiento
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Paginación
    const skip = (Number(page) - 1) * Number(limit);

    const [declarations, total] = await Promise.all([
      DeclaracionEmpleado.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      DeclaracionEmpleado.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: declarations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error al obtener declaraciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// POST /api/employee-declarations/:id/convert-to-finding - Convertir declaración a hallazgo
export const convertToFinding = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id, user_id, findingData } = req.body;

    if (!organization_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id y user_id son requeridos'
      });
    }

    // Buscar declaración
    const declaration = await DeclaracionEmpleado.findById(id);

    if (!declaration) {
      return res.status(404).json({
        success: false,
        message: 'Declaración no encontrada'
      });
    }

    if (declaration.estado !== 'pendiente_revision') {
      return res.status(400).json({
        success: false,
        message: 'La declaración ya ha sido procesada'
      });
    }

    // Generar número de hallazgo
    const traceabilityService = new TraceabilityService(organization_id);
    const findingNumber = await traceabilityService.generateFindingNumber('employee');

    // Crear hallazgo
    const finding = new Hallazgos({
      organization_id,
      numeroHallazgo: findingNumber,
      titulo: `Declaración de empleado: ${declaration.nombreEmpleado}`,
      descripcion: declaration.descripcionProblema,
      origen: 'empleado',
      origenId: declaration._id.toString(),
      origenNombre: declaration.nombreEmpleado,
      origenReferencia: declaration.numeroDeclaracion,
      tipoHallazgo: 'observacion',
      severidad: 'menor',
      categoria: 'proceso',
      nivelRiesgo: 'bajo',
      fechaIdentificacion: new Date(),
      identificadoPor: user_id,
      identificadoPorNombre: req.body.userName || 'Sistema',
      estaActivo: true,
      cantidadAcciones: 0,
      cantidadAccionesAbiertas: 0,
      cantidadAccionesCompletadas: 0,
      estaVerificado: false,
      esRecurrente: false,
      cantidadRecurrencias: 0,
      cadenaTrazabilidad: [findingNumber],
      creadoPor: user_id
    });

    await finding.save();

    // Actualizar declaración
    declaration.estado = 'convertido_hallazgo';
    declaration.hallazgoConvertidoId = finding._id.toString();
    declaration.fechaActualizacion = new Date();
    await declaration.save();

    res.json({
      success: true,
      data: { declaration, finding },
      message: 'Declaración convertida a hallazgo exitosamente'
    });
  } catch (error) {
    console.error('Error al convertir declaración:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};