import { Request, Response } from 'express';
import { Personnel } from '../models/Personnel';

// Obtener todo el personal
export const getPersonnel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const query: any = {
      organization_id: parseInt(organization_id as string)
    };

    // Filtros opcionales
    if (req.query.estado) {
      query.estado = req.query.estado;
    }

    if (req.query.tipo_personal) {
      query.tipo_personal = req.query.tipo_personal;
    }

    if (req.query.supervisor_id) {
      query.supervisor_id = req.query.supervisor_id;
    }

    const personnel = await Personnel.find(query)
      .populate('supervisor_id', 'nombres apellidos')
      .sort({ apellidos: 1, nombres: 1 });

    res.json({
      success: true,
      data: personnel,
      count: personnel.length
    });
  } catch (error) {
    console.error('Error obteniendo personal:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener una persona por ID
export const getPersonnelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const person = await Personnel.findOne({ id })
      .populate('supervisor_id', 'nombres apellidos');

    if (!person) {
      res.status(404).json({
        error: 'Persona no encontrada'
      });
      return;
    }

    res.json({
      success: true,
      data: person
    });
  } catch (error) {
    console.error('Error obteniendo persona:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Crear una nueva persona
export const createPersonnel = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      id,
      organization_id,
      nombres,
      apellidos,
      email,
      telefono,
      documento_identidad,
      fecha_nacimiento,
      nacionalidad,
      direccion,
      telefono_emergencia,
      fecha_contratacion,
      numero_legajo,
      estado,
      meta_mensual,
      comision_porcentaje,
      supervisor_id,
      especialidad_ventas,
      fecha_inicio_ventas,
      tipo_personal,
      zona_venta
    } = req.body;

    // Validaciones básicas
    if (!id || !organization_id || !nombres || !apellidos || !email) {
      res.status(400).json({
        error: 'Campos requeridos: id, organization_id, nombres, apellidos, email'
      });
      return;
    }

    // Verificar que el ID no exista
    const existingPerson = await Personnel.findOne({ id });
    if (existingPerson) {
      res.status(400).json({
        error: 'Ya existe una persona con este ID'
      });
      return;
    }

    // Verificar que el email no exista
    const existingEmail = await Personnel.findOne({ email, organization_id });
    if (existingEmail) {
      res.status(400).json({
        error: 'Ya existe una persona con este email en la organización'
      });
      return;
    }

    // Crear la persona
    const newPerson = new Personnel({
      id,
      organization_id,
      nombres,
      apellidos,
      email,
      telefono,
      documento_identidad,
      fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : undefined,
      nacionalidad,
      direccion,
      telefono_emergencia,
      fecha_contratacion: fecha_contratacion ? new Date(fecha_contratacion) : undefined,
      numero_legajo,
      estado: estado || 'Activo',
      meta_mensual: meta_mensual || 0,
      comision_porcentaje: comision_porcentaje || 0,
      supervisor_id,
      especialidad_ventas,
      fecha_inicio_ventas: fecha_inicio_ventas ? new Date(fecha_inicio_ventas) : undefined,
      tipo_personal: tipo_personal || 'administrativo',
      zona_venta
    });

    const savedPerson = await newPerson.save();

    // Poblar los datos para la respuesta
    const populatedPerson = await Personnel.findById(savedPerson._id)
      .populate('supervisor_id', 'nombres apellidos');

    res.status(201).json({
      success: true,
      data: populatedPerson,
      message: 'Persona creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando persona:', error);

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

// Actualizar una persona
export const updatePersonnel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const person = await Personnel.findOne({ id });

    if (!person) {
      res.status(404).json({
        error: 'Persona no encontrada'
      });
      return;
    }

    // Convertir fechas si existen
    if (updateData.fecha_nacimiento) {
      updateData.fecha_nacimiento = new Date(updateData.fecha_nacimiento);
    }
    if (updateData.fecha_contratacion) {
      updateData.fecha_contratacion = new Date(updateData.fecha_contratacion);
    }
    if (updateData.fecha_inicio_ventas) {
      updateData.fecha_inicio_ventas = new Date(updateData.fecha_inicio_ventas);
    }

    // Actualizar campos
    Object.assign(person, updateData);

    const updatedPerson = await person.save();

    // Poblar los datos para la respuesta
    const populatedPerson = await Personnel.findById(updatedPerson._id)
      .populate('supervisor_id', 'nombres apellidos');

    res.json({
      success: true,
      data: populatedPerson,
      message: 'Persona actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando persona:', error);

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

// Eliminar una persona
export const deletePersonnel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const person = await Personnel.findOne({ id });

    if (!person) {
      res.status(404).json({
        error: 'Persona no encontrada'
      });
      return;
    }

    await Personnel.deleteOne({ id });

    res.json({
      success: true,
      message: 'Persona eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando persona:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};