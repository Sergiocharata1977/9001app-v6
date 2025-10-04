import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  FileText, 
  Target, 
  BarChart3, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Activity,
  Package
} from 'lucide-react';

export default function DashboardPage() {
  // Datos ficticios para el dashboard (simulando datos reales)
  const estadisticas = {
    procesos: {
      total: 24,
      activos: 18,
      enRevision: 4,
      inactivos: 2
    },
    objetivos: {
      total: 12,
      cumplidos: 8,
      enProgreso: 3,
      retrasados: 1
    },
    indicadores: {
      total: 15,
      cumpliendo: 12,
      alertas: 2,
      criticos: 1
    },
    personal: {
      total: 45,
      departamentos: 6,
      capacitacionesPendientes: 8
    }
  };

  const actividadReciente = [
    { tipo: 'proceso', titulo: 'Proceso de Ventas actualizado', tiempo: '2 horas', icono: FileText },
    { tipo: 'objetivo', titulo: 'Objetivo Q1 completado', tiempo: '4 horas', icono: Target },
    { tipo: 'indicador', titulo: 'Indicador satisfacción cliente en alerta', tiempo: '6 horas', icono: AlertTriangle },
    { tipo: 'personal', titulo: 'Nuevo empleado agregado', tiempo: '1 día', icono: Users }
  ];

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Resumen del Sistema de Gestión ISO 9001
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/procesos">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Ver Procesos
            </Button>
          </Link>
          <Link href="/objetivos">
            <Button className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Gestionar Objetivos
            </Button>
          </Link>
        </div>
      </div>

      {/* Tarjetas de Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Procesos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.procesos.activos}</p>
                <p className="text-xs text-gray-500">de {estadisticas.procesos.total} totales</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Objetivos en Progreso</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.objetivos.enProgreso}</p>
                <p className="text-xs text-gray-500">{estadisticas.objetivos.cumplidos} completados</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Indicadores OK</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticas.indicadores.cumpliendo}</p>
                <p className="text-xs text-gray-500">{estadisticas.indicadores.alertas} con alertas</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Personal Total</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.personal.total}</p>
                <p className="text-xs text-gray-500">{estadisticas.personal.departamentos} departamentos</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Acceso Rápido y Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Acceso Rápido a Módulos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Acceso Rápido a Módulos
            </CardTitle>
            <CardDescription>
              Navegación directa a las funcionalidades principales del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/procesos" className="group">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Procesos</p>
                        <p className="text-sm text-gray-500">{estadisticas.procesos.total} procesos</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </div>
              </Link>

              <Link href="/documentos" className="group">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Documentos</p>
                        <p className="text-sm text-gray-500">Gestión de documentación</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
                  </div>
                </div>
              </Link>

              <Link href="/diseno-producto" className="group">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Diseño y desarrollo de Productos</p>
                        <p className="text-sm text-gray-500">Gestión de productos</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
                  </div>
                </div>
              </Link>

              <Link href="/rrhh" className="group">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Recursos Humanos</p>
                        <p className="text-sm text-gray-500">{estadisticas.personal.total} empleados</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600" />
                  </div>
                </div>
              </Link>

              <Link href="/crm/dashboard" className="group col-span-2">
                <div className="p-4 border-2 border-emerald-300 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer bg-gradient-to-r from-emerald-50 to-teal-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">CRM Comercial</p>
                        <p className="text-sm text-gray-600">Gestión de clientes y oportunidades</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-emerald-600 group-hover:text-emerald-700" />
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>
              Últimas actualizaciones del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actividadReciente.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icono className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.titulo}
                    </p>
                    <p className="text-xs text-gray-500">hace {item.tiempo}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y Estado del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alertas del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    2 indicadores requieren atención
                  </p>
                  <p className="text-xs text-yellow-600">
                    Revisar métricas de satisfacción al cliente
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    4 procesos en revisión pendiente
                  </p>
                  <p className="text-xs text-blue-600">
                    Programar revisiones para esta semana
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Estado General del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cumplimiento ISO 9001</span>
                <span className="text-sm font-semibold text-green-600">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Procesos Activos</span>
                <span className="text-sm font-semibold text-blue-600">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Objetivos Cumplidos</span>
                <span className="text-sm font-semibold text-purple-600">67%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


