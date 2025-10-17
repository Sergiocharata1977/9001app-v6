'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  DollarSign,
  User,
  Building,
  Phone,
  Mail
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CrmCardProps {
  item: any;
  type: 'oportunidad' | 'empresa' | 'contacto' | 'actividad';
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  className?: string;
}

export default function CrmCard({ 
  item, 
  type, 
  onView, 
  onEdit, 
  onDelete, 
  className = '' 
}: CrmCardProps) {
  const handleCardClick = () => {
    onView?.(item);
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'oportunidad':
        return <DollarSign className="h-4 w-4" />;
      case 'empresa':
        return <Building className="h-4 w-4" />;
      case 'contacto':
        return <User className="h-4 w-4" />;
      case 'actividad':
        return <Calendar className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'oportunidad':
        return 'bg-blue-100 text-blue-800';
      case 'empresa':
        return 'bg-green-100 text-green-800';
      case 'contacto':
        return 'bg-purple-100 text-purple-800';
      case 'actividad':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      // Oportunidades
      'prospecto': 'bg-yellow-100 text-yellow-800',
      'calificacion': 'bg-blue-100 text-blue-800',
      'propuesta': 'bg-purple-100 text-purple-800',
      'negociacion': 'bg-orange-100 text-orange-800',
      'cierre': 'bg-green-100 text-green-800',
      
      // Actividades
      'programada': 'bg-blue-100 text-blue-800',
      'en_curso': 'bg-yellow-100 text-yellow-800',
      'completada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800',
    };

    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const renderCardContent = () => {
    switch (type) {
      case 'oportunidad':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 truncate">{item.titulo}</h3>
              <Badge className={getStatusBadge(item.etapa)}>{item.etapa}</Badge>
            </div>
            <p className="text-sm text-gray-600">{item.cliente?.razon_social || 'Sin cliente'}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                ${item.valor_estimado?.toLocaleString()} {item.moneda}
              </span>
              <span>{item.probabilidad}%</span>
            </div>
          </div>
        );

      case 'empresa':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 truncate">{item.razon_social}</h3>
              <Badge className={getTypeColor()}>{item.industria}</Badge>
            </div>
            <p className="text-sm text-gray-600">{item.nombre_comercial}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {item.numero_empleados} empleados
              </span>
              {item.telefono && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {item.telefono}
                </span>
              )}
            </div>
          </div>
        );

      case 'contacto':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 truncate">
                {item.nombre} {item.apellidos}
              </h3>
              <Badge className={getTypeColor()}>{item.tipo_contacto}</Badge>
            </div>
            <p className="text-sm text-gray-600">{item.cargo}</p>
            <p className="text-sm text-gray-500">{item.empresa?.razon_social}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {item.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {item.email}
                </span>
              )}
              {item.telefono && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {item.telefono}
                </span>
              )}
            </div>
          </div>
        );

      case 'actividad':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 truncate">{item.titulo}</h3>
              <Badge className={getStatusBadge(item.estado)}>{item.estado}</Badge>
            </div>
            <p className="text-sm text-gray-600 capitalize">{item.tipo}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(item.fecha_programada).toLocaleDateString()}
              </span>
              <span>{item.duracion_minutos} min</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow duration-200 ${className}`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <CardTitle className="text-sm font-medium text-gray-600 capitalize">
              {type}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView?.(item); }}>
                <Eye className="h-4 w-4 mr-2" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(item); }}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete?.(item); }}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {renderCardContent()}
      </CardContent>
    </Card>
  );
}

























