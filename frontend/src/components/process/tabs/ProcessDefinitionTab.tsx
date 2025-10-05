'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  User, 
  Calendar, 
  Edit, 
  Save,
  X,
  Database,
  ExternalLink,
  Settings
} from 'lucide-react';
import { IProcessDefinition } from '@/types';
import api from '@/lib/api';

interface ProcessDefinitionTabProps {
  processId: string;
}

export function ProcessDefinitionTab({ processId }: ProcessDefinitionTabProps) {
  const [process, setProcess] = useState<IProcessDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const loadProcessDefinition = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/process-definitions/${processId}`);
      if (response.data.success) {
        setProcess(response.data.data);
      } else {
        console.error('Error en la respuesta:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error cargando definición del proceso:', error);
    } finally {
      setLoading(false);
    }
  }, [processId]);

  useEffect(() => {
    loadProcessDefinition();
  }, [loadProcessDefinition]);

  const handleToggleRegistries = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!process) return;
    
    try {
      const newValue = event.target.checked;
      const response = await api.put(`/process-definitions/${processId}`, {
        enableRegistries: newValue,
        updated_by: 'current_user' // TODO: Obtener del contexto de usuario
      });
      
      if (response.data.success) {
        setProcess({ ...process, enableRegistries: newValue });
      } else {
        console.error('Error actualizando configuración de registros');
      }
    } catch (error) {
      console.error('Error actualizando configuración de registros:', error);
    }
  };

  const getRegistriesStatusMessage = (process: IProcessDefinition) => {
    if (process.hasExternalSystem) {
      return 'Este proceso usa sistema externo - Registros deshabilitados';
    }
    if (process.hasSpecificRegistries) {
      return 'Este proceso tiene registros específicos - Registros deshabilitados';
    }
    return 'Registros estándar disponibles';
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!process) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No se encontró el proceso</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información General */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Información General</h2>
          <Button 
            variant={editing ? "ghost" : "outline"}
            size="sm"
            onClick={() => setEditing(!editing)}
          >
            {editing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre del Proceso */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Nombre del Proceso
            </label>
            {editing ? (
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                defaultValue={process.name}
              />
            ) : (
              <p className="text-gray-900 font-medium">{process.name}</p>
            )}
          </div>

          {/* Código */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Código del Proceso
            </label>
            {editing ? (
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                defaultValue={process.codigo || process.code}
              />
            ) : (
              <p className="text-gray-900 font-medium">{process.codigo || process.code || 'Sin código'}</p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Tipo de Proceso
            </label>
            {editing ? (
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue={process.tipo}>
                <option value="estrategico">Estratégico</option>
                <option value="operativo">Operativo</option>
                <option value="apoyo">Apoyo</option>
              </select>
            ) : (
              <Badge className="bg-blue-100 text-blue-800 capitalize">
                {process.tipo}
              </Badge>
            )}
          </div>

          {/* Responsable */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              <User className="h-4 w-4 inline mr-1" />
              Responsable del Proceso
            </label>
            {editing ? (
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                defaultValue={process.owner}
              />
            ) : (
              <p className="text-gray-900">{process.owner || 'No asignado'}</p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Estado
            </label>
            <Badge className={
              process.estado === 'activo' 
                ? 'bg-green-100 text-green-800' 
                : process.estado === 'revision'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }>
              {process.estado}
            </Badge>
          </div>

          {/* Nivel Crítico */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Nivel Crítico
            </label>
            <Badge className={
              process.nivel_critico === 'alto' 
                ? 'bg-red-100 text-red-800' 
                : process.nivel_critico === 'medio'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }>
              {process.nivel_critico}
            </Badge>
          </div>

          {/* Versión */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Versión
            </label>
            <p className="text-gray-900 font-medium">{process.version || '1.0'}</p>
          </div>
        </div>

        {editing && (
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        )}
      </Card>

      {/* Alcance */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Alcance del Proceso</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Objetivo del Proceso
            </label>
            {editing ? (
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                defaultValue={process.objetivo || process.objective}
              />
            ) : (
              <p className="text-gray-900">{process.objetivo || process.objective || 'Sin objetivo definido'}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Descripción
            </label>
            {editing ? (
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={4}
                defaultValue={process.description}
              />
            ) : (
              <p className="text-gray-900">{process.description}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Alcance del Proceso
            </label>
            {editing ? (
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                defaultValue={process.alcance || process.scope}
              />
            ) : (
              <p className="text-gray-900">{process.alcance || process.scope || 'Sin alcance definido'}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Entradas y Salidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Entradas del Proceso</h3>
          <div className="space-y-2">
            {process.entradas ? (
              <p className="text-gray-900">{process.entradas}</p>
            ) : process.inputs && process.inputs.length > 0 ? (
              <ul className="space-y-2">
                {process.inputs.map((input: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-900">{input}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Sin entradas definidas</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Salidas del Proceso</h3>
          <div className="space-y-2">
            {process.salidas ? (
              <p className="text-gray-900">{process.salidas}</p>
            ) : process.outputs && process.outputs.length > 0 ? (
              <ul className="space-y-2">
                {process.outputs.map((output: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-900">{output}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Sin salidas definidas</p>
            )}
          </div>
        </Card>
      </div>

      {/* Documentos Relacionados */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <FileText className="h-5 w-5 inline mr-2" />
          Documentos Relacionados
        </h3>
        <div className="space-y-2">
          {process.related_documents && process.related_documents.length > 0 ? (
            process.related_documents.map((doc: string, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{doc}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No hay documentos relacionados
            </p>
          )}
        </div>
      </Card>

      {/* Configuración de Registros */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <Settings className="h-5 w-5 inline mr-2" />
          Configuración de Registros
        </h3>
        
        <div className="space-y-4">
          {/* Toggle de Registros */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">Tareas del Proceso</h4>
              <p className="text-sm text-gray-600">
                {getRegistriesStatusMessage(process)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={process.enableRegistries || false}
                  disabled={process.hasExternalSystem || process.hasSpecificRegistries}
                  onChange={handleToggleRegistries}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-900">
                  {process.enableRegistries ? 'Habilitado' : 'Deshabilitado'}
                </span>
              </label>
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Sistema Externo</p>
                <p className="text-xs text-blue-700">
                  {process.hasExternalSystem ? 'Sí' : 'No'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <ExternalLink className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-900">Registros Específicos</p>
                <p className="text-xs text-purple-700">
                  {process.hasSpecificRegistries ? 'Sí' : 'No'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

