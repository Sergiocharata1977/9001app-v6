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
          id: 'PROC-2024-001',
          name: 'Gestión de Ventas',
          description: 'Proceso integral para la gestión del ciclo de ventas desde prospección hasta cierre',
          owner: 'Gerente de Ventas',
          category: 'Comercial',
          tipo: 'operativo',
          estado: 'activo',
          responsible_user_id: sampleUserId,
          department_id: sampleDepartmentId,
          team_members: [sampleUserId],
          organization_id: '1',
          created_by: sampleUserId,
          // Campos ISO 9001
          codigo: 'PROC-2024-001',
          version: '1.0',
          objetivo: 'Maximizar las ventas manteniendo la satisfacción del cliente',
          alcance: 'Desde la generación de leads hasta el cierre de venta',
          entradas: 'Leads, Consultas de clientes, Oportunidades',
          salidas: 'Contratos firmados, Órdenes de compra, Clientes satisfechos',
          nivel_critico: 'alto'
        },
        {
          id: 'PROC-2024-002',
          name: 'Control de Calidad',
          description: 'Proceso para asegurar la calidad de productos y servicios según estándares ISO 9001',
          owner: 'Jefe de Calidad',
          category: 'Calidad',
          tipo: 'operativo',
          estado: 'activo',
          responsible_user_id: sampleUserId,
          department_id: sampleDepartmentId,
          team_members: [sampleUserId],
          organization_id: '1',
          created_by: sampleUserId,
          // Campos ISO 9001
          codigo: 'PROC-2024-002',
          version: '1.0',
          objetivo: 'Asegurar que todos los productos cumplan con los estándares de calidad',
          alcance: 'Desde recepción de materias primas hasta producto terminado',
          entradas: 'Materias primas, Productos en proceso, Especificaciones',
          salidas: 'Productos conformes, Reportes de calidad, Acciones correctivas',
          nivel_critico: 'alto'
        },
        {
          id: 'PROC-2024-003',
          name: 'Gestión de Recursos Humanos',
          description: 'Proceso integral para la gestión del talento humano en la organización',
          owner: 'Gerente de RRHH',
          category: 'Recursos Humanos',
          tipo: 'apoyo',
          estado: 'activo',
          responsible_user_id: sampleUserId,
          department_id: sampleDepartmentId,
          team_members: [sampleUserId],
          organization_id: '1',
          created_by: sampleUserId,
          // Campos ISO 9001
          codigo: 'PROC-2024-003',
          version: '1.0',
          objetivo: 'Gestionar eficientemente el capital humano de la organización',
          alcance: 'Todos los procesos relacionados con el personal',
          entradas: 'Requerimientos de personal, Políticas corporativas',
          salidas: 'Personal competente, Evaluaciones, Planes de desarrollo',
          nivel_critico: 'alto'
        },
        {
          id: 'PROC-2024-004',
          name: 'Gestión de Compras',
          description: 'Proceso para la adquisición de bienes y servicios necesarios para la operación',
          owner: 'Jefe de Compras',
          category: 'Compras',
          tipo: 'operativo',
          estado: 'activo',
          responsible_user_id: sampleUserId,
          department_id: sampleDepartmentId,
          team_members: [sampleUserId],
          organization_id: '1',
          created_by: sampleUserId,
          // Campos ISO 9001
          codigo: 'PROC-2024-004',
          version: '1.0',
          objetivo: 'Adquirir bienes y servicios de calidad al mejor costo',
          alcance: 'Desde la solicitud hasta la recepción de bienes',
          entradas: 'Solicitudes de compra, Especificaciones técnicas',
          salidas: 'Órdenes de compra, Bienes recibidos, Evaluaciones',
          nivel_critico: 'medio'
        },
        {
          id: 'PROC-2024-005',
          name: 'Gestión de Producción',
          description: 'Proceso para la planificación y control de la producción de bienes',
          owner: 'Gerente de Producción',
          category: 'Producción',
          tipo: 'operativo',
          estado: 'revision',
          responsible_user_id: sampleUserId,
          department_id: sampleDepartmentId,
          team_members: [sampleUserId],
          organization_id: '1',
          created_by: sampleUserId,
          // Campos ISO 9001
          codigo: 'PROC-2024-005',
          version: '1.0',
          objetivo: 'Producir bienes de calidad en tiempo y forma',
          alcance: 'Desde la planificación hasta el producto terminado',
          entradas: 'Órdenes de producción, Materias primas, Especificaciones',
          salidas: 'Productos terminados, Reportes de producción',
          nivel_critico: 'alto'
        }
      ];

      // Insertar los procesos
      const insertedProcesses = await ProcessDefinition.insertMany(sampleProcesses);
      console.log(`✅ ${insertedProcesses.length} procesos de definición creados exitosamente`);

      // Mostrar resumen
      console.log('\n📊 Resumen de procesos creados:');
      insertedProcesses.forEach((process, index) => {
        console.log(`${index + 1}. ${process.name} (${process.category}) - ${process.estado}`);
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