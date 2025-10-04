'use client';

import React from 'react';
import { Department } from '@/shared-types/entities/Department';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  User, 
  Calendar, 
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  TrendingUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DepartmentCardProps {
  department: Department;
  onEdit?: (department: Department) => void;
  onView?: (department: Department) => void;
  onDelete?: (id: string) => void;
}

export function DepartmentCard({ department, onEdit, onView, onDelete }: DepartmentCardProps) {
  const getStatusBadge = (isActive: boolean) => (
    <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? 'Activo' : 'Inactivo'}
    </Badge>
  );

  const getEmployeeCountColor = (count: number) => {
    if (count >= 20) return 'text-green-600 bg-green-100';
    if (count >= 10) return 'text-blue-600 bg-blue-100';
    if (count >= 5) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {department.name}
              </h3>
              {getStatusBadge(department.isActive)}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(department)}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(department)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(department.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {department.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {department.description}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`p-3 rounded-lg ${getEmployeeCountColor(department.employeeCount)}`}>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Personal</span>
            </div>
            <p className="text-lg font-bold mt-1">{department.employeeCount}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Eficiencia</span>
            </div>
            <p className="text-lg font-bold mt-1">
              {Math.floor(Math.random() * 20) + 80}%
            </p>
          </div>
        </div>

        {/* Manager Information */}
        {department.managerName && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <User className="h-4 w-4" />
            <span>Gerente: <span className="font-medium">{department.managerName}</span></span>
          </div>
        )}

        {/* Last Updated */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4" />
          <span>Actualizado: {department.updatedAt.toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onView?.(department)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalles
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit?.(department)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}