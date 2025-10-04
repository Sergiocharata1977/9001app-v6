'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  Filter, 
  Plus, 
  Grid3X3, 
  List, 
  Package,
  Calendar,
  User,
  FileText,
  MoreHorizontal,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Kanban,
  Target,
  Settings
} from 'lucide-react';

// Interface para proyectos de diseño y desarrollo
interface ProyectoDiseno {
  id: string;
  nombre: string;
  descripcion?: string;
  codigo: string;
  tipo: 'Producto' | 'Servicio' | 'Software' | 'Hardware';
  categoria: string;
  estado: 'Planificación' | 'Diseño' | 'Desarrollo' | 'Testing' | 'Lanzamiento' | 'Mantenimiento';
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  responsable: string;
  equipo: string[];
  fecha_inicio: string;
  fecha_vencimiento: string;
  fecha_lanzamiento?: string;
  presupuesto?: number;
  progreso: number;
  requisitos_norma: string[];
  documentos_asociados: string[];
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

// Mock data para proyectos de diseño y desarrollo
const mockProyectos: ProyectoDiseno[] = [
  {
    id: '1',
    nombre: 'Sistema de Gestión de Calidad ISO 9001',
    descripcion: 'Desarrollo de software para gestión integral de sistemas de calidad según ISO 9001:2015',
    codigo: 'PROD-001',
    tipo: 'Software',
    categoria: 'Sistemas de Gestión',
    estado: 'Desarrollo',
    prioridad: 'Alta',
    responsable: 'Juan Pérez',
    equipo: ['María García', 'Carlos López', 'Ana Martínez'],
    fecha_inicio: '2024-01-15',
    fecha_vencimiento: '2024-06-15',
    presupuesto: 150000,
    progreso: 65,
    requisitos_norma: ['ISO 9001:2015', 'ISO 14001:2015'],
    documentos_asociados: ['Manual de Usuario', 'Documentación Técnica', 'Plan de Pruebas'],
    observaciones: 'En fase de desarrollo del módulo de auditorías',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-25T14:30:00Z'
  },
  {
    id: '2',
    nombre: 'Aplicación Móvil de Auditoría',
    descripcion: 'Aplicación móvil para realizar auditorías internas y externas con sincronización en tiempo real',
    codigo: 'APP-001',
    tipo: 'Software',
    categoria: 'Aplicaciones Móviles',
    estado: 'Testing',
    prioridad: 'Media',
    responsable: 'Sofía Herrera',
    equipo: ['Luis Rodríguez', 'Roberto Silva'],
    fecha_inicio: '2024-01-05',
    fecha_vencimiento: '2024-04-30',
    presupuesto: 80000,
    progreso: 85,
    requisitos_norma: ['ISO 9001:2015', 'ISO 27001:2022'],
    documentos_asociados: ['Manual de Usuario Móvil', 'Guía de Instalación', 'Plan de Seguridad'],
    observaciones: 'En fase de testing con usuarios beta',
    created_at: '2024-01-05T12:00:00Z',
    updated_at: '2024-01-28T09:15:00Z'
  },
  {
    id: '3',
    nombre: 'Servicio de Consultoría ISO 9001',
    descripcion: 'Servicio integral de consultoría para implementación de sistemas de gestión de calidad',
    codigo: 'SERV-001',
    tipo: 'Servicio',
    categoria: 'Consultoría',
    estado: 'Lanzamiento',
    prioridad: 'Alta',
    responsable: 'Ana Martínez',
    equipo: ['Carlos López', 'María González'],
    fecha_inicio: '2024-01-10',
    fecha_vencimiento: '2024-07-10',
    fecha_lanzamiento: '2024-02-01',
    presupuesto: 120000,
    progreso: 100,
    requisitos_norma: ['ISO 9001:2015'],
    documentos_asociados: ['Propuesta Comercial', 'Contrato de Servicio', 'Manual de Procesos'],
    observaciones: 'Servicio lanzado exitosamente',
    created_at: '2024-01-10T08:45:00Z',
    updated_at: '2024-02-01T16:20:00Z'
  },
  {
    id: '4',
    nombre: 'Manual de Procedimientos Digital',
    descripcion: 'Manual interactivo de procedimientos con funcionalidades multimedia y navegación intuitiva',
    codigo: 'DOC-001',
    tipo: 'Producto',
    categoria: 'Documentación Digital',
    estado: 'Diseño',
    prioridad: 'Media',
    responsable: 'Luis Rodríguez',
    equipo: ['Sofía Herrera'],
    fecha_inicio: '2024-02-01',
    fecha_vencimiento: '2024-05-01',
    presupuesto: 45000,
    progreso: 30,
    requisitos_norma: ['ISO 9001:2015'],
    documentos_asociados: ['Especificaciones Técnicas', 'Guía de Diseño'],
    observaciones: 'En fase de diseño de la interfaz',
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-15T11:20:00Z'
  }
];

export default function DisenoProductoPage() {
  const router = useRouter();
  const [proyectos, setProyectos] = useState<ProyectoDiseno[]>(mockProyectos);
  const [filteredProyectos, setFilteredProyectos] = useState<ProyectoDiseno[]>(mockProyectos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterPrioridad, setFilterPrioridad] = useState<string>('todos');
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'list' | 'cards' | 'kanban'>('cards');

  // Función para filtrar proyectos
  const filterProyectos = () => {
    let filtered = proyectos;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(proyecto =>
        proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proyecto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proyecto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proyecto.responsable.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filterEstado !== 'todos') {
      filtered = filtered.filter(proyecto => proyecto.estado === filterEstado);
    }

    // Filtro por prioridad
    if (filterPrioridad !== 'todos') {
      filtered = filtered.filter(proyecto => proyecto.prioridad === filterPrioridad);
    }

    // Filtro por tipo
    if (filterTipo !== 'todos') {
      filtered = filtered.filter(proyecto => proyecto.tipo === filterTipo);
    }

    setFilteredProyectos(filtered);
  };

  useEffect(() => {
    filterProyectos();
  }, [searchTerm, filterEstado, filterPrioridad, filterTipo, proyectos]);

  const handleProyectoClick = (proyecto: ProyectoDiseno) => {
    if (viewMode === 'kanban') {
      // Navegar al Kanban del proyecto específico
      router.push(`/diseno-producto/${proyecto.id}/kanban`);
    } else {
      // Navegar a los detalles del proyecto
      router.push(`/diseno-producto/${proyecto.id}`);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Planificación': return 'bg-gray-100 text-gray-800';
      case 'Diseño': return 'bg-blue-100 text-blue-800';
      case 'Desarrollo': return 'bg-yellow-100 text-yellow-800';
      case 'Testing': return 'bg-orange-100 text-orange-800';
      case 'Lanzamiento': return 'bg-green-100 text-green-800';
      case 'Mantenimiento': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Crítica': return 'bg-red-100 text-red-800';
      case 'Alta': return 'bg-orange-100 text-orange-800';
      case 'Media': return 'bg-yellow-100 text-yellow-800';
      case 'Baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Software': return 'bg-blue-100 text-blue-800';
      case 'Servicio': return 'bg-green-100 text-green-800';
      case 'Producto': return 'bg-purple-100 text-purple-800';
      case 'Hardware': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Planificación': return <Target className="h-4 w-4" />;
      case 'Diseño': return <Settings className="h-4 w-4" />;
      case 'Desarrollo': return <Package className="h-4 w-4" />;
      case 'Testing': return <CheckCircle className="h-4 w-4" />;
      case 'Lanzamiento': return <CheckCircle className="h-4 w-4" />;
      case 'Mantenimiento': return <Settings className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Función para obtener proyectos por estado (para vista Kanban)
  const getProyectosByEstado = (estado: string) => {
    return filteredProyectos.filter(proyecto => proyecto.estado === estado);
  };

  const estadosKanban = [
    { id: 'Planificación', title: 'Planificación', color: 'bg-gray-100' },
    { id: 'Diseño', title: 'Diseño', color: 'bg-blue-100' },
    { id: 'Desarrollo', title: 'Desarrollo', color: 'bg-yellow-100' },
    { id: 'Testing', title: 'Testing', color: 'bg-orange-100' },
    { id: 'Lanzamiento', title: 'Lanzamiento', color: 'bg-green-100' },
    { id: 'Mantenimiento', title: 'Mantenimiento', color: 'bg-purple-100' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-6 w-6 text-blue-500" />
              Diseño y desarrollo de Producto
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión de proyectos de diseño y desarrollo con metodología Kanban
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, código, responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="todos">Todos los estados</option>
              <option value="Planificación">Planificación</option>
              <option value="Diseño">Diseño</option>
              <option value="Desarrollo">Desarrollo</option>
              <option value="Testing">Testing</option>
              <option value="Lanzamiento">Lanzamiento</option>
              <option value="Mantenimiento">Mantenimiento</option>
            </select>
            <select
              value={filterPrioridad}
              onChange={(e) => setFilterPrioridad(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="todos">Todas las prioridades</option>
              <option value="Crítica">Crítica</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="todos">Todos los tipos</option>
              <option value="Software">Software</option>
              <option value="Servicio">Servicio</option>
              <option value="Producto">Producto</option>
              <option value="Hardware">Hardware</option>
            </select>
          </div>
        </div>

        {/* Vista toggle */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
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
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'kanban'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Kanban className="h-4 w-4" />
            Vista Kanban
          </button>
        </div>
      </div>

      {/* Contenido */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {estadosKanban.map((estado) => (
            <div key={estado.id} className="flex-1 min-w-0">
              <div className="bg-white rounded-lg border border-gray-200 h-full">
                <div className={`p-4 rounded-t-lg ${estado.color}`}>
                  <h3 className="font-semibold text-gray-900">{estado.title}</h3>
                  <span className="text-sm text-gray-600">({getProyectosByEstado(estado.id).length})</span>
                </div>
                
                <div className="p-4 min-h-[400px]">
                  {getProyectosByEstado(estado.id).map((proyecto) => (
                    <Card 
                      key={proyecto.id} 
                      className="p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleProyectoClick(proyecto)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900">{proyecto.nombre}</h4>
                        <Badge className={getPrioridadColor(proyecto.prioridad)}>
                          {proyecto.prioridad}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{proyecto.descripcion}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge className={getTipoColor(proyecto.tipo)}>
                          {proyecto.tipo}
                        </Badge>
                        <Badge variant="outline">
                          {proyecto.categoria}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{proyecto.responsable}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Vencimiento: {new Date(proyecto.fecha_vencimiento).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Progreso: {proyecto.progreso}%</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2 text-gray-500 hover:text-gray-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar proyecto
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProyectos.map((proyecto) => (
            <Card key={proyecto.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProyectoClick(proyecto)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{proyecto.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-2">{proyecto.codigo}</p>
                </div>
                <Button size="sm" variant="ghost" className="p-1">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{proyecto.descripcion}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getEstadoColor(proyecto.estado)}>
                  {getEstadoIcon(proyecto.estado)}
                  <span className="ml-1">{proyecto.estado}</span>
                </Badge>
                <Badge className={getPrioridadColor(proyecto.prioridad)}>
                  {proyecto.prioridad}
                </Badge>
                <Badge className={getTipoColor(proyecto.tipo)}>
                  {proyecto.tipo}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Responsable: {proyecto.responsable}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Vencimiento: {new Date(proyecto.fecha_vencimiento).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Progreso: {proyecto.progreso}%</span>
                </div>
                {proyecto.presupuesto && (
                  <div className="flex items-center gap-2">
                    <span>Presupuesto: ${proyecto.presupuesto.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProyectoClick(proyecto);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  Ver Detalles
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProyectos.map((proyecto) => (
            <Card key={proyecto.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProyectoClick(proyecto)}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-gray-900">{proyecto.nombre}</h3>
                    <Badge className={getEstadoColor(proyecto.estado)}>
                      {getEstadoIcon(proyecto.estado)}
                      <span className="ml-1">{proyecto.estado}</span>
                    </Badge>
                    <Badge className={getPrioridadColor(proyecto.prioridad)}>
                      {proyecto.prioridad}
                    </Badge>
                    <Badge className={getTipoColor(proyecto.tipo)}>
                      {proyecto.tipo}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{proyecto.codigo}</p>
                  <p className="text-sm text-gray-500 mb-3">{proyecto.descripcion}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>Responsable: {proyecto.responsable}</span>
                    <span>Vencimiento: {new Date(proyecto.fecha_vencimiento).toLocaleDateString()}</span>
                    <span>Progreso: {proyecto.progreso}%</span>
                    {proyecto.presupuesto && <span>Presupuesto: ${proyecto.presupuesto.toLocaleString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProyectoClick(proyecto);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredProyectos.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron proyectos</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
}

