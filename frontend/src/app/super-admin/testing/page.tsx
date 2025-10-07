'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TestTube2,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Download,
  Eye,
  TrendingUp,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function TestingPage() {
  const [activeTab, setActiveTab] = useState('historial');

  // Historial de tests ejecutados
  const testHistory = [
    {
      id: 'test-001',
      modulo: 'Puntos de Norma',
      fecha: '2025-01-10 14:45',
      duracion: '45s',
      tests: { total: 19, pasados: 19, fallidos: 0, advertencias: 0 },
      estado: 'exitoso',
      cobertura: 100,
      reporteUrl: '/frontend/test-results/test-report.html'
    },
    {
      id: 'test-002',
      modulo: 'Documentos',
      fecha: '2025-01-10 14:30',
      duracion: '38s',
      tests: { total: 19, pasados: 19, fallidos: 0, advertencias: 0 },
      estado: 'exitoso',
      cobertura: 100,
      reporteUrl: '/test-results/documentos-report.html'
    }
  ];

  // Métricas generales
  const metricas = {
    totalTests: testHistory.reduce((acc, t) => acc + t.tests.total, 0),
    testsPasados: testHistory.reduce((acc, t) => acc + t.tests.pasados, 0),
    testsFallidos: testHistory.reduce((acc, t) => acc + t.tests.fallidos, 0),
    coberturaPromedio: Math.round(testHistory.reduce((acc, t) => acc + t.cobertura, 0) / testHistory.length)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/super-admin">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Testing Automático</h1>
            <p className="text-gray-600 mt-2">
              Historial y resultados de pruebas automáticas de todos los subsistemas
            </p>
          </div>
        </div>
        <Button>
          <Play className="w-4 h-4 mr-2" />
          Ejecutar Nuevo Test
        </Button>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Tests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metricas.totalTests}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <TestTube2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tests Pasados</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{metricas.testsPasados}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tests Fallidos</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{metricas.testsFallidos}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cobertura</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{metricas.coberturaPromedio}%</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="historial">Historial de Tests</TabsTrigger>
          <TabsTrigger value="modulos">Por Módulos</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
        </TabsList>

        {/* Tab: Historial */}
        <TabsContent value="historial" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Ejecuciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testHistory.map((test) => (
                  <div key={test.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${test.estado === 'exitoso' ? 'bg-green-50' : 'bg-red-50'}`}>
                          {test.estado === 'exitoso' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{test.modulo}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Clock className="w-4 h-4" />
                            <span>{test.fecha}</span>
                            <span>•</span>
                            <span>Duración: {test.duracion}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={test.estado === 'exitoso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {test.estado === 'exitoso' ? 'Exitoso' : 'Fallido'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{test.tests.total}</p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{test.tests.pasados}</p>
                        <p className="text-sm text-gray-600">Pasados</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{test.tests.fallidos}</p>
                        <p className="text-sm text-gray-600">Fallidos</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{test.tests.advertencias}</p>
                        <p className="text-sm text-gray-600">Advertencias</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Reporte
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Por Módulos */}
        <TabsContent value="modulos" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tests por Módulo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TestTube2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Vista de tests agrupados por módulo en desarrollo</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Configuración */}
        <TabsContent value="config" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Configuración de testing automático en desarrollo</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

