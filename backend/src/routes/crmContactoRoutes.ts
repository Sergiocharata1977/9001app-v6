import express from 'express';
import {
  getAllContactos,
  getContactoById,
  createContacto,
  updateContacto,
  deleteContacto,
  searchContactos
} from '../controllers/crmContactoController';

const router = express.Router();

// GET /api/crm/contactos/search - Búsqueda de contactos
router.get('/search', searchContactos);

// GET /api/crm/contactos - Obtener todos los contactos
router.get('/', getAllContactos);

// GET /api/crm/contactos/:id - Obtener contacto por ID
router.get('/:id', getContactoById);

// POST /api/crm/contactos - Crear nuevo contacto
router.post('/', createContacto);

// PUT /api/crm/contactos/:id - Actualizar contacto
router.put('/:id', updateContacto);

// DELETE /api/crm/contactos/:id - Eliminar contacto
router.delete('/:id', deleteContacto);

export default router;


