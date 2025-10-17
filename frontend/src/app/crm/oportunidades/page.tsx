'use client';

import {
    EditarOportunidadModal,
    EliminarOportunidadModal,
    NuevaOportunidadModal
} from '@/components/crm/modals';
import { UnifiedKanbanBoard } from '@/components/ui/unified-kanban-board';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrganization } from '@/contexts/OrganizationContext';
import { crmClienteService, crmContactoService, crmOportunidadService } from '@/services/crmService';
import type { KanbanColumn, KanbanItem } from '@/types/unified-kanban';
import {
    ClipboardCheck,
    DollarSign,
    Edit,
    Kanban,
    LayoutGrid,
    List,
    Plus,
    Search,
    Settings,
    Target,
    Trash2,
    TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Datos de ejemplo
const oportunidadesEjemplo = [
  {
    id: '1',
    titulo: 'Venta de Semillas - Estancia San Miguel',
    descripcion: 'Oportunidad de venta de semillas de soja para la próxima temporada',
    etapa: 'negociacion',
    valor: 125000,
    probabilidad: 75,
    vendedor: 'Carlos Rodriguez',
    fechaCierre: '2024-02-15',
    cliente: 'Estancia San Miguel',
    tipoCliente: 'viejo',
    valorPonderado: 93750
  },
  {
    id: '2',
    titulo: 'Agroquímicos - Agropecuaria Los Pinos',
    descripcion: 'Suministro de agroquímicos para cultivos de maíz',
    etapa: 'propuesta',
    valor: 89500,
    probabilidad: 60,
    vendedor: 'María González',
    fechaCierre: '2024-02-20',
    cliente: 'Agropecuaria Los Pinos',
    tipoCliente: 'nuevo',
    valorPonderado: 53700
  },
  {
    id: '3',
    titulo: 'Fertilizantes - Campo Verde SA',
    descripcion: 'Aplicación de fertilizantes para cultivos de trigo',
    etapa: 'calificacion',
    valor: 210000,
    probabilidad: 40,
    vendedor: 'Roberto Silva',
    fechaCierre: '2024-03-01',
    cliente: 'Campo Verde SA',
    tipoCliente: 'viejo',
    valorPonderado: 84000
  },
  {
    id: '4',
    titulo: 'Estancia San Miguel - Prospecto',
    descripcion: 'Nueva oportunidad de venta de insumos agrícolas',
    etapa: 'prospecto',
    valor: 450000,
    probabilidad: 25,
    vendedor: 'Carlos Rodriguez',
    fechaCierre: '2024-03-15',
    cliente: 'Estancia San Miguel',
    tipoCliente: 'nuevo',
    valorPonderado: 112500
  },
  {
    id: '5',
    titulo: 'Campo Verde - Negociación',
    descripcion: 'Negociación final de contrato de servicios',
    etapa: 'negociacion',
    valor: 125000,
    probabilidad: 75,
    vendedor: 'María González',
    fechaCierre: '2024-02-28',
    cliente: 'Campo Verde',
    tipoCliente: 'viejo',
    valorPonderado: 93750
  }
];

const columnas = [
  { id: 'prospecto', titulo: 'Prospecto', color: '#9CA3AF' },
  { id: 'calificacion', titulo: 'Calificación', color: '#3B82F6' },
  { id: 'propuesta', titulo: 'Propuesta', color: '#8B5CF6' },
  { id: 'negociacion', titulo: 'Negociación', color: '#F59E0B' },
  { id: 'cierre', titulo: 'Cierre', color: '#10B981' }
];

// Convertir columnas a formato Kanban
const kanbanColumns: KanbanColumn[] = columnas.map(col => ({
  id: col.id,
  title: col.titulo,
  color: col.color
}));

export default function OportunidadesPage() {
  const router = useRouter();
  const { organizationId } = useOrganization();
  const [oportunidades, setOportunidades] = useState<any[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [contactos, setContactos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'cards'>('kanban');

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVendedor, setFilterVendedor] = useState('todos');
  const [filterTipoCliente, setFilterTipoCliente] = useState('todos');
  const [filterEtapa, setFilterEtapa] = useState('todas');

  // Estados de modales
  const [showNuevaModal, setShowNuevaModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [oportunidadSeleccionada, setOportunidadSeleccionada] = useState<any>(null);

  const getPrioridadColor = (probabilidad: number) => {
    if (probabilidad >= 75) return 'bg-red-100 text-red-800 border-red-200';
    if (probabilidad >= 50) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (probabilidad >= 25) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getPrioridadLabel = (probabilidad: number) => {
    if (probabilidad >= 75) return 'Crítica';
    if (probabilidad >= 50) return 'Alta';
    if (probabilidad >= 25) return 'Media';
    return 'Baja';
  };

  // Función para filtrar oportunidades
  const filteredOportunidades = oportunidades.filter(oportunidad => {
    const matchesSearch = !searchTerm ||
      oportunidad.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oportunidad.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oportunidad.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVendedor = filterVendedor === 'todos' || oportunidad.vendedor === filterVendedor;
    const matchesTipoCliente = filterTipoCliente === 'todos' || oportunidad.tipoCliente === filterTipoCliente;
    const matchesEtapa = filterEtapa === 'todas' || oportunidad.etapa === filterEtapa;

    return matchesSearch && matchesVendedor && matchesTipoCliente && matchesEtapa;
  });

  // Función para obtener estadísticas
  const getStats = () => {
    const total = filteredOportunidades.length;
    const valorTotal = filteredOportunidades.reduce((sum, op) => sum + (op.valor || 0), 0);
    const valorPonderado = filteredOportunidades.reduce((sum, op) => sum + (op.valorPonderado || 0), 0);

    return { total, valorTotal, valorPonderado };
  };

  const stats = getStats();

  const loadOportunidades = useCallback(async () => {
    try {
      setLoading(true);
      const response = await crmOportunidadService.getAll(organizationId, { limit: 100 });
      if (response.success && response.data) {
        setOportunidades(response.data);
      } else {
        // Fallback a datos de ejemplo si no hay datos reales
        setOportunidades(oportunidadesEjemplo);
      }
    } catch (error) {
      console.error('Error cargando oportunidades:', error);
      // Fallback a datos de ejemplo en caso de error
      setOportunidades(oportunidadesEjemplo);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  // Cargar datos
  useEffect(() => {
    loadOportunidades();
    loadEmpresas();
    loadContactos();
  }, [loadOportunidades, organizationId]);

  // Cargar empresas
  const loadEmpresas = async () => {
    try {
      const response = await crmClienteService.getAll(organizationId);
      if (response.success && response.data) {
        setEmpresas(response.data);
      }
    } catch (error) {
      console.error('Error cargando empresas:', error);
    }
  };

  // Cargar contactos
  const loadContactos = async () => {
    try {
      const response = await crmContactoService.getAll(organizationId);
      if (response.success && response.data) {
        setContactos(response.data);
      }
    } catch (error) {
      console.error('Error cargando contactos:', error);
    }
  };

  // Función para obtener nombre de empresa
  const getEmpresaNombre = (clienteId: string) => {
    if (!clienteId) return 'Sin empresa asignada';
    const empresa = empresas.find(e => e.id === clienteId);
    return empresa ? (empresa.razon_social || empresa.nombre_comercial) : 'Empresa no encontrada';
  };

  // Función para obtener nombre de contacto
  const getContactoNombre = (contactoId: string) => {
    if (!contactoId) return 'Sin contacto asignado';
    const contacto = contactos.find(c => c.id === contactoId);
    return contacto ? `${contacto.nombre} ${contacto.apellidos || ''}` : 'Contacto no encontrado';
  };

  const getOportunidadesByColumn = (columnId: string) => {
    return filteredOportunidades.filter(opp => opp.etapa === columnId);
  };

  // Handlers de modales
  const handleNuevaOportunidad = () => {
    setShowNuevaModal(true);
  };

  const handleEditarOportunidad = (oportunidad: any) => {
    setOportunidadSeleccionada(oportunidad);
    setShowEditarModal(true);
  };

  const handleEliminarOportunidad = (oportunidad: any) => {
    setOportunidadSeleccionada(oportunidad);
    setShowEliminarModal(true);
  };

  const handleVerOportunidad = (oportunidad: any) => {
    router.push(`/crm/oportunidades/${oportunidad.id}`);
  };

  const handleModalSuccess = () => {
    loadOportunidades();
    setShowNuevaModal(false);
    setShowEditarModal(false);
    setShowEliminarModal(false);
    setOportunidadSeleccionada(null);
  };

  // Obtener vendedores únicos para el filtro
  const vendedores = Array.from(new Set(oportunidades.map(op => op.vendedor)));

  // Formatear valor monetario
  const formatCurrency = (value: number | undefined) => {
    // Verificar si el valor es undefined o null
    if (!value && value !== 0) return 'US$ 0';
    // Usar formato consistente para servidor y cliente
    return `US$ ${value.toLocaleString('es-AR')}`;
  };

  // Convertir oportunidades a formato Kanban
  const convertToKanbanItems = (opps: any[]): KanbanItem[] => {
    return opps.map(opp => ({
      id: opp.id,
      title: opp.titulo,
      description: opp.descripcion || '',
      columnId: opp.etapa || 'prospecto',
      priority: opp.probabilidad >= 75 ? 'critical' :
        opp.probabilidad >= 50 ? 'high' :
          opp.probabilidad >= 25 ? 'medium' : 'low',
      customData: {
        valor_estimado: opp.valor_estimado || 0,
        probabilidad: opp.probabilidad || 0,
        vendedor_id: opp.vendedor_id,
        cliente_id: opp.cliente_id,
        contacto_id: opp.contacto_id,
        fecha_cierre_esperada: opp.fecha_cierre_esperada,
        evaluacion_necesidades: opp.evaluacion_necesidades
      }
    }));
  };

  // Handler para mover items en el Kanban
  const handleItemMove = async (itemId: string, sourceColumn: string, targetColumn: string, newIndex: number) => {
    try {
      // Encontrar la oportunidad
      const oportunidad = oportunidades.find(opp => opp.id === itemId);
      if (!oportunidad) {
        toast.error('Oportunidad no encontrada');
        return;
      }

      // Actualizar el estado local primero para feedback inmediato
      setOportunidades(prev =>
        prev.map(opp =>
          opp.id === itemId ? { ...opp, etapa: targetColumn } : opp
        )
      );

      // Actualizar en el backend
      const response = await crmOportunidadService.update(itemId, {
        organization_id: organizationId,
        etapa: targetColumn
      });

      if (response.success) {
        toast.success(`Oportunidad movida a ${columnas.find(c => c.id === targetColumn)?.titulo}`);
      } else {
        // Revertir cambios si falla
        setOportunidades(prev =>
          prev.map(opp =>
            opp.id === itemId ? { ...opp, etapa: sourceColumn } : opp
          )
        );
        toast.error('Error al actualizar la oportunidad');
      }
    } catch (error) {
      console.error('Error moviendo oportunidad:', error);
      toast.error('Error al mover la oportunidad');
      // Revertir cambios
      setOportunidades(prev =>
        prev.map(opp =>
          opp.id === itemId ? { ...opp, etapa: sourceColumn } : opp
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pipeline de Ventas</h1>
          <p className="text-gray-600 mt-2">Gestión de oportunidades de negocio</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Configurar Etapas
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={handleNuevaOportunidad}
          >
            <Plus className="h-4 w-4" />
            Nueva Oportunidad
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Oportunidades Activas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Total Pipeline</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.valorTotal)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Ponderado</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.valorPonderado)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y View Toggle */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Filtros */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar oportunidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Select value={filterVendedor} onValueChange={setFilterVendedor}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por vendedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los vendedores</SelectItem>
              {vendedores.map(vendedor => (
                <SelectItem key={vendedor} value={vendedor}>{vendedor}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterTipoCliente} onValueChange={setFilterTipoCliente}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo de cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tipos</SelectItem>
              <SelectItem value="nuevo">Clientes nuevos</SelectItem>
              <SelectItem value="viejo">Clientes viejos</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterEtapa} onValueChange={setFilterEtapa}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Etapa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las etapas</SelectItem>
              {columnas.map(columna => (
                <SelectItem key={columna.id} value={columna.id}>{columna.titulo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'kanban'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <Kanban className="h-4 w-4" />
            Kanban
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'cards'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Tarjetas
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'list'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <List className="h-4 w-4" />
            Lista
          </button>
        </div>
      </div>

      {/* Vista Kanban con Drag & Drop */}
      {viewMode === 'kanban' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <UnifiedKanbanBoard
            columns={kanbanColumns}
            items={convertToKanbanItems(filteredOportunidades)}
            onItemMove={handleItemMove}
            onItemClick={(item) => handleVerOportunidad(item.customData)}
            onItemEdit={(item) => {
              const opp = oportunidades.find(o => o.id === item.id);
              if (opp) handleEditarOportunidad(opp);
            }}
            onItemDelete={(item) => {
              const opp = oportunidades.find(o => o.id === item.id);
              if (opp) handleEliminarOportunidad(opp);
            }}
            loading={loading}
            readOnly={false}
            showActions={true}
            customCardRenderer={(item) => {
              const opp = oportunidades.find(o => o.id === item.id);
              if (!opp) return null;

              return (
                <div
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleVerOportunidad(opp)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 flex-1">
                      {opp.titulo}
                    </h4>
                    <Badge
                      className="ml-2 text-xs"
                      style={{
                        backgroundColor: `${columnas.find(c => c.id === item.columnId)?.color}20`,
                        color: columnas.find(c => c.id === item.columnId)?.color
                      }}
                    >
                      {opp.probabilidad}%
                    </Badge>
                  </div>

                  <p className="text-xs text-gray-600 mb-2 line-clamp-1 font-medium">
                    {getEmpresaNombre(opp.cliente_id)}
                  </p>

                  <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                    {getContactoNombre(opp.contacto_id)}
                  </p>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Valor:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(opp.valor_estimado)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Vendedor:</span>
                      <span className="text-gray-700">{opp.vendedor_id}</span>
                    </div>

                    {opp.fecha_cierre_esperada && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Cierre:</span>
                        <span className="text-gray-700">
                          {new Date(opp.fecha_cierre_esperada).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {opp.evaluacion_necesidades && (
                      <div className="mt-2 pt-1 border-t border-gray-100">
                        <Badge variant="outline" className="text-xs">
                          <ClipboardCheck className="h-3 w-3 mr-1" />
                          Evaluada
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          />
        </div>
      )}

      {/* Vista de Tarjetas */}
      {viewMode === 'cards' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredOportunidades.map((oportunidad) => (
            <Card
              key={oportunidad.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4"
              style={{ borderLeftColor: columnas.find(c => c.id === oportunidad.etapa)?.color || '#6B7280' }}
              onClick={() => handleVerOportunidad(oportunidad)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                      {oportunidad.titulo}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{oportunidad.cliente}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      backgroundColor: `${columnas.find(c => c.id === oportunidad.etapa)?.color}20`,
                      borderColor: columnas.find(c => c.id === oportunidad.etapa)?.color,
                      color: columnas.find(c => c.id === oportunidad.etapa)?.color
                    }}
                  >
                    {columnas.find(c => c.id === oportunidad.etapa)?.titulo}
                  </Badge>
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {oportunidad.descripcion}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Valor:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(oportunidad.valor)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Probabilidad:</span>
                    <Badge className={getPrioridadColor(oportunidad.probabilidad)}>
                      {oportunidad.probabilidad}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Vendedor:</span>
                    <span className="text-xs text-gray-700">{oportunidad.vendedor}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Tipo Cliente:</span>
                    <Badge variant={oportunidad.tipoCliente === 'nuevo' ? 'default' : 'secondary'}>
                      {oportunidad.tipoCliente === 'nuevo' ? 'Nuevo' : 'Viejo'}
                    </Badge>
                  </div>

                  {oportunidad.fechaCierre && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Cierre:</span>
                      <span className="text-xs text-gray-700">
                        {new Date(oportunidad.fechaCierre).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Vista de Lista */}
      {viewMode === 'list' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Oportunidad
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Etapa
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Probabilidad
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendedor
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo Cliente
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cierre
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOportunidades.map((oportunidad) => (
                    <tr
                      key={oportunidad.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleVerOportunidad(oportunidad)}
                    >
                      <td className="p-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {oportunidad.titulo}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {oportunidad.descripcion}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-900">
                        {oportunidad.cliente}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            backgroundColor: `${columnas.find(c => c.id === oportunidad.etapa)?.color}20`,
                            borderColor: columnas.find(c => c.id === oportunidad.etapa)?.color,
                            color: columnas.find(c => c.id === oportunidad.etapa)?.color
                          }}
                        >
                          {columnas.find(c => c.id === oportunidad.etapa)?.titulo}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-900">
                        {formatCurrency(oportunidad.valor)}
                      </td>
                      <td className="p-4">
                        <Badge className={getPrioridadColor(oportunidad.probabilidad)}>
                          {oportunidad.probabilidad}%
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {oportunidad.vendedor}
                      </td>
                      <td className="p-4">
                        <Badge variant={oportunidad.tipoCliente === 'nuevo' ? 'default' : 'secondary'}>
                          {oportunidad.tipoCliente === 'nuevo' ? 'Nuevo' : 'Viejo'}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {oportunidad.fechaCierre ? new Date(oportunidad.fechaCierre).toLocaleDateString() : '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditarOportunidad(oportunidad);
                            }}
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEliminarOportunidad(oportunidad);
                            }}
                            className="h-8 w-8 p-0 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modales */}
      <NuevaOportunidadModal
        isOpen={showNuevaModal}
        onClose={() => setShowNuevaModal(false)}
        onSuccess={handleModalSuccess}
      />

      <EditarOportunidadModal
        isOpen={showEditarModal}
        onClose={() => setShowEditarModal(false)}
        oportunidad={oportunidadSeleccionada}
        onSuccess={handleModalSuccess}
      />

      <EliminarOportunidadModal
        isOpen={showEliminarModal}
        onClose={() => setShowEliminarModal(false)}
        oportunidad={oportunidadSeleccionada}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}