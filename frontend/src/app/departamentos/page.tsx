'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, UserCheck, TrendingUp, Clock, Award } from 'lucide-react';
import { DepartmentListing } from '@/components/modules/hr/listings/DepartmentListing';
import { departmentService } from '@/services/departmentService';
import { personnelService } from '@/services/personnelService';
import { useToast } from '@/components/ui/use-toast';

export default function DepartamentosPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [deptData, personnelData] = await Promise.all([
        departmentService.getDepartments(1),
        personnelService.getPersonnel(1)
      ]);
      
      setDepartments(deptData);
      // Los gerentes son personal que puede ser asignado como responsable
      setManagers(personnelData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar los datos de departamentos"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para crear departamento
  const handleCreate = async (data: any) => {
    try {
      await departmentService.createDepartment({
        ...data,
        organization_id: 1,
        id: `dept_${Date.now()}`
      });
      await loadData();
      toast({
        title: "Éxito",
        description: "Departamento creado correctamente"
      });
    } catch (error) {
      console.error('Error creando departamento:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al crear el departamento"
      });
    }
  };

  // Handler para editar departamento
  const handleEdit = async (department: any) => {
    try {
      await departmentService.updateDepartment(department.id, department);
      await loadData();
      toast({
        title: "Éxito",
        description: "Departamento actualizado correctamente"
      });
    } catch (error) {
      console.error('Error actualizando departamento:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al actualizar el departamento"
      });
    }
  };

  // Handler para eliminar departamento
  const handleDelete = async (id: string) => {
    try {
      await departmentService.deleteDepartment(id);
      await loadData();
      toast({
        title: "Éxito",
        description: "Departamento eliminado correctamente"
      });
    } catch (error) {
      console.error('Error eliminando departamento:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al eliminar el departamento"
      });
    }
  };
  const stats = [
    {
      title: 'Total Departamentos',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Personal Total',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Gerentes Asignados',
      value: '10',
      change: '+1',
      changeType: 'positive',
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Eficiencia Promedio',
      value: '87%',
      change: '+3%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Evaluaciones Pendientes',
      value: '5',
      change: '-2',
      changeType: 'positive',
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Certificaciones ISO',
      value: '8/12',
      change: '+1',
      changeType: 'positive',
      icon: Award,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Departamentos</h1>
        <p className="text-gray-600 mt-2">
          Administración de la estructura organizacional y departamentos
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

      {/* Department Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Administración de Departamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DepartmentListing 
            data={departments}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
            isLoading={isLoading}
            managers={managers}
          />
        </CardContent>
      </Card>
    </div>
  );
}