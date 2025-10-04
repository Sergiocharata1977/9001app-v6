const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware básico
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'Servidor de prueba funcionando',
    timestamp: new Date().toISOString()
  });
});

// Base de datos en memoria para pruebas
let processes = [
  {
    _id: '1',
    name: 'Proceso de Ventas',
    code: 'PV-001',
    version: '1.0',
    status: 'activo',
    description: 'Garantizar la satisfacción del cliente mediante un proceso de ventas eficiente y transparente',
    funciones_involucradas: 'Ventas, Marketing, Atención al Cliente',
    alcance: 'Todas las actividades de ventas de productos y servicios de la empresa',
    responsible_user_id: { name: 'Gerente de Ventas' },
    registros: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Proceso de Compras',
    code: 'PC-001',
    version: '1.2',
    status: 'activo',
    description: 'Asegurar la adquisición eficiente de bienes y servicios necesarios para la operación',
    funciones_involucradas: 'Compras, Finanzas, Almacén',
    alcance: 'Todas las actividades de adquisición de bienes y servicios',
    responsible_user_id: { name: 'Gerente de Compras' },
    registros: [{}, {}], // 2 registros simulados
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Proceso de Recursos Humanos',
    code: 'PRH-001',
    version: '2.0',
    status: 'activo',
    description: 'Gestionar eficientemente el talento humano de la organización',
    funciones_involucradas: 'RRHH, Administración, Gerencia',
    alcance: 'Todas las actividades relacionadas con el personal',
    responsible_user_id: { name: 'Gerente de RRHH' },
    registros: [{}], // 1 registro simulado
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// GET - Obtener todos los procesos
app.get('/api/process-definitions', (req, res) => {
  res.json({
    success: true,
    data: processes,
    count: processes.length
  });
});

// POST - Crear nuevo proceso
app.post('/api/process-definitions', (req, res) => {
  try {
    const newProcess = {
      _id: Date.now().toString(),
      ...req.body,
      registros: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    processes.push(newProcess);
    
    res.status(201).json({
      success: true,
      data: newProcess,
      message: 'Proceso creado exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error creando proceso',
      message: error.message
    });
  }
});

// PUT - Actualizar proceso
app.put('/api/process-definitions/:id', (req, res) => {
  try {
    const processId = req.params.id;
    const processIndex = processes.findIndex(p => p._id === processId);
    
    if (processIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Proceso no encontrado'
      });
    }
    
    processes[processIndex] = {
      ...processes[processIndex],
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: processes[processIndex],
      message: 'Proceso actualizado exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error actualizando proceso',
      message: error.message
    });
  }
});

// DELETE - Eliminar proceso
app.delete('/api/process-definitions/:id', (req, res) => {
  try {
    const processId = req.params.id;
    const processIndex = processes.findIndex(p => p._id === processId);
    
    if (processIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Proceso no encontrado'
      });
    }
    
    processes.splice(processIndex, 1);
    
    res.json({
      success: true,
      message: 'Proceso eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error eliminando proceso',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de prueba ejecutándose en puerto ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});