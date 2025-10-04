import mongoose from 'mongoose';
import { User } from '../models/User';
import { Department } from '../models/Department';
import { Organization } from '../models/Organization';

export const userSeeder = {
  async seed() {
    try {
      console.log('🌱 Iniciando seeder de Users, Departments y Organizations...');

      // Limpiar datos existentes
      await User.deleteMany({});
      await Department.deleteMany({});
      await Organization.deleteMany({});
      console.log('🗑️ Datos existentes eliminados');

      // Crear organización
      const organization = new Organization({
        name: 'Empresa Demo ISO 9001',
        description: 'Organización de ejemplo para el sistema de gestión ISO 9001'
      });
      await organization.save();
      console.log('✅ Organización creada');

      // Crear usuarios de ejemplo
      const users = [
        {
          name: 'Juan Pérez',
          email: 'juan.perez@empresa.com',
          role: 'admin',
          organization_id: 1
        },
        {
          name: 'María García',
          email: 'maria.garcia@empresa.com',
          role: 'manager',
          organization_id: 1
        },
        {
          name: 'Carlos López',
          email: 'carlos.lopez@empresa.com',
          role: 'user',
          organization_id: 1
        },
        {
          name: 'Ana Martínez',
          email: 'ana.martinez@empresa.com',
          role: 'user',
          organization_id: 1
        },
        {
          name: 'Roberto Silva',
          email: 'roberto.silva@empresa.com',
          role: 'viewer',
          organization_id: 1
        }
      ];

      const insertedUsers = await User.insertMany(users);
      console.log(`✅ ${insertedUsers.length} usuarios creados`);

      // Crear departamentos
      const departments = [
        {
          name: 'Gerencia General',
          description: 'Dirección estratégica de la organización',
          responsible_user_id: insertedUsers[0]._id,
          organization_id: 1
        },
        {
          name: 'Recursos Humanos',
          description: 'Gestión del talento humano',
          responsible_user_id: insertedUsers[1]._id,
          organization_id: 1
        },
        {
          name: 'Ventas',
          description: 'Gestión comercial y ventas',
          responsible_user_id: insertedUsers[2]._id,
          organization_id: 1
        },
        {
          name: 'Producción',
          description: 'Operaciones de producción',
          responsible_user_id: insertedUsers[3]._id,
          organization_id: 1
        },
        {
          name: 'Calidad',
          description: 'Control y aseguramiento de la calidad',
          responsible_user_id: insertedUsers[1]._id,
          organization_id: 1
        },
        {
          name: 'Compras',
          description: 'Adquisiciones y gestión de proveedores',
          responsible_user_id: insertedUsers[4]._id,
          organization_id: 1
        }
      ];

      const insertedDepartments = await Department.insertMany(departments);
      console.log(`✅ ${insertedDepartments.length} departamentos creados`);

      // Mostrar resumen
      console.log('\n📊 Resumen de datos creados:');
      console.log(`- 1 organización: ${organization.name}`);
      console.log(`- ${insertedUsers.length} usuarios`);
      console.log(`- ${insertedDepartments.length} departamentos`);

      return {
        success: true,
        organization,
        users: insertedUsers,
        departments: insertedDepartments
      };

    } catch (error) {
      console.error('❌ Error en seeder de Users:', error);
      throw error;
    }
  },

  async clear() {
    try {
      console.log('🗑️ Limpiando datos de Users, Departments y Organizations...');
      const userResult = await User.deleteMany({});
      const deptResult = await Department.deleteMany({});
      const orgResult = await Organization.deleteMany({});
      
      console.log(`✅ ${userResult.deletedCount} usuarios eliminados`);
      console.log(`✅ ${deptResult.deletedCount} departamentos eliminados`);
      console.log(`✅ ${orgResult.deletedCount} organizaciones eliminadas`);
      
      return { userResult, deptResult, orgResult };
    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
      throw error;
    }
  }
};

export default userSeeder;