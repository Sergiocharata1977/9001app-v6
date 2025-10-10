'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Share,
  Calendar,
  User,
  Building2,
  Target,
  DollarSign,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  Users,
  Plus,
  Eye,
  Download,
  AlertCircle,
  Play,
  Pause,
  Square
} from 'lucide-react';
import Link from 'next/link';
import { crmActividadService, crmClienteService, crmContactoService, crmOportunidadService } from '@/services/crmService';
import { useOrganization } from '@/contexts/OrganizationContext';
import { toast } from 'sonner';

// Datos de ejemplo más realistas
const datosEjemplo = {
  actividad: {
    id: 'ACT-001',
    titulo: 'Llamada técnica de seguimiento - Estancia San Miguel',
    descripcion: 'Llamada de seguimiento para discutir los resultados del análisis de suelo y las recomendaciones de fertilización para la próxima temporada.',
    tipo_actividad: 'llamada',
    estado: 'completada',
    prioridad: 'alta',
    fecha_actividad: '2024-01-25',
    duracion_minutos: 45,
    cliente_id: 'CLI-001',
    contacto_id: 'CON-001',
    oportunidad_id: 'OPP-001',
    vendedor_id: 'VEN-001',
    resultado_tecnico: 'Cliente muy satisfecho con las recomendaciones. Solicita propuesta formal para fertilizantes nitrogenados. Interés en programa de seguimiento técnico.',
    recomendaciones: '1. Enviar propuesta formal de fertilizantes nitrogenados\n2. Programar visita técnica para febrero\n3. Preparar programa de seguimiento trimestral\n4. Considerar descuentos por volumen por ser cliente histórico',
    notas: [
      {
        texto: 'Cliente menciona que los resultados del análisis coinciden con lo observado en campo. Muy satisfecho con el servicio.',
        fecha: '2024-01-25',
        usuario_id: 'VEN-001',
        usuario_nombre: 'Carlos Rodriguez'
      },
      {
        texto: 'Solicita información sobre nuevas variedades de semillas resistentes a sequía para la próxima temporada.',
        fecha: '2024-01-25',
        usuario_id: 'VEN-001',
        usuario_nombre: 'Carlos Rodriguez'
      }
    ],
    historial: [
      {
        campo: 'estado',
        valor_anterior: 'pendiente',
        valor_nuevo: 'completada',
        fecha: '2024-01-25',
        usuario_id: 'VEN-001',
        usuario_nombre: 'Carlos Rodriguez'
      },
      {
        campo: 'duracion_minutos',
        valor_anterior: null,
        valor_nuevo: 45,
        fecha: '2024-01-25',
        usuario_id: 'VEN-001',
        usuario_nombre: 'Carlos Rodriguez'
      }
    ],
    archivos: [
      {
        nombre: 'Analisis_Suelo_Estancia_San_Miguel.pdf',
        url: '/archivos/analisis-suelo.pdf',
        tipo: 'application/pdf',
        fecha_subida: '2024-01-25',
        usuario_id: 'VEN-001'
      }
    ],
    recordatorios: [
      {
        fecha: '2024-01-26',
        mensaje: 'Enviar propuesta de fertilizantes nitrogenados',
        enviado: true
      },
      {
        fecha: '2024-02-01',
        mensaje: 'Programar visita técnica',
        enviado: false
      }
    ],
    seguimiento: [
      {
        id: 'SEG-001',
        titulo: 'Envío de propuesta de fertilizantes',
        tipo_actividad: 'email',
        fecha_programada: '2024-01-26',
        estado: 'completada',
        descripcion: 'Enviar propuesta formal con precios y condiciones especiales'
      },
      {
        id: 'SEG-002',
        titulo: 'Visita técnica a campo',
        tipo_actividad: 'visita',
        fecha_programada: '2024-02-05',
        estado: 'pendiente',
        descripcion: 'Visita técnica para evaluación de aplicación de fertilizantes'
      }
    ],
    organization_id: 'ORG-2024-001'
  },
  cliente: {
    id: 'CLI-001',
    razon_social: 'Estancia San Miguel S.A.',
    tipo_cliente: 'grande',
    ciudad: 'San Miguel del Monte',
    estado: 'Buenos Aires'
  },
  contacto: {
    id: 'CON-001',
    nombre: 'María',
    apellidos: 'González',
    cargo: 'Gerente de Producción',
    email: 'maria.gonzalez@estanciasanmiguel.com',
    telefono: '+54 11 1234-5678'
  },
  oportunidad: {
    id: 'OPP-001',
    titulo: 'Venta de Semillas de Soja - Estancia San Miguel',
    valor_estimado: 125000,
    probabilidad: 75,
    etapa: 'negociacion'
  },
  vendedor: {
    id: 'VEN-001',
    nombre: 'Carlos',
    apellidos: 'Rodriguez',
    cargo: 'Vendedor Senior'
  }
};

export default function ActividadSinglePage() {
  const params = useParams();
  const router = useRouter();
  const { organizationId } = useOrganization();
  const [actividad, setActividad] = useState(datosEjemplo.actividad);
  const [cliente, setCliente] = useState(datosEjemplo.cliente);
  const [contacto, setContacto] = useState(datosEjemplo.contacto);
  const [oportunidad, setOportunidad] = useState(datosEjemplo.oportunidad);
  const [vendedor, setVendedor] = useState(datosEjemplo.vendedor);
  const [nuevaNota, setNuevaNota] = useState('');
  const [loading, setLoading] = useState(false);

  const actividadId = params.id as string;

  useEffect(() => {
    if (actividadId && actividadId !== 'ACT-001') {
      loadActividadData();
    }
  }, [actividadId, organizationId]);

  const loadActividadData = async () => {
    try {
      setLoading(true);
      // En un entorno real, estas llamadas serían:
      // const actividadData = await crmActividadService.getById(actividadId, organizationId);
      // const clienteData = await crmClienteService.getById(actividadData.data.cliente_id, organizationId);
      // etc...
    } catch (error) {
      console.error('Error cargando datos de actividad:', error);
      toast.error('Error al cargar los datos de la actividad');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarNota = async () => {
    if (!nuevaNota.trim()) return;

    const nota = {
      texto: nuevaNota,
      fecha: new Date().toISOString(),
      usuario_id: 'VEN-001', // En un entorno real vendría del contexto de usuario
      usuario_nombre: 'Carlos Rodriguez'
    };

    setActividad(prev => ({
      ...prev,
      notas: [...prev.notas, nota]
    }));

    setNuevaNota('');
    toast.success('Nota agregada correctamente');
  };

  const handleCompletarActividad = async () => {
    // Aquí se actualizaría el estado en el backend
    setActividad(prev => ({
      ...prev,
      estado: 'completada'
    }));
    toast.success('Actividad marcada como completada');
  };

  const getTipoActividadIcon = (tipo: string) => {
    switch (tipo) {
      case 'llamada': return <Phone className="h-5 w-5" />;
      case 'email': return <Mail className="h-5 w-5" />;
      case 'visita': return <MapPin className="h-5 w-5" />;
      case 'reunion': return <User className="h-5 w-5" />;
      case 'tarea': return <CheckCircle className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTipoActividadColor = (tipo: string) => {
    const colors = {
      llamada: 'bg-blue-100 text-blue-800',
      email: 'bg-green-100 text-green-800',
      visita: 'bg-orange-100 text-orange-800',
      reunion: 'bg-purple-100 text-purple-800',
      tarea: 'bg-gray-100 text-gray-800',
      otro: 'bg-yellow-100 text-yellow-800'
    };
    return colors[tipo as keyof typeof colors] || colors.otro;
  };

  const getEstadoActividadColor = (estado: string) => {
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEtapaColor = (etapa: string) => {
    const colors = {
      prospecto: 'bg-gray-100 text-gray-800',
      calificacion: 'bg-blue-100 text-blue-800',
      propuesta: 'bg-purple-100 text-purple-800',
      negociacion: 'bg-orange-100 text-orange-800',
      cierre: 'bg-green-100 text-green-800'
    };
    return colors[etapa as keyof typeof colors] || colors.prospecto;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getTipoActividadColor(actividad.tipo_actividad)}`}>
              {getTipoActividadIcon(actividad.tipo_actividad)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{actividad.titulo}</h1>
              <p className="text-gray-600">Actividad #{actividad.id}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {actividad.estado === 'pendiente' && (
            <Button onClick={handleCompletarActividad} size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Completar
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Fecha</p>
                <p className="text-lg font-bold">{new Date(actividad.fecha_actividad).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Duración</p>
                <p className="text-lg font-bold">{actividad.duracion_minutos || 0} min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Prioridad</p>
                <Badge className={getPrioridadColor(actividad.prioridad)}>
                  {actividad.prioridad}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Estado</p>
                <Badge className={getEstadoActividadColor(actividad.estado)}>
                  {actividad.estado}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="detalles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="detalles">Detalles</TabsTrigger>
          <TabsTrigger value="relacionados">Relacionados</TabsTrigger>
          <TabsTrigger value="notas">Notas</TabsTrigger>
          <TabsTrigger value="resultados">Resultados</TabsTrigger>
          <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        {/* Tab Detalles */}
        <TabsContent value="detalles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Descripción</label>
                  <p className="text-sm">{actividad.descripcion}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tipo de Actividad</label>
                  <Badge className={getTipoActividadColor(actividad.tipo_actividad)}>
                    {actividad.tipo_actividad}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Responsable</label>
                  <p className="text-sm">{vendedor.nombre} {vendedor.apellidos} - {vendedor.cargo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha y Hora</label>
                  <p className="text-sm">{new Date(actividad.fecha_actividad).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Archivos Adjuntos</CardTitle>
              </CardHeader>
              <CardContent>
                {actividad.archivos.length > 0 ? (
                  <div className="space-y-2">
                    {actividad.archivos.map((archivo, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{archivo.nombre}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No hay archivos adjuntos</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recordatorios */}
          {actividad.recordatorios && actividad.recordatorios.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recordatorios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {actividad.recordatorios.map((recordatorio, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{recordatorio.mensaje}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(recordatorio.fecha).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={recordatorio.enviado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {recordatorio.enviado ? 'Enviado' : 'Pendiente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab Relacionados */}
        <TabsContent value="relacionados" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {cliente && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{cliente.razon_social}</p>
                    <p className="text-sm text-gray-600">{cliente.tipo_cliente}</p>
                    <p className="text-sm text-gray-500">{cliente.ciudad}, {cliente.estado}</p>
                    <Link href={`/crm/empresas/${cliente.id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {contacto && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{contacto.nombre} {contacto.apellidos}</p>
                    <p className="text-sm text-gray-600">{contacto.cargo}</p>
                    <p className="text-sm text-gray-500">{contacto.email}</p>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Link href={`/crm/contactos/${contacto.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {oportunidad && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Oportunidad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium text-sm">{oportunidad.titulo}</p>
                    <p className="text-sm text-gray-600">${oportunidad.valor_estimado.toLocaleString()}</p>
                    <Badge className={getEtapaColor(oportunidad.etapa)}>
                      {oportunidad.etapa}
                    </Badge>
                    <Link href={`/crm/oportunidades/${oportunidad.id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab Notas */}
        <TabsContent value="notas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notas de la Actividad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actividad.notas.map((nota, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{nota.usuario_nombre}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(nota.fecha).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{nota.texto}</p>
                  </div>
                ))}
                
                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Agregar una nueva nota..."
                      value={nuevaNota}
                      onChange={(e) => setNuevaNota(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleAgregarNota} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Nota
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Resultados */}
        <TabsContent value="resultados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Resultados Técnicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {actividad.resultado_tecnico ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Resultado de la Actividad</label>
                    <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{actividad.resultado_tecnico}</p>
                  </div>
                  {actividad.recomendaciones && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Recomendaciones</label>
                      <div className="text-sm mt-1 p-3 bg-blue-50 rounded whitespace-pre-line">
                        {actividad.recomendaciones}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay resultados registrados para esta actividad</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Seguimiento */}
        <TabsContent value="seguimiento" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Actividades de Seguimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              {actividad.seguimiento && actividad.seguimiento.length > 0 ? (
                <div className="space-y-3">
                  {actividad.seguimiento.map((seguimiento) => (
                    <div key={seguimiento.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{seguimiento.titulo}</p>
                        <p className="text-sm text-gray-600">{seguimiento.descripcion}</p>
                        <p className="text-xs text-gray-500">
                          Programada: {new Date(seguimiento.fecha_programada).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getEstadoActividadColor(seguimiento.estado)}>
                          {seguimiento.estado}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay actividades de seguimiento programadas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Historial */}
        <TabsContent value="historial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Historial de Cambios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {actividad.historial.map((cambio, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{cambio.usuario_nombre}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(cambio.fecha).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Cambió <strong>{cambio.campo}</strong> de "{cambio.valor_anterior}" a "{cambio.valor_nuevo}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}




