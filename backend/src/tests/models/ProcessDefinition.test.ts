/**
 * TESTS UNITARIOS - ProcessDefinition Model
 * 
 * Tests específicos para el modelo ProcessDefinition
 * Valida esquemas, validaciones y funcionalidades del modelo
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { ProcessDefinition } from '../../models/ProcessDefinition';

// Mock data
const validProcessData = {
  id: 'PROC-TEST-001',
  name: 'Proceso de Prueba Unitaria',
  description: 'Descripción del proceso de prueba',
  owner: 'Test Owner',
  organization_id: 'org-001',
  version: '1.0',
  tipo: 'operativo' as const,
  categoria: 'testing',
  nivel_critico: 'medio' as const,
  estado: 'activo' as const,
  created_by: 'test-user',
  updated_by: 'test-user'
};

describe('ProcessDefinition Model', () => {
  
  beforeAll(async () => {
    // Conectar a base de datos de test
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/test_db');
    }
  });

  afterAll(async () => {
    // Limpiar y cerrar conexión
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Limpiar colección antes de cada test
    await ProcessDefinition.deleteMany({});
  });

  describe('Schema Validation', () => {
    
    test('debe crear proceso con datos válidos', async () => {
      const process = new ProcessDefinition(validProcessData);
      const savedProcess = await process.save();
      
      expect(savedProcess._id).toBeDefined();
      expect(savedProcess.id).toBe(validProcessData.id);
      expect(savedProcess.name).toBe(validProcessData.name);
      expect(savedProcess.organization_id).toBe(validProcessData.organization_id);
    });

    test('debe fallar sin campos obligatorios', async () => {
      const requiredFields = ['id', 'name', 'description', 'owner', 'organization_id'];
      
      for (const field of requiredFields) {
        const invalidData = { ...validProcessData };
        delete (invalidData as any)[field];
        
        const process = new ProcessDefinition(invalidData);
        
        await expect(process.save()).rejects.toThrow();
      }
    });

    test('debe validar formato de ID único', async () => {
      // Crear primer proceso
      const process1 = new ProcessDefinition(validProcessData);
      await process1.save();
      
      // Intentar crear segundo proceso con mismo ID
      const process2 = new ProcessDefinition(validProcessData);
      
      await expect(process2.save()).rejects.toThrow();
    });

    test('debe validar longitudes máximas', async () => {
      const longData = {
        ...validProcessData,
        name: 'a'.repeat(201), // Excede límite de 200
        description: 'b'.repeat(1001), // Excede límite de 1000
        owner: 'c'.repeat(101) // Excede límite de 100
      };
      
      const process = new ProcessDefinition(longData);
      
      await expect(process.save()).rejects.toThrow();
    });

    test('debe validar valores enum', async () => {
      const invalidEnums = [
        { tipo: 'invalido' },
        { nivel_critico: 'super_alto' },
        { estado: 'eliminado' }
      ];
      
      for (const invalidEnum of invalidEnums) {
        const invalidData = { ...validProcessData, ...invalidEnum };
        const process = new ProcessDefinition(invalidData);
        
        await expect(process.save()).rejects.toThrow();
      }
    });

    test('debe validar formato de organization_id', async () => {
      const invalidOrgIds = ['org-1', 'organization-001', '001', 'org001'];
      
      for (const orgId of invalidOrgIds) {
        const invalidData = { ...validProcessData, organization_id: orgId };
        const process = new ProcessDefinition(invalidData);
        
        await expect(process.save()).rejects.toThrow();
      }
    });
  });

  describe('Default Values', () => {
    
    test('debe asignar valores por defecto', async () => {
      const minimalData = {
        id: 'PROC-MIN-001',
        name: 'Proceso Mínimo',
        description: 'Descripción mínima',
        owner: 'Owner',
        organization_id: 'org-001'
      };
      
      const process = new ProcessDefinition(minimalData);
      const savedProcess = await process.save();
      
      expect(savedProcess.version).toBe('1.0');
      expect(savedProcess.tipo).toBe('operativo');
      expect(savedProcess.nivel_critico).toBe('medio');
      expect(savedProcess.estado).toBe('activo');
      expect(savedProcess.is_active).toBe(true);
      expect(savedProcess.is_archived).toBe(false);
    });

    test('debe asignar timestamps automáticamente', async () => {
      const process = new ProcessDefinition(validProcessData);
      const savedProcess = await process.save();
      
      expect(savedProcess.created_at).toBeInstanceOf(Date);
      expect(savedProcess.updated_at).toBeInstanceOf(Date);
    });
  });

  describe('Indexes', () => {
    
    test('debe tener índice compuesto en organization_id + id', async () => {
      const indexes = await ProcessDefinition.collection.getIndexes();
      
      const hasCompositeIndex = Object.keys(indexes).some(key => 
        key.includes('organization_id') && key.includes('id')
      );
      
      expect(hasCompositeIndex).toBe(true);
    });

    test('debe tener índice en campos de filtro', async () => {
      const indexes = await ProcessDefinition.collection.getIndexes();
      
      const expectedIndexFields = ['organization_id', 'estado', 'tipo', 'is_active'];
      
      expectedIndexFields.forEach(field => {
        const hasIndex = Object.keys(indexes).some(key => key.includes(field));
        expect(hasIndex).toBe(true);
      });
    });
  });

  describe('Soft Delete', () => {
    
    test('debe marcar como inactivo en lugar de eliminar', async () => {
      const process = new ProcessDefinition(validProcessData);
      const savedProcess = await process.save();
      
      // Simular soft delete
      savedProcess.is_active = false;
      savedProcess.deleted_at = new Date();
      await savedProcess.save();
      
      expect(savedProcess.is_active).toBe(false);
      expect(savedProcess.deleted_at).toBeInstanceOf(Date);
    });

    test('debe permitir restaurar proceso eliminado', async () => {
      const process = new ProcessDefinition(validProcessData);
      const savedProcess = await process.save();
      
      // Soft delete
      savedProcess.is_active = false;
      savedProcess.deleted_at = new Date();
      await savedProcess.save();
      
      // Restore
      savedProcess.is_active = true;
      savedProcess.deleted_at = undefined;
      await savedProcess.save();
      
      expect(savedProcess.is_active).toBe(true);
      expect(savedProcess.deleted_at).toBeUndefined();
    });
  });

  describe('Versioning', () => {
    
    test('debe incrementar versión correctamente', async () => {
      const process = new ProcessDefinition(validProcessData);
      const savedProcess = await process.save();
      
      expect(savedProcess.version).toBe('1.0');
      
      // Simular actualización de versión
      savedProcess.version = '1.1';
      savedProcess.change_reason = 'Actualización de proceso';
      await savedProcess.save();
      
      expect(savedProcess.version).toBe('1.1');
      expect(savedProcess.change_reason).toBe('Actualización de proceso');
    });

    test('debe validar formato de versión', async () => {
      const invalidVersions = ['1', 'v1.0', '1.0.0', 'version-1'];
      
      for (const version of invalidVersions) {
        const process = new ProcessDefinition({
          ...validProcessData,
          version
        });
        
        await expect(process.save()).rejects.toThrow();
      }
    });
  });

  describe('Multi-tenant Isolation', () => {
    
    test('debe aislar procesos por organización', async () => {
      // Crear procesos en diferentes organizaciones
      const process1 = new ProcessDefinition({
        ...validProcessData,
        id: 'PROC-ORG1-001',
        organization_id: 'org-001'
      });
      
      const process2 = new ProcessDefinition({
        ...validProcessData,
        id: 'PROC-ORG2-001',
        organization_id: 'org-002'
      });
      
      await process1.save();
      await process2.save();
      
      // Buscar por organización
      const org1Processes = await ProcessDefinition.find({ organization_id: 'org-001' });
      const org2Processes = await ProcessDefinition.find({ organization_id: 'org-002' });
      
      expect(org1Processes).toHaveLength(1);
      expect(org2Processes).toHaveLength(1);
      expect(org1Processes[0].id).toBe('PROC-ORG1-001');
      expect(org2Processes[0].id).toBe('PROC-ORG2-001');
    });

    test('debe permitir IDs duplicados en diferentes organizaciones', async () => {
      const sameId = 'PROC-SAME-001';
      
      const process1 = new ProcessDefinition({
        ...validProcessData,
        id: sameId,
        organization_id: 'org-001'
      });
      
      const process2 = new ProcessDefinition({
        ...validProcessData,
        id: sameId,
        organization_id: 'org-002'
      });
      
      await process1.save();
      await process2.save();
      
      const allProcesses = await ProcessDefinition.find({ id: sameId });
      expect(allProcesses).toHaveLength(2);
    });
  });

  describe('Search and Filtering', () => {
    
    beforeEach(async () => {
      // Crear datos de prueba
      const testProcesses = [
        { ...validProcessData, id: 'PROC-001', name: 'Proceso Ventas', tipo: 'operativo' },
        { ...validProcessData, id: 'PROC-002', name: 'Proceso Marketing', tipo: 'estratégico' },
        { ...validProcessData, id: 'PROC-003', name: 'Proceso Soporte', tipo: 'apoyo' }
      ];
      
      await ProcessDefinition.insertMany(testProcesses);
    });

    test('debe buscar por texto en nombre', async () => {
      const results = await ProcessDefinition.find({
        organization_id: 'org-001',
        name: { $regex: 'Ventas', $options: 'i' }
      });
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toContain('Ventas');
    });

    test('debe filtrar por tipo', async () => {
      const operativos = await ProcessDefinition.find({
        organization_id: 'org-001',
        tipo: 'operativo'
      });
      
      const estrategicos = await ProcessDefinition.find({
        organization_id: 'org-001',
        tipo: 'estratégico'
      });
      
      expect(operativos).toHaveLength(1);
      expect(estrategicos).toHaveLength(1);
    });

    test('debe ordenar por fecha de creación', async () => {
      const results = await ProcessDefinition.find({
        organization_id: 'org-001'
      }).sort({ created_at: -1 });
      
      expect(results).toHaveLength(3);
      
      // Verificar orden descendente
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].created_at.getTime()).toBeGreaterThanOrEqual(
          results[i + 1].created_at.getTime()
        );
      }
    });
  });

  describe('Audit Trail', () => {
    
    test('debe registrar quién creó el proceso', async () => {
      const process = new ProcessDefinition(validProcessData);
      const savedProcess = await process.save();
      
      expect(savedProcess.created_by).toBe('test-user');
      expect(savedProcess.updated_by).toBe('test-user');
    });

    test('debe actualizar updated_by en modificaciones', async () => {
      const process = new ProcessDefinition(validProcessData);
      const savedProcess = await process.save();
      
      // Simular actualización por otro usuario
      savedProcess.name = 'Proceso Actualizado';
      savedProcess.updated_by = 'another-user';
      await savedProcess.save();
      
      expect(savedProcess.updated_by).toBe('another-user');
      expect(savedProcess.created_by).toBe('test-user'); // No debe cambiar
    });
  });
});

console.log('✅ Tests unitarios para ProcessDefinition model completados');