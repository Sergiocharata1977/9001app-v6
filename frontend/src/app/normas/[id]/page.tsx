'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Star, AlertCircle, CheckCircle, FileText, Target, BarChart3, Link } from 'lucide-react';
import { normPointService, NormPoint } from '@/services/normPointService';

// Mock data para desarrollo
const mockNormPoint: NormPoint = {
  _id: 'norm-4-1',
  code: '4.1',
  title: 'Comprensión de la organización y de su contexto',
  chapter: 4,
  section: '4.1',
  category: 'contexto',
  requirements: 'La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y que afectan a su capacidad para lograr los resultados previstos de su sistema de gestión de la calidad.',
  guidance: 'Debe considerar cuestiones como: condiciones legales, tecnológicas, competitivas, del mercado, culturales, sociales y económicas, ya sean internacionales, nacionales, regionales o locales. La organización debe mantener esta información actualizada y disponible como información documentada.',
  examples: 'Análisis FODA (Fortalezas, Oportunidades, Debilidades, Amenazas), análisis PESTEL (Político, Económico, Social, Tecnológico, Ambiental, Legal), mapas de stakeholders, análisis de cadena de valor.',
  status: 'vigente',
  version: 'ISO 9001:2015',
  effective_date: '2015-09-15T00:00:00.000Z',
  keywords: ['contexto', 'organización', 'externo', 'interno', 'entorno', 'FODA', 'PESTEL'],
  is_mandatory: true,
  priority: 'alta',
  related_processes: [],
  related_documents: [],
  related_objectives: [],
  related_indicators: [],
  is_active: true,
  created_by: 'system',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z'
};

export default function NormaSinglePage() {
  const params = useParams();
  const router = useRouter();
  const normPointId = params.id as string;

  const [normPoint, setNormPoint] = useState<NormPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNormPoint = async () => {
      try {
        setLoading(true);
        // Intentar cargar desde API
        const data = await normPointService.getNormPointById(normPointId);
        setNormPoint(data);
      } catch (error) {
        console.error('Error cargando punto de norma:', error);
        // Usar datos mock si falla la API
        if (normPointId === 'norm-4-1') {
          setNormPoint(mockNormPoint);
        } else {
          setError('Punto de norma no encontrado');
        }
      } finally {
        setLoading(false);
      }
    };

    if (normPointId) {
      loadNormPoint();
    }
  }, [normPointId]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contexto':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'liderazgo':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'planificacion':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'apoyo':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'operacion':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'evaluacion':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'mejora':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'contexto':
        return 'Contexto de la Organización';
      case 'liderazgo':
        return 'Liderazgo';
      case 'planificacion':
        return 'Planificación';
      case 'apoyo':
        return 'Apoyo';
      case 'operacion':
        return 'Operación';
      case 'evaluacion':
        return 'Evaluación del Desempeño';
      case 'mejora':
        return 'Mejora';
      default:
        return category;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'Alta Prioridad';
      case 'media':
        return 'Media Prioridad';
      case 'baja':
        return 'Baja Prioridad';
      default:
        return priority;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-center text-gray-600 mt-4">Cargando punto de norma...</p>
      </div>
    );
  }

  if (error || !normPoint) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {error || 'Punto de norma no encontrado'}
            </h3>
            <p className="text-gray-600 mb-6">
              El punto de norma solicitado no existe o ha sido eliminado.
            </p>
            <Button onClick={() => router.push('/normas')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la lista
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/normas')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {normPoint.code}
            </h1>
            <Badge className={getCategoryColor(normPoint.category)}>
              {getCategoryText(normPoint.category)}
            </Badge>
            {normPoint.is_mandatory && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Star className="h-3 w-3 mr-1" />
                Obligatorio
              </Badge>
            )}
            <Badge className={getPriorityColor(normPoint.priority)}>
              {getPriorityText(normPoint.priority)}
            </Badge>
          </div>
          <h2 className="text-xl text-gray-700">{normPoint.title}</h2>
        </div>
      </div>

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Capítulo</p>
                <p className="text-2xl font-bold text-gray-900">{normPoint.chapter}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sección</p>
                <p className="text-2xl font-bold text-gray-900">{normPoint.section}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Versión</p>
                <p className="text-lg font-bold text-gray-900">{normPoint.version}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estado</p>
                <p className="text-lg font-bold text-gray-900">{normPoint.status}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requisitos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Requisitos
          </CardTitle>
          <CardDescription>
            Requisitos específicos que debe cumplir la organización
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{normPoint.requirements}</p>
        </CardContent>
      </Card>

      {/* Orientación para la implementación */}
      {normPoint.guidance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Orientación para la Implementación
            </CardTitle>
            <CardDescription>
              Guía práctica para implementar este requisito
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{normPoint.guidance}</p>
          </CardContent>
        </Card>
      )}

      {/* Ejemplos */}
      {normPoint.examples && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Ejemplos de Aplicación
            </CardTitle>
            <CardDescription>
              Casos prácticos y ejemplos de implementación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{normPoint.examples}</p>
          </CardContent>
        </Card>
      )}

      {/* Palabras clave */}
      {normPoint.keywords && normPoint.keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Palabras Clave
            </CardTitle>
            <CardDescription>
              Términos relacionados para búsqueda y referencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {normPoint.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relaciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Procesos relacionados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Procesos Relacionados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {normPoint.related_processes && normPoint.related_processes.length > 0 ? (
              <div className="space-y-2">
                {normPoint.related_processes.map((processId, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    Proceso {processId}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay procesos relacionados</p>
            )}
          </CardContent>
        </Card>

        {/* Documentos relacionados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos Relacionados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {normPoint.related_documents && normPoint.related_documents.length > 0 ? (
              <div className="space-y-2">
                {normPoint.related_documents.map((docId, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    Documento {docId}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay documentos relacionados</p>
            )}
          </CardContent>
        </Card>

        {/* Objetivos relacionados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objetivos Relacionados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {normPoint.related_objectives && normPoint.related_objectives.length > 0 ? (
              <div className="space-y-2">
                {normPoint.related_objectives.map((objId, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    Objetivo {objId}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay objetivos relacionados</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Metadatos */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Creado por:</span>
              <p className="font-medium">{normPoint.created_by}</p>
            </div>
            <div>
              <span className="text-gray-500">Fecha de creación:</span>
              <p className="font-medium">
                {new Date(normPoint.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Última actualización:</span>
              <p className="font-medium">
                {new Date(normPoint.updated_at).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Estado del registro:</span>
              <p className="font-medium">{normPoint.is_active ? 'Activo' : 'Inactivo'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}