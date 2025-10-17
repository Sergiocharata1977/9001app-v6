'use client';

import PersonalForm from '@/components/rrhh/PersonalForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useABM from '@/hooks/useABM';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Tipos para Personal
interface Personal {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  departamento: string;
  puesto: string;
  fecha_ingreso: string;
  salario?: number;
  estado: string;
  observaciones?: string;
}

export default function PersonalABMPage() {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedPersonal, setSelectedPersonal] = useState<Personal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Hook ABM para operaciones CRUD
  const { items, loading, error, create, update, remove, refresh } = useABM('/rrhh/personal');

  // Manejar creación
  const handleCreate = async (data: any) => {
    try {
      await create(data);
      setShowForm(false);
      setSelectedPersonal(null);
    } catch (err) {
      console.error('Error al crear personal:', err);
    }
  };

  // Manejar edición
  const handleEdit = async (data: any) => {
    if (!selectedPersonal) return;
    
    try {
      await update(selectedPersonal.id, data);
      setShowForm(false);
      setSelectedPersonal(null);
    } catch (err) {
      console.error('Error al editar personal:', err);
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        await remove(id);
      } catch (err) {
        console.error('Error al eliminar personal:', err);
      }
    }
  };

  // Abrir formulario
  const openForm = (mode: 'create' | 'edit' | 'view', personal?: Personal) => {
    setFormMode(mode);
    setSelectedPersonal(personal || null);
    setShowForm(true);
  };

  // Cerrar formulario
  const closeForm = () => {
    setShowForm(false);
    setSelectedPersonal(null);
  };

  // Filtrar items
  const filteredItems = items.filter((item: Personal) => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || item.estado === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Obtener color del badge según estado
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-red-100 text-red-800';
      case 'vacaciones': return 'bg-blue-100 text-blue-800';
      case 'licencia': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return (
      <div className="container mx-auto p-6">
        <PersonalForm
          mode={formMode}
          initialData={selectedPersonal}
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
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Personal</h1>
        <p className="text-gray-600 mt-2">Administra el personal de la empresa</p>
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
                  placeholder="Buscar por nombre, apellido o email..."
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
                  <SelectItem value="vacaciones">En Vacaciones</SelectItem>
                  <SelectItem value="licencia">En Licencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botón crear */}
            <Button onClick={() => openForm('create')} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de personal */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Cargando personal...</span>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600">Error al cargar personal: {error}</p>
              <Button onClick={refresh} className="mt-4">
                Reintentar
              </Button>
            </CardContent>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No se encontró personal</p>
              <Button onClick={() => openForm('create')} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Crear primer empleado
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((personal: Personal) => (
            <Card key={personal.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {personal.nombre} {personal.apellido}
                        </h3>
                        <p className="text-gray-600">{personal.email}</p>
                        <p className="text-sm text-gray-500">
                          {personal.puesto} • {personal.departamento}
                        </p>
                      </div>
                      <Badge className={getStatusColor(personal.estado)}>
                        {personal.estado}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openForm('view', personal)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openForm('edit', personal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(personal.id)}
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
                  {items.filter((item: Personal) => item.estado === 'activo').length}
                </p>
                <p className="text-sm text-gray-600">Activos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {items.filter((item: Personal) => item.estado === 'vacaciones').length}
                </p>
                <p className="text-sm text-gray-600">En Vacaciones</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {items.filter((item: Personal) => item.estado === 'inactivo').length}
                </p>
                <p className="text-sm text-gray-600">Inactivos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



