'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  GraduationCap, 
  ClipboardCheck, 
  BookOpen,
  ExternalLink,
  Download,
  Eye
} from 'lucide-react';

export default function CasosUsoPage() {
  const casosUso = [
    {
      id: 'rrhh',
      titulo: 'Recursos Humanos',
      descripcion: 'Casos de uso para competencias, evaluaciones y capacitaciones',
      icono: <Users className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      archivo: 'CASOS_DE_USO_RRHH.html',
      modulos: ['Competencias', 'Evaluaciones', 'Capacitaciones'],
      casos: 9
    },
    {
      id: 'norma',
      titulo: 'Puntos de Norma ISO 9001',
      descripcion: 'Casos de uso para gestión de requisitos ISO 9001:2015',
      icono: <BookOpen className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      archivo: 'CASOS_DE_USO.html',
      modulos: ['Puntos de Norma', 'Documentos'],
      casos: 6
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            Casos de Uso del Sistema
          </h1>
          <p className="text-gray-600 mt-2">
            Documentación completa de casos de uso para cada módulo del sistema
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/super-admin">
              <Eye className="h-4 w-4 mr-2" />
              Volver al Super Admin
            </Link>
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Casos de Uso</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Módulos RRHH</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Módulos ISO</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Casos de Uso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {casosUso.map((caso) => (
          <Card key={caso.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${caso.bgColor}`}>
                    <div className={caso.color}>
                      {caso.icono}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{caso.titulo}</CardTitle>
                    <p className="text-sm text-gray-600">{caso.descripcion}</p>
                  </div>
                </div>
                <Badge variant="outline">
                  {caso.casos} casos
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Módulos incluidos:</h4>
                  <div className="flex flex-wrap gap-2">
                    {caso.modulos.map((modulo, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {modulo}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button asChild className="flex-1">
                    <Link href={`/super-admin/casos-uso/${caso.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Casos de Uso
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/${caso.archivo}`} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir HTML
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Información sobre los Casos de Uso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">¿Qué son los Casos de Uso?</h4>
              <p className="text-sm text-gray-600">
                Los casos de uso describen cómo los usuarios interactúan con el sistema para lograr objetivos específicos. 
                Incluyen actores, objetivos, flujos de trabajo y resultados esperados.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Estructura de cada caso:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Actor:</strong> Quién ejecuta la acción</li>
                <li>• <strong>Objetivo:</strong> Qué se quiere lograr</li>
                <li>• <strong>Flujo:</strong> Pasos detallados del proceso</li>
                <li>• <strong>Resultado:</strong> Qué se obtiene al finalizar</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



























