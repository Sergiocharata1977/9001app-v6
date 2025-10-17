'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Datos de ejemplo para AMFE
const amfeData = [
  { 
    id: 1,
    process: 'Recepción de Fertilizantes',
    failure: 'Contaminación del producto',
    effects: 'Producto no conforme, rechazo del cliente',
    causes: 'Almacenamiento inadecuado, exposición a humedad',
    controls: 'Inspección visual, control de temperatura',
    severity: 8,
    occurrence: 3,
    detection: 6,
    rpn: 144,
    actions: 'Implementar control de temperatura y humedad',
    responsible: 'Supervisor Almacén',
    targetDate: '2024-02-15',
    status: 'in-progress'
  },
  {
    id: 2,
    process: 'Embalaje de Semillas',
    failure: 'Etiquetado incorrecto',
    effects: 'Confusión del cliente, posibles devoluciones',
    causes: 'Error humano, falta de verificación',
    controls: 'Verificación doble, checklist visual',
    severity: 6,
    occurrence: 4,
    detection: 7,
    rpn: 168,
    actions: 'Capacitación del personal, implementar sistema de códigos QR',
    responsible: 'Jefe de Producción',
    targetDate: '2024-02-20',
    status: 'pending'
  },
  {
    id: 3,
    process: 'Transporte de Productos',
    failure: 'Daño durante el transporte',
    effects: 'Productos defectuosos, pérdida económica',
    causes: 'Manejo inadecuado, embalaje insuficiente',
    controls: 'Inspección pre-envío, capacitación conductores',
    severity: 7,
    occurrence: 2,
    detection: 8,
    rpn: 112,
    actions: 'Mejorar embalaje, capacitación adicional',
    responsible: 'Jefe de Logística',
    targetDate: '2024-02-10',
    status: 'completed'
  }
];

const riskMatrixData = {
  high: 2,
  medium: 1,
  low: 0
};

export default function AMFETable() {
  const [activeTab, setActiveTab] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');

  const getRPNColor = (rpn: number) => {
    if (rpn >= 150) return 'bg-red-100 text-red-800 border-red-200';
    if (rpn >= 100) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-red-600 font-bold';
    if (severity >= 6) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
  };

  const filteredData = amfeData.filter(item =>
    item.process.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.failure.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análisis AMFE</h1>
          <p className="text-gray-600">Análisis Modal de Fallos y Efectos - Gestión de Riesgos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo AMFE
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Buscar por proceso o fallo..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="table">Tabla AMFE</TabsTrigger>
          <TabsTrigger value="matrix">Matriz de Riesgos</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Registros AMFE</CardTitle>
              <CardDescription>
                {filteredData.length} registros encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-3 text-left font-medium">Proceso</th>
                      <th className="border p-3 text-left font-medium">Fallo Potencial</th>
                      <th className="border p-3 text-center font-medium">S</th>
                      <th className="border p-3 text-center font-medium">O</th>
                      <th className="border p-3 text-center font-medium">D</th>
                      <th className="border p-3 text-center font-medium">RPN</th>
                      <th className="border p-3 text-left font-medium">Responsable</th>
                      <th className="border p-3 text-center font-medium">Estado</th>
                      <th className="border p-3 text-center font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="border p-3 text-sm font-medium">{item.process}</td>
                        <td className="border p-3 text-sm">{item.failure}</td>
                        <td className="border p-3 text-center">
                          <span className={getSeverityColor(item.severity)}>
                            {item.severity}
                          </span>
                        </td>
                        <td className="border p-3 text-center">{item.occurrence}</td>
                        <td className="border p-3 text-center">{item.detection}</td>
                        <td className="border p-3 text-center">
                          <Badge className={getRPNColor(item.rpn)}>
                            {item.rpn}
                          </Badge>
                        </td>
                        <td className="border p-3 text-sm">{item.responsible}</td>
                        <td className="border p-3">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="border p-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total AMFE</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{filteredData.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 nuevos este mes
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AMFETable;
