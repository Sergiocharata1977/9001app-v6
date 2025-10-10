'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
  AlertCircle,
  Plus,
  Download,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { crmOportunidadService, crmClienteService, crmContactoService, crmActividadService } from '@/services/crmService';
import { useOrganization } from '@/contexts/OrganizationContext';
import { RelatedEntityCard, NotesTimeline, HistoryLog } from '@/components/crm/shared';
import { toast } from 'sonner';

// Datos de ejemplo más realistas
const datosEjemplo = {
  oportunidad: {
    id: '1',
    titulo: 'Venta de Semillas de Soja - Estancia San Miguel',
    descripcion: 'Oportunidad de venta de semillas de soja certificadas para la próxima temporada de siembra. El cliente necesita 500 hectáreas de semillas de alta calidad.',
    cliente_id: 'CLI-001',
    contacto_id: 'CON-001',
    valor_estimado: 125000,
    moneda: 'USD',
    probabilidad: 75,
    etapa: 'negociacion',
    fecha_creacion: '2024-01-15',
    fecha_cierre_esperada: '2024-03-15',
    fecha_cierre_real: null,
    vendedor_id: 'VEN-001',
    productos: [
      { producto_id: 'PROD-001', nombre: 'Semillas de Soja Certificadas', cantidad: 500, precio_unitario: 250 },
    ],
    actividades_relacionadas: ['ACT-001', 'ACT-002', 'ACT-003'],
    notas: [
      {
        texto: 'Cliente muy interesado en las semillas certificadas. Solicita muestras para análisis de calidad.',
        fecha: '2024-01-20',
        usuario_id: 'VEN-001',
        usuario_nombre: 'Carlos Rodriguez'
      },
      {
        texto: 'Se enviaron muestras al laboratorio. Esperando resultados para proceder con la negociación.',
        fecha: '2024-01-25',
        usuario_id: 'VEN-001',
        usuario_nombre: 'Carlos Rodriguez'
      }
    ],
    historial: [
      {
        campo: 'etapa',
        valor_anterior: 'propuesta',
        valor_nuevo: 'negociacion',
        fecha: '2024-01-20',
        usuario_id: 'VEN-001',
        usuario_nombre: 'Carlos Rodriguez'
      },
      {
        campo: 'probabilidad',
        valor_anterior: 60,
        valor_nuevo: 75,
        fecha: '2024-01-20',
        usuario_id: 'VEN-001',
        usuario_nombre: 'Carlos Rodriguez'
      }
    ],
    archivos: [
      {
        nombre: 'Propuesta_Comercial_Semillas.pdf',
        url: '/archivos/propuesta-semillas.pdf',
        tipo: 'application/pdf',
        fecha_subida: '2024-01-18',
        usuario_id: 'VEN-001'
      }
    ],
    tags: ['semillas', 'soja', 'certificadas', 'temporada-2024'],
    organization_id: 'ORG-2024-001'
  },
  cliente: {
    id: 'CLI-001',
    razon_social: 'Estancia San Miguel S.A.',
    rfc: 'ESM123456789',
    tipo_cliente: 'grande',
    categoria_agro: 'agricultura',
    zona_geografica: 'Pampas',
    region: 'Buenos Aires',
    superficie_total: 2500,
    cultivos_principales: ['soja', 'maiz', 'trigo'],
    direccion: 'Ruta Nacional 7, Km 180',
    ciudad: 'San Miguel del Monte',
    estado: 'Buenos Aires',
    vendedor_asignado_id: 'VEN-001',
    fecha_registro: '2023-06-15',
    fecha_ultimo_contacto: '2024-01-25'
  },
  contacto: {
    id: 'CON-001',
    nombre: 'María',
    apellidos: 'González',
    empresa_id: 'CLI-001',
    cargo: 'Gerente de Producción',
    email: 'maria.gonzalez@estanciasanmiguel.com',
    telefono: '+54 11 1234-5678',
    tipo_contacto: 'cliente',
    estado_contacto: 'activo',
    fecha_registro: '2023-06-15'
  },
  actividades: [
    {
      id: 'ACT-001',
      titulo: 'Llamada inicial de contacto',
      tipo_actividad: 'llamada',
      estado: 'completada',
      fecha_actividad: '2024-01-15',
      vendedor_id: 'VEN-001',
      resultado_tecnico: 'Cliente interesado en semillas certificadas. Solicita información detallada.',
      notas: [
        {
          texto: 'Muy buena recepción del producto. Interés en muestras.',
          fecha: '2024-01-15',
          usuario_id: 'VEN-001',
          usuario_nombre: 'Carlos Rodriguez'
        }
      ]
    },
    {
      id: 'ACT-002',
      titulo: 'Envío de propuesta comercial',
      tipo_actividad: 'email',
      estado: 'completada',
      fecha_actividad: '2024-01-18',
      vendedor_id: 'VEN-001',
      resultado_tecnico: 'Propuesta enviada con éxito. Cliente revisando términos.',
      notas: [
        {
          texto: 'Propuesta enviada por email. Adjunto PDF con especificaciones.',
          fecha: '2024-01-18',
          usuario_id: 'VEN-001',
          usuario_nombre: 'Carlos Rodriguez'
        }
      ]
    },
    {
      id: 'ACT-003',
      titulo: 'Visita técnica a campo',
      tipo_actividad: 'visita',
      estado: 'pendiente',
      fecha_actividad: '2024-02-05',
      vendedor_id: 'VEN-001',
      resultado_tecnico: null,
      notas: []
    }
  ]
};

export default function OportunidadSinglePage() {
  const params = useParams();
  const router = useRouter();
  const { organizationId } = useOrganization();
  const [oportunidad, setOportunidad] = useState(datosEjemplo.oportunidad);
  const [cliente, setCliente] = useState(datosEjemplo.cliente);
  const [contacto, setContacto] = useState(datosEjemplo.contacto);
  const [actividades, setActividades] = useState(datosEjemplo.actividades);
  const [loading, setLoading] = useState(false);

  const oportunidadId = params.id as string;

  useEffect(() => {
    if (oportunidadId && oportunidadId !== '1') {
      // Aquí se haría la llamada real a la API
      loadOportunidadData();
    }
  }, [oportunidadId, organizationId]);

  const loadOportunidadData = async () => {
    try {
      setLoading(true);
      // En un entorno real, estas llamadas serían:
      // const oportunidadData = await crmOportunidadService.getById(oportunidadId, organizationId);
      // const clienteData = await crmClienteService.getById(oportunidadData.data.cliente_id, organizationId);
      // etc...
    } catch (error) {
      console.error('Error cargando datos de oportunidad:', error);
      toast.error('Error al cargar los datos de la oportunidad');
    } finally {
      setLoading(false);
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

  const getEtapaLabel = (etapa: string) => {
    const labels = {
      prospecto: 'Prospecto',
      calificacion: 'Calificación',
      propuesta: 'Propuesta',
      negociacion: 'Negociación',
      cierre: 'Cierre'
    };
    return labels[etapa as keyof typeof labels] || etapa;
  };

  const getTipoActividadIcon = (tipo: string) => {
    switch (tipo) {
      case 'llamada': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'visita': return <MapPin className="h-4 w-4" />;
      case 'reunion': return <User className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getEstadoActividadColor = (estado: string) => {
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{oportunidad.titulo}</h1>
            <p className="text-gray-600">Oportunidad #{oportunidad.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Estimado</p>
                <p className="text-lg font-bold">${oportunidad.valor_estimado.toLocaleString()} {oportunidad.moneda}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Probabilidad</p>
                <p className="text-lg font-bold">{oportunidad.probabilidad}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Ponderado</p>
                <p className="text-lg font-bold">${(oportunidad.valor_estimado * oportunidad.probabilidad / 100).toLocaleString()} {oportunidad.moneda}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Fecha Cierre</p>
                <p className="text-lg font-bold">{new Date(oportunidad.fecha_cierre_esperada).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de progreso por etapas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso por Etapas</span>
            <Badge className={getEtapaColor(oportunidad.etapa)}>
              {getEtapaLabel(oportunidad.etapa)}
            </Badge>
          </div>
          <Progress value={(oportunidad.probabilidad)} className="h-2" />
        </CardContent>
      </Card>

      {/* Tabs principales */}
      <Tabs defaultValue="detalles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="detalles">Detalles</TabsTrigger>
          <TabsTrigger value="cliente">Cliente</TabsTrigger>
          <TabsTrigger value="contactos">Contactos</TabsTrigger>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="actividades">Actividades</TabsTrigger>
          <TabsTrigger value="notas">Notas</TabsTrigger>
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
                  <p className="text-sm">{oportunidad.descripcion}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha de Creación</label>
                  <p className="text-sm">{new Date(oportunidad.fecha_creacion).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Vendedor Asignado</label>
                  <p className="text-sm">Carlos Rodriguez</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tags</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {oportunidad.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Archivos Adjuntos</CardTitle>
              </CardHeader>
              <CardContent>
                {oportunidad.archivos.length > 0 ? (
                  <div className="space-y-2">
                    {oportunidad.archivos.map((archivo, index) => (
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
        </TabsContent>

        {/* Tab Cliente */}
        <TabsContent value="cliente" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Razón Social</label>
                    <p className="text-sm font-medium">{cliente.razon_social}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">RFC</label>
                    <p className="text-sm">{cliente.rfc}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tipo de Cliente</label>
                    <Badge variant="secondary">{cliente.tipo_cliente}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Superficie Total</label>
                    <p className="text-sm">{cliente.superficie_total} hectáreas</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Cultivos Principales</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {cliente.cultivos_principales.map((cultivo, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cultivo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ubicación</label>
                    <p className="text-sm">{cliente.ciudad}, {cliente.estado}</p>
                    <p className="text-xs text-gray-500">{cliente.direccion}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Último Contacto</label>
                    <p className="text-sm">{new Date(cliente.fecha_ultimo_contacto).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link href={`/crm/empresas/${cliente.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles Completos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Contactos */}
        <TabsContent value="contactos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contactos Relacionados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {contacto.nombre[0]}{contacto.apellidos[0]}
                    </div>
                    <div>
                      <p className="font-medium">{contacto.nombre} {contacto.apellidos}</p>
                      <p className="text-sm text-gray-600">{contacto.cargo}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Llamar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                    <Link href={`/crm/contactos/${contacto.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Productos */}
        <TabsContent value="productos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productos/Servicios</CardTitle>
            </CardHeader>
            <CardContent>
              {oportunidad.productos.length > 0 ? (
                <div className="space-y-3">
                  {oportunidad.productos.map((producto, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{producto.nombre}</p>
                        <p className="text-sm text-gray-600">Cantidad: {producto.cantidad} unidades</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${producto.precio_unitario.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">por unidad</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No hay productos asociados</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Actividades */}
        <TabsContent value="actividades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline de Actividades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actividades.map((actividad, index) => (
                  <div key={actividad.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getTipoActividadIcon(actividad.tipo_actividad)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{actividad.titulo}</h4>
                        <Badge className={getEstadoActividadColor(actividad.estado)}>
                          {actividad.estado}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(actividad.fecha_actividad).toLocaleString()}
                      </p>
                      {actividad.resultado_tecnico && (
                        <p className="text-sm mt-2 p-2 bg-gray-50 rounded">
                          {actividad.resultado_tecnico}
                        </p>
                      )}
                      {actividad.notas.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {actividad.notas.map((nota, notaIndex) => (
                            <div key={notaIndex} className="text-xs text-gray-500 border-l-2 border-gray-200 pl-2">
                              {nota.texto}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Link href={`/crm/actividades/${actividad.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Notas */}
        <TabsContent value="notas" className="space-y-4">
          <NotesTimeline
            notes={oportunidad.notas}
            onAddNote={(noteData) => {
              // En un entorno real, aquí se haría la llamada a la API
              console.log('Adding note:', noteData);
            }}
            currentUserId="VEN-001"
            currentUserName="Carlos Rodriguez"
          />
        </TabsContent>

        {/* Tab Historial */}
        <TabsContent value="historial" className="space-y-4">
          <HistoryLog
            entries={oportunidad.historial}
            groupByDate={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
