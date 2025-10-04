import { Request, Response } from 'express';
import { ProcessDocument } from '../models/ProcessDocument';
import mongoose from 'mongoose';

// Obtener todos los documentos de procesos
export const getProcessDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const query: any = {
      organization_id: organization_id,
      is_active: true,
      is_archived: false
    };

    // Filtros opcionales
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.type) {
      query.type = req.query.type;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.responsible_user_id) {
      query.responsible_user_id = req.query.responsible_user_id;
    }

    const documents = await ProcessDocument.find(query)
      .populate('responsible_user_id', 'name email')
      .populate('approved_by', 'name email')
      .populate('reviewed_by', 'name email')
      .populate('department_id', 'name')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      data: documents,
      count: documents.length
    });
  } catch (error) {
    console.error('Error obteniendo documentos de procesos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener un documento por ID
export const getProcessDocumentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de documento inválido'
      });
      return;
    }

    const document = await ProcessDocument.findById(id)
      .populate('responsible_user_id', 'name email')
      .populate('approved_by', 'name email')
      .populate('reviewed_by', 'name email')
      .populate('department_id', 'name')
      .populate('distribution_list', 'name email')
      .populate('status_history.changed_by', 'name email')
      .populate('version_history.created_by', 'name email');

    if (!document) {
      res.status(404).json({
        error: 'Documento no encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Error obteniendo documento:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Crear un nuevo documento
export const createProcessDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      type,
      category,
      content,
      keywords,
      responsible_user_id,
      department_id,
      distribution_list,
      effective_date,
      review_date,
      organization_id,
      created_by
    } = req.body;

    // Validaciones básicas
    if (!title || !type || !category || !responsible_user_id || !organization_id || !created_by) {
      res.status(400).json({
        error: 'Campos requeridos: title, type, category, responsible_user_id, organization_id, created_by'
      });
      return;
    }

    // Crear el documento
    const newDocument = new ProcessDocument({
      title,
      description,
      type,
      category,
      content,
      keywords: keywords || [],
      responsible_user_id,
      department_id,
      distribution_list: distribution_list || [],
      effective_date: effective_date ? new Date(effective_date) : undefined,
      review_date: review_date ? new Date(review_date) : undefined,
      organization_id,
      created_by,
      status_history: [{
        status: 'borrador',
        changed_at: new Date(),
        changed_by: created_by,
        comment: 'Documento creado'
      }]
    });

    const savedDocument = await newDocument.save();

    // Poblar los datos para la respuesta
    const populatedDocument = await ProcessDocument.findById(savedDocument._id)
      .populate('responsible_user_id', 'name email')
      .populate('department_id', 'name');

    res.status(201).json({
      success: true,
      data: populatedDocument,
      message: 'Documento creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando documento:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({
        error: 'Error de validación',
        details: error.message
      });
      return;
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Actualizar un documento
export const updateProcessDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { updated_by, ...updateData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de documento inválido'
      });
      return;
    }

    if (!updated_by) {
      res.status(400).json({
        error: 'updated_by es requerido'
      });
      return;
    }

    const document = await ProcessDocument.findById(id);

    if (!document) {
      res.status(404).json({
        error: 'Documento no encontrado'
      });
      return;
    }

    // Actualizar campos
    Object.assign(document, updateData);
    document.updated_by = updated_by;

    const updatedDocument = await document.save();

    // Poblar los datos para la respuesta
    const populatedDocument = await ProcessDocument.findById(updatedDocument._id)
      .populate('responsible_user_id', 'name email')
      .populate('department_id', 'name');

    res.json({
      success: true,
      data: populatedDocument,
      message: 'Documento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando documento:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({
        error: 'Error de validación',
        details: error.message
      });
      return;
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Cambiar estado de un documento
export const changeDocumentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { new_status, changed_by, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de documento inválido'
      });
      return;
    }

    if (!new_status || !changed_by) {
      res.status(400).json({
        error: 'new_status y changed_by son requeridos'
      });
      return;
    }

    const validStatuses = ['borrador', 'revision', 'aprobado', 'vigente', 'obsoleto'];
    if (!validStatuses.includes(new_status)) {
      res.status(400).json({
        error: 'Estado inválido',
        valid_statuses: validStatuses
      });
      return;
    }

    const document = await ProcessDocument.findById(id);

    if (!document) {
      res.status(404).json({
        error: 'Documento no encontrado'
      });
      return;
    }

    // Cambiar estado usando el método del modelo
    await document.changeStatus(new_status, changed_by, comment);

    // Poblar los datos para la respuesta
    const populatedDocument = await ProcessDocument.findById(document._id)
      .populate('responsible_user_id', 'name email')
      .populate('approved_by', 'name email')
      .populate('reviewed_by', 'name email');

    res.json({
      success: true,
      data: populatedDocument,
      message: `Estado cambiado a ${new_status} exitosamente`
    });
  } catch (error) {
    console.error('Error cambiando estado del documento:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Crear nueva versión de un documento
export const createNewVersion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { changes, created_by } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de documento inválido'
      });
      return;
    }

    if (!changes || !created_by) {
      res.status(400).json({
        error: 'changes y created_by son requeridos'
      });
      return;
    }

    const document = await ProcessDocument.findById(id);

    if (!document) {
      res.status(404).json({
        error: 'Documento no encontrado'
      });
      return;
    }

    // Crear nueva versión usando el método del modelo
    await document.createNewVersion(changes, created_by);

    // Poblar los datos para la respuesta
    const populatedDocument = await ProcessDocument.findById(document._id)
      .populate('responsible_user_id', 'name email');

    res.json({
      success: true,
      data: populatedDocument,
      message: 'Nueva versión creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando nueva versión:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Buscar documentos
export const searchDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id, search_term } = req.query;

    if (!organization_id || !search_term) {
      res.status(400).json({
        error: 'organization_id y search_term son requeridos'
      });
      return;
    }

    const documents = await ProcessDocument.find({
      organization_id: parseInt(organization_id as string),
      $or: [
        { titulo: { $regex: search_term, $options: 'i' } },
        { descripcion: { $regex: search_term, $options: 'i' } },
        { archivo_nombre: { $regex: search_term, $options: 'i' } }
      ],
      is_active: true
    }).populate('process_id', 'codigo nombre');

    res.json({
      success: true,
      data: documents,
      count: documents.length
    });
  } catch (error) {
    console.error('Error buscando documentos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Eliminar (archivar) un documento
export const deleteProcessDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { deleted_by } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de documento inválido'
      });
      return;
    }

    if (!deleted_by) {
      res.status(400).json({
        error: 'deleted_by es requerido'
      });
      return;
    }

    const document = await ProcessDocument.findById(id);

    if (!document) {
      res.status(404).json({
        error: 'Documento no encontrado'
      });
      return;
    }

    // Soft delete - marcar como archivado
    document.is_archived = true;
    document.is_active = false;
    document.updated_by = deleted_by;

    await document.save();

    res.json({
      success: true,
      message: 'Documento archivado exitosamente'
    });
  } catch (error) {
    console.error('Error archivando documento:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener estadísticas de documentos
export const getDocumentStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const stats = await ProcessDocument.aggregate([
      {
        $match: {
          organization_id: new mongoose.Types.ObjectId(organization_id as string),
          is_active: true,
          is_archived: false
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = stats.reduce((acc: any, stat: any) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de documentos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};