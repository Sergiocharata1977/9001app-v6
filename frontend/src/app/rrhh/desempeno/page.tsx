'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Award,
    CheckCircle,
    Clock,
    FileText,
    Plus,
    Target,
    TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Evaluacion {
  _id: string;
  empleado_nombre: string;
  evaluador_nombre: string;
  periodo: string;
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'aprobada';
  puntuacion_total: number;
  objetivos: Array<{
    id: string;
    descripcion: string;
    peso: number;
    meta: string;
    resultado?: string;
    puntuacion?: number;
  }>;
  fecha_inicio: string;
  fecha_fin: string;
}

export default function GestionDesempenoPage() {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    total_evaluaciones: 0,
    promedio_puntuacion: 0,
    pendientes: 0,
    completadas: 0,
    cumplimiento_objetivos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // TODO: Reemplazar con organizationId real
      const organizationId = 'org-123';
      
      const [evaluacionesRes, estadisticasRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rrhh/desempeno?organization_id=${organizationId}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rrhh/desempeno/estadisticas?organization_id=${organizationId}`)
      ]);
      
      const evaluacionesData = await evaluacionesRes.json();
      const estadisticasData = await estadisticasRes.json();
      
      setEvaluaciones(evaluacionesData);
      setEstadisticas({
        total_evaluaciones: estadisticasData.total_evaluaciones || 0,
        promedio_puntuacion: estadisticasData.promedio_puntuacion || 0,
        pendientes: estadisticasData.por_estado?.pendiente || 0,
        completadas: estadisticasData.por_estado?.completada + estadisticasData.por_estado?.aprobada || 0,
        cumplimiento_objetivos: 75 // TODO: Calcular desde objetivos
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar evaluaciones:', error);
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estilos = {
      pendiente: { variant: 'secondary' as const, icon: Clock, color: 'text-gray-500', text: 'Pendiente' },
      en_progreso: { variant: 'default' as const, icon: TrendingUp, color: 'text-blue-500', text: 'En Progreso' },
      completada: { variant: 'outline' as const, icon: CheckCircle, color: 'text-green-500', text: 'Completada' },
      aprobada: { variant: 'default' as const, icon: Award, color: 'text-purple-500', text: 'Aprobada' }
    };
    
    const config = estilos[estado as keyof typeof estilos];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`w-3 h-3 ${config.color}`} />
        {config.text}
      </Badge>
    );
  };

  const getPuntuacionColor = (puntuacion: number) => {
    if (puntuacion >= 8) return 'text-green-600';
    if (puntuacion >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calcularProgreso = (objetivos: Evaluacion['objetivos']) => {
    const objetivosConPuntuacion = objetivos.filter(obj => obj.puntuacion);
    if (objetivosConPuntuacion.length === 0) return 0;
    
    const sumaPonderada = objetivosConPuntuacion.reduce((acc, obj) => {
      return acc + (obj.puntuacion! * obj.peso / 100);
    }, 0);
    
    return Math.round(sumaPonderada * 10);
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Desempeño</h1>
          <p className="text-muted-foreground mt-1">
            Evaluaciones individuales, objetivos y seguimiento continuo
          </p>
        </div>
        <Button size="lg" className="w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Evaluación
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Evaluaciones</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {estadisticas.total_evaluaciones}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              En el período actual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntuación Promedio</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getPuntuacionColor(estadisticas.promedio_puntuacion)}`}>
              {estadisticas.promedio_puntuacion.toFixed(1)}/10
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Desempeño general
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {estadisticas.pendientes}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {estadisticas.completadas}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Finalizadas exitosamente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Evaluaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluaciones de Desempeño</CardTitle>
          <CardDescription>
            Seguimiento de objetivos y competencias por empleado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {evaluaciones.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay evaluaciones registradas</h3>
              <p className="text-muted-foreground mb-4">
                Comienza creando la primera evaluación de desempeño
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Evaluación
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {evaluaciones.map((evaluacion) => {
                const progreso = calcularProgreso(evaluacion.objetivos);
                
                return (
                  <div 
                    key={evaluacion._id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{evaluacion.empleado_nombre}</h3>
                          {getEstadoBadge(evaluacion.estado)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Evaluador: <span className="font-medium">{evaluacion.evaluador_nombre}</span></p>
                          <p>Período: <span className="font-medium">{evaluacion.periodo}</span></p>
                          <p>
                            {new Date(evaluacion.fecha_inicio).toLocaleDateString()} - {new Date(evaluacion.fecha_fin).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                        <div className={`text-3xl font-bold ${getPuntuacionColor(evaluacion.puntuacion_total)}`}>
                          {evaluacion.puntuacion_total.toFixed(1)}/10
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Puntuación Total
                        </div>
                      </div>
                    </div>

                    {/* Objetivos */}
                    <div className="space-y-3 mb-4">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Objetivos ({evaluacion.objetivos.length})
                      </h4>
                      {evaluacion.objetivos.slice(0, 3).map((objetivo) => (
                        <div key={objetivo.id} className="pl-6 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{objetivo.descripcion}</p>
                              <p className="text-xs text-muted-foreground">Meta: {objetivo.meta}</p>
                            </div>
                            {objetivo.puntuacion && (
                              <Badge variant="outline" className={getPuntuacionColor(objetivo.puntuacion)}>
                                {objetivo.puntuacion}/10
                              </Badge>
                            )}
                          </div>
                          {objetivo.puntuacion && (
                            <Progress value={objetivo.puntuacion * 10} className="h-2" />
                          )}
                        </div>
                      ))}
                      {evaluacion.objetivos.length > 3 && (
                        <p className="text-xs text-muted-foreground pl-6">
                          +{evaluacion.objetivos.length - 3} objetivos más
                        </p>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        Ver Detalles
                      </Button>
                      {evaluacion.estado !== 'aprobada' && (
                        <Button variant="default" size="sm" className="flex-1">
                          Actualizar Avance
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}







