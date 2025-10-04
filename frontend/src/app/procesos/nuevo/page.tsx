'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft,
  Save,
  FileText,
  Hash,
  Users,
  Target,
  Book,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { processUnifiedService } from '@/services/processUnifiedService';

interface FormData {
  name: string;
  code: string;
  version: string;
  description: string;
  category: string;
  status: 'activo' | 'inactivo' | 'revision' | 'borrador';
  funciones_involucradas: string;
  alcance: string;
  responsible_user_name: string;
}

export default function NuevoProcesoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    code: '',
    version: '1.0',
    description: '',
    category: 'proceso',
    status: 'borrador',
    funciones_involucradas: '',
    alcance: '',
    responsible_user_name: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Validaciones básicas
      if (!formData.name.trim()) {
        throw new Error('El nombre del proceso es requerido');
      }
      if (!formData.code.trim()) {
        throw new Error('El código del proceso es requerido');
      }
      if (!formData.description.trim()) {
        throw new Error('La descripción del proceso es requerida');
      }

      // Preparar datos para envío
      const processData = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        version: formData.version,
        description: formData.description.trim(),
        category: formData.category,
        status: formData.status,
        content: `# ${formData.name}

## Descripción
${formData.description}

## Funciones Involucradas
${formData.funciones_involucradas || 'No especificado'}

## Alcance
${formData.alcance || 'No especificado'}

## Responsable
${formData.responsible_user_name || 'No asignado'}
`,
        type: 'proceso',
        permite_registros: true,
        etapas_proceso: [
          {
            id: 'iniciado',
            nombre: 'Iniciado',
            color: '#3B82F6',
            orden: 1,
            es_inicial: true,
            es_final: false,
            campos: []
          },
          {
            id: 'completado',
            nombre: 'Completado',
            color: '#10B981',
            orden: 2,
            es_inicial: false,
            es_final: true,
            campos: []
          }
        ],
        responsible_user_id: { name: formData.responsible_user_name || 'Sin asignar' },
        team_members: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Crear proceso
      await processUnifiedService.createProcess(processData);
      
      setSuccess(true);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/procesos/definiciones');
      }, 2000);

    } catch (error) {
      console.error('Error creando proceso:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al crear el proceso');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/procesos/definiciones');
  };

  if (success) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto mt-20">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Proceso Creado!</h2>
            <p className="text-gray-600 mb-4">
              El proceso "{formData.name}" ha sido creado exitosamente.
            </p>
            <p className="text-sm text-gray-500">
              Redirigiendo a la lista de procesos...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Proceso</h1>
        <p className="text-gray-600 mt-2">
          Crear una nueva definición de proceso según ISO 9001
        </p>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Error:</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Básica */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Proceso *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ej: Proceso de Ventas"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código *
                    </label>
                    <Input
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      placeholder="Ej: PV-001"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Versión
                    </label>
                    <Input
                      value={formData.version}
                      onChange={(e) => handleInputChange('version', e.target.value)}
                      placeholder="1.0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value as FormData['status'])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="borrador">Borrador</option>
                      <option value="revision">En Revisión</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción / Objetivo *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe el objetivo y propósito del proceso..."
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información Adicional */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Detalles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsable
                  </label>
                  <Input
                    value={formData.responsible_user_name}
                    onChange={(e) => handleInputChange('responsible_user_name', e.target.value)}
                    placeholder="Nombre del responsable"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funciones Involucradas
                  </label>
                  <Textarea
                    value={formData.funciones_involucradas}
                    onChange={(e) => handleInputChange('funciones_involucradas', e.target.value)}
                    placeholder="Ej: Ventas, Marketing, Atención al Cliente"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alcance
                  </label>
                  <Textarea
                    value={formData.alcance}
                    onChange={(e) => handleInputChange('alcance', e.target.value)}
                    placeholder="Define el alcance del proceso..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado Actual
                  </label>
                  <Badge 
                    className={
                      formData.status === 'activo' ? 'bg-green-100 text-green-800' :
                      formData.status === 'inactivo' ? 'bg-red-100 text-red-800' :
                      formData.status === 'revision' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {formData.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Crear Proceso
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}