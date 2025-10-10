import { Request, Response } from 'express';
import RoadmapTask from '../models/RoadmapTask';

// Función para generar número único de tarea
const generateTaskNumber = async (organizationId: string): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await RoadmapTask.countDocuments({ 
    organization_id: organizationId,
    createdAt: { $gte: new Date(year, 0, 1) }
  });
  return `TASK-${year}-${String(count + 1).padStart(4, '0')}`;
};

// GET /api/roadmap/tasks - Obtener todas las tareas con filtros
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { 
      module, 
      status, 
      priority, 
      phase, 
      type,
      abmType,
      assignedTo,
      tags,
      search 
    } = req.query;
    
    const organizationId = req.headers['x-organization-id'] as string || 'org-default';

    // Construir filtro
    const filter: any = { 
      organization_id: organizationId,
      isActive: true
    };

    if (module) filter.module = module;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (phase) filter.phase = phase;
    if (type) filter.type = type;
    if (abmType) filter.abmType = abmType;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (tags) filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await RoadmapTask.find(filter).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error: any) {
    console.error('[ROADMAP] Error getting tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tareas',
      error: error.message
    });
  }
};

// GET /api/roadmap/tasks/:id - Obtener tarea por ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = req.headers['x-organization-id'] as string || 'org-default';

    const task = await RoadmapTask.findOne({ 
      _id: id, 
      organization_id: organizationId,
      isActive: true
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error: any) {
    console.error('[ROADMAP] Error getting task:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tarea',
      error: error.message
    });
  }
};

// POST /api/roadmap/tasks - Crear nueva tarea
export const createTask = async (req: Request, res: Response) => {
  try {
    const organizationId = req.headers['x-organization-id'] as string || 'org-default';
    const userId = req.headers['x-user-id'] as string || 'system';

    // Generar número único de tarea
    const taskNumber = await generateTaskNumber(organizationId);

    const taskData = {
      ...req.body,
      organization_id: organizationId,
      taskNumber: taskNumber,
      createdBy: userId,
      linkedMdFiles: req.body.linkedMdFiles || [],
      attachedDocuments: req.body.attachedDocuments || []
    };

    const task = new RoadmapTask(taskData);
    await task.save();

    res.status(201).json({
      success: true,
      data: task,
      message: 'Tarea creada exitosamente'
    });
  } catch (error: any) {
    console.error('[ROADMAP] Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear tarea',
      error: error.message
    });
  }
};

// PUT /api/roadmap/tasks/:id - Actualizar tarea
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = req.headers['x-organization-id'] as string || 'org-default';
    const userId = req.headers['x-user-id'] as string || 'system';

    const task = await RoadmapTask.findOneAndUpdate(
      { 
        _id: id, 
        organization_id: organizationId,
        isActive: true
      },
      {
        ...req.body,
        updatedBy: userId,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      data: task,
      message: 'Tarea actualizada exitosamente'
    });
  } catch (error: any) {
    console.error('[ROADMAP] Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar tarea',
      error: error.message
    });
  }
};

// DELETE /api/roadmap/tasks/:id - Eliminar tarea (soft delete)
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = req.headers['x-organization-id'] as string || 'org-default';
    const userId = req.headers['x-user-id'] as string || 'system';

    const task = await RoadmapTask.findOneAndUpdate(
      { 
        _id: id, 
        organization_id: organizationId 
      },
      {
        isActive: false,
        updatedBy: userId,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
  } catch (error: any) {
    console.error('[ROADMAP] Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar tarea',
      error: error.message
    });
  }
};

// PATCH /api/roadmap/tasks/:id/move - Mover tarea (cambiar status y order)
export const moveTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, order } = req.body;
    const organizationId = req.headers['x-organization-id'] as string || 'org-default';
    const userId = req.headers['x-user-id'] as string || 'system';

    const task = await RoadmapTask.findOneAndUpdate(
      { 
        _id: id, 
        organization_id: organizationId,
        isActive: true
      },
      {
        status,
        order,
        updatedBy: userId,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      data: task,
      message: 'Tarea movida exitosamente'
    });
  } catch (error: any) {
    console.error('[ROADMAP] Error moving task:', error);
    res.status(500).json({
      success: false,
      message: 'Error al mover tarea',
      error: error.message
    });
  }
};

// GET /api/roadmap/stats - Obtener estadísticas
export const getStats = async (req: Request, res: Response) => {
  try {
    const organizationId = req.headers['x-organization-id'] as string || 'org-default';

    const tasks = await RoadmapTask.find({ 
      organization_id: organizationId,
      isActive: true
    });

    const stats = {
      total: tasks.length,
      byStatus: {
        backlog: tasks.filter(t => t.status === 'backlog').length,
        todo: tasks.filter(t => t.status === 'todo').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        review: tasks.filter(t => t.status === 'review').length,
        done: tasks.filter(t => t.status === 'done').length
      },
      byPriority: {
        critical: tasks.filter(t => t.priority === 'critical').length,
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length
      },
      byModule: tasks.reduce((acc: any, task) => {
        acc[task.module] = (acc[task.module] || 0) + 1;
        return acc;
      }, {}),
      byPhase: {
        backlog: tasks.filter(t => t.phase === 'backlog').length,
        'v6.1': tasks.filter(t => t.phase === 'v6.1').length,
        'v6.5': tasks.filter(t => t.phase === 'v6.5').length,
        'v7.0': tasks.filter(t => t.phase === 'v7.0').length,
        'v8.0': tasks.filter(t => t.phase === 'v8.0').length
      },
      progress: tasks.length > 0 
        ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)
        : 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('[ROADMAP] Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

