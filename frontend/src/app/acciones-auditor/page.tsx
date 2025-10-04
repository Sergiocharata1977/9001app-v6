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
  ClipboardCheck,
  Calendar,
  User,
  FileText,
  MoreHorizontal,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

// Interface para acciones de auditor
interface AccionAuditor {
  id: string;
  numeroAccion: string;
  titulo: string;
  descripcion?: string;
  estado: 'Pendiente' | 'En Progreso' | 'Completada' | 'Cancelada';
  tipo_accion: 'Correctiva' | 'Preventiva' | 'Mejora';
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  responsable: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  fecha_cierre?: string;
  hallazgo_id?: string;
  proceso_id: string;
  evidencia?: string;
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

// Mock data para acciones de auditor
const mockAcciones: AccionAuditor[] = [
  {
    id: '1',
    numeroAccion: 'ACC-2024-001',
    titulo: 'Actualizar procedimiento de recepción',
    descripcion: 'Actualizar el procedimiento de recepción de materiales para cumplir con ISO 9001:2015',
    estado: 'En Progreso',
    tipo_accion: 'Correctiva',
    prioridad: 'Alta',
    responsable: 'Juan Pérez',
    fecha_inicio: '2024-01-15',
    fecha_vencimiento: '2024-02-15',
    hallazgo_id: 'HAL-2024-001',
    proceso_id: 'PROC-001',
    evidencia: 'Documento actualizado',
    observaciones: 'En revisión por el responsable de calidad',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-25T14:30:00Z'
  },
  {
    id: '2',
    numeroAccion: 'ACC-2024-002',
    titulo: 'Capacitar personal en nuevos procedimientos',
    descripcion: 'Realizar capacitación al personal en los nuevos procedimientos implementados',
    estado: 'Pendiente',
    tipo_accion: 'Preventiva',
    prioridad: 'Media',
    responsable: 'María García',
    fecha_inicio: '2024-02-01',
    fecha_vencimiento: '2024-02-28',
    hallazgo_id: 'HAL-2024-002',
    proceso_id: 'PROC-002',
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    numeroAccion: 'ACC-2024-003',
    titulo: 'Implementar sistema de calibración',
    descripcion: 'Implementar un sistema de calibración para todos los equipos de medición',
    estado: 'Completada',
    tipo_accion: 'Correctiva',
    prioridad: 'Crítica',
    responsable: 'Carlos López',
    fecha_inicio: '2024-01-10',
    fecha_vencimiento: '2024-01-30',
    fecha_cierre: '2024-01-28',
    hallazgo_id: 'HAL-2024-004',
    proceso_id: 'PROC-004',
    evidencia: 'Sistema implementado y documentado',
    observaciones: 'Completada exitosamente',
    created_at: '2024-01-10T08:45:00Z',
    updated_at: '2024-01-28T16:20:00Z'
  },
  {
    id: '4',
    numeroAccion: 'ACC-2024-004',
    titulo: 'Revisar y actualizar registros de calidad',
    descripcion: 'Revisar todos los registros de calidad y corregir inconsistencias',
    estado: 'En Progreso',
    tipo_accion: 'Correctiva',
    prioridad: 'Alta',
    responsable: 'Ana Martínez',
    fecha_inicio: '2024-01-25',
    fecha_vencimiento: '2024-02-20',
    hallazgo_id: 'HAL-2024-002',
    proceso_id: 'PROC-002',
    evidencia: 'Registros corregidos parcialmente',
    observaciones: 'Falta completar la revisión de registros históricos',
    created_at: '2024-01-25T11:20:00Z',
    updated_at: '2024-01-30T09:15:00Z'
  }
];

export default function AccionesAuditorPage() {
  const router = useRouter();
  const [acciones, setAcciones] = useState<AccionAuditor[]>(mockAcciones);
  const [filteredAcciones, setFilteredAcciones] = useState<AccionAuditor[]>(mockAcciones);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterPrioridad, setFilterPrioridad] = useState<string>('todos');
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');

  // Función para filtrar acciones
  const filterAcciones = () => {
    let filtered = acciones;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(accion =>
        accion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accion.numeroAccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accion.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accion.responsable.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filterEstado !== 'todos') {
      filtered = filtered.filter(accion => accion.estado === filterEstado);
    }

    // Filtro por prioridad
    if (filterPrioridad !== 'todos') {
      filtered = filtered.filter(accion => accion.prioridad === filterPrioridad);
    }

    // Filtro por tipo
    if (filterTipo !== 'todos') {
      filtered = filtered.filter(accion => accion.tipo_accion === filterTipo);
    }

    setFilteredAcciones(filtered);
  };

  useEffect(() => {
    filterAcciones();
  }, [searchTerm, filterEstado, filterPrioridad, filterTipo, acciones]);

  const handleAccionClick = (accion: AccionAuditor) => {
    // Navegar al Kanban de la acción específica
    router.push(`/acciones-auditor/${accion.id}/kanban`);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'bg-gray-100 text-gray-800';
      case 'En Progreso': return 'bg-blue-100 text-blue-800';
      case 'Completada': return 'bg-green-100 text-green-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
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
      case 'Correctiva': return 'bg-red-100 text-red-800';
      case 'Preventiva': return 'bg-blue-100 text-blue-800';
      case 'Mejora': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return <Clock className="h-4 w-4" />;
      case 'En Progreso': return <AlertCircle className="h-4 w-4" />;
      case 'Completada': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelada': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6 text-blue-500" />
              Acciones de Auditor
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión de acciones correctivas, preventivas y de mejora
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Acción
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
                placeholder="Buscar por título, número, responsable..."
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
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
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
              <option value="Correctiva">Correctiva</option>
              <option value="Preventiva">Preventiva</option>
              <option value="Mejora">Mejora</option>
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
        </div>
      </div>

      {/* Contenido */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAcciones.map((accion) => (
            <Card key={accion.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleAccionClick(accion)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{accion.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-2">{accion.numeroAccion}</p>
                </div>
                <Button size="sm" variant="ghost" className="p-1">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{accion.descripcion}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getEstadoColor(accion.estado)}>
                  {getEstadoIcon(accion.estado)}
                  <span className="ml-1">{accion.estado}</span>
                </Badge>
                <Badge className={getPrioridadColor(accion.prioridad)}>
                  {accion.prioridad}
                </Badge>
                <Badge className={getTipoColor(accion.tipo_accion)}>
                  {accion.tipo_accion}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Responsable: {accion.responsable}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Vencimiento: {new Date(accion.fecha_vencimiento).toLocaleDateString()}</span>
                </div>
                {accion.hallazgo_id && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Hallazgo: {accion.hallazgo_id}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccionClick(accion);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  Ver Kanban
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAcciones.map((accion) => (
            <Card key={accion.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleAccionClick(accion)}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-gray-900">{accion.titulo}</h3>
                    <Badge className={getEstadoColor(accion.estado)}>
                      {getEstadoIcon(accion.estado)}
                      <span className="ml-1">{accion.estado}</span>
                    </Badge>
                    <Badge className={getPrioridadColor(accion.prioridad)}>
                      {accion.prioridad}
                    </Badge>
                    <Badge className={getTipoColor(accion.tipo_accion)}>
                      {accion.tipo_accion}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{accion.numeroAccion}</p>
                  <p className="text-sm text-gray-500 mb-3">{accion.descripcion}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>Responsable: {accion.responsable}</span>
                    <span>Vencimiento: {new Date(accion.fecha_vencimiento).toLocaleDateString()}</span>
                    {accion.hallazgo_id && <span>Hallazgo: {accion.hallazgo_id}</span>}
                    <span>Proceso: {accion.proceso_id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccionClick(accion);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Kanban
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredAcciones.length === 0 && (
        <div className="text-center py-12">
          <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron acciones</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
}

