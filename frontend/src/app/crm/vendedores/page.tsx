'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useOrganization } from '@/contexts/OrganizationContext';
import {
    AlertCircle,
    Calendar,
    DollarSign,
    Mail,
    Phone,
    Search,
    Target,
    TrendingUp,
    UserCheck,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Vendedor {
  _id: string;
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  puesto: string;
  departamento: string;
  fecha_ingreso: string;
  estado: 'activo' | 'inactivo' | 'vacaciones';
  metas_ventas?: {
    mensual: number;
    anual: number;
  };
  estadisticas?: {
    clientes_asignados: number;
    oportunidades_activas: number;
    ventas_mes_actual: number;
  };
}

export default function VendedoresPage() {
  const { organizationId } = useOrganization();
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterDepartamento, setFilterDepartamento] = useState('todos');

  useEffect(() => {
    loadVendedores();
  }, [organizationId]);

  const loadVendedores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular carga de datos - en producción sería una llamada al API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de ejemplo
      const vendedoresEjemplo: Vendedor[] = [
        {
          _id: '1',
          id: 'VEND-001',
          nombre: 'María',
          apellidos: 'García López',
          email: 'maria.garcia@empresa.com',
          telefono: '+52 55 1234 5678',
          puesto: 'Ejecutivo de Ventas Senior',
          departamento: 'Ventas',
          fecha_ingreso: '2022-03-15',
          estado: 'activo',
          metas_ventas: {
            mensual: 150000,
            anual: 1800000
          },
          estadisticas: {
            clientes_asignados: 25,
            oportunidades_activas: 8,
            ventas_mes_actual: 125000
          }
        },
        {
          _id: '2',
          id: 'VEND-002',
          nombre: 'Carlos',
          apellidos: 'Rodríguez Martínez',
          email: 'carlos.rodriguez@empresa.com',
          telefono: '+52 55 2345 6789',
          puesto: 'Representante de Ventas',
          departamento: 'Ventas',
          fecha_ingreso: '2023-01-10',
          estado: 'activo',
          metas_ventas: {
            mensual: 100000,
            anual: 1200000
          },
          estadisticas: {
            clientes_asignados: 18,
            oportunidades_activas: 5,
            ventas_mes_actual: 85000
          }
        },
        {
          _id: '3',
          id: 'VEND-003',
          nombre: 'Ana',
          apellidos: 'Hernández Silva',
          email: 'ana.hernandez@empresa.com',
          telefono: '+52 55 3456 7890',
          puesto: 'Gerente de Ventas',
          departamento: 'Ventas',
          fecha_ingreso: '2021-08-20',
          estado: 'vacaciones',
          metas_ventas: {
            mensual: 200000,
            anual: 2400000
          },
          estadisticas: {
            clientes_asignados: 35,
            oportunidades_activas: 12,
            ventas_mes_actual: 180000
          }
        }
      ];

      setVendedores(vendedoresEjemplo);
    } catch (err) {
      setError('Error al cargar la lista de vendedores');
      console.error('Error loading vendedores:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'vacaciones': return 'bg-yellow-100 text-yellow-800';
      case 'inactivo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'activo': return <UserCheck className="h-4 w-4" />;
      case 'vacaciones': return <Calendar className="h-4 w-4" />;
      case 'inactivo': return <AlertCircle className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const filteredVendedores = vendedores.filter(vendedor => {
    const matchesSearch = vendedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendedor.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendedor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filterEstado === 'todos' || vendedor.estado === filterEstado;
    const matchesDepartamento = filterDepartamento === 'todos' || vendedor.departamento === filterDepartamento;

    return matchesSearch && matchesEstado && matchesDepartamento;
  });

  const totalVendedores = vendedores.length;
  const vendedoresActivos = vendedores.filter(v => v.estado === 'activo').length;
  const ventasTotales = vendedores.reduce((sum, v) => sum + (v.estadisticas?.ventas_mes_actual || 0), 0);
  const clientesTotales = vendedores.reduce((sum, v) => sum + (v.estadisticas?.clientes_asignados || 0), 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadVendedores}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendedores</h1>
          <p className="text-gray-600 mt-1">
            Gestión del equipo de ventas y representantes comerciales
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendedores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVendedores}</div>
            <p className="text-xs text-muted-foreground">
              {vendedoresActivos} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${ventasTotales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Asignados</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesTotales}</div>
            <p className="text-xs text-muted-foreground">
              Promedio por vendedor: {Math.round(clientesTotales / totalVendedores)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades Activas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendedores.reduce((sum, v) => sum + (v.estadisticas?.oportunidades_activas || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              En seguimiento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="vacaciones">En vacaciones</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDepartamento} onValueChange={setFilterDepartamento}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los departamentos</SelectItem>
                <SelectItem value="Ventas">Ventas</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vendedores */}
      <Card>
        <CardHeader>
          <CardTitle>Equipo de Vendedores</CardTitle>
          <CardDescription>
            {filteredVendedores.length} vendedores encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendedor</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Estadísticas</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendedores.map((vendedor) => (
                <TableRow key={vendedor._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-emerald-700">
                          {vendedor.nombre[0]}{vendedor.apellidos[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{vendedor.nombre} {vendedor.apellidos}</div>
                        <div className="text-sm text-gray-500">{vendedor.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="font-medium">{vendedor.puesto}</div>
                      <div className="text-sm text-gray-500">{vendedor.departamento}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getEstadoColor(vendedor.estado)}>
                      <div className="flex items-center gap-1">
                        {getEstadoIcon(vendedor.estado)}
                        {vendedor.estado}
                      </div>
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {vendedor.email}
                      </div>
                      {vendedor.telefono && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {vendedor.telefono}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-blue-500" />
                        {vendedor.estadisticas?.clientes_asignados || 0} clientes
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        {vendedor.estadisticas?.oportunidades_activas || 0} oportunidades
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3 text-emerald-500" />
                        ${(vendedor.estadisticas?.ventas_mes_actual || 0).toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Ver Perfil
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}




