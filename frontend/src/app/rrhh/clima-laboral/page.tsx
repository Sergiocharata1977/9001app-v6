'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertCircle,
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    Plus,
    TrendingUp,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Encuesta {
  _id: string;
  id: string;
  titulo: string;
  descripcion?: string;
  periodo: string;
  estado: 'borrador' | 'activa' | 'cerrada';
  fecha_inicio: string;
  fecha_fin: string;
  total_respuestas: number;
  promedio_general?: number;
  anonima: boolean;
}

export default function ClimaLaboralPage() {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    satisfaccion_promedio: 0,
    total_respuestas: 0,
    encuestas_activas: 0,
    tendencia: '+2%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // TODO: Reemplazar con organizationId real
      const organizationId = 'org-123';
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rrhh/clima-laboral?organization_id=${organizationId}`);
      const data = await response.json();
      
      setEncuestas(data);
      
      // Calcular estadísticas
      const activas = data.filter((e: Encuesta) => e.estado === 'activa').length;
      const totalRespuestas = data.reduce((acc: number, e: Encuesta) => acc + e.total_respuestas, 0);
      const encuestasConPromedio = data.filter((e: Encuesta) => e.promedio_general);
      const promedioGeneral = encuestasConPromedio.length > 0
        ? encuestasConPromedio.reduce((acc: number, e: Encuesta) => acc + (e.promedio_general || 0), 0) / encuestasConPromedio.length
        : 0;
      
      setEstadisticas({
        satisfaccion_promedio: Math.round(promedioGeneral * 100 / 5), // Convertir de escala 1-5 a porcentaje
        total_respuestas: totalRespuestas,
        encuestas_activas: activas,
        tendencia: '+2%'
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar encuestas:', error);
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estilos = {
      borrador: { variant: 'secondary' as const, icon: Clock, color: 'text-gray-500' },
      activa: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-500' },
      cerrada: { variant: 'outline' as const, icon: AlertCircle, color: 'text-red-500' }
    };
    
    const config = estilos[estado as keyof typeof estilos];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`w-3 h-3 ${config.color}`} />
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
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
          <h1 className="text-3xl font-bold tracking-tight">Clima Laboral</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona encuestas de satisfacción y analiza el ambiente organizacional
          </p>
        </div>
        <Button size="lg" className="w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Encuesta
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfacción Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {estadisticas.satisfaccion_promedio}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {estadisticas.tendencia} desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Respuestas</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {estadisticas.total_respuestas}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Participación registrada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Encuestas Activas</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {estadisticas.encuestas_activas}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              En curso actualmente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Encuestas */}
      <Card>
        <CardHeader>
          <CardTitle>Encuestas de Clima Laboral</CardTitle>
          <CardDescription>
            Historial completo de encuestas de satisfacción organizacional
          </CardDescription>
        </CardHeader>
        <CardContent>
          {encuestas.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay encuestas creadas</h3>
              <p className="text-muted-foreground mb-4">
                Comienza creando tu primera encuesta de clima laboral
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Encuesta
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {encuestas.map((encuesta) => (
                <div 
                  key={encuesta._id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 mb-3 md:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{encuesta.titulo}</h3>
                      {getEstadoBadge(encuesta.estado)}
                    </div>
                    {encuesta.descripcion && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {encuesta.descripcion}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(encuesta.fecha_inicio).toLocaleDateString()} - {new Date(encuesta.fecha_fin).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{encuesta.total_respuestas} respuestas</span>
                      </div>
                      {encuesta.promedio_general && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>Promedio: {encuesta.promedio_general.toFixed(1)}/5</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    {encuesta.estado === 'activa' && (
                      <Button variant="default" size="sm" className="flex-1 md:flex-none">
                        Responder
                      </Button>
                    )}
                    {encuesta.estado === 'cerrada' && (
                      <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                        Ver Resultados
                      </Button>
                    )}
                    {encuesta.estado === 'borrador' && (
                      <>
                        <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                          Editar
                        </Button>
                        <Button variant="default" size="sm" className="flex-1 md:flex-none">
                          Publicar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

