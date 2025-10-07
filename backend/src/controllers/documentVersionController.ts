import { Request, Response } from 'express';
import { DocumentVersion } from '../models/DocumentVersion';
import mongoose from 'mongoose';

// Obtener versiones de un documento
export const getDocumentVersions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { document_id } = req.params;
    const { organization_id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(document_id)) {
      res.status(400).json({
        error: 'ID de documento inválido'
      });
      return;
    }

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const versions = await DocumentVersion.find({
      document_id: document_id,
      organization_id: organization_id
    })
      .populate('approved_by', 'name email')
      .populate('rejected_by', 'name email')
      .populate('created_by', 'name email')
      .sort({ version_number: -1 });

    res.json({
      success: true,
      data: versions,
      count: versions.length
    });
  } catch (error) {
    console.error('Error obteniendo versiones:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener una versión específica
export const getDocumentVersionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de versión inválido'
      });
      return;
    }

    const version = await DocumentVersion.findById(id)
      .populate('document_id', 'title')
      .populate('approved_by', 'name email')
      .populate('rejected_by', 'name email')
      .populate('created_by', 'name email');

    if (!version) {
      res.status(404).json({
        error: 'Versión no encontrada'
      });
      return;
    }

    res.json({
      success: true,
      data: version
    });
  } catch (error) {
    console.error('Error obteniendo versión:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Crear una nueva versión
export const createDocumentVersion = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      document_id,
      version_number,
      title,
      description,
      file_path,
      file_name,
      file_size,
      mime_type,
      checksum,
      changes_description,
      organization_id,
      created_by
    } = req.body;

    // Validaciones básicas
    if (!document_id || !version_number || !title || !file_path || !file_name ||
        !file_size || !mime_type || !organization_id || !created_by) {
      res.status(400).json({
        error: 'Campos requeridos: document_id, version_number, title, file_path, file_name, file_size, mime_type, organization_id, created_by'
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(document_id)) {
      res.status(400).json({
        error: 'ID de documento inválido'
      });
      return;
    }

    // Verificar que no exista una versión con el mismo número
    const existingVersion = await DocumentVersion.findOne({
      document_id: document_id,
      version_number: version_number
    });

    if (existingVersion) {
      res.status(400).json({
        error: 'Ya existe una versión con ese número'
      });
      return;
    }

    // Crear la versión
    const newVersion = new DocumentVersion({
      document_id,
      version_number,
      title,
      description,
      file_path,
      file_name,
      file_size,
      mime_type,
      checksum,
      changes_description,
      organization_id,
      created_by
    });

    const savedVersion = await newVersion.save();

    // Poblar los datos para la respuesta
    const populatedVersion = await DocumentVersion.findById(savedVersion._id)
      .populate('document_id', 'title')
      .populate('created_by', 'name email');

    res.status(201).json({
      success: true,
      data: populatedVersion,
      message: 'Versión creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando versión:', error);

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

// Aprobar una versión
export const approveDocumentVersion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { approved_by, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de versión inválido'
      });
      return;
    }

    if (!approved_by) {
      res.status(400).json({
        error: 'approved_by es requerido'
      });
      return;
    }

    const version = await DocumentVersion.findById(id);

    if (!version) {
      res.status(404).json({
        error: 'Versión no encontrada'
      });
      return;
    }

    // Aprobar la versión usando el método del modelo
    await version.approve(new mongoose.Types.ObjectId(approved_by), comment);

    // Poblar los datos para la respuesta
    const populatedVersion = await DocumentVersion.findById(version._id)
      .populate('document_id', 'title')
      .populate('approved_by', 'name email')
      .populate('created_by', 'name email');

    res.json({
      success: true,
      data: populatedVersion,
      message: 'Versión aprobada exitosamente'
    });
  } catch (error) {
    console.error('Error aprobando versión:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Rechazar una versión
export const rejectDocumentVersion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rejected_by, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de versión inválido'
      });
      return;
    }

    if (!rejected_by || !reason) {
      res.status(400).json({
        error: 'rejected_by y reason son requeridos'
      });
      return;
    }

    const version = await DocumentVersion.findById(id);

    if (!version) {
      res.status(404).json({
        error: 'Versión no encontrada'
      });
      return;
    }

    // Rechazar la versión usando el método del modelo
    await version.reject(new mongoose.Types.ObjectId(rejected_by), reason);

    // Poblar los datos para la respuesta
    const populatedVersion = await DocumentVersion.findById(version._id)
      .populate('document_id', 'title')
      .populate('rejected_by', 'name email')
      .populate('created_by', 'name email');

    res.json({
      success: true,
      data: populatedVersion,
      message: 'Versión rechazada exitosamente'
    });
  } catch (error) {
    console.error('Error rechazando versión:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener la versión actual de un documento
export const getCurrentVersion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { document_id } = req.params;
    const { organization_id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(document_id)) {
      res.status(400).json({
        error: 'ID de documento inválido'
      });
      return;
    }

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const currentVersion = await DocumentVersion.findOne({
      document_id: document_id,
      organization_id: organization_id,
      is_current_version: true
    })
      .populate('document_id', 'title')
      .populate('approved_by', 'name email')
      .populate('created_by', 'name email');

    if (!currentVersion) {
      res.status(404).json({
        error: 'No se encontró una versión actual para este documento'
      });
      return;
    }

    res.json({
      success: true,
      data: currentVersion
    });
  } catch (error) {
    console.error('Error obteniendo versión actual:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};