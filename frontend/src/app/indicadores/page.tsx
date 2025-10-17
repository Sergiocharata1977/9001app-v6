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
  TrendingUp,
  Calendar,
  User,
  Target,
  BarChart3,
  CheckCircle,
  AlertCircle,
  List,
  Grid3X3,
  Filter,
  MoreHorizontal,
  Activity
} from 'lucide-react';

interface Indicador {
  _id: string;
  nombre: string;
  descripcion: string;
  tipo: 'efectividad' | 'eficiencia' | 'satisfaccion' | 'cumplimiento';
  unidad_medida: string;
  frecuencia_medicion: 'diaria' | 'semanal' | 'mensual' | 'trimestral' | 'anual';
  estado: 'activo' | 'inactivo' | 'suspendido';
  responsable: string;
  objetivo_meta: number;
  valor_actual?: number;
  tendencia: 'ascendente' | 'descendente' | 'estable';
  procesos_relacionados: string[];
  objetivos_relacionados: string[];
  fecha_ultima_medicion?: string;
  created_at: string;
  updated_at: string;
}

export default function IndicadoresPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('all');
  const [filterEstado, setFilterEstado] = useState('all');
  const [filterFrecuencia, setFilterFrecuencia] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [showFilters, setShowFilters] = useState(false);

  // Datos mock de indicadores
  const mockIndicadores: Indicador[] = [
    {
      _id: '1',
      nombre: 'Satisfacción del Cliente',
      descripcion: 'Medición del nivel de satisfacción de los clientes con nuestros productos y servicios',
      tipo: 'satisfaccion',
      unidad_medida: 'Escala 1-5',
      frecuencia_medicion: 'mensual',
      estado: 'activo',
      responsable: 'Gerente de Calidad',
      objetivo_meta: 4.5,
      valor_actual: 4.2,
      tendencia: 'ascendente',
      procesos_relacionados: ['Atención al Cliente', 'Ventas'],
      objetivos_relacionados: ['Aumentar satisfacción del cliente'],
      fecha_ultima_medicion: '2024-01-15',
      created_at: '2024-01-01',
      updated_at: '2024-01-20'
    },
    {
      _id: '2',
      nombre: 'Tasa de Defectos',
      descripcion: 'Porcentaje de productos defectuosos en relación al total de productos fabricados',
      tipo: 'eficiencia',
      unidad_medida: 'Porcentaje',
      frecuencia_medicion: 'semanal',
      estado: 'activo',
      responsable: 'Gerente de Producción',
      objetivo_meta: 2.0,
      valor_actual: 2.8,
      tendencia: 'descendente',
      procesos_relacionados: ['Producción', 'Control de Calidad'],
      objetivos_relacionados: ['Reducir defectos de producción'],
      fecha_ultima_medicion: '2024-01-18',
      created_at: '2024-01-05',
      updated_at: '2024-01-22'
    },
    {
      _id: '3',
      nombre: 'Tiempo de Respuesta',
      descripcion: 'Tiempo promedio de respuesta a consultas y solicitudes de clientes',
      tipo: 'eficiencia',
      unidad_medida: 'Horas',
      frecuencia_medicion: 'diaria',
      estado: 'activo',
      responsable: 'Supervisor de Atención al Cliente',
      objetivo_meta: 4.0,
      valor_actual: 3.2,
      tendencia: 'descendente',
      procesos_relacionados: ['Atención al Cliente'],
      objetivos_relacionados: ['Mejorar eficiencia operativa'],
      fecha_ultima_medicion: '2024-01-20',
      created_at: '2024-01-10',
      updated_at: '2024-01-25'
    },
    {
      _id: '4',
      nombre: 'Cumplimiento de Entregas',
      descripcion: 'Porcentaje de entregas realizadas en tiempo y forma según lo acordado con el cliente',
      tipo: 'cumplimiento',
      unidad_medida: 'Porcentaje',
      frecuencia_medicion: 'mensual',
      estado: 'activo',
      responsable: 'Gerente de Logística',
      objetivo_meta: 95.0,
      valor_actual: 92.5,
      tendencia: 'ascendente',
      procesos_relacionados: ['Logística', 'Ventas'],
      objetivos_relacionados: ['Mejorar satisfacción del cliente'],
      fecha_ultima_medicion: '2024-01-10',
      created_at: '2024-01-08',
      updated_at: '2024-01-15'
    },
    {
      _id: '5',
      nombre: 'Eficiencia Energética',
      descripcion: 'Consumo de energía por unidad de producto fabricado',
      tipo: 'eficiencia',
      unidad_medida: 'kWh/unidad',
      frecuencia_medicion: 'mensual',
      estado: 'suspendido',
      responsable: 'Gerente de Producción',
      objetivo_meta: 15.0,
      valor_actual: 18.5,
      tendencia: 'descendente',
      procesos_relacionados: ['Producción'],
      objetivos_relacionados: ['Implementar sistema de gestión ambiental'],
      fecha_ultima_medicion: '2023-12-15',
      created_at: '2023-12-01',
      updated_at: '2024-01-05'
    },
    {
      _id: '6',
      nombre: 'Capacitación del Personal',
      descripcion: 'Horas de capacitación por empleado al año',
      tipo: 'efectividad',
      unidad_medida: 'Horas/empleado',
      frecuencia_medicion: 'trimestral',
      estado: 'activo',
      responsable: 'Gerente de RRHH',
      objetivo_meta: 40.0,
      valor_actual: 25.0,
      tendencia: 'ascendente',
      procesos_relacionados: ['Recursos Humanos', 'Capacitación'],
      objetivos_relacionados: ['Capacitar al personal en nuevas tecnologías'],
      fecha_ultima_medicion: '2024-01-05',
      created_at: '2024-01-01',
      updated_at: '2024-01-12'
    }
  ];

  const handleNewIndicador = () => {
    router.push('/indicadores/nuevo');
  };

  const handleEditIndicador = (indicador: Indicador) => {
    router.push(`/indicadores/${indicador._id}/editar`);
  };

  const handleViewIndicador = (indicador: Indicador) => {
    router.push(`/indicadores/${indicador._id}`);
  };

  const handleDeleteIndicador = (indicador: Indicador) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el indicador "${indicador.nombre}"?`)) {
      // TODO: Implementar eliminación
      console.log('Eliminar indicador:', indicador._id);
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'efectividad':
        return 'bg-green-100 text-green-800';
      case 'eficiencia':
        return 'bg-blue-100 text-blue-800';
      case 'satisfaccion':
        return 'bg-purple-100 text-purple-800';
      case 'cumplimiento':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      case 'suspendido':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'ascendente':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'descendente':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      case 'estable':
        return <Activity className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case 'ascendente':
        return 'text-green-600';
      case 'descendente':
        return 'text-red-600';
      case 'estable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgresoColor = (valor: number, meta: number) => {
    const porcentaje = (valor / meta) * 100;
    if (porcentaje >= 90) return 'bg-green-500';
    if (porcentaje >= 70) return 'bg-blue-500';
    if (porcentaje >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredIndicadores = mockIndicadores.filter(indicador => {
    const matchesSearch = indicador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indicador.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indicador.responsable.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = filterTipo === 'all' || indicador.tipo === filterTipo;
    const matchesEstado = filterEstado === 'all' || indicador.estado === filterEstado;
    const matchesFrecuencia = filterFrecuencia === 'all' || indicador.frecuencia_medicion === filterFrecuencia;
    
    return matchesSearch && matchesTipo && matchesEstado && matchesFrecuencia;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Indicadores de Calidad</h1>
        <p className="text-gray-600 mt-2">
          Gestión de indicadores para medir el desempeño y la calidad
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
          <Button onClick={handleNewIndicador} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Indicador
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
                <option value="efectividad">Efectividad</option>
                <option value="eficiencia">Eficiencia</option>
                <option value="satisfaccion">Satisfacción</option>
                <option value="cumplimiento">Cumplimiento</option>
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
                <option value="inactivo">Inactivo</option>
                <option value="suspendido">Suspendido</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia</label>
              <select
                value={filterFrecuencia}
                onChange={(e) => setFilterFrecuencia(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las frecuencias</option>
                <option value="diaria">Diaria</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
                <option value="trimestral">Trimestral</option>
                <option value="anual">Anual</option>
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
          {filteredIndicadores.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No se encontraron indicadores</p>
              </CardContent>
            </Card>
          ) : (
            filteredIndicadores.map((indicador) => (
              <Card 
                key={indicador._id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewIndicador(indicador)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {indicador.nombre}
                        </h3>
                        <Badge className={getTipoColor(indicador.tipo)}>
                          {indicador.tipo}
                        </Badge>
                        <Badge className={getEstadoColor(indicador.estado)}>
                          {indicador.estado}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{indicador.descripcion}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span><strong>Responsable:</strong> {indicador.responsable}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span><strong>Frecuencia:</strong> {indicador.frecuencia_medicion}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span><strong>Meta:</strong> {indicador.objetivo_meta} {indicador.unidad_medida}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTendenciaIcon(indicador.tendencia)}
                          <span className={getTendenciaColor(indicador.tendencia)}>
                            <strong>Tendencia:</strong> {indicador.tendencia}
                          </span>
                        </div>
                      </div>

                      {indicador.valor_actual && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Progreso hacia la meta</span>
                            <span className="font-medium">
                              {indicador.valor_actual} / {indicador.objetivo_meta} {indicador.unidad_medida}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getProgresoColor(indicador.valor_actual, indicador.objetivo_meta)}`}
                              style={{ width: `${Math.min((indicador.valor_actual / indicador.objetivo_meta) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewIndicador(indicador);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditIndicador(indicador);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteIndicador(indicador);
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
          {filteredIndicadores.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No se encontraron indicadores</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredIndicadores.map((indicador) => (
              <Card 
                key={indicador._id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewIndicador(indicador)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 mb-2">
                        {indicador.nombre}
                      </CardTitle>
                      <div className="flex gap-2 mb-2">
                        <Badge className={getTipoColor(indicador.tipo)}>
                          {indicador.tipo}
                        </Badge>
                        <Badge className={getEstadoColor(indicador.estado)}>
                          {indicador.estado}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implementar menú de acciones
                        console.log('Menú de acciones:', indicador._id);
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {indicador.descripcion}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      <span className="truncate">{indicador.responsable}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{indicador.frecuencia_medicion}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Target className="h-4 w-4" />
                      <span>Meta: {indicador.objetivo_meta} {indicador.unidad_medida}</span>
                    </div>

                    {indicador.valor_actual && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Actual</span>
                          <span className="font-medium">{indicador.valor_actual} {indicador.unidad_medida}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgresoColor(indicador.valor_actual, indicador.objetivo_meta)}`}
                            style={{ width: `${Math.min((indicador.valor_actual / indicador.objetivo_meta) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      {getTendenciaIcon(indicador.tendencia)}
                      <span className={getTendenciaColor(indicador.tendencia)}>
                        {indicador.tendencia}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{indicador.objetivos_relacionados.length} objetivos</span>
                      <span>•</span>
                      <span>{indicador.procesos_relacionados.length} procesos</span>
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