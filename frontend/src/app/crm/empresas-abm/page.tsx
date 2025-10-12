'use client';

import EmpresasForm from '@/components/CRM/EmpresasForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useABM from '@/hooks/useABM';
import { Building2, Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Tipos para Empresas
interface Empresa {
  id: string;
  nombre: string;
  cuit: string;
  email: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  provincia: string;
  codigo_postal?: string;
  sector: string;
  tamaño: string;
  fecha_registro: string;
  estado: string;
  observaciones?: string;
}

export default function EmpresasABMPage() {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSector, setFilterSector] = useState('all');

  // Hook ABM para operaciones CRUD
  const { items, loading, error, create, update, remove, refresh } = useABM('/crm/empresas');

  // Manejar creación
  const handleCreate = async (data: any) => {
    try {
      await create(data);
      setShowForm(false);
      setSelectedEmpresa(null);
    } catch (err) {
      console.error('Error al crear empresa:', err);
    }
  };

  // Manejar edición
  const handleEdit = async (data: any) => {
    if (!selectedEmpresa) return;
    
    try {
      await update(selectedEmpresa.id, data);
      setShowForm(false);
      setSelectedEmpresa(null);
    } catch (err) {
      console.error('Error al editar empresa:', err);
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta empresa?')) {
      try {
        await remove(id);
      } catch (err) {
        console.error('Error al eliminar empresa:', err);
      }
    }
  };

  // Abrir formulario
  const openForm = (mode: 'create' | 'edit' | 'view', empresa?: Empresa) => {
    setFormMode(mode);
    setSelectedEmpresa(empresa || null);
    setShowForm(true);
  };

  // Cerrar formulario
  const closeForm = () => {
    setShowForm(false);
    setSelectedEmpresa(null);
  };

  // Filtrar items
  const filteredItems = items.filter((item: Empresa) => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.cuit.includes(searchTerm) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || item.estado === filterStatus;
    const matchesSector = filterSector === 'all' || item.sector === filterSector;
    
    return matchesSearch && matchesStatus && matchesSector;
  });

  // Obtener color del badge según estado
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-red-100 text-red-800';
      case 'prospecto': return 'bg-blue-100 text-blue-800';
      case 'cliente': return 'bg-purple-100 text-purple-800';
      case 'ex_cliente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener color del badge según sector
  const getSectorColor = (sector: string) => {
    switch (sector) {
      case 'tecnologia': return 'bg-blue-100 text-blue-800';
      case 'manufactura': return 'bg-green-100 text-green-800';
      case 'servicios': return 'bg-purple-100 text-purple-800';
      case 'comercio': return 'bg-yellow-100 text-yellow-800';
      case 'construccion': return 'bg-orange-100 text-orange-800';
      case 'salud': return 'bg-red-100 text-red-800';
      case 'educacion': return 'bg-indigo-100 text-indigo-800';
      case 'finanzas': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return (
      <div className="container mx-auto p-6">
        <EmpresasForm
          mode={formMode}
          initialData={selectedEmpresa}
          onSave={formMode === 'create' ? handleCreate : handleEdit}
          onCancel={closeForm}
          loading={loading}
          error={error}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Empresas</h1>
        <p className="text-gray-600 mt-2">Administra las empresas y clientes</p>
      </div>

      {/* Controles */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, CUIT o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro por estado */}
            <div className="w-full md:w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="prospecto">Prospecto</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="ex_cliente">Ex Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por sector */}
            <div className="w-full md:w-48">
              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los sectores</SelectItem>
                  <SelectItem value="tecnologia">Tecnología</SelectItem>
                  <SelectItem value="manufactura">Manufactura</SelectItem>
                  <SelectItem value="servicios">Servicios</SelectItem>
                  <SelectItem value="comercio">Comercio</SelectItem>
                  <SelectItem value="construccion">Construcción</SelectItem>
                  <SelectItem value="salud">Salud</SelectItem>
                  <SelectItem value="educacion">Educación</SelectItem>
                  <SelectItem value="finanzas">Finanzas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botón crear */}
            <Button onClick={() => openForm('create')} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Empresa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de empresas */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Cargando empresas...</span>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600">Error al cargar empresas: {error}</p>
              <Button onClick={refresh} className="mt-4">
                Reintentar
              </Button>
            </CardContent>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No se encontraron empresas</p>
              <Button onClick={() => openForm('create')} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Crear primera empresa
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((empresa: Empresa) => (
            <Card key={empresa.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-lg">{empresa.nombre}</h3>
                        <p className="text-gray-600">CUIT: {empresa.cuit}</p>
                        <p className="text-sm text-gray-500">{empresa.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(empresa.estado)}>
                            {empresa.estado}
                          </Badge>
                          <Badge className={getSectorColor(empresa.sector)}>
                            {empresa.sector}
                          </Badge>
                          <Badge variant="outline">
                            {empresa.tamaño}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openForm('view', empresa)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openForm('edit', empresa)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(empresa.id)}
                      className="text-red-600 hover:text-red-700"
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

      {/* Estadísticas */}
      {items.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{items.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {items.filter((item: Empresa) => item.estado === 'activo').length}
                </p>
                <p className="text-sm text-gray-600">Activas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {items.filter((item: Empresa) => item.estado === 'cliente').length}
                </p>
                <p className="text-sm text-gray-600">Clientes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {items.filter((item: Empresa) => item.estado === 'prospecto').length}
                </p>
                <p className="text-sm text-gray-600">Prospectos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



