'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye,
  Trash2,
  Target,
  Calendar,
  User,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  List,
  Grid3X3,
  Filter,
  MoreHorizontal
} from 'lucide-react';

interface Objetivo {
  _id: string;
  nombre: string;
  descripcion: string;
  tipo: 'estrategico' | 'tactico' | 'operativo';
  estado: 'activo' | 'completado' | 'cancelado' | 'pausado';
  responsable: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  fecha_completado?: string;
  progreso: number;
  indicadores_relacionados: string[];
  procesos_relacionados: string[];
  created_at: string;
  updated_at: string;
}

export default function ObjetivosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('all');
  const [filterEstado, setFilterEstado] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [showFilters, setShowFilters] = useState(false);

  // Datos mock de objetivos
  const mockObjetivos: Objetivo[] = [
    {
      _id: '1',
      nombre: 'Aumentar satisfacción del cliente',
      descripcion: 'Mejorar la satisfacción del cliente mediante la implementación de mejores prácticas en atención al cliente y reducción de tiempos de respuesta',
      tipo: 'estrategico',
      estado: 'activo',
      responsable: 'Gerente de Calidad',
      fecha_inicio: '2024-01-01',
      fecha_vencimiento: '2024-12-31',
      progreso: 65,
      indicadores_relacionados: ['Satisfacción del cliente', 'Tiempo de respuesta'],
      procesos_relacionados: ['Atención al Cliente', 'Ventas'],
      created_at: '2024-01-01',
      updated_at: '2024-01-20'
    },
    {
      _id: '2',
      nombre: 'Reducir defectos de producción',
      descripcion: 'Implementar controles de calidad más estrictos para reducir los defectos de producción en un 30%',
      tipo: 'tactico',
      estado: 'activo',
      responsable: 'Gerente de Producción',
      fecha_inicio: '2024-02-01',
      fecha_vencimiento: '2024-06-30',
      progreso: 40,
      indicadores_relacionados: ['Tasa de defectos', 'Eficiencia de producción'],
      procesos_relacionados: ['Producción', 'Control de Calidad'],
      created_at: '2024-01-15',
      updated_at: '2024-01-25'
    },
    {
      _id: '3',
      nombre: 'Mejorar eficiencia operativa',
      descripcion: 'Optimizar los procesos operativos para reducir costos y mejorar la eficiencia general de la organización',
      tipo: 'operativo',
      estado: 'completado',
      responsable: 'Gerente de Operaciones',
      fecha_inicio: '2023-10-01',
      fecha_vencimiento: '2023-12-31',
      fecha_completado: '2023-12-15',
      progreso: 100,
      indicadores_relacionados: ['Eficiencia operativa', 'Reducción de costos'],
      procesos_relacionados: ['Operaciones', 'Finanzas'],
      created_at: '2023-09-15',
      updated_at: '2023-12-15'
    },
    {
      _id: '4',
      nombre: 'Implementar sistema de gestión ambiental',
      descripcion: 'Desarrollar e implementar un sistema de gestión ambiental conforme a ISO 14001',
      tipo: 'estrategico',
      estado: 'pausado',
      responsable: 'Gerente Ambiental',
      fecha_inicio: '2024-01-01',
      fecha_vencimiento: '2024-12-31',
      progreso: 25,
      indicadores_relacionados: ['Certificación ISO 14001', 'Reducción de residuos'],
      procesos_relacionados: ['Gestión Ambiental', 'Operaciones'],
      created_at: '2024-01-01',
      updated_at: '2024-01-10'
    },
    {
      _id: '5',
      nombre: 'Capacitar al personal en nuevas tecnologías',
      descripcion: 'Implementar un programa de capacitación para que el personal se familiarice con las nuevas tecnologías implementadas',
      tipo: 'tactico',
      estado: 'activo',
      responsable: 'Gerente de RRHH',
      fecha_inicio: '2024-02-15',
      fecha_vencimiento: '2024-08-15',
      progreso: 30,
      indicadores_relacionados: ['Horas de capacitación', 'Satisfacción del personal'],
      procesos_relacionados: ['Recursos Humanos', 'Capacitación'],
      created_at: '2024-01-20',
      updated_at: '2024-01-28'
    }
  ];

  const handleNewObjetivo = () => {
    router.push('/objetivos/nuevo');
  };

  const handleEditObjetivo = (objetivo: Objetivo) => {
    router.push(`/objetivos/${objetivo._id}/editar`);
  };

  const handleViewObjetivo = (objetivo: Objetivo) => {
    router.push(`/objetivos/${objetivo._id}`);
  };

  const handleDeleteObjetivo = (objetivo: Objetivo) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el objetivo "${objetivo.nombre}"?`)) {
      // TODO: Implementar eliminación
      console.log('Eliminar objetivo:', objetivo._id);
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'estrategico':
        return 'bg-purple-100 text-purple-800';
      case 'tactico':
        return 'bg-blue-100 text-blue-800';
      case 'operativo':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'completado':
        return 'bg-blue-100 text-blue-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'pausado':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgresoColor = (progreso: number) => {
    if (progreso >= 80) return 'bg-green-500';
    if (progreso >= 60) return 'bg-blue-500';
    if (progreso >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredObjetivos = mockObjetivos.filter(objetivo => {
    const matchesSearch = objetivo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         objetivo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         objetivo.responsable.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = filterTipo === 'all' || objetivo.tipo === filterTipo;
    const matchesEstado = filterEstado === 'all' || objetivo.estado === filterEstado;
    
    return matchesSearch && matchesTipo && matchesEstado;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Objetivos de Calidad</h1>
        <p className="text-gray-600 mt-2">
          Gestión de objetivos estratégicos, tácticos y operativos
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, descripción o responsable..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button onClick={handleNewObjetivo} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Objetivo
          </Button>
        </div>
      </div>

      {/* Filtros expandibles */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los tipos</option>
                <option value="estrategico">Estratégico</option>
                <option value="tactico">Táctico</option>
                <option value="operativo">Operativo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
                <option value="pausado">Pausado</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Pestañas de vista */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="h-4 w-4" />
            Vista Lista
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'cards'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
            Vista Tarjetas
          </button>
        </div>
      </div>

      {/* Contenido según vista */}
      {viewMode === 'list' ? (
        /* Vista Lista */
        <div className="grid gap-4">
          {filteredObjetivos.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No se encontraron objetivos</p>
              </CardContent>
            </Card>
          ) : (
            filteredObjetivos.map((objetivo) => (
              <Card 
                key={objetivo._id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewObjetivo(objetivo)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {objetivo.nombre}
                        </h3>
                        <Badge className={getTipoColor(objetivo.tipo)}>
                          {objetivo.tipo}
                        </Badge>
                        <Badge className={getEstadoColor(objetivo.estado)}>
                          {objetivo.estado}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{objetivo.descripcion}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span><strong>Responsable:</strong> {objetivo.responsable}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span><strong>Vencimiento:</strong> {new Date(objetivo.fecha_vencimiento).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          <span><strong>Progreso:</strong> {objetivo.progreso}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgresoColor(objetivo.progreso)}`}
                            style={{ width: `${objetivo.progreso}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {objetivo.progreso}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewObjetivo(objetivo);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditObjetivo(objetivo);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteObjetivo(objetivo);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        /* Vista Tarjetas */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredObjetivos.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No se encontraron objetivos</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredObjetivos.map((objetivo) => (
              <Card 
                key={objetivo._id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewObjetivo(objetivo)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 mb-2">
                        {objetivo.nombre}
                      </CardTitle>
                      <div className="flex gap-2 mb-2">
                        <Badge className={getTipoColor(objetivo.tipo)}>
                          {objetivo.tipo}
                        </Badge>
                        <Badge className={getEstadoColor(objetivo.estado)}>
                          {objetivo.estado}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implementar menú de acciones
                        console.log('Menú de acciones:', objetivo._id);
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {objetivo.descripcion}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      <span className="truncate">{objetivo.responsable}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(objetivo.fecha_vencimiento).toLocaleDateString()}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Progreso</span>
                        <span className="font-medium">{objetivo.progreso}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgresoColor(objetivo.progreso)}`}
                          style={{ width: `${objetivo.progreso}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{objetivo.indicadores_relacionados.length} indicadores</span>
                      <span>•</span>
                      <span>{objetivo.procesos_relacionados.length} procesos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}