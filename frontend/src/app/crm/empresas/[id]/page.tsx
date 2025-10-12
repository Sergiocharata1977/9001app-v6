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
  Wheat,
  Plus,
  Eye,
  Download,
  FolderOpen
} from 'lucide-react';
import Link from 'next/link';
import { crmClienteService, crmContactoService, crmOportunidadService, crmActividadService } from '@/services/crmService';
import { useOrganization } from '@/contexts/OrganizationContext';
import { RelatedEntityCard, NotesTimeline, HistoryLog } from '@/components/crm/shared';
import { toast } from 'sonner';
import axios from 'axios';

// Datos de ejemplo más realistas
const datosEjemplo = {
  empresa: {
    id: 'CLI-001',
    razon_social: 'Estancia San Miguel S.A.',
    rfc: 'ESM123456789',
    tipo_cliente: 'grande',
    categoria_agro: 'agricultura',
    zona_geografica: 'Pampas',
    region: 'Buenos Aires',
    clima_zona: 'templado',
    tipo_suelo: 'arcilloso-limoso',
    direccion: 'Ruta Nacional 7, Km 180',
    ciudad: 'San Miguel del Monte',
    estado: 'Buenos Aires',
    superficie_total: 2500,
    cultivos_principales: ['soja', 'maiz', 'trigo'],
    sistema_riego: 'aspersión',
    tipo_agricultura: 'extensiva',
    vendedor_asignado_id: 'VEN-001',
    tecnico_asignado_id: 'TEC-001',
    contactos_relacionados: ['CON-001', 'CON-002'],
    oportunidades_relacionadas: ['OPP-001', 'OPP-002'],
    actividades_relacionadas: ['ACT-001', 'ACT-002', 'ACT-003'],
    notas: [
      {
        texto: 'Cliente histórico con excelente relación comercial. Siempre puntual en pagos.',
        fecha: '2024-01-10',
        usuario_id: 'VEN-001',
        usuario_nombre: 'Carlos Rodriguez'
      },
      {
        texto: 'Interés en nuevas variedades de semillas resistentes a sequía.',
        fecha: '2024-01-15',
        usuario_id: 'TEC-001',
        usuario_nombre: 'Ana Martinez'
      }
    ],
    historial: [
      {
        campo: 'vendedor_asignado_id',
        valor_anterior: 'VEN-002',
        valor_nuevo: 'VEN-001',
        fecha: '2024-01-01',
        usuario_id: 'ADM-001',
        usuario_nombre: 'Admin Sistema'
      }
    ],
    archivos: [
      {
        nombre: 'Certificado_Fitosanitario_2024.pdf',
        url: '/archivos/certificado-fitosanitario.pdf',
        tipo: 'application/pdf',
        fecha_subida: '2024-01-20',
        usuario_id: 'TEC-001'
      }
    ],
    fecha_registro: '2023-06-15',
    fecha_ultimo_contacto: '2024-01-25',
    organization_id: 'ORG-2024-001'
  },
  contactos: [
    {
      id: 'CON-001',
      nombre: 'María',
      apellidos: 'González',
      cargo: 'Gerente de Producción',
      email: 'maria.gonzalez@estanciasanmiguel.com',
      telefono: '+54 11 1234-5678',
      tipo_contacto: 'cliente',
      estado_contacto: 'activo'
    },
    {
      id: 'CON-002',
      nombre: 'Roberto',
      apellidos: 'Silva',
      cargo: 'Director Comercial',
      email: 'roberto.silva@estanciasanmiguel.com',
      telefono: '+54 11 2345-6789',
      tipo_contacto: 'cliente',
      estado_contacto: 'activo'
    }
  ],
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
      titulo: 'Visita técnica a campo',
      tipo_actividad: 'visita',
      estado: 'completada',
      fecha_actividad: '2024-01-20',
      resultado_tecnico: 'Evaluación de suelos completada. Recomendaciones de fertilización entregadas.',
      notas: [
        {
          texto: 'Suelos en buen estado. Recomendamos aplicación de nitrógeno en febrero.',
          fecha: '2024-01-20',
          usuario_id: 'TEC-001',
          usuario_nombre: 'Ana Martinez'
        }
      ]
    },
    {
      id: 'ACT-002',
      titulo: 'Llamada de seguimiento comercial',
      tipo_actividad: 'llamada',
      estado: 'completada',
      fecha_actividad: '2024-01-25',
      resultado_tecnico: 'Cliente satisfecho con servicios. Interés en nueva propuesta de semillas.',
      notas: [
        {
          texto: 'Muy buena recepción. Enviar propuesta de semillas certificadas.',
          fecha: '2024-01-25',
          usuario_id: 'VEN-001',
          usuario_nombre: 'Carlos Rodriguez'
        }
      ]
    }
  ],
  estadisticas: {
    total_oportunidades: 2,
    oportunidades_activas: 1,
    valor_total_pipeline: 210000,
    valor_cierre_anterior: 150000,
    fecha_ultima_venta: '2023-12-15'
  }
};

export default function EmpresaSinglePage() {
  const params = useParams();
  const router = useRouter();
  const { organizationId } = useOrganization();
  const [empresa, setEmpresa] = useState(datosEjemplo.empresa);
  const [contactos, setContactos] = useState(datosEjemplo.contactos);
  const [oportunidades, setOportunidades] = useState(datosEjemplo.oportunidades);
  const [actividades, setActividades] = useState(datosEjemplo.actividades);
  const [estadisticas, setEstadisticas] = useState(datosEjemplo.estadisticas);
  const [loading, setLoading] = useState(false);

  const empresaId = params.id as string;

  useEffect(() => {
    if (empresaId && empresaId !== 'CLI-001') {
      loadEmpresaData();
    }
  }, [empresaId, organizationId]);

  const loadEmpresaData = async () => {
    try {
      setLoading(true);
      // En un entorno real, estas llamadas serían:
      // const empresaData = await crmClienteService.getById(empresaId, organizationId);
      // const contactosData = await crmContactoService.getByEmpresa(empresaId, organizationId);
      // etc...
    } catch (error) {
      console.error('Error cargando datos de empresa:', error);
      toast.error('Error al cargar los datos de la empresa');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el clic en "Ver Legajo"
   * - Si la empresa ya tiene legajo, abre ese legajo
   * - Si no tiene legajo, crea uno automáticamente
   * - Redirige a la vista del legajo
   */
  const handleVerLegajo = async () => {
    try {
      setLoading(true);
      toast.loading('Cargando legajo...', { id: 'legajo-loading' });

      // Llamar al endpoint que obtiene o crea el legajo
      const response = await axios.post(
        `/api/crm/clientes/${empresaId}/legajo`,
        {
          organization_id: organizationId,
          user_id: 'USER-001' // TODO: Obtener del contexto de auth
        }
      );

      const legajo = response.data.data;
      const isNew = response.data.is_new;

      toast.dismiss('legajo-loading');

      if (isNew) {
        toast.success('Legajo creado automáticamente');
      } else {
        toast.success('Legajo encontrado');
      }

      // Redirigir a la vista del legajo
      router.push(`/crm/legajos/${legajo._id}`);

    } catch (error: any) {
      toast.dismiss('legajo-loading');
      console.error('Error al obtener/crear legajo:', error);
      toast.error(error.response?.data?.message || 'Error al acceder al legajo');
    } finally {
      setLoading(false);
    }
  };

  const getTipoClienteColor = (tipo: string) => {
    const colors = {
      pequeño: 'bg-blue-100 text-blue-800',
      mediano: 'bg-green-100 text-green-800',
      grande: 'bg-orange-100 text-orange-800',
      corporativo: 'bg-purple-100 text-purple-800'
    };
    return colors[tipo as keyof typeof colors] || colors.mediano;
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
            <h1 className="text-2xl font-bold text-gray-900">{empresa.razon_social}</h1>
            <p className="text-gray-600">Empresa #{empresa.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Botón destacado: Ver Legajo */}
          <Button 
            onClick={handleVerLegajo}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Ver Legajo
          </Button>
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
                <p className="text-sm font-medium text-gray-600">Pipeline Actual</p>
                <p className="text-lg font-bold">${estadisticas.valor_total_pipeline.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Última Venta</p>
                <p className="text-lg font-bold">${estadisticas.valor_cierre_anterior.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Último Contacto</p>
                <p className="text-lg font-bold">{new Date(empresa.fecha_ultimo_contacto).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="detalles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="detalles">Detalles</TabsTrigger>
          <TabsTrigger value="agricola">Agrícola</TabsTrigger>
          <TabsTrigger value="contactos">Contactos</TabsTrigger>
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
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Razón Social</label>
                  <p className="text-sm font-medium">{empresa.razon_social}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">RFC</label>
                  <p className="text-sm">{empresa.rfc}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tipo de Cliente</label>
                  <Badge className={getTipoClienteColor(empresa.tipo_cliente)}>
                    {empresa.tipo_cliente}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Categoría Agro</label>
                  <p className="text-sm">{empresa.categoria_agro}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha de Registro</label>
                  <p className="text-sm">{new Date(empresa.fecha_registro).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Dirección</label>
                  <p className="text-sm">{empresa.direccion}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Ciudad</label>
                  <p className="text-sm">{empresa.ciudad}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <p className="text-sm">{empresa.estado}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Región</label>
                  <p className="text-sm">{empresa.region}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Zona Geográfica</label>
                  <p className="text-sm">{empresa.zona_geografica}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Archivos Adjuntos</CardTitle>
            </CardHeader>
            <CardContent>
              {empresa.archivos.length > 0 ? (
                <div className="space-y-2">
                  {empresa.archivos.map((archivo, index) => (
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
        </TabsContent>

        {/* Tab Agrícola */}
        <TabsContent value="agricola" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wheat className="h-5 w-5" />
                  Información Agrícola
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Superficie Total</label>
                  <p className="text-sm font-medium">{empresa.superficie_total} hectáreas</p>
                </div>
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
                  <label className="text-sm font-medium text-gray-600">Sistema de Riego</label>
                  <p className="text-sm">{empresa.sistema_riego}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tipo de Agricultura</label>
                  <p className="text-sm">{empresa.tipo_agricultura}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Características del Suelo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Tipo de Suelo</label>
                  <p className="text-sm">{empresa.tipo_suelo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Clima de la Zona</label>
                  <p className="text-sm">{empresa.clima_zona}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Personal Asignado</label>
                  <div className="space-y-1 mt-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Carlos Rodriguez (Vendedor)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Ana Martinez (Técnico)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Contactos */}
        <TabsContent value="contactos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contactos de la Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contactos.map((contacto) => (
                  <div key={contacto.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {contacto.nombre[0]}{contacto.apellidos[0]}
                      </div>
                      <div>
                        <p className="font-medium">{contacto.nombre} {contacto.apellidos}</p>
                        <p className="text-sm text-gray-600">{contacto.cargo}</p>
                        <p className="text-sm text-gray-500">{contacto.email}</p>
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
                ))}
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
                Oportunidades de Negocio
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
                      </p>
                      {actividad.resultado_tecnico && (
                        <p className="text-sm mt-2 p-2 bg-gray-50 rounded">
                          {actividad.resultado_tecnico}
                        </p>
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
                {empresa.notas.map((nota, index) => (
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
                {empresa.historial.map((cambio, index) => (
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
