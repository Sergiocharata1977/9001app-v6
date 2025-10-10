'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Users, 
  Mail, 
  Phone,
  Search,
  Grid3X3,
  List,
  Building2,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOrganization } from '@/contexts/OrganizationContext';
import { crmContactoService } from '@/services/crmService';
import { toast } from 'sonner';
import { 
  NuevoContactoModal, 
  EditarContactoModal, 
  EliminarContactoModal 
} from '@/components/crm/modals';
import CrmCard from '@/components/crm/cards/CrmCard';

export default function ContactosPage() {
  const router = useRouter();
  const { organizationId } = useOrganization();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [contactos, setContactos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, empresas: 0, activos: 0 });

  // Estados de modales
  const [showNuevoModal, setShowNuevoModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [contactoSeleccionado, setContactoSeleccionado] = useState<any>(null);

  const loadContactos = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        ...(filterTipo !== 'todos' && { tipo_contacto: filterTipo }),
        limit: 100,
      };
      
      const response = await crmContactoService.getAll(organizationId, filters);
      if (response.success && response.data) {
        setContactos(response.data);
        setStats({
          total: response.data.length,
          empresas: new Set(response.data.map((c: any) => c.empresa_id).filter(Boolean)).size,
          activos: response.data.filter((c: any) => c.activo).length,
        });
      }
    } catch (error) {
      console.error('Error cargando contactos:', error);
      toast.error('Error al cargar contactos');
    } finally {
      setLoading(false);
    }
  }, [organizationId, filterTipo]);

  useEffect(() => {
    loadContactos();
  }, [loadContactos]);

  // Handlers de modales
  const handleNuevoContacto = () => {
    setShowNuevoModal(true);
  };

  const handleEditarContacto = (contacto: any) => {
    setContactoSeleccionado(contacto);
    setShowEditarModal(true);
  };

  const handleEliminarContacto = (contacto: any) => {
    setContactoSeleccionado(contacto);
    setShowEliminarModal(true);
  };

  const handleVerContacto = (contacto: any) => {
    router.push(`/crm/contactos/${contacto.id}`);
  };

  const handleModalSuccess = () => {
    loadContactos();
  };

  const filteredContactos = contactos.filter(contacto => {
    const matchesSearch = 
      contacto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacto.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacto.empresa?.razon_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacto.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
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
          <h1 className="text-3xl font-bold text-gray-900">Contactos</h1>
          <p className="text-gray-600 mt-2">Gestión de contactos de clientes</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={handleNuevoContacto}
        >
          <Plus className="h-4 w-4" />
          Nuevo Contacto
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, empresa o email..."
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
            <option value="comercial">Comercial</option>
            <option value="tecnico">Técnico</option>
            <option value="decision">Tomador de Decisiones</option>
            <option value="influencer">Influencer</option>
            <option value="usuario_final">Usuario Final</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Contactos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Empresas Relacionadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.empresas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Contactos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activos}</p>
              </div>
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
          {filteredContactos.length} contactos encontrados
        </div>
      </div>

      {/* Content */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContactos.map((contacto) => (
            <CrmCard
              key={contacto.id}
              item={contacto}
              type="contacto"
              onView={handleVerContacto}
              onEdit={handleEditarContacto}
              onDelete={handleEliminarContacto}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContactos.map((contacto) => (
            <CrmCard
              key={contacto.id}
              item={contacto}
              type="contacto"
              onView={handleVerContacto}
              onEdit={handleEditarContacto}
              onDelete={handleEliminarContacto}
            />
          ))}
        </div>
      )}

      {filteredContactos.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron contactos</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      {/* Modales */}
      <NuevoContactoModal
        isOpen={showNuevoModal}
        onClose={() => setShowNuevoModal(false)}
        onSuccess={handleModalSuccess}
      />

      <EditarContactoModal
        isOpen={showEditarModal}
        onClose={() => setShowEditarModal(false)}
        contacto={contactoSeleccionado}
        onSuccess={handleModalSuccess}
      />

      <EliminarContactoModal
        isOpen={showEliminarModal}
        onClose={() => setShowEliminarModal(false)}
        contacto={contactoSeleccionado}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
