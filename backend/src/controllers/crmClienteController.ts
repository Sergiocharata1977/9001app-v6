import { Request, Response } from 'express';
import { z } from 'zod';
// import { Legajo } from '../models/Legajo'; // TEMPORALMENTE DESACTIVADO
import { CRM_ClientesAgro } from '../models/crm_clientes_agro';

// Esquemas de validación Zod
const clienteCreateSchema = z.object({
  organization_id: z.string().min(1, 'organization_id es requerido'),
  razon_social: z.string().min(1, 'Razón social es requerida'),
  rfc: z.string().optional(),
  tipo_cliente: z.enum(['pequeño', 'mediano', 'grande', 'corporativo']).optional(),
  categoria_agro: z.string().optional(),
  zona_geografica: z.string().optional(),
  region: z.string().optional(),
  clima_zona: z.string().optional(),
  tipo_suelo: z.string().optional(),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  estado: z.string().optional(),
  superficie_total: z.number().optional(),
  cultivos_principales: z.string().optional(),
  sistema_riego: z.string().optional(),
  tipo_agricultura: z.string().optional(),
  vendedor_asignado_id: z.string().optional(),
  tecnico_asignado_id: z.string().optional(),
  supervisor_comercial_id: z.string().optional(),
  observaciones: z.string().optional(),
  created_by: z.string().optional()
});

const clienteUpdateSchema = clienteCreateSchema.partial();

// GET /api/crm/clientes - Obtener todos los clientes
export const getAllClientes = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;
    
    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const {
      tipo_cliente,
      zona_geografica,
      vendedor_asignado_id,
      page = 1,
      limit = 10,
      sortBy = 'fecha_registro',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filters: any = { 
      organization_id,
      is_active: 1 
    };
    
    if (tipo_cliente) {
      filters.tipo_cliente = tipo_cliente;
    }
    
    if (zona_geografica) {
      filters.zona_geografica = zona_geografica;
    }
    
    if (vendedor_asignado_id) {
      filters.vendedor_asignado_id = vendedor_asignado_id;
    }

    // Construir ordenamiento
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Paginación
    const skip = (Number(page) - 1) * Number(limit);

    // Optimización: Usar lean() y select() para mejor rendimiento
    const [clientes, total] = await Promise.all([
      CRM_ClientesAgro.find(filters)
        .select('razon_social rfc tipo_cliente categoria_agro zona_geografica direccion ciudad estado superficie_total cultivos_principales vendedor_asignado_id fecha_registro is_active')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      CRM_ClientesAgro.countDocuments(filters)
    ]);

    return res.json({
      success: true,
      data: clientes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/crm/clientes/:id - Obtener cliente por ID
export const getClienteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;
    
    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const cliente = await CRM_ClientesAgro.findOne({
      id,
      organization_id
    });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    return res.json({
      success: true,
      data: cliente
    });
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// POST /api/crm/clientes - Crear nuevo cliente
export const createCliente = async (req: Request, res: Response) => {
  try {
    // Validar datos
    const validatedData = clienteCreateSchema.parse(req.body);
    
    // Generar ID único
    const count = await CRM_ClientesAgro.countDocuments({ organization_id: validatedData.organization_id });
    const clienteId = `CLI-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    // Crear cliente
    const nuevoCliente = new CRM_ClientesAgro({
      id: clienteId,
      ...validatedData,
      fecha_registro: new Date(),
      created_at: new Date()
    });

    await nuevoCliente.save();

    return res.status(201).json({
      success: true,
      data: nuevoCliente,
      message: 'Cliente creado exitosamente'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.issues
      });
    }

    console.error('Error al crear cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// PUT /api/crm/clientes/:id - Actualizar cliente
export const updateCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id, updated_by } = req.body;
    
    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    // Validar datos
    const validatedData = clienteUpdateSchema.parse(req.body);
    
    // Buscar cliente
    const cliente = await CRM_ClientesAgro.findOne({
      id,
      organization_id
    });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    // Actualizar campos
    Object.assign(cliente, validatedData);
    cliente.updated_by = updated_by;
    cliente.updated_at = new Date();

    await cliente.save();

    return res.json({
      success: true,
      data: cliente,
      message: 'Cliente actualizado exitosamente'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.issues
      });
    }

    console.error('Error al actualizar cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// DELETE /api/crm/clientes/:id - Eliminar cliente (soft delete)
export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const cliente = await CRM_ClientesAgro.findOne({
      id,
      organization_id
    });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    // Soft delete
    cliente.is_active = 0;
    await cliente.save();

    return res.json({
      success: true,
      message: 'Cliente eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/crm/clientes/stats - Obtener estadísticas de clientes
export const getClienteStats = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    // Optimización: Pipeline más eficiente con proyección temprana
    const stats = await CRM_ClientesAgro.aggregate([
      {
        $match: {
          organization_id,
          is_active: 1
        }
      },
      {
        $project: {
          tipo_cliente: 1,
          superficie_total: { $ifNull: ['$superficie_total', 0] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalSuperficie: { $sum: '$superficie_total' },
          porTipo: {
            $push: {
              tipo: '$tipo_cliente'
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      totalSuperficie: 0,
      porTipo: []
    };

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * POST /api/crm/clientes/:id/legajo
 * Obtiene el legajo de una empresa o lo crea automáticamente si no existe
 * 
 * FLUJO:
 * 1. Verifica que la empresa exista
 * 2. Si la empresa ya tiene legajo_id, retorna ese legajo
 * 3. Si no tiene legajo, crea uno nuevo automáticamente
 * 4. Vincula el legajo a la empresa (actualiza legajo_id)
 * 5. Retorna el legajo con populate de company_id
 * 
 * GARANTÍAS:
 * - 1 Empresa → 1 Legajo (único por company_id + organization_id)
 * - Creación automática sin errores de vinculación
 * - Trazabilidad completa (created_by, created_at)
 */
export const getOrCreateLegajo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // ID de la empresa
    const { organization_id, user_id } = req.body; // Desde middleware de auth

    // 1. Buscar la empresa
    const empresa = await CRM_ClientesAgro.findOne({ 
      _id: id, 
      organization_id,
      is_active: 1 
    });

    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada o inactiva'
      });
    }

    // 2-5. TEMPORALMENTE DESACTIVADO - Legajo en mantenimiento
    return res.status(503).json({
      success: false,
      message: 'Funcionalidad de Legajos temporalmente desactivada',
      error: 'Legajo module is under maintenance'
    });

  } catch (error: any) {
    console.error('Error en getOrCreateLegajo:', error);
    
    // Error de duplicado (por si acaso)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Esta empresa ya tiene un legajo asociado',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al obtener o crear legajo',
      error: error.message
    });
  }
};


