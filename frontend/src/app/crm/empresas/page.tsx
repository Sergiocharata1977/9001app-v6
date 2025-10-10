'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  Grid3X3,
  List,
  User,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOrganization } from '@/contexts/OrganizationContext';
import { crmClienteService } from '@/services/crmService';
import type { CRMCliente } from '@/types/crm';
import { toast } from 'sonner';
import { 
  NuevaEmpresaModal, 
  EditarEmpresaModal, 
  EliminarEmpresaModal 
} from '@/components/crm/modals';
import CrmCard from '@/components/crm/cards/CrmCard';

export default function EmpresasPage() {
  const router = useRouter();
  const { organizationId } = useOrganization();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [empresas, setEmpresas] = useState<CRMCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, totalSuperficie: 0 });

  // Estados de modales
  const [showNuevaModal, setShowNuevaModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<any>(null);

  const loadEmpresas = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        ...(filterTipo !== 'todos' && { tipo_cliente: filterTipo }),
        limit: 100, // Cargar más para filtrado local
      };
      
      const response = await crmClienteService.getAll(organizationId, filters);
      if (response.success && response.data) {
        setEmpresas(response.data);
      }
    } catch (error) {
      console.error('Error cargando empresas:', error);
      toast.error('Error al cargar empresas');
    } finally {
      setLoading(false);
    }
  }, [organizationId, filterTipo]);

  const loadStats = useCallback(async () => {
    try {
      const response = await crmClienteService.getStats(organizationId);
      if (response.success && response.data) {
        setStats({
          total: response.data.total,
          totalSuperficie: response.data.totalSuperficie,
        });
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  }, [organizationId]);

  // Cargar empresas
  useEffect(() => {
    loadEmpresas();
    loadStats();
  }, [loadEmpresas, loadStats]);

  // Handlers de modales
  const handleNuevaEmpresa = () => {
    setShowNuevaModal(true);
  };

  const handleEditarEmpresa = (empresa: any) => {
    setEmpresaSeleccionada(empresa);
    setShowEditarModal(true);
  };

  const handleEliminarEmpresa = (empresa: any) => {
    setEmpresaSeleccionada(empresa);
    setShowEliminarModal(true);
  };

  const handleVerEmpresa = (empresa: any) => {
    router.push(`/crm/empresas/${empresa.id}`);
  };

  const handleModalSuccess = () => {
    loadEmpresas();
    loadStats();
  };

  const getTipoClienteColor = (tipo: string) => {
    const colors = {
      pequeño: 'bg-blue-100 text-blue-800',
      mediano: 'bg-green-100 text-green-800',
      grande: 'bg-purple-100 text-purple-800',
      corporativo: 'bg-orange-100 text-orange-800'
    };
    return colors[tipo as keyof typeof colors] || colors.mediano;
  };

  const getInitials = (razonSocial: string) => {
    return razonSocial.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  const filteredEmpresas = empresas.filter(empresa => {
    const matchesSearch = empresa.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa.zona_geografica?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
          <p className="text-gray-600 mt-2">Gestión de clientes y empresas agropecuarias</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={handleNuevaEmpresa}
        >
          <Plus className="h-4 w-4" />
          Nueva Empresa
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, ciudad o zona..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todos los tipos</option>
            <option value="pequeño">Pequeño</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
            <option value="corporativo">Corporativo</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Empresas</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Superficie Total</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalSuperficie?.toLocaleString() || 0} ha
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Clientes Grandes</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {empresas.filter(e => e.tipo_cliente === 'grande' || e.tipo_cliente === 'corporativo').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Zonas Activas</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {new Set(empresas.map(e => e.zona_geografica).filter(Boolean)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center">
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
        <div className="text-sm text-gray-600">
          {filteredEmpresas.length} empresas encontradas
        </div>
      </div>

      {/* Content - Vista Tarjetas */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmpresas.map((empresa) => (
            <CrmCard
              key={empresa.id}
              item={empresa}
              type="empresa"
              onView={handleVerEmpresa}
              onEdit={handleEditarEmpresa}
              onDelete={handleEliminarEmpresa}
            />
          ))}
        </div>
      ) : (
        /* Vista Lista */
        <div className="space-y-4">
          {filteredEmpresas.map((empresa) => (
            <CrmCard
              key={empresa.id}
              item={empresa}
              type="empresa"
              onView={handleVerEmpresa}
              onEdit={handleEditarEmpresa}
              onDelete={handleEliminarEmpresa}
            />
          ))}
        </div>
      )}

      {filteredEmpresas.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron empresas</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      {/* Modales */}
      <NuevaEmpresaModal
        isOpen={showNuevaModal}
        onClose={() => setShowNuevaModal(false)}
        onSuccess={handleModalSuccess}
      />

      <EditarEmpresaModal
        isOpen={showEditarModal}
        onClose={() => setShowEditarModal(false)}
        empresa={empresaSeleccionada}
        onSuccess={handleModalSuccess}
      />

      <EliminarEmpresaModal
        isOpen={showEliminarModal}
        onClose={() => setShowEliminarModal(false)}
        empresa={empresaSeleccionada}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
