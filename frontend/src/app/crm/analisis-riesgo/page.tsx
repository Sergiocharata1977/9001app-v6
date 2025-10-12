'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AnalisisCredito } from '@/types/analisisCredito';
import {
    AlertTriangle,
    Calculator,
    Edit,
    Eye,
    Plus,
    Search,
    Shield,
    TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';

const mockAnalisis: AnalisisCredito[] = [
  {
    id: '1',
    organization_id: 'org1',
    cliente_id: 'cli1',
    cliente_nombre: 'Estancia San Miguel',
    analista_responsable: 'Juan Pérez',
    fecha_analisis: '2024-01-15',
    subaspectos: [],
    resultado_cualitativo: 7.5,
    resultado_legal: 8.2,
    resultado_cuantitativo: 7.8,
    resultado_total: 7.83,
    categoria_riesgo: 'B',
    nivel_riesgo: 'Bajo',
    limite_credito_recomendado: 500000,
    condiciones_comerciales: 'Condiciones estándar',
    observaciones: 'Cliente con buen historial',
    factores_criticos: ['Estacionalidad', 'Clima'],
    fecha_proxima_revision: '2024-04-15',
    frecuencia_revision: 'trimestral',
    estado: 'aprobado',
    version: 1,
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  },
  {
    id: '2',
    organization_id: 'org1',
    cliente_id: 'cli2',
    cliente_nombre: 'Agropecuaria Los Pinos',
    analista_responsable: 'María García',
    fecha_analisis: '2024-01-14',
    subaspectos: [],
    resultado_cualitativo: 5.2,
    resultado_legal: 6.1,
    resultado_cuantitativo: 4.8,
    resultado_total: 5.37,
    categoria_riesgo: 'C',
    nivel_riesgo: 'Medio',
    limite_credito_recomendado: 250000,
    condiciones_comerciales: 'Condiciones restrictivas',
    observaciones: 'Requiere seguimiento',
    factores_criticos: ['Liquidez', 'Endeudamiento'],
    fecha_proxima_revision: '2024-04-14',
    frecuencia_revision: 'trimestral',
    estado: 'en_revision',
    version: 1,
    created_at: '2024-01-14',
    updated_at: '2024-01-14'
  }
];

export default function AnalisisCreditoPage() {
  const [analisis, setAnalisis] = useState<AnalisisCredito[]>(mockAnalisis);
  const [filteredAnalisis, setFilteredAnalisis] = useState<AnalisisCredito[]>(mockAnalisis);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterCategoria, setFilterCategoria] = useState<string>('todos');
  const [loading, setLoading] = useState(false);
  const [selectedAnalisis, setSelectedAnalisis] = useState<AnalisisCredito | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Función para filtrar análisis
  useEffect(() => {
    let filtered = analisis;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.analista_responsable.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filterEstado !== 'todos') {
      filtered = filtered.filter(item => item.estado === filterEstado);
    }

    // Filtro por categoría de riesgo
    if (filterCategoria !== 'todos') {
      filtered = filtered.filter(item => item.categoria_riesgo === filterCategoria);
    }

    setFilteredAnalisis(filtered);
  }, [analisis, searchTerm, filterEstado, filterCategoria]);

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-lime-100 text-lime-800 border-lime-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'E': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'borrador': return 'bg-gray-100 text-gray-800';
      case 'en_revision': return 'bg-blue-100 text-blue-800';
      case 'aprobado': return 'bg-green-100 text-green-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const stats = [
    {
      titulo: 'Análisis Totales',
      valor: analisis.length.toString(),
      icon: Calculator,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      titulo: 'Riesgo Bajo',
      valor: analisis.filter(a => a.categoria_riesgo === 'A' || a.categoria_riesgo === 'B').length.toString(),
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      titulo: 'Riesgo Medio',
      valor: analisis.filter(a => a.categoria_riesgo === 'C').length.toString(),
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      titulo: 'Riesgo Alto/Crítico',
      valor: analisis.filter(a => a.categoria_riesgo === 'D' || a.categoria_riesgo === 'E').length.toString(),
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Análisis de Riesgo Crediticio
          </h1>
          <p className="text-gray-600 mt-2">
            Evaluación estructurada y ponderada de riesgo crediticio según ISO 9001
          </p>
        </div>
        {/* Botón "Nuevo" deshabilitado - Los análisis se crean desde el legajo de la empresa */}
        <div className="flex flex-col items-end gap-2">
          <Button 
            disabled 
            variant="outline" 
            className="flex items-center gap-2"
            title="Los análisis de riesgo se crean desde el legajo de cada empresa"
          >
            <Plus className="h-4 w-4" />
            Nuevo Análisis
          </Button>
          <p className="text-xs text-gray-500 text-right max-w-xs">
            💡 Los análisis de riesgo se crean desde el legajo de cada empresa
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.titulo}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.valor}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por cliente o analista..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="en_revision">En Revisión</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las categorías</SelectItem>
                  <SelectItem value="A">A - Muy Bajo</SelectItem>
                  <SelectItem value="B">B - Bajo</SelectItem>
                  <SelectItem value="C">C - Medio</SelectItem>
                  <SelectItem value="D">D - Alto</SelectItem>
                  <SelectItem value="E">E - Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de análisis */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Riesgo Crediticio</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Analista</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Score Total</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Límite Recomendado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnalisis.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.cliente_nombre}</TableCell>
                  <TableCell>{item.analista_responsable}</TableCell>
                  <TableCell>{formatDate(item.fecha_analisis)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.resultado_total * 10} className="w-16" />
                      <span className="text-sm font-medium">{item.resultado_total.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoriaColor(item.categoria_riesgo)}>
                      {item.categoria_riesgo} - {item.nivel_riesgo}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(item.limite_credito_recomendado)}</TableCell>
                  <TableCell>
                    <Badge className={getEstadoColor(item.estado)}>
                      {item.estado.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedAnalisis(item);
                          setShowDetailModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // TODO: Implementar edición
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAnalisis.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron análisis</h3>
              <p className="text-gray-500 mb-4">Intenta ajustar los filtros de búsqueda</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Análisis
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalle */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle del Análisis de Riesgo</DialogTitle>
          </DialogHeader>
          {selectedAnalisis && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Cliente</h4>
                  <p className="text-gray-600">{selectedAnalisis.cliente_nombre}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Analista Responsable</h4>
                  <p className="text-gray-600">{selectedAnalisis.analista_responsable}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Fecha de Análisis</h4>
                  <p className="text-gray-600">{formatDate(selectedAnalisis.fecha_analisis)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Próxima Revisión</h4>
                  <p className="text-gray-600">{formatDate(selectedAnalisis.fecha_proxima_revision)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Cualitativo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedAnalisis.resultado_cualitativo * 10} className="flex-1" />
                      <span className="text-sm font-medium">{selectedAnalisis.resultado_cualitativo.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Legal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedAnalisis.resultado_legal * 10} className="flex-1" />
                      <span className="text-sm font-medium">{selectedAnalisis.resultado_legal.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Cuantitativo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Progress value={selectedAnalisis.resultado_cuantitativo * 10} className="flex-1" />
                      <span className="text-sm font-medium">{selectedAnalisis.resultado_cuantitativo.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Límite de Crédito Recomendado</h4>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(selectedAnalisis.limite_credito_recomendado)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Categoría de Riesgo</h4>
                  <Badge className={getCategoriaColor(selectedAnalisis.categoria_riesgo)}>
                    {selectedAnalisis.categoria_riesgo} - {selectedAnalisis.nivel_riesgo}
                  </Badge>
                </div>
              </div>

              {selectedAnalisis.observaciones && (
                <div>
                  <h4 className="font-semibold text-gray-900">Observaciones</h4>
                  <p className="text-gray-600">{selectedAnalisis.observaciones}</p>
                </div>
              )}

              {selectedAnalisis.factores_criticos && selectedAnalisis.factores_criticos.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900">Factores Críticos</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedAnalisis.factores_criticos.map((factor, index) => (
                      <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}