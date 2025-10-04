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
  XCircle
} from 'lucide-react';

// Interface basada en la tabla PRODUCTOS del bd-turso.md.txt
interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  codigo?: string;
  tipo: 'Producto' | 'Servicio' | 'Software' | 'Hardware';
  categoria?: string;
  estado: 'Borrador' | 'En Desarrollo' | 'En Revisión' | 'Aprobado' | 'Lanzado' | 'Descontinuado';
  version: string;
  fecha_creacion: string;
  fecha_revision?: string;
  responsable: string;
  especificaciones?: string;
  requisitos_calidad?: string;
  proceso_aprobacion?: string;
  documentos_asociados?: string;
  observaciones?: string;
  organization_id: number;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}

// Mock data basado en la estructura de la tabla PRODUCTOS
const mockProductos: Producto[] = [
  {
    id: '1',
    nombre: 'Sistema de Gestión de Calidad ISO 9001',
    descripcion: 'Software para la gestión integral de sistemas de calidad según ISO 9001:2015',
    codigo: 'PROD-001',
    tipo: 'Software',
    categoria: 'Sistemas de Gestión',
    estado: 'En Desarrollo',
    version: '2.1',
    fecha_creacion: '2024-01-15',
    fecha_revision: '2024-02-15',
    responsable: 'Juan Pérez',
    especificaciones: 'Desarrollado en React/Next.js con backend Node.js',
    requisitos_calidad: 'Cumplir con ISO 9001:2015, ISO 14001:2015',
    proceso_aprobacion: 'Revisión técnica y validación de usuario',
    documentos_asociados: 'Manual de usuario, Documentación técnica',
    observaciones: 'En fase de testing y validación',
    organization_id: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-25T14:30:00Z',
    created_by: 1
  },
  {
    id: '2',
    nombre: 'Servicio de Consultoría ISO 9001',
    descripcion: 'Servicio de consultoría para implementación de sistemas de gestión de calidad',
    codigo: 'SERV-001',
    tipo: 'Servicio',
    categoria: 'Consultoría',
    estado: 'Aprobado',
    version: '1.0',
    fecha_creacion: '2024-01-10',
    fecha_revision: '2024-01-20',
    responsable: 'María García',
    especificaciones: 'Servicio de 6 meses con seguimiento trimestral',
    requisitos_calidad: 'Certificación ISO 9001:2015',
    proceso_aprobacion: 'Aprobación del director y cliente',
    documentos_asociados: 'Propuesta comercial, Contrato de servicio',
    observaciones: 'Servicio activo y en ejecución',
    organization_id: 1,
    created_at: '2024-01-10T08:45:00Z',
    updated_at: '2024-01-20T16:20:00Z',
    created_by: 2
  },
  {
    id: '3',
    nombre: 'Aplicación Móvil de Auditoría',
    descripcion: 'Aplicación móvil para realizar auditorías internas y externas',
    codigo: 'APP-001',
    tipo: 'Software',
    categoria: 'Aplicaciones Móviles',
    estado: 'En Revisión',
    version: '1.5',
    fecha_creacion: '2024-01-05',
    fecha_revision: '2024-02-01',
    responsable: 'Carlos López',
    especificaciones: 'Desarrollada en React Native para iOS y Android',
    requisitos_calidad: 'Funcionalidad offline, sincronización automática',
    proceso_aprobacion: 'Revisión de UX/UI y testing de funcionalidades',
    documentos_asociados: 'Manual de usuario móvil, Guía de instalación',
    observaciones: 'En fase de testing con usuarios beta',
    organization_id: 1,
    created_at: '2024-01-05T12:00:00Z',
    updated_at: '2024-01-30T09:15:00Z',
    created_by: 3
  },
  {
    id: '4',
    nombre: 'Manual de Procedimientos de Calidad',
    descripcion: 'Manual completo de procedimientos para sistema de gestión de calidad',
    codigo: 'DOC-001',
    tipo: 'Producto',
    categoria: 'Documentación',
    estado: 'Lanzado',
    version: '3.0',
    fecha_creacion: '2023-12-01',
    fecha_revision: '2024-01-15',
    responsable: 'Ana Martínez',
    especificaciones: 'Documento PDF interactivo con 150 páginas',
    requisitos_calidad: 'Cumplir con ISO 9001:2015, formato estándar',
    proceso_aprobacion: 'Revisión por comité de calidad y aprobación final',
    documentos_asociados: 'Plantillas, Formularios, Guías de implementación',
    observaciones: 'Documento oficial y en uso',
    organization_id: 1,
    created_at: '2023-12-01T10:00:00Z',
    updated_at: '2024-01-15T11:20:00Z',
    created_by: 1
  }
];

export default function ProductosPage() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>(mockProductos);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>(mockProductos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [filterCategoria, setFilterCategoria] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');

  // Función para filtrar productos
  const filterProductos = () => {
    let filtered = productos;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.responsable.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filterEstado !== 'todos') {
      filtered = filtered.filter(producto => producto.estado === filterEstado);
    }

    // Filtro por tipo
    if (filterTipo !== 'todos') {
      filtered = filtered.filter(producto => producto.tipo === filterTipo);
    }

    // Filtro por categoría
    if (filterCategoria !== 'todos') {
      filtered = filtered.filter(producto => producto.categoria === filterCategoria);
    }

    setFilteredProductos(filtered);
  };

  useEffect(() => {
    filterProductos();
  }, [searchTerm, filterEstado, filterTipo, filterCategoria, productos]);

  const handleProductoClick = (producto: Producto) => {
    // Navegar al Kanban del producto específico
    router.push(`/productos/${producto.id}/kanban`);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Borrador': return 'bg-gray-100 text-gray-800';
      case 'En Desarrollo': return 'bg-blue-100 text-blue-800';
      case 'En Revisión': return 'bg-yellow-100 text-yellow-800';
      case 'Aprobado': return 'bg-green-100 text-green-800';
      case 'Lanzado': return 'bg-purple-100 text-purple-800';
      case 'Descontinuado': return 'bg-red-100 text-red-800';
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
      case 'Borrador': return <Clock className="h-4 w-4" />;
      case 'En Desarrollo': return <AlertCircle className="h-4 w-4" />;
      case 'En Revisión': return <Clock className="h-4 w-4" />;
      case 'Aprobado': return <CheckCircle className="h-4 w-4" />;
      case 'Lanzado': return <CheckCircle className="h-4 w-4" />;
      case 'Descontinuado': return <XCircle className="h-4 w-4" />;
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
              <Package className="h-6 w-6 text-purple-500" />
              Productos y Servicios
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión de diseño y desarrollo de productos y servicios
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Producto
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
              <option value="Borrador">Borrador</option>
              <option value="En Desarrollo">En Desarrollo</option>
              <option value="En Revisión">En Revisión</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Lanzado">Lanzado</option>
              <option value="Descontinuado">Descontinuado</option>
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
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="todos">Todas las categorías</option>
              <option value="Sistemas de Gestión">Sistemas de Gestión</option>
              <option value="Consultoría">Consultoría</option>
              <option value="Aplicaciones Móviles">Aplicaciones Móviles</option>
              <option value="Documentación">Documentación</option>
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
          {filteredProductos.map((producto) => (
            <Card key={producto.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProductoClick(producto)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{producto.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-2">{producto.codigo} - v{producto.version}</p>
                </div>
                <Button size="sm" variant="ghost" className="p-1">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{producto.descripcion}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getEstadoColor(producto.estado)}>
                  {getEstadoIcon(producto.estado)}
                  <span className="ml-1">{producto.estado}</span>
                </Badge>
                <Badge className={getTipoColor(producto.tipo)}>
                  {producto.tipo}
                </Badge>
                {producto.categoria && (
                  <Badge variant="outline">
                    {producto.categoria}
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Responsable: {producto.responsable}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Creación: {new Date(producto.fecha_creacion).toLocaleDateString()}</span>
                </div>
                {producto.fecha_revision && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Revisión: {new Date(producto.fecha_revision).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductoClick(producto);
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
          {filteredProductos.map((producto) => (
            <Card key={producto.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProductoClick(producto)}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-gray-900">{producto.nombre}</h3>
                    <Badge className={getEstadoColor(producto.estado)}>
                      {getEstadoIcon(producto.estado)}
                      <span className="ml-1">{producto.estado}</span>
                    </Badge>
                    <Badge className={getTipoColor(producto.tipo)}>
                      {producto.tipo}
                    </Badge>
                    {producto.categoria && (
                      <Badge variant="outline">
                        {producto.categoria}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{producto.codigo} - v{producto.version}</p>
                  <p className="text-sm text-gray-500 mb-3">{producto.descripcion}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>Responsable: {producto.responsable}</span>
                    <span>Creación: {new Date(producto.fecha_creacion).toLocaleDateString()}</span>
                    {producto.fecha_revision && (
                      <span>Revisión: {new Date(producto.fecha_revision).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductoClick(producto);
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

      {filteredProductos.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
}

