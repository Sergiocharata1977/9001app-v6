'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Search,
  Filter,
  TrendingUp,
  Shield,
  Calculator
} from 'lucide-react';

interface AnalisisRiesgo {
  id: string;
  cliente: string;
  fecha: string;
  tipo: 'completo' | 'rapido' | 'seguimiento';
  scoreFinanciero: number;
  scoreAgropecuario: number;
  riesgoFinal: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  recomendacion: 'Aprobar' | 'Revisar' | 'Rechazar';
  estado: 'borrador' | 'en_revision' | 'aprobado' | 'rechazado';
}

const mockAnalisis: AnalisisRiesgo[] = [
  {
    id: '1',
    cliente: 'Estancia San Miguel',
    fecha: '2024-01-15',
    tipo: 'completo',
    scoreFinanciero: 75,
    scoreAgropecuario: 82,
    riesgoFinal: 'Bajo',
    recomendacion: 'Aprobar',
    estado: 'aprobado'
  },
  {
    id: '2',
    cliente: 'Agropecuaria Los Pinos',
    fecha: '2024-01-14',
    tipo: 'rapido',
    scoreFinanciero: 45,
    scoreAgropecuario: 68,
    riesgoFinal: 'Medio',
    recomendacion: 'Revisar',
    estado: 'en_revision'
  },
  {
    id: '3',
    cliente: 'Campo Verde SA',
    fecha: '2024-01-13',
    tipo: 'seguimiento',
    scoreFinanciero: 25,
    scoreAgropecuario: 35,
    riesgoFinal: 'Alto',
    recomendacion: 'Rechazar',
    estado: 'rechazado'
  },
  {
    id: '4',
    cliente: 'Estancia El Progreso',
    fecha: '2024-01-12',
    tipo: 'completo',
    scoreFinanciero: 15,
    scoreAgropecuario: 20,
    riesgoFinal: 'Crítico',
    recomendacion: 'Rechazar',
    estado: 'rechazado'
  }
];

export default function AnalisisRiesgoPage() {
  const [analisis] = useState<AnalisisRiesgo[]>(mockAnalisis);
  const [filteredAnalisis, setFilteredAnalisis] = useState<AnalisisRiesgo[]>(mockAnalisis);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterRiesgo, setFilterRiesgo] = useState<string>('todos');

  // Función para filtrar análisis
  const filterAnalisis = () => {
    let filtered = analisis;

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.cliente.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filterEstado !== 'todos') {
      filtered = filtered.filter(item => item.estado === filterEstado);
    }

    // Filtro por nivel de riesgo
    if (filterRiesgo !== 'todos') {
      filtered = filtered.filter(item => item.riesgoFinal === filterRiesgo);
    }

    setFilteredAnalisis(filtered);
  };

  // Aplicar filtros cuando cambien
  useState(() => {
    filterAnalisis();
  });

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case 'Bajo': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Alto': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Crítico': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getRecomendacionColor = (recomendacion: string) => {
    switch (recomendacion) {
      case 'Aprobar': return 'bg-green-100 text-green-800';
      case 'Revisar': return 'bg-yellow-100 text-yellow-800';
      case 'Rechazar': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      valor: analisis.filter(a => a.riesgoFinal === 'Bajo').length.toString(),
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      titulo: 'Riesgo Medio',
      valor: analisis.filter(a => a.riesgoFinal === 'Medio').length.toString(),
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      titulo: 'Riesgo Alto/Crítico',
      valor: analisis.filter(a => a.riesgoFinal === 'Alto' || a.riesgoFinal === 'Crítico').length.toString(),
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
            Análisis de Riesgo
          </h1>
          <p className="text-gray-600 mt-2">
            Evaluación financiera y agropecuaria de clientes según ISO 9001
          </p>
        </div>
        <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Nuevo Análisis
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.titulo}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
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
                  placeholder="Buscar por cliente..."
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
              <Select value={filterRiesgo} onValueChange={setFilterRiesgo}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Nivel de Riesgo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los riesgos</SelectItem>
                  <SelectItem value="Bajo">Bajo</SelectItem>
                  <SelectItem value="Medio">Medio</SelectItem>
                  <SelectItem value="Alto">Alto</SelectItem>
                  <SelectItem value="Crítico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de análisis */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Riesgo</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Score Financiero</TableHead>
                <TableHead>Score Agropecuario</TableHead>
                <TableHead>Riesgo Final</TableHead>
                <TableHead>Recomendación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnalisis.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.cliente}</TableCell>
                  <TableCell>{item.fecha}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.scoreFinanciero} className="w-12" />
                      <span className="text-sm">{item.scoreFinanciero}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.scoreAgropecuario} className="w-12" />
                      <span className="text-sm">{item.scoreAgropecuario}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiesgoColor(item.riesgoFinal)}>
                      {item.riesgoFinal}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRecomendacionColor(item.recomendacion)}>
                      {item.recomendacion}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEstadoColor(item.estado)}>
                      {item.estado.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
    </div>
  );
}