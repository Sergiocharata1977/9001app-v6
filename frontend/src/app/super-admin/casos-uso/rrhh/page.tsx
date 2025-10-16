'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  GraduationCap, 
  ClipboardCheck, 
  ArrowLeft,
  User,
  Target,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function CasosUsoRRHHPage() {
  const [activeTab, setActiveTab] = useState('competencias');

  const competenciasCasos = [
    {
      id: 'comp_001',
      titulo: 'RH crea nueva competencia',
      actor: 'Responsable de RRHH',
      objetivo: 'Definir competencia organizacional',
      complejidad: 'Baja',
      tiempo: '5 min',
      pasos: 4,
      icono: <User className="h-5 w-5" />
    },
    {
      id: 'comp_002',
      titulo: 'Asignar competencia a empleado',
      actor: 'Jefe de Área',
      objetivo: 'Asignar competencia requerida a empleado',
      complejidad: 'Media',
      tiempo: '10 min',
      pasos: 6,
      icono: <Target className="h-5 w-5" />
    },
    {
      id: 'comp_003',
      titulo: 'Ver brechas de competencias',
      actor: 'Gerente de RRHH',
      objetivo: 'Identificar brechas críticas de competencias',
      complejidad: 'Media',
      tiempo: '15 min',
      pasos: 4,
      icono: <AlertTriangle className="h-5 w-5" />
    }
  ];

  const evaluacionesCasos = [
    {
      id: 'eval_001',
      titulo: 'Crear evaluación individual',
      actor: 'Jefe Directo',
      objetivo: 'Evaluar desempeño de empleado',
      complejidad: 'Alta',
      tiempo: '20 min',
      pasos: 7,
      icono: <ClipboardCheck className="h-5 w-5" />
    },
    {
      id: 'eval_002',
      titulo: 'Ver reporte de evaluación',
      actor: 'Empleado',
      objetivo: 'Revisar resultados de su evaluación',
      complejidad: 'Baja',
      tiempo: '5 min',
      pasos: 3,
      icono: <BookOpen className="h-5 w-5" />
    },
    {
      id: 'eval_003',
      titulo: 'Generar reporte consolidado',
      actor: 'Gerente de RRHH',
      objetivo: 'Analizar desempeño general del equipo',
      complejidad: 'Media',
      tiempo: '10 min',
      pasos: 5,
      icono: <CheckCircle className="h-5 w-5" />
    }
  ];

  const capacitacionesCasos = [
    {
      id: 'cap_001',
      titulo: 'Programar nueva capacitación',
      actor: 'Coordinador de Capacitaciones',
      objetivo: 'Crear capacitación para desarrollo de competencias',
      complejidad: 'Alta',
      tiempo: '30 min',
      pasos: 5,
      icono: <GraduationCap className="h-5 w-5" />
    },
    {
      id: 'cap_002',
      titulo: 'Control de asistencia por sesión',
      actor: 'Instructor',
      objetivo: 'Registrar asistencia de participantes',
      complejidad: 'Media',
      tiempo: '15 min',
      pasos: 5,
      icono: <Users className="h-5 w-5" />
    },
    {
      id: 'cap_003',
      titulo: 'Evaluación post-capacitación',
      actor: 'Participante',
      objetivo: 'Evaluar efectividad de la capacitación',
      complejidad: 'Baja',
      tiempo: '10 min',
      pasos: 4,
      icono: <CheckCircle className="h-5 w-5" />
    }
  ];

  const getComplejidadColor = (complejidad: string) => {
    switch (complejidad) {
      case 'Baja': return 'bg-green-100 text-green-800';
      case 'Media': return 'bg-yellow-100 text-yellow-800';
      case 'Alta': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCasos = (casos: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {casos.map((caso) => (
        <Card key={caso.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <div className="text-blue-600">
                    {caso.icono}
                  </div>
                </div>
                <div>
                  <CardTitle className="text-lg">{caso.titulo}</CardTitle>
                  <p className="text-sm text-gray-600">{caso.actor}</p>
                </div>
              </div>
              <Badge className={getComplejidadColor(caso.complejidad)}>
                {caso.complejidad}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Objetivo:</h4>
                <p className="text-sm text-gray-600">{caso.objetivo}</p>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-4 w-4" />
                  {caso.tiempo}
                </div>
                <div className="text-gray-500">
                  {caso.pasos} pasos
                </div>
              </div>
              
              <Button className="w-full" variant="outline">
                Ver Detalles
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/super-admin/casos-uso">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Casos de Uso - Recursos Humanos
          </h1>
          <p className="text-gray-600 mt-2">
            Casos de uso detallados para competencias, evaluaciones y capacitaciones
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Competencias</p>
                <p className="text-xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ClipboardCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Evaluaciones</p>
                <p className="text-xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Capacitaciones</p>
                <p className="text-xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Casos</p>
                <p className="text-xl font-bold text-gray-900">9</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs con casos de uso */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="competencias" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Competencias
          </TabsTrigger>
          <TabsTrigger value="evaluaciones" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Evaluaciones
          </TabsTrigger>
          <TabsTrigger value="capacitaciones" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Capacitaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="competencias" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Casos de Uso - Competencias</h2>
              <Badge variant="outline">3 casos</Badge>
            </div>
            {renderCasos(competenciasCasos)}
          </div>
        </TabsContent>

        <TabsContent value="evaluaciones" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Casos de Uso - Evaluaciones</h2>
              <Badge variant="outline">3 casos</Badge>
            </div>
            {renderCasos(evaluacionesCasos)}
          </div>
        </TabsContent>

        <TabsContent value="capacitaciones" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Casos de Uso - Capacitaciones</h2>
              <Badge variant="outline">3 casos</Badge>
            </div>
            {renderCasos(capacitacionesCasos)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Información para manuales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Base para Manuales de Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Estos casos de uso sirven como base para crear los manuales de usuario. 
              Cada caso incluye:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Actores:</strong> Definir quién usa cada funcionalidad</li>
              <li>• <strong>Objetivos:</strong> Qué se quiere lograr</li>
              <li>• <strong>Flujos:</strong> Pasos detallados para crear procedimientos</li>
              <li>• <strong>Complejidad:</strong> Nivel de dificultad para organizar capacitaciones</li>
              <li>• <strong>Tiempo estimado:</strong> Para planificar sesiones de entrenamiento</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



























