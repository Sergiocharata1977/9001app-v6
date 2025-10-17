'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UnifiedKanbanBoard } from '@/components/ui/unified-kanban-board';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, Users, Calendar } from 'lucide-react';
import type { KanbanColumn, KanbanItem } from '@/types/unified-kanban';

// Datos de prueba para el Kanban
const mockProcess = {
  id: '1',
  name: 'Gestión de Recursos Humanos',
  description: 'Proceso de reclutamiento, selección y desarrollo del personal',
  status: 'active',
  category: 'Recursos Humanos',
  owner: 'María González',
  color: '#3B82F6',
  teamMembers: 5
};

const mockColumns: KanbanColumn[] = [
  {
    id: 'pending',
    title: 'Pendientes',
    color: '#6B7280'
  },
  {
    id: 'in-progress',
    title: 'En Progreso',
    color: '#F59E0B'
  },
  {
    id: 'review',
    title: 'En Revisión',
    color: '#3B82F6'
  },
  {
    id: 'completed',
    title: 'Completados',
    color: '#10B981'
  }
];

const mockItems: KanbanItem[] = [
  {
    id: '1',
    title: 'Revisar CV de candidato',
    description: 'Evaluar candidato para puesto de desarrollador',
    columnId: 'pending',
    priority: 'high',
    assignee: 'María González',
    dueDate: '2024-01-25',
    tags: ['Reclutamiento', 'Desarrollo']
  },
  {
    id: '2',
    title: 'Actualizar descripción de puesto',
    description: 'Revisar y actualizar descripción del puesto de analista',
    columnId: 'pending',
    priority: 'medium',
    assignee: 'Carlos López',
    dueDate: '2024-01-26',
    tags: ['Descripción']
  },
  {
    id: '3',
    title: 'Entrevista técnica',
    description: 'Realizar entrevista técnica a candidato seleccionado',
    columnId: 'in-progress',
    priority: 'high',
    assignee: 'Ana Martínez',
    dueDate: '2024-01-24',
    tags: ['Entrevista', 'Técnica']
  },
  {
    id: '4',
    title: 'Evaluación final',
    description: 'Evaluación final del proceso de selección',
    columnId: 'review',
    priority: 'medium',
    assignee: 'Roberto Silva',
    dueDate: '2024-01-27',
    tags: ['Evaluación']
  },
  {
    id: '5',
    title: 'Onboarding nuevo empleado',
    description: 'Proceso de integración completado exitosamente',
    columnId: 'completed',
    priority: 'high',
    assignee: 'Patricia López',
    dueDate: '2024-01-20',
    tags: ['Onboarding']
  }
];

export default function ProcessKanbanPage() {
  const params = useParams();
  const router = useRouter();
  const processId = params.id as string;

  const [columns] = useState<KanbanColumn[]>(mockColumns);
  const [items, setItems] = useState<KanbanItem[]>(mockItems);
  const [process] = useState(mockProcess);

  const handleItemClick = (item: KanbanItem) => {
    // Navegar a la vista detallada del registro
    router.push(`/procesos/${processId}/registros/${item.id}`);
  };

  const handleItemMove = (itemId: string, sourceColumn: string, targetColumn: string, newIndex: number) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      const itemIndex = newItems.findIndex(item => item.id === itemId);

      if (itemIndex === -1) return prevItems;

      // Actualizar la columnId del item
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        columnId: targetColumn
      };

      return newItems;
    });
  };

  const handleItemEdit = (item: KanbanItem) => {
    // Aquí podrías abrir un modal para editar el item
    console.log('Editar item:', item);
  };

  const handleItemDelete = (item: KanbanItem) => {
    // Aquí podrías mostrar un diálogo de confirmación
    console.log('Eliminar item:', item);
    setItems(prevItems => prevItems.filter(i => i.id !== item.id));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header del Proceso */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/procesos')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Procesos
            </Button>
            
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: process.color }}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{process.name}</h1>
                <p className="text-gray-600">{process.description}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{process.teamMembers} miembros</span>
            </div>
            
            <Badge 
              className={
                process.status === 'active' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-gray-100 text-gray-800 border-gray-200'
              }
            >
              {process.status === 'active' ? 'Activo' : 'Inactivo'}
            </Badge>
            
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </div>
        </div>
        
        {/* Estadísticas rápidas */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Pendientes</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {items.filter(item => item.columnId === 'pending').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">En Progreso</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {items.filter(item => item.columnId === 'in-progress').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">En Revisión</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {items.filter(item => item.columnId === 'review').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Completados</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {items.filter(item => item.columnId === 'completed').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Vista Kanban */}
      <div className="flex-1 overflow-hidden">
        <UnifiedKanbanBoard
          columns={columns}
          items={items}
          onItemMove={handleItemMove}
          onItemClick={handleItemClick}
          onItemEdit={handleItemEdit}
          onItemDelete={handleItemDelete}
        />
      </div>
    </div>
  );
}


