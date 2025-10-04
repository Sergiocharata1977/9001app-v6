import { Request, Response } from 'express';
import { z } from 'zod';
import { CRM_Contactos } from '../models/crm_contactos';

// Esquema de validación
const contactoSchema = z.object({
  organization_id: z.string().min(1),
  nombre: z.string().min(1),
  apellidos: z.string().optional(),
  cargo: z.string().optional(),
  empresa: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  estado: z.string().optional(),
  zona_geografica: z.string().optional(),
  tipo_contacto: z.enum(['prospecto', 'cliente', 'proveedor', 'aliado']).optional(),
  fuente_contacto: z.string().optional(),
  estado_contacto: z.enum(['activo', 'inactivo', 'pendiente']).optional(),
  observaciones: z.string().optional(),
  created_by: z.string().optional()
});

// GET /api/crm/contactos
export const getAllContactos = async (req: Request, res: Response) => {
  try {
    const { organization_id, empresa, tipo_contacto, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    
    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const filters: any = { organization_id, is_active: 1 };
    if (empresa) filters.empresa = empresa;
    if (tipo_contacto) filters.tipo_contacto = tipo_contacto;

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
    const skip = (Number(page) - 1) * Number(limit);

    const [contactos, total] = await Promise.all([
      CRM_Contactos.find(filters).sort(sort).skip(skip).limit(Number(limit)).lean(),
      CRM_Contactos.countDocuments(filters)
    ]);

    return res.json({
      success: true,
      data: contactos,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// GET /api/crm/contactos/:id
export const getContactoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;
    
    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const contacto = await CRM_Contactos.findOne({ id, organization_id });

    if (!contacto) {
      return res.status(404).json({ success: false, message: 'Contacto no encontrado' });
    }

    return res.json({ success: true, data: contacto });
  } catch (error) {
    console.error('Error al obtener contacto:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// POST /api/crm/contactos
export const createContacto = async (req: Request, res: Response) => {
  try {
    const validatedData = contactoSchema.parse(req.body);
    
    const count = await CRM_Contactos.countDocuments({ organization_id: validatedData.organization_id });
    const contactoId = `CONT-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const nuevoContacto = new CRM_Contactos({
      id: contactoId,
      ...validatedData,
      created_at: new Date()
    });

    await nuevoContacto.save();

    return res.status(201).json({ success: true, data: nuevoContacto, message: 'Contacto creado exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.issues });
    }
    console.error('Error al crear contacto:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// PUT /api/crm/contactos/:id
export const updateContacto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id, updated_by } = req.body;
    
    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const validatedData = contactoSchema.partial().parse(req.body);
    const contacto = await CRM_Contactos.findOne({ id, organization_id });

    if (!contacto) {
      return res.status(404).json({ success: false, message: 'Contacto no encontrado' });
    }

    Object.assign(contacto, validatedData);
    contacto.updated_by = updated_by;
    contacto.updated_at = new Date();
    await contacto.save();

    return res.json({ success: true, data: contacto, message: 'Contacto actualizado exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.issues });
    }
    console.error('Error al actualizar contacto:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// DELETE /api/crm/contactos/:id
export const deleteContacto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const contacto = await CRM_Contactos.findOne({ id, organization_id });

    if (!contacto) {
      return res.status(404).json({ success: false, message: 'Contacto no encontrado' });
    }

    contacto.is_active = 0;
    await contacto.save();

    return res.json({ success: true, message: 'Contacto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar contacto:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// GET /api/crm/contactos/search - Búsqueda de contactos
export const searchContactos = async (req: Request, res: Response) => {
  try {
    const { organization_id, q } = req.query;

    if (!organization_id || !q) {
      return res.status(400).json({ success: false, message: 'organization_id y q (query) son requeridos' });
    }

    const searchRegex = new RegExp(q as string, 'i');
    
    const contactos = await CRM_Contactos.find({
      organization_id,
      is_active: 1,
      $or: [
        { nombre: searchRegex },
        { apellidos: searchRegex },
        { email: searchRegex },
        { telefono: searchRegex },
        { empresa: searchRegex }
      ]
    }).limit(20).lean();

    return res.json({ success: true, data: contactos });
  } catch (error) {
    console.error('Error al buscar contactos:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};


