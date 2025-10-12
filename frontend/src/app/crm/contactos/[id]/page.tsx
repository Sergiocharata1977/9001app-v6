'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  MessageSquare,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { crmContactoService, crmClienteService, crmOportunidadService, crmActividadService } from '@/services/crmService';
import { useOrganization } from '@/contexts/OrganizationContext';
import { toast } from 'sonner';

// Datos de ejemplo más realistas
const datosEjemplo = {
  contacto: {
    id: 'CON-001',
    nombre: 'María',
    apellidos: 'González',
    empresa_id: 'CLI-001',
    cargo: 'Gerente de Producción',
    email: 'maria.gonzalez@estanciasanmiguel.com',
    telefono: '+54 11 1234-5678',
    telefono_secundario: '+54 11 9876-5432',
    tipo_contacto: 'cliente',
    estado_contacto: 'activo',
    direccion: 'Av. Corrientes 1234',
    ciudad: 'San Miguel del Monte',
    estado: 'Buenos Aires',
    fecha_nacimiento: '1985-03-15',
    redes_sociales: {
      linkedin: 'https://linkedin.com/in/maria-gonzalez',
      twitter: '@maria_gonzalez'
    },
    preferencias_contacto: ['email', 'whatsapp'],
    oportunidades_relacionadas: ['OPP-001', 'OPP-002'],
    actividades_relacionadas: ['ACT-001', 'ACT-002', 'ACT-003'],
    notas: [
      {
        texto: 'Contacto clave para decisiones de compra. Muy receptiva a propuestas técnicas.',
        fecha: '2024-01-10',
        usuario_id: 'VEN-001',
        usuario_nombre: 'Carlos Rodriguez'
      },
      {
        texto: 'Preferencia por comunicación por email. Evitar llamadas en horario de almuerzo.',
        fecha: '2024-01-15',
        usuario_id: 'VEN-001',
        usuario_nombre: 'Carlos Rodriguez'
      }
    ],
    historial: [
      {
        campo: 'cargo',
        valor_anterior: 'Supervisora de Producción',
        valor_nuevo: 'Gerente de Producción',
        fecha: '2024-01-01',
        usuario_id: 'CON-001',
        usuario_nombre: 'María González'
      }
    ],
    fecha_registro: '2023-06-15',
    fecha_ultimo_contacto: '2024-01-25',
    organization_id: 'ORG-2024-001'
  },
  empresa: {
    id: 'CLI-001',
    razon_social: 'Estancia San Miguel S.A.',
    tipo_cliente: 'grande',
    superficie_total: 2500,
    cultivos_principales: ['soja', 'maiz', 'trigo'],
    ciudad: 'San Miguel del Monte',
    estado: 'Buenos Aires'
  },
  oportunidades: [
    {
      id: 'OPP-001',
      titulo: 'Venta de Semillas de Soja - Estancia San Miguel',
      valor_estimado: 125000,
      probabilidad: 75,
      etapa: 'negociacion',
      fecha_cierre_esperada: '2024-03-15'
    },
    {
      id: 'OPP-002',
      titulo: 'Fertilizantes para Temporada 2024',
      valor_estimado: 85000,
      probabilidad: 90,
      etapa: 'cierre',
      fecha_cierre_esperada: '2024-02-28'
    }
  ],
  actividades: [
    {
      id: 'ACT-001',
      titulo: 'Llamada inicial de presentación',
      tipo_actividad: 'llamada',
      estado: 'completada',
      fecha_actividad: '2024-01-15',
      duracion_minutos: 30,
      resultado_tecnico: 'Muy buena recepción. Interés en productos certificados.',
      notas: [
        {
          texto: 'Contacto muy profesional y conocedora del sector.',
          fecha: '2024-01-15',
          usuario_id: 'VEN-001',
          usuario_nombre: 'Carlos Rodriguez'
        }
      ]
    },
    {
      id: 'ACT-002',
      titulo: 'Envío de catálogo de productos',
      tipo_actividad: 'email',
      estado: 'completada',
      fecha_actividad: '2024-01-18',
      resultado_tecnico: 'Catálogo enviado exitosamente. Confirmó recepción.',
      notas: [
        {
          texto: 'Solicita información adicional sobre certificaciones.',
          fecha: '2024-01-18',
          usuario_id: 'VEN-001',
          usuario_nombre: 'Carlos Rodriguez'
        }
      ]
    },
    {
      id: 'ACT-003',
      titulo: 'Reunión virtual de seguimiento',
      tipo_actividad: 'reunion',
      estado: 'pendiente',
      fecha_actividad: '2024-02-05',
      duracion_minutos: 60,
      resultado_tecnico: null,
      notas: []
    }
  ],
  estadisticas: {
    total_oportunidades: 2,
    valor_total_oportunidades: 210000,
    actividades_completadas: 2,
    actividades_pendientes: 1,
    dias_desde_ultimo_contacto: 5
  }
};

export default function ContactoSinglePage() {
  const params = useParams();
  const router = useRouter();
  const { organizationId } = useOrganization();
  const [contacto, setContacto] = useState(datosEjemplo.contacto);
  const [empresa, setEmpresa] = useState(datosEjemplo.empresa);
  const [oportunidades, setOportunidades] = useState(datosEjemplo.oportunidades);
  const [actividades, setActividades] = useState(datosEjemplo.actividades);
  const [estadisticas, setEstadisticas] = useState(datosEjemplo.estadisticas);
  const [loading, setLoading] = useState(false);

  const contactoId = params.id as string;

  useEffect(() => {
    if (contactoId && contactoId !== 'CON-001') {
      loadContactoData();
    }
  }, [contactoId, organizationId]);

  const loadContactoData = async () => {
    try {
      setLoading(true);
      // En un entorno real, estas llamadas serían:
      // const contactoData = await crmContactoService.getById(contactoId, organizationId);
      // const empresaData = await crmClienteService.getById(contactoData.data.empresa_id, organizationId);
      // etc...
    } catch (error) {
      console.error('Error cargando datos de contacto:', error);
      toast.error('Error al cargar los datos del contacto');
    } finally {
      setLoading(false);
    }
  };

  const getTipoContactoColor = (tipo: string) => {
    const colors = {
      prospecto: 'bg-blue-100 text-blue-800',
      cliente: 'bg-green-100 text-green-800',
      proveedor: 'bg-purple-100 text-purple-800',
      aliado: 'bg-orange-100 text-orange-800'
    };
    return colors[tipo as keyof typeof colors] || colors.cliente;
  };

  const getEstadoContactoColor = (estado: string) => {
    const colors = {
      activo: 'bg-green-100 text-green-800',
      inactivo: 'bg-gray-100 text-gray-800',
      pendiente: 'bg-yellow-100 text-yellow-800'
    };
    return colors[estado as keyof typeof colors] || colors.activo;
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

  const getInitials = (nombre: string, apellidos: string) => {
    return `${nombre[0]}${apellidos[0]}`.toUpperCase();
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {getInitials(contacto.nombre, contacto.apellidos)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{contacto.nombre} {contacto.apellidos}</h1>
              <p className="text-gray-600">{contacto.cargo} • {empresa.razon_social}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Llamar
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
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
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Oportunidades</p>
                <p className="text-lg font-bold">{estadisticas.total_oportunidades}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-lg font-bold">${estadisticas.valor_total_oportunidades.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Actividades</p>
                <p className="text-lg font-bold">{estadisticas.actividades_completadas}/{estadisticas.actividades_completadas + estadisticas.actividades_pendientes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Último Contacto</p>
                <p className="text-lg font-bold">{estadisticas.dias_desde_ultimo_contacto} días</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="detalles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="detalles">Detalles</TabsTrigger>
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          <TabsTrigger value="actividades">Actividades</TabsTrigger>
          <TabsTrigger value="notas">Notas</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        {/* Tab Detalles */}
        <TabsContent value="detalles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                  <p className="text-sm font-medium">{contacto.nombre} {contacto.apellidos}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Cargo</label>
                  <p className="text-sm">{contacto.cargo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tipo de Contacto</label>
                  <Badge className={getTipoContactoColor(contacto.tipo_contacto)}>
                    {contacto.tipo_contacto}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <Badge className={getEstadoContactoColor(contacto.estado_contacto)}>
                    {contacto.estado_contacto}
                  </Badge>
                </div>
                {contacto.fecha_nacimiento && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
                    <p className="text-sm">{new Date(contacto.fecha_nacimiento).toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm">{contacto.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Teléfono Principal</label>
                  <p className="text-sm">{contacto.telefono}</p>
                </div>
                {contacto.telefono_secundario && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Teléfono Secundario</label>
                    <p className="text-sm">{contacto.telefono_secundario}</p>
                  </div>
                )}
                {contacto.direccion && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dirección</label>
                    <p className="text-sm">{contacto.direccion}</p>
                    <p className="text-xs text-gray-500">{contacto.ciudad}, {contacto.estado}</p>
                  </div>
                )}
                {contacto.preferencias_contacto && contacto.preferencias_contacto.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Preferencias de Contacto</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {contacto.preferencias_contacto.map((pref, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Redes Sociales */}
          {contacto.redes_sociales && (contacto.redes_sociales.linkedin || contacto.redes_sociales.twitter) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Redes Sociales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {contacto.redes_sociales.linkedin && (
                    <a href={contacto.redes_sociales.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                      <MessageSquare className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {contacto.redes_sociales.twitter && (
                    <a href={`https://twitter.com/${contacto.redes_sociales.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-600">
                      <MessageSquare className="h-4 w-4" />
                      Twitter
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab Empresa */}
        <TabsContent value="empresa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información de la Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Razón Social</label>
                    <p className="text-sm font-medium">{empresa.razon_social}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tipo de Cliente</label>
                    <Badge variant="secondary">{empresa.tipo_cliente}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Superficie Total</label>
                    <p className="text-sm">{empresa.superficie_total} hectáreas</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Cultivos Principales</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {empresa.cultivos_principales.map((cultivo, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cultivo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ubicación</label>
                    <p className="text-sm">{empresa.ciudad}, {empresa.estado}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link href={`/crm/empresas/${empresa.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles de la Empresa
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Oportunidades */}
        <TabsContent value="oportunidades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Oportunidades Relacionadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {oportunidades.map((oportunidad) => (
                  <div key={oportunidad.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{oportunidad.titulo}</p>
                      <p className="text-sm text-gray-600">
                        Valor: ${oportunidad.valor_estimado.toLocaleString()} | 
                        Probabilidad: {oportunidad.probabilidad}%
                      </p>
                      <p className="text-xs text-gray-500">
                        Cierre esperado: {new Date(oportunidad.fecha_cierre_esperada).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getEtapaColor(oportunidad.etapa)}>
                        {oportunidad.etapa}
                      </Badge>
                      <Link href={`/crm/oportunidades/${oportunidad.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
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
                {actividades.map((actividad) => (
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
                        {actividad.duracion_minutos && ` • ${actividad.duracion_minutos} min`}
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notas y Comentarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contacto.notas.map((nota, index) => (
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
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Nota
                  </Button>
                </div>
              </div>
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
                {contacto.historial.map((cambio, index) => (
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








