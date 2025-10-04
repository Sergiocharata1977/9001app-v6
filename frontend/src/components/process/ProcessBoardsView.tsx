'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, FileText, Calendar, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessBoard {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  category: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  recordsCount: number;
  color: string;
  lastActivity: string;
  teamMembers: number;
}

interface ProcessBoardsViewProps {
  processes: ProcessBoard[];
  onProcessSelect: (process: ProcessBoard) => void;
  onNewProcess: () => void;
}

export default function ProcessBoardsView({ 
  processes, 
  onProcessSelect, 
  onNewProcess 
}: ProcessBoardsViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'draft':
        return 'Borrador';
      case 'inactive':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableros de Procesos</h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus procesos organizacionales según ISO 9001
          </p>
        </div>
        <Button onClick={onNewProcess} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Tablero
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tableros</p>
                <p className="text-2xl font-bold text-gray-900">{processes.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {processes.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Borradores</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {processes.filter(p => p.status === 'draft').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registros</p>
                <p className="text-2xl font-bold text-blue-600">
                  {processes.reduce((sum, p) => sum + p.recordsCount, 0)}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Tableros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Card para crear nuevo tablero */}
        <Card 
          className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer"
          onClick={onNewProcess}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Crear Nuevo Tablero</h3>
            <p className="text-sm text-gray-500">
              Agrega un nuevo proceso a tu organización
            </p>
          </CardContent>
        </Card>

        {/* Cards de procesos existentes */}
        {processes.map((process) => (
          <Card 
            key={process.id}
            className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => onProcessSelect(process)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {process.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 mt-1">
                    {process.description}
                  </CardDescription>
                </div>
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: process.color }}
                />
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={cn('text-xs', getStatusColor(process.status))}>
                  {getStatusText(process.status)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {process.category}
                </Badge>
              </div>

              {/* Estadísticas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Registros</span>
                  <span className="font-medium text-gray-900">{process.recordsCount}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Responsable</span>
                  <span className="font-medium text-gray-900">{process.owner}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Equipo</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="font-medium text-gray-900">{process.teamMembers}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Última actividad</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="font-medium text-gray-900">{process.lastActivity}</span>
                  </div>
                </div>
              </div>

              {/* Footer con botón de configuración */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Creado {new Date(process.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aquí podrías abrir un modal de configuración
                    }}
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado vacío */}
      {processes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay tableros de procesos
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza creando tu primer tablero de procesos para gestionar tu organización según ISO 9001.
            </p>
            <Button onClick={onNewProcess}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Tablero
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}






