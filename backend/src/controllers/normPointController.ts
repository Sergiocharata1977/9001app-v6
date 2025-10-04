import { Request, Response } from 'express';
import { NormPoint } from '../models/NormPoint';
import mongoose from 'mongoose';

// Obtener todos los puntos de norma
export const getNormPoints = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {
      is_active: true
    };

    // Filtros opcionales
    if (req.query.chapter) {
      query.chapter = parseInt(req.query.chapter as string);
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    if (req.query.is_mandatory !== undefined) {
      query.is_mandatory = req.query.is_mandatory === 'true';
    }

    const normPoints = await NormPoint.find(query)
      .populate('created_by', 'name email')
      .populate('updated_by', 'name email')
      .populate('related_processes', 'name code')
      .populate('related_documents', 'title code type')
      .populate('related_objectives', 'title code')
      .populate('related_indicators', 'name code')
      .sort({ chapter: 1, section: 1 });

    res.json({
      success: true,
      data: normPoints,
      count: normPoints.length
    });
  } catch (error) {
    console.error('Error obteniendo puntos de norma:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener un punto de norma por ID
export const getNormPointById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de punto de norma inválido'
      });
      return;
    }

    const normPoint = await NormPoint.findById(id)
      .populate('created_by', 'name email')
      .populate('updated_by', 'name email')
      .populate('related_processes', 'name code description')
      .populate('related_documents', 'title code type status')
      .populate('related_objectives', 'title code status')
      .populate('related_indicators', 'name code status');

    if (!normPoint) {
      res.status(404).json({
        error: 'Punto de norma no encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: normPoint
    });
  } catch (error) {
    console.error('Error obteniendo punto de norma:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Crear un nuevo punto de norma
export const createNormPoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      code,
      title,
      description,
      chapter,
      section,
      category,
      requirements,
      guidance,
      examples,
      keywords,
      is_mandatory,
      priority,
      related_processes,
      related_documents,
      related_objectives,
      related_indicators,
      created_by
    } = req.body;

    // Validaciones básicas
    if (!code || !title || !chapter || !section || !category || !requirements || !created_by) {
      res.status(400).json({
        error: 'Campos requeridos: code, title, chapter, section, category, requirements, created_by'
      });
      return;
    }

    // Crear el punto de norma
    const newNormPoint = new NormPoint({
      code,
      title,
      description,
      chapter,
      section,
      category,
      requirements,
      guidance,
      examples,
      keywords: keywords || [],
      is_mandatory: is_mandatory !== undefined ? is_mandatory : true,
      priority: priority || 'media',
      related_processes: related_processes || [],
      related_documents: related_documents || [],
      related_objectives: related_objectives || [],
      related_indicators: related_indicators || [],
      created_by
    });

    const savedNormPoint = await newNormPoint.save();

    // Poblar los datos para la respuesta
    const populatedNormPoint = await NormPoint.findById(savedNormPoint._id)
      .populate('created_by', 'name email');

    res.status(201).json({
      success: true,
      data: populatedNormPoint,
      message: 'Punto de norma creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando punto de norma:', error);

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

// Actualizar un punto de norma
export const updateNormPoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { updated_by, ...updateData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de punto de norma inválido'
      });
      return;
    }

    if (!updated_by) {
      res.status(400).json({
        error: 'updated_by es requerido'
      });
      return;
    }

    const normPoint = await NormPoint.findById(id);

    if (!normPoint) {
      res.status(404).json({
        error: 'Punto de norma no encontrado'
      });
      return;
    }

    // Actualizar campos
    Object.assign(normPoint, updateData);
    normPoint.updated_by = updated_by;

    const updatedNormPoint = await normPoint.save();

    // Poblar los datos para la respuesta
    const populatedNormPoint = await NormPoint.findById(updatedNormPoint._id)
      .populate('created_by', 'name email')
      .populate('updated_by', 'name email');

    res.json({
      success: true,
      data: populatedNormPoint,
      message: 'Punto de norma actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando punto de norma:', error);

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

// Agregar proceso relacionado
export const addRelatedProcess = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { process_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(process_id)) {
      res.status(400).json({
        error: 'IDs inválidos'
      });
      return;
    }

    const normPoint = await NormPoint.findById(id);

    if (!normPoint) {
      res.status(404).json({
        error: 'Punto de norma no encontrado'
      });
      return;
    }

    await normPoint.addRelatedProcess(process_id);

    res.json({
      success: true,
      message: 'Proceso relacionado agregado exitosamente'
    });
  } catch (error) {
    console.error('Error agregando proceso relacionado:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Remover proceso relacionado
export const removeRelatedProcess = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, processId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(processId)) {
      res.status(400).json({
        error: 'IDs inválidos'
      });
      return;
    }

    const normPoint = await NormPoint.findById(id);

    if (!normPoint) {
      res.status(404).json({
        error: 'Punto de norma no encontrado'
      });
      return;
    }

    await normPoint.removeRelatedProcess(processId);

    res.json({
      success: true,
      message: 'Proceso relacionado removido exitosamente'
    });
  } catch (error) {
    console.error('Error removiendo proceso relacionado:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Buscar puntos de norma
export const searchNormPoints = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search_term } = req.query;

    if (!search_term) {
      res.status(400).json({
        error: 'search_term es requerido'
      });
      return;
    }

    const normPoints = await NormPoint.searchNormPoints(search_term as string);

    res.json({
      success: true,
      data: normPoints,
      count: normPoints.length
    });
  } catch (error) {
    console.error('Error buscando puntos de norma:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener puntos por capítulo
export const getNormPointsByChapter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chapter } = req.params;

    const chapterNum = parseInt(chapter);
    if (isNaN(chapterNum) || chapterNum < 4 || chapterNum > 10) {
      res.status(400).json({
        error: 'Capítulo inválido. Debe ser un número entre 4 y 10'
      });
      return;
    }

    const normPoints = await NormPoint.findByChapter(chapterNum);

    res.json({
      success: true,
      data: normPoints,
      count: normPoints.length
    });
  } catch (error) {
    console.error('Error obteniendo puntos por capítulo:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener puntos por categoría
export const getNormPointsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;

    const validCategories = ['contexto', 'liderazgo', 'planificacion', 'apoyo', 'operacion', 'evaluacion', 'mejora'];
    if (!validCategories.includes(category)) {
      res.status(400).json({
        error: 'Categoría inválida',
        valid_categories: validCategories
      });
      return;
    }

    const normPoints = await NormPoint.findByCategory(category);

    res.json({
      success: true,
      data: normPoints,
      count: normPoints.length
    });
  } catch (error) {
    console.error('Error obteniendo puntos por categoría:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener puntos obligatorios
export const getMandatoryNormPoints = async (req: Request, res: Response): Promise<void> => {
  try {
    const normPoints = await NormPoint.getMandatoryPoints();

    res.json({
      success: true,
      data: normPoints,
      count: normPoints.length
    });
  } catch (error) {
    console.error('Error obteniendo puntos obligatorios:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Eliminar un punto de norma
export const deleteNormPoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { deleted_by } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de punto de norma inválido'
      });
      return;
    }

    if (!deleted_by) {
      res.status(400).json({
        error: 'deleted_by es requerido'
      });
      return;
    }

    const normPoint = await NormPoint.findById(id);

    if (!normPoint) {
      res.status(404).json({
        error: 'Punto de norma no encontrado'
      });
      return;
    }

    // Soft delete - marcar como inactivo
    normPoint.is_active = false;
    normPoint.updated_by = deleted_by;

    await normPoint.save();

    res.json({
      success: true,
      message: 'Punto de norma eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando punto de norma:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};