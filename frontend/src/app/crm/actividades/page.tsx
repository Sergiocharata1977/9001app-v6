'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle,
  Phone,
  Mail,
  Users,
  Video,
  MapPin,
  Search,
  Loader2,
  Edit,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOrganization } from '@/contexts/OrganizationContext';
import { crmActividadService } from '@/services/crmService';
import type { CRMActividad } from '@/types/crm';
import { toast } from 'sonner';
import { 
  NuevaActividadModal, 
  EditarActividadModal, 
  EliminarActividadModal 
} from '@/components/crm/modals';
import CrmCard from '@/components/crm/cards/CrmCard';

export default function ActividadesPage() {
  const router = useRouter();
  const { organizationId } = useOrganization();
  const [actividades, setActividades] = useState<CRMActividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');

  // Estados de modales
  const [showNuevaModal, setShowNuevaModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState<any>(null);

  const loadActividades = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        ...(filterEstado !== 'todos' && { estado: filterEstado }),
        limit: 100,
      };
      
      const response = await crmActividadService.getAll(organizationId, filters);
      if (response.success && response.data) {
        setActividades(response.data);
      }
    } catch (error) {
      console.error('Error cargando actividades:', error);
      toast.error('Error al cargar actividades');
    } finally {
      setLoading(false);
    }
  }, [organizationId, filterEstado]);

  useEffect(() => {
    loadActividades();
  }, [loadActividades]);

  // Handlers de modales
  const handleNuevaActividad = () => {
    setShowNuevaModal(true);
  };

  const handleEditarActividad = (actividad: any) => {
    setActividadSeleccionada(actividad);
    setShowEditarModal(true);
  };

  const handleEliminarActividad = (actividad: any) => {
    setActividadSeleccionada(actividad);
    setShowEliminarModal(true);
  };

  const handleVerActividad = (actividad: any) => {
    router.push(`/crm/actividades/${actividad.id}`);
  };

  const handleModalSuccess = () => {
    loadActividades();
  };

  const handleComplete = async (id: string) => {
    try {
      const response = await crmActividadService.complete(id, organizationId);
      if (response.success) {
        toast.success('Actividad completada correctamente');
        loadActividades();
      }
    } catch (error) {
      console.error('Error completando actividad:', error);
      toast.error('Error al completar actividad');
    }
  };

  const getTipoIcon = (tipo?: string) => {
    switch (tipo) {
      case 'llamada': return Phone;
      case 'email': return Mail;
      case 'reunion': return Users;
      case 'visita': return MapPin;
      case 'demo': return Video;
      default: return Calendar;
    }
  };

  const getEstadoColor = (estado?: string) => {
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800';
      case 'programada': return 'bg-blue-100 text-blue-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'reprogramada': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredActividades = actividades.filter(act => {
    const matchesSearch = act.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         act.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const statsData = {
    programadas: actividades.filter(a => a.estado === 'programada').length,
    pendientesHoy: actividades.filter(a => {
      if (a.estado !== 'programada') return false;
      const today = new Date().toISOString().split('T')[0];
      const actDate = a.fecha_actividad.split('T')[0];
      return actDate === today;
    }).length,
    completadas: actividades.filter(a => a.estado === 'completada').length,
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Actividades</h1>
          <p className="text-gray-600 mt-2">Gestión de actividades y seguimiento de clientes</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={handleNuevaActividad}
        >
          <Plus className="h-4 w-4" />
          Nueva Actividad
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por título o descripción..."
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
            <option value="programada">Programada</option>
            <option value="en_curso">En Curso</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Programadas</p>
                <p className="text-2xl font-bold text-gray-900">{statsData.programadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendientes Hoy</p>
                <p className="text-2xl font-bold text-gray-900">{statsData.pendientesHoy}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{statsData.completadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActividades.map((actividad) => (
          <CrmCard
            key={actividad.id}
            item={actividad}
            type="actividad"
            onView={handleVerActividad}
            onEdit={handleEditarActividad}
            onDelete={handleEliminarActividad}
          />
        ))}
      </div>

      {filteredActividades.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron actividades</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      {/* Modales */}
      <NuevaActividadModal
        isOpen={showNuevaModal}
        onClose={() => setShowNuevaModal(false)}
        onSuccess={handleModalSuccess}
      />

      <EditarActividadModal
        isOpen={showEditarModal}
        onClose={() => setShowEditarModal(false)}
        actividad={actividadSeleccionada}
        onSuccess={handleModalSuccess}
      />

      <EliminarActividadModal
        isOpen={showEliminarModal}
        onClose={() => setShowEliminarModal(false)}
        actividad={actividadSeleccionada}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
