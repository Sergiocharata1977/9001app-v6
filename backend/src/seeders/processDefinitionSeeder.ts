import mongoose from 'mongoose';
import { ProcessDefinition } from '../models/ProcessDefinition';

export const processDefinitionSeeder = {
  async seed() {
    try {
      console.log('🌱 Iniciando seeder de ProcessDefinition...');

      // Limpiar datos existentes
      await ProcessDefinition.deleteMany({});
      console.log('🗑️ Datos existentes eliminados');

      // Crear usuario de ejemplo (ObjectId válido)
      const sampleUserId = new mongoose.Types.ObjectId();
      const sampleDepartmentId = new mongoose.Types.ObjectId();

      // Datos de ejemplo para procesos
      const sampleProcesses = [
        {
          code: 'PROC-2024-001',
          name: 'Gestión de Ventas',
          description: 'Proceso integral para la gestión del ciclo de ventas desde prospección hasta cierre',
          content: 'Este proceso define las actividades necesarias para gestionar efectivamente el proceso de ventas...',
          category: 'Comercial',
          type: 'operativo',
          status: 'activo',
          responsible_user_id: sampleUserId,
          department_id: sampleDepartmentId,
          team_members: [sampleUserId],
          organization_id: 1,
          created_by: sampleUserId,
          // Campos ISO 9001
          responsable: 'Gerente de Ventas',
          nivel_critico: 'alto',
          proveedores: 'Marketing, Desarrollo de Producto',
          clientes: 'Clientes finales, Distribuidores',
          recursos_requeridos: 'CRM, Equipo de ventas, Material promocional',
          competencias_requeridas: 'Negociación, Comunicación, Conocimiento del producto',
          metodos_seguimiento: 'Reportes semanales, KPIs de ventas',
          criterios_control: 'Tasa de conversión, Tiempo de ciclo de venta',
          objetivo: 'Maximizar las ventas manteniendo la satisfacción del cliente',
          alcance: 'Desde la generación de leads hasta el cierre de venta',
          entradas: 'Leads, Consultas de clientes, Oportunidades',
          salidas: 'Contratos firmados, Órdenes de compra, Clientes satisfechos',
          // Etapas Kanban
          etapas_proceso: [
            {
              id: 'prospecto',
              nombre: 'Prospecto',
              color: '#3b82f6',
              orden: 1,
              es_inicial: true,
              es_final: false,
              descripcion: 'Cliente potencial identificado'
            },
            {
              id: 'contacto',
              nombre: 'Primer Contacto',
              color: '#8b5cf6',
              orden: 2,
              es_inicial: false,
              es_final: false,
              descripcion: 'Primer acercamiento con el cliente'
            },
            {
              id: 'negociacion',
              nombre: 'Negociación',
              color: '#f59e0b',
              orden: 3,
              es_inicial: false,
              es_final: false,
              descripcion: 'Proceso de negociación activa'
            },
            {
              id: 'cierre',
              nombre: 'Cierre',
              color: '#10b981',
              orden: 4,
              es_inicial: false,
              es_final: true,
              descripcion: 'Venta cerrada exitosamente'
            }
          ]
        },
        {
          code: 'PROC-2024-002',
          name: 'Control de Calidad',
          description: 'Proceso para asegurar la calidad de productos y servicios según estándares ISO 9001',
          content: 'Este proceso establece los controles necesarios para mantener la calidad...',
          category: 'Calidad',
          type: 'operativo',
          status: 'activo',
          responsible_user_id: sampleUserId,
          department_id: sampleDepartmentId,
          team_members: [sampleUserId],
          organization_id: 1,
          created_by: sampleUserId,
          // Campos ISO 9001
          responsable: 'Jefe de Calidad',
          nivel_critico: 'critico',
          proveedores: 'Producción, Proveedores externos',
          clientes: 'Clientes finales, Departamento comercial',
          recursos_requeridos: 'Equipos de medición, Personal calificado, Laboratorio',
          competencias_requeridas: 'Conocimiento de normas ISO, Análisis estadístico',
          metodos_seguimiento: 'Auditorías internas, Indicadores de calidad',
          criterios_control: 'Índice de defectos, Satisfacción del cliente',
          objetivo: 'Asegurar que todos los productos cumplan con los estándares de calidad',
          alcance: 'Desde recepción de materias primas hasta producto terminado',
          entradas: 'Materias primas, Productos en proceso, Especificaciones',
          salidas: 'Productos conformes, Reportes de calidad, Acciones correctivas',
          // Etapas Kanban
          etapas_proceso: [
            {
              id: 'inspeccion',
              nombre: 'Inspección',
              color: '#3b82f6',
              orden: 1,
              es_inicial: true,
              es_final: false,
              descripcion: 'Inspección inicial del producto'
            },
            {
              id: 'analisis',
              nombre: 'Análisis',
              color: '#f59e0b',
              orden: 2,
              es_inicial: false,
              es_final: false,
              descripcion: 'Análisis detallado de conformidad'
            },
            {
              id: 'aprobado',
              nombre: 'Aprobado',
              color: '#10b981',
              orden: 3,
              es_inicial: false,
              es_final: true,
              descripcion: 'Producto aprobado para entrega'
            },
            {
              id: 'rechazado',
              nombre: 'Rechazado',
              color: '#ef4444',
              orden: 4,
              es_inicial: false,
              es_final: true,
              descripcion: 'Producto rechazado - requiere corrección'
            }
          ]
        },
        {
          code: 'PROC-2024-003',
          name: 'Gestión de Recursos Humanos',
          description: 'Proceso integral para la gestión del talento humano en la organización',
          content: 'Este proceso abarca desde el reclutamiento hasta el desarrollo del personal...',
          category: 'Recursos Humanos',
          type: 'apoyo',
          status: 'activo',
          responsible_user_id: sampleUserId,
          department_id: sampleDepartmentId,
          team_members: [sampleUserId],
          organization_id: 1,
          created_by: sampleUserId,
          // Campos ISO 9001
          responsable: 'Gerente de RRHH',
          nivel_critico: 'alto',
          proveedores: 'Gerencias, Consultoras externas',
          clientes: 'Empleados, Gerencias',
          recursos_requeridos: 'Sistema RRHH, Personal especializado',
          competencias_requeridas: 'Psicología organizacional, Legislación laboral',
          metodos_seguimiento: 'Evaluaciones de desempeño, Encuestas de clima',
          criterios_control: 'Rotación de personal, Satisfacción laboral',
          objetivo: 'Gestionar eficientemente el capital humano de la organización',
          alcance: 'Todos los procesos relacionados con el personal',
          entradas: 'Requerimientos de personal, Políticas corporativas',
          salidas: 'Personal competente, Evaluaciones, Planes de desarrollo',
          // Etapas Kanban
          etapas_proceso: [
            {
              id: 'reclutamiento',
              nombre: 'Reclutamiento',
              color: '#3b82f6',
              orden: 1,
              es_inicial: true,
              es_final: false,
              descripcion: 'Búsqueda y atracción de candidatos'
            },
            {
              id: 'seleccion',
              nombre: 'Selección',
              color: '#8b5cf6',
              orden: 2,
              es_inicial: false,
              es_final: false,
              descripcion: 'Evaluación y selección de candidatos'
            },
            {
              id: 'contratacion',
              nombre: 'Contratación',
              color: '#10b981',
              orden: 3,
              es_inicial: false,
              es_final: true,
              descripcion: 'Formalización de la contratación'
            }
          ]
        },
        {
          code: 'PROC-2024-004',
          name: 'Gestión de Compras',
          description: 'Proceso para la adquisición de bienes y servicios necesarios para la operación',
          content: 'Este proceso define las actividades para la gestión eficiente de compras...',
          category: 'Compras',
          type: 'operativo',
          status: 'activo',
          responsible_user_id: sampleUserId,
          department_id: sampleDepartmentId,
          team_members: [sampleUserId],
          organization_id: 1,
          created_by: sampleUserId,
          // Campos ISO 9001
          responsable: 'Jefe de Compras',
          nivel_critico: 'medio',
          proveedores: 'Departamentos solicitantes, Proveedores',
          clientes: 'Departamentos internos, Producción',
          recursos_requeridos: 'Sistema de compras, Personal especializado',
          competencias_requeridas: 'Negociación, Análisis de mercado',
          metodos_seguimiento: 'Evaluación de proveedores, KPIs de compras',
          criterios_control: 'Tiempo de entrega, Calidad de productos',
          objetivo: 'Adquirir bienes y servicios de calidad al mejor costo',
          alcance: 'Desde la solicitud hasta la recepción de bienes',
          entradas: 'Solicitudes de compra, Especificaciones técnicas',
          salidas: 'Órdenes de compra, Bienes recibidos, Evaluaciones',
          // Etapas Kanban
          etapas_proceso: [
            {
              id: 'solicitud',
              nombre: 'Solicitud',
              color: '#3b82f6',
              orden: 1,
              es_inicial: true,
              es_final: false,
              descripcion: 'Solicitud de compra recibida'
            },
            {
              id: 'cotizacion',
              nombre: 'Cotización',
              color: '#f59e0b',
              orden: 2,
              es_inicial: false,
              es_final: false,
              descripcion: 'Solicitud de cotizaciones a proveedores'
            },
            {
              id: 'orden',
              nombre: 'Orden de Compra',
              color: '#8b5cf6',
              orden: 3,
              es_inicial: false,
              es_final: false,
              descripcion: 'Orden de compra emitida'
            },
            {
              id: 'recepcion',
              nombre: 'Recepción',
              color: '#10b981',
              orden: 4,
              es_inicial: false,
              es_final: true,
              descripcion: 'Bienes recibidos y verificados'
            }
          ]
        },
        {
          code: 'PROC-2024-005',
          name: 'Gestión de Producción',
          description: 'Proceso para la planificación y control de la producción de bienes',
          content: 'Este proceso establece las actividades para una producción eficiente...',
          category: 'Producción',
          type: 'operativo',
          status: 'revision',
          responsible_user_id: sampleUserId,
          department_id: sampleDepartmentId,
          team_members: [sampleUserId],
          organization_id: 1,
          created_by: sampleUserId,
          // Campos ISO 9001
          responsable: 'Gerente de Producción',
          nivel_critico: 'critico',
          proveedores: 'Compras, Planificación, Mantenimiento',
          clientes: 'Ventas, Almacén, Clientes finales',
          recursos_requeridos: 'Maquinaria, Personal operativo, Materias primas',
          competencias_requeridas: 'Conocimiento técnico, Gestión de operaciones',
          metodos_seguimiento: 'Indicadores de productividad, Control de calidad',
          criterios_control: 'Eficiencia, Cumplimiento de plazos',
          objetivo: 'Producir bienes de calidad en tiempo y forma',
          alcance: 'Desde la planificación hasta el producto terminado',
          entradas: 'Órdenes de producción, Materias primas, Especificaciones',
          salidas: 'Productos terminados, Reportes de producción',
          // Etapas Kanban
          etapas_proceso: [
            {
              id: 'planificacion',
              nombre: 'Planificación',
              color: '#3b82f6',
              orden: 1,
              es_inicial: true,
              es_final: false,
              descripcion: 'Planificación de la producción'
            },
            {
              id: 'preparacion',
              nombre: 'Preparación',
              color: '#8b5cf6',
              orden: 2,
              es_inicial: false,
              es_final: false,
              descripcion: 'Preparación de materiales y equipos'
            },
            {
              id: 'produccion',
              nombre: 'Producción',
              color: '#f59e0b',
              orden: 3,
              es_inicial: false,
              es_final: false,
              descripcion: 'Proceso de producción activo'
            },
            {
              id: 'terminado',
              nombre: 'Terminado',
              color: '#10b981',
              orden: 4,
              es_inicial: false,
              es_final: true,
              descripcion: 'Producto terminado y verificado'
            }
          ]
        }
      ];

      // Insertar los procesos
      const insertedProcesses = await ProcessDefinition.insertMany(sampleProcesses);
      console.log(`✅ ${insertedProcesses.length} procesos de definición creados exitosamente`);

      // Mostrar resumen
      console.log('\n📊 Resumen de procesos creados:');
      insertedProcesses.forEach((process, index) => {
        console.log(`${index + 1}. ${process.name} (${process.category}) - ${process.status}`);
      });

      return {
        success: true,
        count: insertedProcesses.length,
        processes: insertedProcesses
      };

    } catch (error) {
      console.error('❌ Error en seeder de ProcessDefinition:', error);
      throw error;
    }
  },

  async clear() {
    try {
      console.log('🗑️ Limpiando datos de ProcessDefinition...');
      const result = await ProcessDefinition.deleteMany({});
      console.log(`✅ ${result.deletedCount} procesos eliminados`);
      return result;
    } catch (error) {
      console.error('❌ Error limpiando ProcessDefinition:', error);
      throw error;
    }
  }
};

export default processDefinitionSeeder;