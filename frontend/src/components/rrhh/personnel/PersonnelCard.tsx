import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, User, Phone, Mail } from 'lucide-react';
import { Personnel } from '@/services/personnelService';

interface PersonnelCardProps {
  personnel: Personnel;
  onView?: (personnel: Personnel) => void;
  onEdit?: (personnel: Personnel) => void;
  onDelete?: (personnel: Personnel) => void;
}

export const PersonnelCard: React.FC<PersonnelCardProps> = ({
  personnel,
  onView,
  onEdit,
  onDelete
}) => {
  const getTipoPersonalColor = (tipo: string) => {
    switch (tipo) {
      case 'gerencial': return 'bg-purple-100 text-purple-800';
      case 'ventas': return 'bg-green-100 text-green-800';
      case 'técnico': return 'bg-blue-100 text-blue-800';
      case 'administrativo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {personnel.nombres} {personnel.apellidos}
                </h3>

                <div className="mt-2 space-y-2">
                  {/* Estado y Tipo */}
                  <div className="flex items-center space-x-2">
                    <Badge className={getEstadoColor(personnel.estado)}>
                      {personnel.estado}
                    </Badge>
                    <Badge className={getTipoPersonalColor(personnel.tipo_personal)}>
                      {personnel.tipo_personal}
                    </Badge>
                  </div>

                  {/* Información de contacto */}
                  <div className="space-y-1 text-sm text-gray-600">
                    {personnel.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="truncate">{personnel.email}</span>
                      </div>
                    )}
                    {personnel.telefono && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{personnel.telefono}</span>
                      </div>
                    )}
                  </div>

                  {/* Información adicional */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {personnel.numero_legajo && (
                      <div>
                        <p className="text-gray-500">Legajo</p>
                        <p className="font-medium">{personnel.numero_legajo}</p>
                      </div>
                    )}
                    {personnel.fecha_contratacion && (
                      <div>
                        <p className="text-gray-500">Fecha Contratación</p>
                        <p className="font-medium">
                          {new Date(personnel.fecha_contratacion).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Información específica por tipo */}
                  {personnel.tipo_personal === 'ventas' && (
                    <div className="mt-2 p-2 bg-green-50 rounded-md">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {personnel.meta_mensual > 0 && (
                          <div>
                            <p className="text-gray-500">Meta Mensual</p>
                            <p className="font-medium text-green-700">
                              ${personnel.meta_mensual.toLocaleString()}
                            </p>
                          </div>
                        )}
                        {personnel.comision_porcentaje > 0 && (
                          <div>
                            <p className="text-gray-500">Comisión</p>
                            <p className="font-medium text-green-700">
                              {personnel.comision_porcentaje}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {onView && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(personnel);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(personnel);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(personnel);
                    }}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Hover hint */}
            <div className="mt-4 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="h-4 w-4 mr-2" />
              <span className="text-sm">Click para ver detalles</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};