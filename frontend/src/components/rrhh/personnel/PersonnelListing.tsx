import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Grid, List, Plus, Search, Filter, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PersonnelCard } from './PersonnelCard';
import { personnelService, Personnel } from '@/services/personnelService';

interface PersonnelListingProps {
  organizationId?: number;
  onViewPersonnel?: (personnel: Personnel) => void;
  onEditPersonnel?: (personnel: Personnel) => void;
  onNewPersonnel?: () => void;
}

export const PersonnelListing: React.FC<PersonnelListingProps> = ({
  organizationId = 1,
  onViewPersonnel,
  onEditPersonnel,
  onNewPersonnel
}) => {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personnelToDelete, setPersonnelToDelete] = useState<Personnel | null>(null);
  const { toast } = useToast();

  // Cargar datos
  const fetchData = useCallback(async () => {
    setLoadingData(true);
    setLocalError(null);

    try {
      console.log('Cargando datos de personal...');
      const data = await personnelService.getPersonnel(organizationId);
      console.log('Datos de personal cargados:', data);
      setPersonnel(data || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setLocalError('Error al cargar los datos. Por favor, intenta de nuevo más tarde.');
      setPersonnel([]);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar los datos. Por favor, intenta de nuevo más tarde."
      });
    } finally {
      setLoadingData(false);
    }
  }, [organizationId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtrar personal
  const filteredPersonnel = useMemo(() => {
    if (!searchTerm.trim()) return personnel;

    const searchLower = searchTerm.toLowerCase();
    return personnel.filter(person =>
      person.nombres?.toLowerCase().includes(searchLower) ||
      person.apellidos?.toLowerCase().includes(searchLower) ||
      person.email?.toLowerCase().includes(searchLower) ||
      person.numero_legajo?.toLowerCase().includes(searchLower) ||
      person.tipo_personal?.toLowerCase().includes(searchLower)
    );
  }, [personnel, searchTerm]);

  // Handlers
  const handleView = useCallback((person: Personnel) => {
    onViewPersonnel?.(person);
  }, [onViewPersonnel]);

  const handleEdit = useCallback((person: Personnel) => {
    onEditPersonnel?.(person);
  }, [onEditPersonnel]);

  const handleDelete = useCallback((person: Personnel) => {
    setPersonnelToDelete(person);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!personnelToDelete) return;

    try {
      await personnelService.deletePersonnel(personnelToDelete.id);
      setPersonnel(prev => prev.filter(p => p.id !== personnelToDelete.id));
      toast({
        title: "Éxito",
        description: "Personal eliminado correctamente"
      });
    } catch (err) {
      console.error('Error al eliminar personal:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al eliminar el personal"
      });
    } finally {
      setDeleteDialogOpen(false);
      setPersonnelToDelete(null);
    }
  }, [personnelToDelete, toast]);

  const handleNewPersonnel = useCallback(() => {
    onNewPersonnel?.();
  }, [onNewPersonnel]);

  // Renderizar contenido
  const renderContent = useMemo(() => {
    if (loadingData) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (filteredPersonnel.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm ? 'No se encontró personal' : 'No hay personal registrado'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'No se encontraron resultados que coincidan con tu búsqueda.'
              : 'Comienza agregando el primer miembro del personal.'
            }
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button onClick={handleNewPersonnel} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Personal
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonnel.map(person => (
            <PersonnelCard
              key={person.id}
              personnel={person}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      );
    }

    // Vista de tabla (lista)
    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPersonnel.map(person => (
                  <tr key={person.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {person.nombres} {person.apellidos}
                        </div>
                        {person.numero_legajo && (
                          <div className="text-sm text-gray-500">
                            Legajo: {person.numero_legajo}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className={
                        person.tipo_personal === 'gerencial' ? 'border-purple-300 text-purple-700' :
                        person.tipo_personal === 'ventas' ? 'border-green-300 text-green-700' :
                        person.tipo_personal === 'técnico' ? 'border-blue-300 text-blue-700' :
                        'border-gray-300 text-gray-700'
                      }>
                        {person.tipo_personal}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={
                        person.estado === 'Activo' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {person.estado}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleView(person)}
                        >
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(person)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(person)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Eliminar
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
    );
  }, [filteredPersonnel, loadingData, searchTerm, viewMode, handleView, handleEdit, handleDelete, handleNewPersonnel]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Personal</h2>
          <p className="text-gray-600">Administra el personal de la organización</p>
        </div>
        <Button onClick={handleNewPersonnel} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Personal
        </Button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar personal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="mr-2 h-4 w-4" />
              Tarjetas
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="mr-2 h-4 w-4" />
              Tabla
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {renderContent}
      </div>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente al personal{' '}
              <span className="font-semibold">
                {personnelToDelete?.nombres} {personnelToDelete?.apellidos}
              </span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};