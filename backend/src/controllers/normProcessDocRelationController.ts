import { Request, Response } from 'express';
import { NormProcessDocRelation } from '../models/NormProcessDocRelation';
import { NormPoint } from '../models/NormPoint';
import { ProcessDefinition } from '../models/ProcessDefinition';
import { ProcessDocument } from '../models/ProcessDocument';
import mongoose from 'mongoose';

// GET todas las relaciones de una organización
export const getRelations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      res.status(400).json({ error: 'organization_id es requerido' });
      return;
    }

    const relations = await NormProcessDocRelation.find({
      organization_id,
      is_active: true
    })
    .populate('norm_point_id', 'code title description chapter category')
    .populate('process_id', 'name codigo tipo estado')
    .populate('document_ids', 'titulo tipo_documento version estado')
    .populate('responsible_user_id', 'name email')
    .sort({ 'norm_point_id.chapter': 1, 'norm_point_id.section': 1 });

    res.json({
      success: true,
      data: relations,
      count: relations.length
    });
  } catch (error) {
    console.error('Error obteniendo relaciones:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// GET relación por ID
export const getRelationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    const relation = await NormProcessDocRelation.findById(id)
      .populate('norm_point_id')
      .populate('process_id')
      .populate('document_ids')
      .populate('responsible_user_id', 'name email')
      .populate('audit_comments.auditor_id', 'name email');

    if (!relation) {
      res.status(404).json({ error: 'Relación no encontrada' });
      return;
    }

    res.json({
      success: true,
      data: relation
    });
  } catch (error) {
    console.error('Error obteniendo relación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// POST crear relación
export const createRelation = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      norm_point_id,
      process_id,
      document_ids,
      compliance_status,
      compliance_percentage,
      evidence_description,
      evidence_files,
      responsible_user_id,
      verification_date,
      next_review_date,
      organization_id,
      created_by
    } = req.body;

    // Validaciones
    if (!norm_point_id || !process_id || !organization_id || !created_by) {
      res.status(400).json({
        error: 'Campos requeridos: norm_point_id, process_id, organization_id, created_by'
      });
      return;
    }

    // Verificar que existan los documentos referenciados
    const normPoint = await NormPoint.findById(norm_point_id);
    if (!normPoint) {
      res.status(404).json({ error: 'Punto de norma no encontrado' });
      return;
    }

    const process = await ProcessDefinition.findById(process_id);
    if (!process) {
      res.status(404).json({ error: 'Proceso no encontrado' });
      return;
    }

    // Crear relación
    const newRelation = new NormProcessDocRelation({
      norm_point_id,
      process_id,
      document_ids: document_ids || [],
      compliance_status: compliance_status || 'pendiente',
      compliance_percentage: compliance_percentage || 0,
      evidence_description,
      evidence_files: evidence_files || [],
      responsible_user_id,
      verification_date,
      next_review_date,
      organization_id,
      created_by
    });

    const savedRelation = await newRelation.save();

    // Actualizar relaciones bidireccionales
    await NormPoint.findByIdAndUpdate(
      norm_point_id,
      { $addToSet: { related_processes: process_id } }
    );

    res.status(201).json({
      success: true,
      data: savedRelation,
      message: 'Relación creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando relación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// PUT actualizar relación
export const updateRelation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { updated_by, ...updateData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    if (!updated_by) {
      res.status(400).json({ error: 'updated_by es requerido' });
      return;
    }

    const relation = await NormProcessDocRelation.findById(id);
    if (!relation) {
      res.status(404).json({ error: 'Relación no encontrada' });
      return;
    }

    Object.assign(relation, updateData);
    relation.updated_by = updated_by;

    const updatedRelation = await relation.save();

    res.json({
      success: true,
      data: updatedRelation,
      message: 'Relación actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando relación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// DELETE eliminar relación (soft delete)
export const deleteRelation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    const relation = await NormProcessDocRelation.findById(id);
    if (!relation) {
      res.status(404).json({ error: 'Relación no encontrada' });
      return;
    }

    relation.is_active = false;
    await relation.save();

    res.json({
      success: true,
      message: 'Relación eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando relación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// GET dashboard de cumplimiento
export const getComplianceDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      res.status(400).json({ error: 'organization_id es requerido' });
      return;
    }

    // Total de puntos de norma
    const totalNormPoints = await NormPoint.countDocuments({ is_active: true });

    // Puntos cubiertos (con relación)
    const coveredPoints = await NormProcessDocRelation.distinct('norm_point_id', {
      organization_id,
      is_active: true
    });

    const coveredCount = coveredPoints.length;
    const uncoveredCount = totalNormPoints - coveredCount;
    const compliancePercentage = totalNormPoints > 0
      ? Math.round((coveredCount / totalNormPoints) * 100)
      : 0;

    // Cumplimiento por capítulo
    const relations = await NormProcessDocRelation.find({
      organization_id,
      is_active: true
    }).populate('norm_point_id', 'chapter category');

    const complianceByChapter = await Promise.all([4, 5, 6, 7, 8, 9, 10].map(async (chapter) => {
      const chapterPoints = await NormPoint.countDocuments({ chapter, is_active: true });
      const chapterCovered = relations.filter(
        r => r.norm_point_id && (r.norm_point_id as any).chapter === chapter
      ).length;

      return {
        chapter,
        title: getChapterTitle(chapter),
        total_points: chapterPoints,
        covered: chapterCovered,
        percentage: chapterPoints > 0 ? Math.round((chapterCovered / chapterPoints) * 100) : 0
      };
    }));

    // Gaps críticos (puntos obligatorios sin cubrir)
    const mandatoryPoints = await NormPoint.find({
      is_mandatory: true,
      is_active: true,
      _id: { $nin: coveredPoints }
    }).limit(10);

    const criticalGaps = mandatoryPoints.map(point => ({
      norm_point: {
        code: point.code,
        title: point.title,
        chapter: point.chapter,
        priority: point.priority
      },
      risk_level: point.priority === 'alta' ? 'alto' : point.priority === 'media' ? 'medio' : 'bajo'
    }));

    // Próximas revisiones
    const today = new Date();
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const upcomingReviews = await NormProcessDocRelation.find({
      organization_id,
      is_active: true,
      next_review_date: { $gte: today, $lte: in30Days }
    })
    .populate('norm_point_id', 'code title')
    .populate('process_id', 'name')
    .sort({ next_review_date: 1 })
    .limit(10);

    const upcomingReviewsData = upcomingReviews.map(rel => ({
      relation_id: rel._id,
      norm_point: (rel.norm_point_id as any),
      process: (rel.process_id as any),
      next_review_date: rel.next_review_date,
      days_until_review: Math.ceil(
        (rel.next_review_date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )
    }));

    res.json({
      success: true,
      data: {
        summary: {
          total_norm_points: totalNormPoints,
          covered_points: coveredCount,
          uncovered_points: uncoveredCount,
          compliance_percentage: compliancePercentage
        },
        compliance_by_chapter: complianceByChapter,
        critical_gaps: criticalGaps,
        upcoming_reviews: upcomingReviewsData
      }
    });
  } catch (error) {
    console.error('Error obteniendo dashboard:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

function getChapterTitle(chapter: number): string {
  const titles: { [key: number]: string } = {
    4: 'Contexto de la Organización',
    5: 'Liderazgo',
    6: 'Planificación',
    7: 'Apoyo',
    8: 'Operación',
    9: 'Evaluación del Desempeño',
    10: 'Mejora'
  };
  return titles[chapter] || `Capítulo ${chapter}`;
}