'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Activity,
    Award,
    BarChart3,
    Calendar,
    Download,
    Minus,
    RefreshCw,
    Target,
    TrendingDown,
    TrendingUp,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Indicador {
  _id: string;
  nombre: string;
  categoria: 'productividad' | 'satisfaccion' | 'rotacion' | 'capacitacion' | 'ausentismo';
  valor_actual: number;
  valor_meta: number;
  unidad: string;
  periodo: string;
  tendencia: 'positiva' | 'negativa' | 'estable';
  fecha_calculo: string;
  formula_calculo: string;
}

interface Dashboard {
  productividad: Indicador[];
  satisfaccion: Indicador[];
  rotacion: Indicador[];
  capacitacion: Indicador[];
  ausentismo: Indicador[];
}

export default function IndicadoresRRHHPage() {
  const [dashboard, setDashboard] = useState<Dashboard>({
    productividad: [],
    satisfaccion: [],
    rotacion: [],
    capacitacion: [],
    ausentismo: []
  });
  const [loading, setLoading] = useState(true);
  const [recalculando, setRecalculando] = useState(false);

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      const organizationId = 'org-123';
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rrhh/indicadores/dashboard?organization_id=${organizationId}`);
      const data = await response.json();
      
      setDashboard(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      setLoading(false);
    }
  };

  const recalcularIndicadores = async () => {
    setRecalculando(true);
    try {
      const organizationId = 'org-123';
      
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rrhh/indicadores/recalcular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organization_id: organizationId })
      });
      
      await cargarDashboard();
    } catch (error) {
      console.error('Error al recalcular indicadores:', error);
    } finally {
      setRecalculando(false);
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    if (tendencia === 'positiva') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (tendencia === 'negativa') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTendenciaColor = (tendencia: string) => {
    if (tendencia === 'positiva') return 'text-green-600';
    if (tendencia === 'negativa') return 'text-red-600';
    return 'text-gray-600';
  };

  const getCategoriaConfig = (categoria: string) => {
    const configs = {
      productividad: {
        icon: Activity,
        color: 'blue',
        titulo: 'Productividad',
        descripcion: 'Indicadores de eficiencia y desempeño'
      },
      satisfaccion: {
        icon: Award,
        color: 'purple',
        titulo: 'Satisfacción',
        descripcion: 'Clima laboral y bienestar organizacional'
      },
      rotacion: {
        icon: Users,
        color: 'orange',
        titulo: 'Rotación',
        descripcion: 'Retención y movimiento de personal'
      },
      capacitacion: {
        icon: Target,
        color: 'green',
        titulo: 'Capacitación',
        descripcion: 'Desarrollo y formación del talento'
      },
      ausentismo: {
        icon: Calendar,
        color: 'red',
        titulo: 'Ausentismo',
        descripcion: 'Control de ausencias y licencias'
      }
    };
    
    return configs[categoria as keyof typeof configs] || configs.productividad;
  };

  const calcularProgreso = (actual: number, meta: number) => {
    const progreso = (actual / meta) * 100;
    return Math.min(progreso, 100);
  };

  const getProgresoColor = (actual: number, meta: number) => {
    const progreso = (actual / meta) * 100;
    if (progreso >= 100) return 'bg-green-600';
    if (progreso >= 75) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const todasCategorias: Array<keyof Dashboard> = ['productividad', 'satisfaccion', 'rotacion', 'capacitacion', 'ausentismo'];
  const totalIndicadores = todasCategorias.reduce((acc, cat) => acc + dashboard[cat].length, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Indicadores de RRHH</h1>
          <p className="text-muted-foreground mt-1">
            Dashboard de métricas y KPIs de recursos humanos
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={recalcularIndicadores}
            disabled={recalculando}
            className="flex-1 md:flex-none"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${recalculando ? 'animate-spin' : ''}`} />
            {recalculando ? 'Recalculando...' : 'Recalcular'}
          </Button>
          <Button variant="outline" size="lg" className="flex-1 md:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Resumen General */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen General</CardTitle>
          <CardDescription>
            Estado actual de los indicadores clave de recursos humanos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {todasCategorias.map((categoria) => {
              const config = getCategoriaConfig(categoria);
              const Icon = config.icon;
              const cantidad = dashboard[categoria].length;
              
              return (
                <div key={categoria} className={`p-4 bg-${config.color}-50 rounded-lg border border-${config.color}-200`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 text-${config.color}-600`} />
                    <span className="text-2xl font-bold text-${config.color}-600">{cantidad}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{config.titulo}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Indicadores por Categoría */}
      {totalIndicadores === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay indicadores calculados</h3>
            <p className="text-muted-foreground mb-4">
              Comienza calculando los indicadores automáticos del sistema
            </p>
            <Button onClick={recalcularIndicadores} disabled={recalculando}>
              <RefreshCw className={`w-4 h-4 mr-2 ${recalculando ? 'animate-spin' : ''}`} />
              {recalculando ? 'Calculando...' : 'Calcular Indicadores'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        todasCategorias.map((categoria) => {
          if (dashboard[categoria].length === 0) return null;
          
          const config = getCategoriaConfig(categoria);
          const Icon = config.icon;
          
          return (
            <Card key={categoria}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-${config.color}-100 rounded-lg`}>
                    <Icon className={`w-5 h-5 text-${config.color}-600`} />
                  </div>
                  <div>
                    <CardTitle>{config.titulo}</CardTitle>
                    <CardDescription>{config.descripcion}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboard[categoria].map((indicador) => {
                    const progreso = calcularProgreso(indicador.valor_actual, indicador.valor_meta);
                    const progresoColor = getProgresoColor(indicador.valor_actual, indicador.valor_meta);
                    
                    return (
                      <div key={indicador._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{indicador.nombre}</h4>
                            <p className="text-xs text-muted-foreground">Período: {indicador.periodo}</p>
                          </div>
                          {getTendenciaIcon(indicador.tendencia)}
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className={`text-3xl font-bold ${getTendenciaColor(indicador.tendencia)}`}>
                                {indicador.valor_actual.toFixed(1)}
                              </span>
                              <span className="text-sm text-muted-foreground">{indicador.unidad}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Meta: {indicador.valor_meta} {indicador.unidad}</span>
                            </div>
                          </div>
                          
                          {/* Barra de progreso */}
                          <div className="space-y-1">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full ${progresoColor} transition-all duration-500`}
                                style={{ width: `${progreso}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{progreso.toFixed(0)}% de la meta</span>
                              {indicador.tendencia !== 'estable' && (
                                <Badge variant="outline" className={getTendenciaColor(indicador.tendencia)}>
                                  {indicador.tendencia === 'positiva' ? '↑' : '↓'} Tendencia
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Información Adicional */}
      {totalIndicadores > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Información del Cálculo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Última Actualización</p>
                  <p className="text-muted-foreground">
                    {dashboard.productividad[0] 
                      ? new Date(dashboard.productividad[0].fecha_calculo).toLocaleString()
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Total Indicadores</p>
                  <p className="text-muted-foreground">{totalIndicadores} métricas activas</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Frecuencia</p>
                  <p className="text-muted-foreground">Actualización mensual</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

