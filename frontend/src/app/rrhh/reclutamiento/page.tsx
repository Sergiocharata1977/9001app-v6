'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Briefcase,
    Building2,
    Calendar,
    Clock,
    DollarSign,
    FileText,
    Mail,
    Phone,
    Plus,
    TrendingUp,
    UserPlus,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Candidato {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  cv_url?: string;
  estado_aplicacion: 'aplicado' | 'en_revision' | 'entrevista' | 'seleccionado' | 'rechazado';
  puntuacion?: number;
  fecha_aplicacion: string;
}

interface Vacante {
  _id: string;
  titulo_puesto: string;
  departamento: string;
  descripcion: string;
  tipo_contrato: string;
  modalidad: string;
  estado: 'borrador' | 'publicada' | 'cerrada' | 'cancelada';
  fecha_publicacion: string;
  fecha_cierre: string;
  candidatos: Candidato[];
  salario_min?: number;
  salario_max?: number;
}

export default function ReclutamientoPage() {
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    total_vacantes: 0,
    vacantes_publicadas: 0,
    total_candidatos: 0,
    tasa_conversion: 0,
    promedio_candidatos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const organizationId = 'org-123';
      
      const [vacantesRes, estadisticasRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rrhh/reclutamiento?organization_id=${organizationId}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rrhh/reclutamiento/estadisticas?organization_id=${organizationId}`)
      ]);
      
      const vacantesData = await vacantesRes.json();
      const estadisticasData = await estadisticasRes.json();
      
      setVacantes(vacantesData);
      setEstadisticas({
        total_vacantes: estadisticasData.total_vacantes || 0,
        vacantes_publicadas: estadisticasData.por_estado?.publicada || 0,
        total_candidatos: estadisticasData.total_candidatos || 0,
        tasa_conversion: estadisticasData.tasa_conversion || 0,
        promedio_candidatos: estadisticasData.promedio_candidatos_por_vacante || 0
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar vacantes:', error);
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estilos = {
      borrador: { variant: 'secondary' as const, text: 'Borrador' },
      publicada: { variant: 'default' as const, text: 'Publicada' },
      cerrada: { variant: 'outline' as const, text: 'Cerrada' },
      cancelada: { variant: 'destructive' as const, text: 'Cancelada' }
    };
    
    const config = estilos[estado as keyof typeof estilos] || estilos.borrador;
    
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getEstadoCandidatoBadge = (estado: string) => {
    const estilos = {
      aplicado: { variant: 'secondary' as const, text: 'Aplicado' },
      en_revision: { variant: 'default' as const, text: 'En Revisión' },
      entrevista: { variant: 'default' as const, text: 'Entrevista' },
      seleccionado: { variant: 'default' as const, text: 'Seleccionado' },
      rechazado: { variant: 'outline' as const, text: 'Rechazado' }
    };
    
    const config = estilos[estado as keyof typeof estilos] || estilos.aplicado;
    
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getTipoContratoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      'tiempo_completo': 'Tiempo Completo',
      'tiempo_parcial': 'Tiempo Parcial',
      'temporal': 'Temporal',
      'practicas': 'Prácticas'
    };
    return tipos[tipo] || tipo;
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
          <h1 className="text-3xl font-bold tracking-tight">Reclutamiento y Selección</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona vacantes, candidatos y proceso de contratación
          </p>
        </div>
        <Button size="lg" className="w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Vacante
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vacantes</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {estadisticas.total_vacantes}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {estadisticas.vacantes_publicadas} publicadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidatos</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {estadisticas.total_candidatos}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Aplicaciones recibidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Vacante</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {estadisticas.promedio_candidatos.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Candidatos por vacante
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa Conversión</CardTitle>
            <UserPlus className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {estadisticas.tasa_conversion.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Candidatos seleccionados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Vacantes */}
      <Card>
        <CardHeader>
          <CardTitle>Vacantes Activas</CardTitle>
          <CardDescription>
            Gestión de posiciones abiertas y pipeline de candidatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vacantes.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay vacantes publicadas</h3>
              <p className="text-muted-foreground mb-4">
                Comienza creando tu primera vacante
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Vacante
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {vacantes.map((vacante) => (
                <div 
                  key={vacante._id}
                  className="p-6 border rounded-lg hover:shadow-md transition-shadow space-y-4"
                >
                  {/* Header Vacante */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-xl">{vacante.titulo_puesto}</h3>
                        {getEstadoBadge(vacante.estado)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          <span>{vacante.departamento}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{getTipoContratoLabel(vacante.tipo_contrato)}</span>
                        </div>
                        {(vacante.salario_min || vacante.salario_max) && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              {vacante.salario_min && `$${vacante.salario_min.toLocaleString()}`}
                              {vacante.salario_min && vacante.salario_max && ' - '}
                              {vacante.salario_max && `$${vacante.salario_max.toLocaleString()}`}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Cierra: {new Date(vacante.fecha_cierre).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      {vacante.estado === 'borrador' && (
                        <Button variant="default" size="sm">
                          Publicar
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Candidatos */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Candidatos ({vacante.candidatos.length})
                      </h4>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Candidato
                      </Button>
                    </div>

                    {vacante.candidatos.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No hay candidatos aplicados aún
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {vacante.candidatos.slice(0, 4).map((candidato) => (
                          <div 
                            key={candidato.id}
                            className="p-3 bg-secondary/20 rounded-lg space-y-2"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium">{candidato.nombre}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <Mail className="w-3 h-3" />
                                  <span className="truncate">{candidato.email}</span>
                                </div>
                                {candidato.telefono && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Phone className="w-3 h-3" />
                                    <span>{candidato.telefono}</span>
                                  </div>
                                )}
                              </div>
                              {getEstadoCandidatoBadge(candidato.estado_aplicacion)}
                            </div>
                            
                            {candidato.puntuacion && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Puntuación:</span>
                                <Badge variant="outline">{candidato.puntuacion}/10</Badge>
                              </div>
                            )}
                            
                            <div className="flex gap-2 pt-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                Ver Perfil
                              </Button>
                              {candidato.cv_url && (
                                <Button variant="outline" size="sm">
                                  <FileText className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {vacante.candidatos.length > 4 && (
                          <div className="col-span-full text-center">
                            <Button variant="ghost" size="sm">
                              Ver todos los {vacante.candidatos.length} candidatos
                            </Button>
                          </div>
                        )}
                      </div>
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







