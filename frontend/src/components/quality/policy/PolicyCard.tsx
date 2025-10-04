'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  History, 
  Users, 
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Eye,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Datos de ejemplo para la política
const policyData = {
  title: "Política de Calidad - Los Señores del Agro",
  version: "2.1",
  lastUpdated: "2024-01-15",
  approver: "María García - Director de Calidad",
  status: "published" as const,
  sections: {
    commitment: `"Los Señores del Agro" se compromete a ser el proveedor líder de fertilizantes, semillas y servicios logísticos de alta calidad para el sector agrícola, implementando un Sistema de Gestión de Calidad basado en ISO 9001:2015.`,
    objectives: `Nuestros objetivos de calidad incluyen: satisfacción del cliente ≥ 95%, productos conformes ≥ 98%, tiempo de entrega ≤ 24 horas, y mejora continua de procesos.`,
    framework: `El marco de referencia se basa en ISO 9001:2015, incluyendo gestión de riesgos, mejora continua, enfoque al cliente y liderazgo comprometido.`,
    communication: `La política se comunica a través de reuniones mensuales, intranet corporativa, carteles informativos y capacitaciones periódicas del personal.`
  }
};

const readingStatus = [
  { department: "Dirección", read: 100, total: 5 },
  { department: "Calidad", read: 100, total: 8 },
  { department: "Producción", read: 87, total: 15 },
  { department: "Ventas", read: 92, total: 12 },
  { department: "Logística", read: 78, total: 10 }
];

const policyHistory = [
  {
    version: "2.1",
    date: "2024-01-15",
    changes: "Actualización de objetivos de calidad y compromisos ambientales",
    approvedBy: "María García"
  },
  {
    version: "2.0",
    date: "2023-12-01",
    changes: "Revisión completa según nueva auditoría ISO 9001:2015",
    approvedBy: "María García"
  },
  {
    version: "1.5",
    date: "2023-08-15",
    changes: "Inclusión de nuevos procesos de control de calidad",
    approvedBy: "Juan Pérez"
  }
];

export function PolicyCard() {
  const [activeTab, setActiveTab] = useState('content');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-emerald-700">{policyData.title}</CardTitle>
              <CardDescription>
                Versión {policyData.version} - Última actualización: {policyData.lastUpdated}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(policyData.status)}>
                {policyData.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Aprobado por: {policyData.approver}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Difundido a: 50 empleados</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Nueva Versión
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="reading">Lectura</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        {/* Contenido de la Política */}
        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Contenido de la Política</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Compromiso */}
              <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-500">
                <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Compromiso con la Excelencia
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {policyData.sections.commitment}
                </p>
              </div>

              {/* Objetivos */}
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Objetivos de Calidad
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {policyData.sections.objectives}
                </p>
              </div>

              {/* Marco de Referencia */}
              <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Marco de Referencia
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {policyData.sections.framework}
                </p>
              </div>

              {/* Comunicación */}
              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Estrategia de Comunicación
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {policyData.sections.communication}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Estado de Lectura */}
        <TabsContent value="reading" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Estado de Lectura por Departamento</CardTitle>
              <CardDescription>
                Progreso de difusión y lectura de la política de calidad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {readingStatus.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dept.department}</span>
                    <span className="text-sm text-gray-600">
                      {dept.read}% ({Math.round((dept.read * dept.total) / 100)}/{dept.total} empleados)
                    </span>
                  </div>
                  <Progress value={dept.read} className="h-2" />
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Total General</h4>
                    <p className="text-sm text-gray-600">Promedio de lectura por departamento</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">
                      {Math.round(readingStatus.reduce((acc, dept) => acc + dept.read, 0) / readingStatus.length)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {readingStatus.reduce((acc, dept) => acc + dept.total, 0)} empleados totales
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historial de Versiones */}
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Historial de Versiones</CardTitle>
              <CardDescription>
                Registro de cambios y actualizaciones de la política
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {policyHistory.map((version, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-emerald-600">{version.version}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">Versión {version.version}</h4>
                      <Badge variant="outline" className="text-xs">
                        {version.date}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{version.changes}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3" />
                      <span>Aprobado por: {version.approvedBy}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análisis */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-700">Métricas de Difusión</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tiempo promedio de lectura</span>
                  <span className="font-semibold">4.2 minutos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tasa de apertura</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Comentarios recibidos</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Última actualización</span>
                  <span className="font-semibold">15 días</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-700">Acciones Requeridas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Revisar departamento Logística</p>
                    <p className="text-xs text-gray-600">78% de lectura - Por debajo del objetivo</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Programar capacitación</p>
                    <p className="text-xs text-gray-600">Nuevos empleados requieren formación</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Cumplimiento objetivo</p>
                    <p className="text-xs text-gray-600">90% de lectura alcanzado en 3 departamentos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

