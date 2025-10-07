import { Request, Response } from 'express';
import { DocumentTemplate } from '../models/DocumentTemplate';
import mongoose from 'mongoose';

// Obtener todas las plantillas
export const getDocumentTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id, category_id, document_type, is_public } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const query: any = {
      $or: [
        { organization_id: organization_id },
        { is_public: true }
      ]
    };

    if (category_id) {
      query.category_id = category_id;
    }

    if (document_type) {
      query.document_type = document_type;
    }

    if (is_public !== undefined) {
      query.is_public = is_public === 'true';
    }

    const templates = await DocumentTemplate.find(query)
      .populate('category_id', 'name color')
      .populate('created_by', 'name email')
      .sort({ usage_count: -1, name: 1 });

    res.json({
      success: true,
      data: templates,
      count: templates.length
    });
  } catch (error) {
    console.error('Error obteniendo plantillas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener una plantilla por ID
export const getDocumentTemplateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de plantilla inválido'
      });
      return;
    }

    const template = await DocumentTemplate.findById(id)
      .populate('category_id', 'name color')
      .populate('created_by', 'name email')
      .populate('updated_by', 'name email');

    if (!template) {
      res.status(404).json({
        error: 'Plantilla no encontrada'
      });
      return;
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error obteniendo plantilla:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Crear una nueva plantilla
export const createDocumentTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      category_id,
      document_type,
      file_path,
      file_name,
      file_size,
      mime_type,
      thumbnail_path,
      tags,
      is_public,
      organization_id,
      created_by
    } = req.body;

    // Validaciones básicas
    if (!name || !document_type || !file_path || !file_name ||
        !file_size || !mime_type || !organization_id || !created_by) {
      res.status(400).json({
        error: 'Campos requeridos: name, document_type, file_path, file_name, file_size, mime_type, organization_id, created_by'
      });
      return;
    }

    // Verificar que la categoría existe si se proporciona
    if (category_id) {
      if (!mongoose.Types.ObjectId.isValid(category_id)) {
        res.status(400).json({
          error: 'ID de categoría inválido'
        });
        return;
      }

      const categoryExists = await mongoose.model('DocumentCategory').findById(category_id);
      if (!categoryExists) {
        res.status(404).json({
          error: 'Categoría no encontrada'
        });
        return;
      }
    }

    // Crear la plantilla
    const newTemplate = new DocumentTemplate({
      name,
      description,
      category_id,
      document_type,
      file_path,
      file_name,
      file_size,
      mime_type,
      thumbnail_path,
      tags: tags || [],
      is_public: is_public || false,
      organization_id,
      created_by
    });

    const savedTemplate = await newTemplate.save();

    // Poblar los datos para la respuesta
    const populatedTemplate = await DocumentTemplate.findById(savedTemplate._id)
      .populate('category_id', 'name color')
      .populate('created_by', 'name email');

    res.status(201).json({
      success: true,
      data: populatedTemplate,
      message: 'Plantilla creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando plantilla:', error);

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

// Actualizar una plantilla
export const updateDocumentTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { updated_by, ...updateData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de plantilla inválido'
      });
      return;
    }

    if (!updated_by) {
      res.status(400).json({
        error: 'updated_by es requerido'
      });
      return;
    }

    const template = await DocumentTemplate.findById(id);

    if (!template) {
      res.status(404).json({
        error: 'Plantilla no encontrada'
      });
      return;
    }

    // Verificar que la categoría existe si se está cambiando
    if (updateData.category_id && updateData.category_id !== template.category_id?.toString()) {
      if (!mongoose.Types.ObjectId.isValid(updateData.category_id)) {
        res.status(400).json({
          error: 'ID de categoría inválido'
        });
        return;
      }

      const categoryExists = await mongoose.model('DocumentCategory').findById(updateData.category_id);
      if (!categoryExists) {
        res.status(404).json({
          error: 'Categoría no encontrada'
        });
        return;
      }
    }

    // Actualizar campos
    Object.assign(template, updateData);
    template.updated_by = updated_by;

    const updatedTemplate = await template.save();

    // Poblar los datos para la respuesta
    const populatedTemplate = await DocumentTemplate.findById(updatedTemplate._id)
      .populate('category_id', 'name color')
      .populate('updated_by', 'name email');

    res.json({
      success: true,
      data: populatedTemplate,
      message: 'Plantilla actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando plantilla:', error);

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

// Eliminar una plantilla
export const deleteDocumentTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { deleted_by } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de plantilla inválido'
      });
      return;
    }

    if (!deleted_by) {
      res.status(400).json({
        error: 'deleted_by es requerido'
      });
      return;
    }

    const template = await DocumentTemplate.findById(id);

    if (!template) {
      res.status(404).json({
        error: 'Plantilla no encontrada'
      });
      return;
    }

    await DocumentTemplate.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Plantilla eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando plantilla:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Buscar plantillas
export const searchTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id, search_term, document_type } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const query: any = {
      $or: [
        { organization_id: organization_id },
        { is_public: true }
      ]
    };

    if (search_term) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: { $regex: search_term, $options: 'i' } },
          { description: { $regex: search_term, $options: 'i' } },
          { tags: { $in: [new RegExp(search_term as string, 'i')] } }
        ]
      });
    }

    if (document_type) {
      query.document_type = document_type;
    }

    const templates = await DocumentTemplate.find(query)
      .populate('category_id', 'name color')
      .populate('created_by', 'name email')
      .sort({ usage_count: -1, name: 1 });

    res.json({
      success: true,
      data: templates,
      count: templates.length
    });
  } catch (error) {
    console.error('Error buscando plantillas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Incrementar contador de uso
export const incrementTemplateUsage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de plantilla inválido'
      });
      return;
    }

    const template = await DocumentTemplate.findById(id);

    if (!template) {
      res.status(404).json({
        error: 'Plantilla no encontrada'
      });
      return;
    }

    await template.incrementUsage();

    res.json({
      success: true,
      message: 'Contador de uso incrementado'
    });
  } catch (error) {
    console.error('Error incrementando uso de plantilla:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};