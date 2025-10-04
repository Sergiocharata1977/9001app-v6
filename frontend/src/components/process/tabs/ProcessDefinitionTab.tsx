'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  User, 
  Calendar, 
  Edit, 
  Save,
  X
} from 'lucide-react';
import { ProcessDefinition } from '@/shared-types/processes';

interface ProcessDefinitionTabProps {
  processId: string;
}

export function ProcessDefinitionTab({ processId }: ProcessDefinitionTabProps) {
  const [process, setProcess] = useState<ProcessDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProcessDefinition();
  }, [processId]);

  const loadProcessDefinition = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/processes/definitions/${processId}`);
      if (response.ok) {
        const data = await response.json();
        setProcess(data.data);
      }
    } catch (error) {
      console.error('Error cargando definición del proceso:', error);
    } finally {
      setLoading(false);
    }
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
              Código
            </label>
            {editing ? (
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                defaultValue={process.code}
              />
            ) : (
              <p className="text-gray-900 font-medium">{process.code}</p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Tipo de Proceso
            </label>
            {editing ? (
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
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
              Responsable
            </label>
            {editing ? (
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                defaultValue={process.owner}
              />
            ) : (
              <p className="text-gray-900">{process.owner}</p>
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
                : 'bg-gray-100 text-gray-800'
            }>
              {process.estado}
            </Badge>
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
              Objetivo
            </label>
            {editing ? (
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                defaultValue={process.objective}
              />
            ) : (
              <p className="text-gray-900">{process.objective}</p>
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
              Alcance
            </label>
            {editing ? (
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                defaultValue={process.scope}
              />
            ) : (
              <p className="text-gray-900">{process.scope}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Entradas y Salidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Entradas</h3>
          <ul className="space-y-2">
            {process.inputs?.map((input, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span className="text-gray-900">{input}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Salidas</h3>
          <ul className="space-y-2">
            {process.outputs?.map((output, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span className="text-gray-900">{output}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Documentos Relacionados */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <FileText className="h-5 w-5 inline mr-2" />
          Documentos Relacionados
        </h3>
        <div className="space-y-2">
          {process.related_documents?.length > 0 ? (
            process.related_documents.map((doc, index) => (
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
    </div>
  );
}

