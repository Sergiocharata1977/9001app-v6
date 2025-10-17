'use client';

import React from 'react';
import { Personnel } from '@/shared-types/entities/Personnel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Building2, 
  Briefcase,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PersonnelCardProps {
  personnel: Personnel;
  onEdit?: (personnel: Personnel) => void;
  onView?: (personnel: Personnel) => void;
  onDelete?: (id: string) => void;
}

export function PersonnelCard({ personnel, onEdit, onView, onDelete }: PersonnelCardProps) {
  const getStatusBadge = (isActive: boolean) => (
    <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? 'Activo' : 'Inactivo'}
    </Badge>
  );

  const getPositionBadge = (position: string) => {
    const colors = {
      'Gerente': 'bg-purple-100 text-purple-800',
      'Supervisor': 'bg-blue-100 text-blue-800',
      'Técnico': 'bg-green-100 text-green-800',
      'Administrativo': 'bg-orange-100 text-orange-800',
      'Operario': 'bg-gray-100 text-gray-800'
    };
    
    const colorClass = colors[position as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    
    return (
      <Badge className={colorClass}>
        {position}
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {personnel.firstName} {personnel.lastName}
              </h3>
              <p className="text-sm text-gray-500">{personnel.employeeId}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(personnel)}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(personnel)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(personnel.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status and Position */}
        <div className="flex gap-2 mb-4">
          {getStatusBadge(personnel.isActive)}
          {personnel.position && getPositionBadge(personnel.position)}
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{personnel.email}</span>
          </div>
          
          {personnel.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{personnel.phone}</span>
            </div>
          )}
          
          {personnel.departmentName && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>{personnel.departmentName}</span>
            </div>
          )}
          
          {personnel.position && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="h-4 w-4" />
              <span>{personnel.position}</span>
            </div>
          )}
        </div>

        {/* Hire Date */}
        {personnel.hireDate && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Calendar className="h-4 w-4" />
            <span>Ingreso: {personnel.hireDate.toLocaleDateString()}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onView?.(personnel)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Perfil
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit?.(personnel)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
