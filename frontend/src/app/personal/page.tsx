'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Building2, Award, TrendingUp, Clock } from 'lucide-react';
import { PersonnelListing } from '@/components/modules/hr/listings/PersonnelListing';
import { personnelService } from '@/services/personnelService';
import { departmentService } from '@/services/departmentService';
import { useToast } from '@/components/ui/use-toast';

export default function PersonalPage() {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [personnelData, deptData] = await Promise.all([
        personnelService.getPersonnel(1),
        departmentService.getDepartments(1)
      ]);
      
      setPersonnel(personnelData);
      setDepartments(deptData);
      
      // Los supervisores son el mismo personal filtrado
      setSupervisors(personnelData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar los datos de personal"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para crear personal
  const handleCreate = async (data: any) => {
    try {
      await personnelService.createPersonnel({
        ...data,
        organization_id: 1,
        id: `per_${Date.now()}`
      });
      await loadData();
      toast({
        title: "Éxito",
        description: "Personal creado correctamente"
      });
    } catch (error) {
      console.error('Error creando personal:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al crear el personal"
      });
    }
  };

  // Handler para editar personal
  const handleEdit = async (personnel: any) => {
    try {
      await personnelService.updatePersonnel(personnel.id, personnel);
      await loadData();
      toast({
        title: "Éxito",
        description: "Personal actualizado correctamente"
      });
    } catch (error) {
      console.error('Error actualizando personal:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al actualizar el personal"
      });
    }
  };

  // Handler para eliminar personal
  const handleDelete = async (id: string) => {
    try {
      await personnelService.deletePersonnel(id);
      await loadData();
      toast({
        title: "Éxito",
        description: "Personal eliminado correctamente"
      });
    } catch (error) {
      console.error('Error eliminando personal:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al eliminar el personal"
      });
    }
  };
  const stats = [
    {
      title: 'Total Empleados',
      value: '156',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Nuevos Ingresos',
      value: '8',
      change: '+25%',
      changeType: 'positive',
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Departamentos Activos',
      value: '12',
      change: '0%',
      changeType: 'neutral',
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Personal Certificado',
      value: '89%',
      change: '+5%',
      changeType: 'positive',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Evaluaciones Pendientes',
      value: '23',
      change: '-15%',
      changeType: 'positive',
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Índice de Satisfacción',
      value: '4.2/5',
      change: '+0.3',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Personal</h1>
        <p className="text-gray-600 mt-2">
          Administración integral del recurso humano y desarrollo organizacional
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">vs mes anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Personnel Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Administración de Personal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PersonnelListing 
            data={personnel}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
            isLoading={isLoading}
            departments={departments}
            supervisors={supervisors}
          />
        </CardContent>
      </Card>
    </div>
  );
}