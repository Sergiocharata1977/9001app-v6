'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    AlertCircle,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    Grid3X3,
    Kanban,
    List,
    MoreHorizontal,
    Plus,
    Search,
    SearchCheck,
    Target,
    User,
    XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Interface para auditorías
interface Auditoria {
  id: string;
  numero_auditoria: string;
  titulo: string;
  descripcion?: string;
  tipo: 'Interna' | 'Externa' | 'Certificación' | 'Seguimiento';
  estado: 'Planificada' | 'En Progreso' | 'Completada' | 'Cancelada' | 'Seguimiento';
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  auditor_lider: string;
  equipo_auditor: string[];
  fecha_inicio: string;
  fecha_fin: string;
  fecha_realizacion?: string;
  alcance: string;
  criterios: string[];
  hallazgos_count?: number;
  observaciones_count?: number;
  no_conformidades_count?: number;
  proceso_auditado?: string;
  departamento_auditado?: string;
  organizacion_auditada?: string;
  documentos_revisados: string[];
  evidencias: string[];
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

// Mock data para auditorías
const mockAuditorias: Auditoria[] = [
  {
    id: '1',
    numero_auditoria: 'AUD-2024-001',
    titulo: 'Auditoría Interna ISO 9001:2015 - Q1 2024',
    descripcion: 'Auditoría interna del sistema de gestión de calidad según ISO 9001:2015 para el primer trimestre de 2024',
    tipo: 'Interna',
    estado: 'Completada',
    prioridad: 'Alta',
    auditor_lider: 'Ana Martínez',
    equipo_auditor: ['Carlos López', 'María González', 'Roberto Silva'],
    fecha_inicio: '2024-01-15',
    fecha_fin: '2024-01-19',
    fecha_realizacion: '2024-01-17',
    alcance: 'Sistema de Gestión de Calidad completo',
    criterios: ['ISO 9001:2015', 'Procedimientos internos', 'Registros de calidad'],
    hallazgos_count: 3,
    observaciones_count: 2,
    no_conformidades_count: 1,
    proceso_auditado: 'Gestión de Procesos',
    departamento_auditado: 'Calidad y Sistemas',
    organizacion_auditada: 'Organización Principal',
    documentos_revisados: ['Manual de Calidad', 'Procedimientos', 'Registros'],
    evidencias: ['Entrevistas', 'Revisión de documentos', 'Observación de procesos'],
    observaciones: 'Auditoría completada exitosamente con hallazgos menores',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    numero_auditoria: 'AUD-2024-002',
    titulo: 'Auditoría Externa ISO 9001:2015 - Certificación',
    descripcion: 'Auditoría externa para renovación de certificación ISO 9001:2015',
    tipo: 'Certificación',
    estado: 'En Progreso',
    prioridad: 'Crítica',
    auditor_lider: 'Dr. Sofía Herrera',
    equipo_auditor: ['Ing. Luis Rodríguez', 'Lic. Patricia Morales'],
    fecha_inicio: '2024-02-01',
    fecha_fin: '2024-02-03',
    alcance: 'Sistema de Gestión de Calidad y procesos relacionados',
    criterios: ['ISO 9001:2015', 'Requisitos legales', 'Políticas de calidad'],
    hallazgos_count: 0,
    observaciones_count: 0,
    no_conformidades_count: 0,
    proceso_auditado: 'Todos los procesos',
    departamento_auditado: 'Toda la organización',
    organizacion_auditada: 'Organización Principal',
    documentos_revisados: ['Manual de Calidad', 'Política de Calidad', 'Objetivos de Calidad'],
    evidencias: ['Entrevistas con dirección', 'Revisión de registros', 'Observación de procesos'],
    observaciones: 'Auditoría en curso, resultados preliminares positivos',
    created_at: '2024-01-25T08:45:00Z',
    updated_at: '2024-02-02T16:20:00Z'
  },
  {
    id: '3',
    numero_auditoria: 'AUD-2024-003',
    titulo: 'Auditoría de Seguimiento - Hallazgos Q1',
    descripcion: 'Auditoría de seguimiento para verificar el cierre de hallazgos del Q1 2024',
    tipo: 'Seguimiento',
    estado: 'Planificada',
    prioridad: 'Media',
    auditor_lider: 'Carlos López',
    equipo_auditor: ['Ana Martínez'],
    fecha_inicio: '2024-03-15',
    fecha_fin: '2024-03-16',
    alcance: 'Verificación de cierre de hallazgos',
    criterios: ['Plan de acción Q1', 'Evidencias de cierre', 'Efectividad de acciones'],
    hallazgos_count: 0,
    observaciones_count: 0,
    no_conformidades_count: 0,
    proceso_auditado: 'Gestión de No Conformidades',
    departamento_auditado: 'Calidad y Sistemas',
    organizacion_auditada: 'Organización Principal',
    documentos_revisados: ['Plan de Acción Q1', 'Evidencias de cierre'],
    evidencias: ['Revisión de documentos', 'Entrevistas con responsables'],
    observaciones: 'Programada para verificar efectividad de acciones correctivas',
    created_at: '2024-02-28T12:00:00Z',
    updated_at: '2024-02-28T12:00:00Z'
  },
  {
    id: '4',
    numero_auditoria: 'AUD-2024-004',
    titulo: 'Auditoría Interna ISO 14001:2015',
    descripcion: 'Auditoría interna del sistema de gestión ambiental según ISO 14001:2015',
    tipo: 'Interna',
    estado: 'Planificada',
    prioridad: 'Alta',
    auditor_lider: 'Roberto Silva',
    equipo_auditor: ['Sofía Herrera', 'Luis Rodríguez'],
    fecha_inicio: '2024-03-20',
    fecha_fin: '2024-03-22',
    alcance: 'Sistema de Gestión Ambiental',
    criterios: ['ISO 14001:2015', 'Aspectos ambientales', 'Requisitos legales'],
    hallazgos_count: 0,
    observaciones_count: 0,
    no_conformidades_count: 0,
    proceso_auditado: 'Gestión Ambiental',
    departamento_auditado: 'Operaciones',
    organizacion_auditada: 'Organización Principal',
    documentos_revisados: ['Manual Ambiental', 'Registros ambientales'],
    evidencias: ['Revisión de procesos', 'Entrevistas', 'Observación de actividades'],
    observaciones: 'Primera auditoría del sistema de gestión ambiental',
    created_at: '2024-03-01T09:15:00Z',
    updated_at: '2024-03-01T09:15:00Z'
  }
];

export default function AuditoriasPage() {
  const router = useRouter();
  const [auditorias, setAuditorias] = useState<Auditoria[]>(mockAuditorias);
  const [filteredAuditorias, setFilteredAuditorias] = useState<Auditoria[]>(mockAuditorias);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [filterPrioridad, setFilterPrioridad] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'list' | 'cards' | 'kanban'>('cards');

  // Función para filtrar auditorías
  const filterAuditorias = () => {
    let filtered = auditorias;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(auditoria =>
        auditoria.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auditoria.numero_auditoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auditoria.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auditoria.auditor_lider.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filterEstado !== 'todos') {
      filtered = filtered.filter(auditoria => auditoria.estado === filterEstado);
    }

    // Filtro por tipo
    if (filterTipo !== 'todos') {
      filtered = filtered.filter(auditoria => auditoria.tipo === filterTipo);
    }

    // Filtro por prioridad
    if (filterPrioridad !== 'todos') {
      filtered = filtered.filter(auditoria => auditoria.prioridad === filterPrioridad);
    }

    setFilteredAuditorias(filtered);
  };

  useEffect(() => {
    filterAuditorias();
  }, [searchTerm, filterEstado, filterTipo, filterPrioridad, auditorias]);

  const handleAuditoriaClick = (auditoria: Auditoria) => {
    if (viewMode === 'kanban') {
      // Navegar al Kanban de la auditoría específica
      router.push(`/auditorias/${auditoria.id}/kanban`);
    } else {
      // Navegar a los detalles de la auditoría
      router.push(`/auditorias/${auditoria.id}`);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Planificada': return 'bg-gray-100 text-gray-800';
      case 'En Progreso': return 'bg-blue-100 text-blue-800';
      case 'Completada': return 'bg-green-100 text-green-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      case 'Seguimiento': return 'bg-yellow-100 text-yellow-800';
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
      case 'Interna': return 'bg-blue-100 text-blue-800';
      case 'Externa': return 'bg-purple-100 text-purple-800';
      case 'Certificación': return 'bg-green-100 text-green-800';
      case 'Seguimiento': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Planificada': return <Target className="h-4 w-4" />;
      case 'En Progreso': return <Clock className="h-4 w-4" />;
      case 'Completada': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelada': return <XCircle className="h-4 w-4" />;
      case 'Seguimiento': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Función para obtener auditorías por estado (para vista Kanban)
  const getAuditoriasByEstado = (estado: string) => {
    return filteredAuditorias.filter(auditoria => auditoria.estado === estado);
  };

  const estadosKanban = [
    { id: 'Planificada', title: 'Planificada', color: 'bg-gray-100' },
    { id: 'En Progreso', title: 'En Progreso', color: 'bg-blue-100' },
    { id: 'Completada', title: 'Completada', color: 'bg-green-100' },
    { id: 'Seguimiento', title: 'Seguimiento', color: 'bg-yellow-100' },
    { id: 'Cancelada', title: 'Cancelada', color: 'bg-red-100' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <SearchCheck className="h-6 w-6 text-green-500" />
              Auditorías
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión de auditorías internas, externas y de certificación
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Auditoría
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
                placeholder="Buscar por título, número, auditor líder..."
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
              <option value="Planificada">Planificada</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completada">Completada</option>
              <option value="Seguimiento">Seguimiento</option>
              <option value="Cancelada">Cancelada</option>
            </select>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="todos">Todos los tipos</option>
              <option value="Interna">Interna</option>
              <option value="Externa">Externa</option>
              <option value="Certificación">Certificación</option>
              <option value="Seguimiento">Seguimiento</option>
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
                  <span className="text-sm text-gray-600">({getAuditoriasByEstado(estado.id).length})</span>
                </div>
                
                <div className="p-4 min-h-[400px]">
                  {getAuditoriasByEstado(estado.id).map((auditoria) => (
                    <Card 
                      key={auditoria.id} 
                      className="p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleAuditoriaClick(auditoria)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900">{auditoria.titulo}</h4>
                        <Badge className={getPrioridadColor(auditoria.prioridad)}>
                          {auditoria.prioridad}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{auditoria.descripcion}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge className={getTipoColor(auditoria.tipo)}>
                          {auditoria.tipo}
                        </Badge>
                        <Badge variant="outline">
                          {auditoria.numero_auditoria}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{auditoria.auditor_lider}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Fin: {new Date(auditoria.fecha_fin).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Hallazgos: {auditoria.hallazgos_count || 0}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2 text-gray-500 hover:text-gray-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar auditoría
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuditorias.map((auditoria) => (
            <Card key={auditoria.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleAuditoriaClick(auditoria)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{auditoria.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-2">{auditoria.numero_auditoria}</p>
                </div>
                <Button size="sm" variant="ghost" className="p-1">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{auditoria.descripcion}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getEstadoColor(auditoria.estado)}>
                  {getEstadoIcon(auditoria.estado)}
                  <span className="ml-1">{auditoria.estado}</span>
                </Badge>
                <Badge className={getPrioridadColor(auditoria.prioridad)}>
                  {auditoria.prioridad}
                </Badge>
                <Badge className={getTipoColor(auditoria.tipo)}>
                  {auditoria.tipo}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Auditor Líder: {auditoria.auditor_lider}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Período: {new Date(auditoria.fecha_inicio).toLocaleDateString()} - {new Date(auditoria.fecha_fin).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>Alcance: {auditoria.alcance}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span>Hallazgos: {auditoria.hallazgos_count || 0}</span>
                  <span>Observaciones: {auditoria.observaciones_count || 0}</span>
                  <span>No Conformidades: {auditoria.no_conformidades_count || 0}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAuditoriaClick(auditoria);
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
          {filteredAuditorias.map((auditoria) => (
            <Card key={auditoria.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleAuditoriaClick(auditoria)}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-gray-900">{auditoria.titulo}</h3>
                    <Badge className={getEstadoColor(auditoria.estado)}>
                      {getEstadoIcon(auditoria.estado)}
                      <span className="ml-1">{auditoria.estado}</span>
                    </Badge>
                    <Badge className={getPrioridadColor(auditoria.prioridad)}>
                      {auditoria.prioridad}
                    </Badge>
                    <Badge className={getTipoColor(auditoria.tipo)}>
                      {auditoria.tipo}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{auditoria.numero_auditoria}</p>
                  <p className="text-sm text-gray-500 mb-3">{auditoria.descripcion}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>Auditor: {auditoria.auditor_lider}</span>
                    <span>Período: {new Date(auditoria.fecha_inicio).toLocaleDateString()} - {new Date(auditoria.fecha_fin).toLocaleDateString()}</span>
                    <span>Hallazgos: {auditoria.hallazgos_count || 0}</span>
                    <span>Alcance: {auditoria.alcance}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAuditoriaClick(auditoria);
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

      {filteredAuditorias.length === 0 && (
        <div className="text-center py-12">
          <SearchCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron auditorías</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
}