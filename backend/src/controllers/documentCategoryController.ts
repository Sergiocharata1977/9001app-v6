import { Request, Response } from 'express';
import { DocumentCategory } from '../models/DocumentCategory';
import mongoose from 'mongoose';

// Obtener todas las categorías
export const getDocumentCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id, parent_id } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const query: any = {
      organization_id: organization_id,
      is_active: true
    };

    if (parent_id) {
      query.parent_id = parent_id;
    }

    const categories = await DocumentCategory.find(query)
      .populate('parent_id', 'name')
      .populate('created_by', 'name email')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener una categoría por ID
export const getDocumentCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de categoría inválido'
      });
      return;
    }

    const category = await DocumentCategory.findById(id)
      .populate('parent_id', 'name')
      .populate('created_by', 'name email')
      .populate('updated_by', 'name email');

    if (!category) {
      res.status(404).json({
        error: 'Categoría no encontrada'
      });
      return;
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Crear una nueva categoría
export const createDocumentCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      parent_id,
      color,
      icon,
      organization_id,
      created_by
    } = req.body;

    // Validaciones básicas
    if (!name || !organization_id || !created_by) {
      res.status(400).json({
        error: 'Campos requeridos: name, organization_id, created_by'
      });
      return;
    }

    // Verificar que la categoría padre existe si se proporciona
    if (parent_id) {
      if (!mongoose.Types.ObjectId.isValid(parent_id)) {
        res.status(400).json({
          error: 'ID de categoría padre inválido'
        });
        return;
      }

      const parentCategory = await DocumentCategory.findById(parent_id);
      if (!parentCategory) {
        res.status(404).json({
          error: 'Categoría padre no encontrada'
        });
        return;
      }
    }

    // Crear la categoría
    const newCategory = new DocumentCategory({
      name,
      description,
      parent_id,
      color,
      icon,
      organization_id,
      created_by
    });

    const savedCategory = await newCategory.save();

    // Poblar los datos para la respuesta
    const populatedCategory = await DocumentCategory.findById(savedCategory._id)
      .populate('parent_id', 'name')
      .populate('created_by', 'name email');

    res.status(201).json({
      success: true,
      data: populatedCategory,
      message: 'Categoría creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando categoría:', error);

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

// Actualizar una categoría
export const updateDocumentCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { updated_by, ...updateData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de categoría inválido'
      });
      return;
    }

    if (!updated_by) {
      res.status(400).json({
        error: 'updated_by es requerido'
      });
      return;
    }

    const category = await DocumentCategory.findById(id);

    if (!category) {
      res.status(404).json({
        error: 'Categoría no encontrada'
      });
      return;
    }

    // Verificar que la categoría padre existe si se está cambiando
    if (updateData.parent_id && updateData.parent_id !== category.parent_id?.toString()) {
      if (!mongoose.Types.ObjectId.isValid(updateData.parent_id)) {
        res.status(400).json({
          error: 'ID de categoría padre inválido'
        });
        return;
      }

      const parentCategory = await DocumentCategory.findById(updateData.parent_id);
      if (!parentCategory) {
        res.status(404).json({
          error: 'Categoría padre no encontrada'
        });
        return;
      }
    }

    // Actualizar campos
    Object.assign(category, updateData);
    category.updated_by = updated_by;

    const updatedCategory = await category.save();

    // Poblar los datos para la respuesta
    const populatedCategory = await DocumentCategory.findById(updatedCategory._id)
      .populate('parent_id', 'name')
      .populate('updated_by', 'name email');

    res.json({
      success: true,
      data: populatedCategory,
      message: 'Categoría actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando categoría:', error);

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

// Eliminar (desactivar) una categoría
export const deleteDocumentCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { deleted_by } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de categoría inválido'
      });
      return;
    }

    if (!deleted_by) {
      res.status(400).json({
        error: 'deleted_by es requerido'
      });
      return;
    }

    const category = await DocumentCategory.findById(id);

    if (!category) {
      res.status(404).json({
        error: 'Categoría no encontrada'
      });
      return;
    }

    // Verificar si tiene subcategorías
    const childCategories = await DocumentCategory.countDocuments({
      parent_id: id,
      is_active: true
    });

    if (childCategories > 0) {
      res.status(400).json({
        error: 'No se puede eliminar una categoría que tiene subcategorías'
      });
      return;
    }

    // Soft delete - marcar como inactiva
    category.is_active = false;
    category.updated_by = deleted_by;

    await category.save();

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener árbol de categorías
export const getCategoryTree = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const categories = await DocumentCategory.find({
      organization_id: organization_id,
      is_active: true
    }).sort({ name: 1 });

    // Construir árbol
    const buildTree = (parentId: mongoose.Types.ObjectId | null = null): any[] => {
      return categories
        .filter(cat => cat.parent_id?.toString() === parentId?.toString())
        .map(cat => ({
          ...cat.toObject(),
          children: buildTree(cat._id)
        }));
    };

    const tree = buildTree();

    res.json({
      success: true,
      data: tree
    });
  } catch (error) {
    console.error('Error obteniendo árbol de categorías:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};