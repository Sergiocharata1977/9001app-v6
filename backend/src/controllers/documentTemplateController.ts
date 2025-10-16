import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { DocumentTemplate } from '../models/DocumentTemplate';
import { cacheService } from '../services/CacheService';

// Obtener todas las plantillas con paginación
export const getDocumentTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id, category_id, document_type, is_public, search } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    // Parámetros de paginación
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

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

    // Búsqueda por nombre o descripción
    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    // Generar cache key
    const cacheKey = `documents:${JSON.stringify(query)}:${page}:${limit}`;
    
    // Intentar obtener del cache
    const cached = cacheService.get<any>(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    // Ejecutar query optimizada con paginación
    const [templates, total] = await Promise.all([
      DocumentTemplate.find(query)
        .select('name description document_type category_id is_public usage_count created_by') // Solo campos necesarios
        .populate('category_id', 'name color')
        .populate('created_by', 'name email')
        .sort({ usage_count: -1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Retorna plain objects (más rápido)
      DocumentTemplate.countDocuments(query)
    ]);

    const response = {
      success: true,
      data: templates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + templates.length < total
      }
    };

    // Guardar en cache (5 minutos)
    cacheService.set(cacheKey, response, 5 * 60 * 1000);

    res.json(response);
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

    // Invalidar cache de documentos
    cacheService.invalidatePattern('^documents:');

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