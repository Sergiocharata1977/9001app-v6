'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import { BookOpen, Search, Filter, Star, Eye } from 'lucide-react';
import { normPointService, NormPoint, NormPointFilters } from '@/services/normPointService';

interface NormaListProps {
  initialNormPoints?: NormPoint[];
}

export default function NormaList({ initialNormPoints }: NormaListProps) {
  const router = useRouter();
  const [normPoints, setNormPoints] = useState<NormPoint[]>(initialNormPoints || []);
  const [filteredNormPoints, setFilteredNormPoints] = useState<NormPoint[]>(initialNormPoints || []);
  const [loading, setLoading] = useState(!initialNormPoints);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<NormPointFilters>({
    chapter: undefined,
    category: undefined,
    status: undefined,
    priority: undefined,
    is_mandatory: undefined
  });

  // Cargar datos si no se proporcionaron inicialmente
  useEffect(() => {
    if (!initialNormPoints) {
      const loadNormPoints = async () => {
        try {
          setLoading(true);
          const data = await normPointService.getNormPoints();
          setNormPoints(data);
          setFilteredNormPoints(data);
        } catch (error) {
          console.error('Error cargando puntos de norma:', error);
        } finally {
          setLoading(false);
        }
      };
      loadNormPoints();
    }
  }, [initialNormPoints]);

  // Aplicar filtros
  useEffect(() => {
    let filtered = normPoints;

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(point =>
        point.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.requirements.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtros adicionales
    if (filters.chapter) {
      filtered = filtered.filter(point => point.chapter === filters.chapter);
    }

    if (filters.category) {
      filtered = filtered.filter(point => point.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(point => point.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(point => point.priority === filters.priority);
    }

    if (filters.is_mandatory !== undefined) {
      filtered = filtered.filter(point => point.is_mandatory === filters.is_mandatory);
    }

    setFilteredNormPoints(filtered);
  }, [normPoints, searchTerm, filters]);

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
        return 'Contexto';
      case 'liderazgo':
        return 'Liderazgo';
      case 'planificacion':
        return 'Planificación';
      case 'apoyo':
        return 'Apoyo';
      case 'operacion':
        return 'Operación';
      case 'evaluacion':
        return 'Evaluación';
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
        return 'Alta';
      case 'media':
        return 'Media';
      case 'baja':
        return 'Baja';
      default:
        return priority;
    }
  };

  const handleViewNormPoint = (normPoint: NormPoint) => {
    router.push(`/normas/${normPoint._id}`);
  };

  const handleFilterChange = (key: keyof NormPointFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'todos' ? undefined : value
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando puntos de norma...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por código, título, requisitos o palabras clave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={filters.chapter?.toString() || 'todos'}
                onChange={(e) => handleFilterChange('chapter', parseInt(e.target.value) || undefined)}
                className="form-input w-full md:w-48"
              >
                <option value="todos">Todos los capítulos</option>
                {[4, 5, 6, 7, 8, 9, 10].map(chapter => (
                  <option key={chapter} value={chapter.toString()}>Capítulo {chapter}</option>
                ))}
              </select>

              <select
                value={filters.category || 'todos'}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="form-input w-full md:w-48"
              >
                <option value="todos">Todas las categorías</option>
                <option value="contexto">Contexto</option>
                <option value="liderazgo">Liderazgo</option>
                <option value="planificacion">Planificación</option>
                <option value="apoyo">Apoyo</option>
                <option value="operacion">Operación</option>
                <option value="evaluacion">Evaluación</option>
                <option value="mejora">Mejora</option>
              </select>

              <select
                value={filters.priority || 'todos'}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="form-input w-full md:w-48"
              >
                <option value="todos">Todas las prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>

              <select
                value={filters.is_mandatory === undefined ? 'todos' : filters.is_mandatory.toString()}
                onChange={(e) => handleFilterChange('is_mandatory', e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined)}
                className="form-input w-full md:w-48"
              >
                <option value="todos">Todos</option>
                <option value="true">Obligatorios</option>
                <option value="false">Recomendados</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de puntos de norma */}
      <div className="space-y-4">
        {filteredNormPoints.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron puntos de norma
              </h3>
              <p className="text-gray-600">
                {searchTerm || Object.values(filters).some(v => v !== undefined)
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay puntos de norma disponibles'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNormPoints.map((normPoint) => (
            <Card key={normPoint._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {normPoint.code} - {normPoint.title}
                      </h3>
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

                    <p className="text-gray-600 mb-4 line-clamp-2">{normPoint.requirements}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Capítulo:</span>
                        <p className="font-medium">{normPoint.chapter}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Sección:</span>
                        <p className="font-medium">{normPoint.section}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Versión:</span>
                        <p className="font-medium">{normPoint.version}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Estado:</span>
                        <p className="font-medium">{normPoint.status}</p>
                      </div>
                    </div>

                    {normPoint.keywords && normPoint.keywords.length > 0 && (
                      <div className="flex items-center gap-2 mt-4">
                        <span className="text-sm text-gray-500">Palabras clave:</span>
                        <div className="flex flex-wrap gap-1">
                          {normPoint.keywords.slice(0, 3).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {normPoint.keywords.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{normPoint.keywords.length - 3} más
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewNormPoint(normPoint)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}