'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  User,
  Target,
  Clock,
  Eye,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

interface RelatedEntityCardProps {
  type: 'empresa' | 'contacto' | 'oportunidad' | 'actividad';
  entity: {
    id: string;
    nombre?: string;
    apellidos?: string;
    razon_social?: string;
    titulo?: string;
    cargo?: string;
    email?: string;
    telefono?: string;
    valor_estimado?: number;
    probabilidad?: number;
    etapa?: string;
    estado?: string;
    fecha_actividad?: string;
    fecha_cierre_esperada?: string;
    ciudad?: string;
    estado_ubicacion?: string;
  };
  showActions?: boolean;
  compact?: boolean;
}

export default function RelatedEntityCard({ 
  type, 
  entity, 
  showActions = true, 
  compact = false 
}: RelatedEntityCardProps) {
  
  const getIcon = () => {
    switch (type) {
      case 'empresa':
        return <Building2 className="h-4 w-4" />;
      case 'contacto':
        return <User className="h-4 w-4" />;
      case 'oportunidad':
        return <Target className="h-4 w-4" />;
      case 'actividad':
        return <Clock className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'empresa':
        return 'bg-blue-100 text-blue-600';
      case 'contacto':
        return 'bg-green-100 text-green-600';
      case 'oportunidad':
        return 'bg-orange-100 text-orange-600';
      case 'actividad':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getEtapaColor = (etapa?: string) => {
    if (!etapa) return 'bg-gray-100 text-gray-800';
    const colors = {
      prospecto: 'bg-gray-100 text-gray-800',
      calificacion: 'bg-blue-100 text-blue-800',
      propuesta: 'bg-purple-100 text-purple-800',
      negociacion: 'bg-orange-100 text-orange-800',
      cierre: 'bg-green-100 text-green-800'
    };
    return colors[etapa as keyof typeof colors] || colors.prospecto;
  };

  const getEstadoColor = (estado?: string) => {
    if (!estado) return 'bg-gray-100 text-gray-800';
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (nombre?: string, apellidos?: string, razonSocial?: string) => {
    if (nombre && apellidos) {
      return `${nombre[0]}${apellidos[0]}`.toUpperCase();
    }
    if (razonSocial) {
      const words = razonSocial.split(' ');
      return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
    }
    return '??';
  };

  const renderContent = () => {
    switch (type) {
      case 'empresa':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded ${getTypeColor()}`}>
                {getIcon()}
              </div>
              <div>
                <p className="font-medium text-sm">{entity.razon_social}</p>
                {entity.cargo && <p className="text-xs text-gray-600">{entity.cargo}</p>}
              </div>
            </div>
            {entity.ciudad && entity.estado_ubicacion && (
              <p className="text-xs text-gray-500">{entity.ciudad}, {entity.estado_ubicacion}</p>
            )}
          </div>
        );

      case 'contacto':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded ${getTypeColor()}`}>
                {getIcon()}
              </div>
              <div>
                <p className="font-medium text-sm">{entity.nombre} {entity.apellidos}</p>
                {entity.cargo && <p className="text-xs text-gray-600">{entity.cargo}</p>}
              </div>
            </div>
            {entity.email && <p className="text-xs text-gray-500">{entity.email}</p>}
            {entity.telefono && <p className="text-xs text-gray-500">{entity.telefono}</p>}
          </div>
        );

      case 'oportunidad':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded ${getTypeColor()}`}>
                {getIcon()}
              </div>
              <div>
                <p className="font-medium text-sm">{entity.titulo}</p>
                {entity.valor_estimado && (
                  <p className="text-xs text-gray-600">
                    ${entity.valor_estimado.toLocaleString()}
                    {entity.probabilidad && ` • ${entity.probabilidad}%`}
                  </p>
                )}
              </div>
            </div>
            {entity.etapa && (
              <Badge className={getEtapaColor(entity.etapa)} variant="secondary">
                {entity.etapa}
              </Badge>
            )}
            {entity.fecha_cierre_esperada && (
              <p className="text-xs text-gray-500">
                Cierre: {new Date(entity.fecha_cierre_esperada).toLocaleDateString()}
              </p>
            )}
          </div>
        );

      case 'actividad':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded ${getTypeColor()}`}>
                {getIcon()}
              </div>
              <div>
                <p className="font-medium text-sm">{entity.titulo}</p>
                {entity.fecha_actividad && (
                  <p className="text-xs text-gray-600">
                    {new Date(entity.fecha_actividad).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            {entity.estado && (
              <Badge className={getEstadoColor(entity.estado)} variant="secondary">
                {entity.estado}
              </Badge>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const getDetailUrl = () => {
    switch (type) {
      case 'empresa':
        return `/crm/empresas/${entity.id}`;
      case 'contacto':
        return `/crm/contactos/${entity.id}`;
      case 'oportunidad':
        return `/crm/oportunidades/${entity.id}`;
      case 'actividad':
        return `/crm/actividades/${entity.id}`;
      default:
        return '#';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded ${getTypeColor()}`}>
            {getIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">
              {entity.razon_social || entity.titulo || `${entity.nombre} ${entity.apellidos}`}
            </p>
            {entity.cargo && <p className="text-xs text-gray-500 truncate">{entity.cargo}</p>}
          </div>
        </div>
        {showActions && (
          <Link href={getDetailUrl()}>
            <Button size="sm" variant="ghost">
              <Eye className="h-3 w-3" />
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {renderContent()}
        
        {showActions && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex items-center space-x-1">
              {type === 'contacto' && entity.telefono && (
                <Button size="sm" variant="outline">
                  <Phone className="h-3 w-3" />
                </Button>
              )}
              {type === 'contacto' && entity.email && (
                <Button size="sm" variant="outline">
                  <Mail className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Link href={getDetailUrl()}>
              <Button size="sm" variant="outline">
                <Eye className="h-3 w-3 mr-1" />
                Ver
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
























