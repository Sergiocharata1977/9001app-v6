'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useOrganization } from '@/contexts/OrganizationContext';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  Plus,
  Search,
  Send,
  Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Datos de ejemplo para encuestas
const encuestasEjemplo = [
  {
    id: 'SUR-001',
    titulo: 'Encuesta de Satisfacción - Semillas de Soja',
    oportunidad_id: '1',
    oportunidad_titulo: 'Venta de Semillas de Soja - Estancia San Miguel',
    cliente_id: 'CLI-001',
    cliente_nombre: 'Estancia San Miguel S.A.',
    contacto_id: 'CON-001',
    contacto_nombre: 'María González',
    fecha_creacion: '2024-02-10',
    fecha_envio: '2024-02-12',
    fecha_respuesta: '2024-02-15',
    estado: 'respondida',
    link_unico: 'https://9001app.com/encuestas/SUR-001/abc123',
    puntuacion_general: 4.5,
    categorias: [
      { nombre: 'Calidad del Producto', puntuacion: 5 },
      { nombre: 'Tiempo de Entrega', puntuacion: 4 },
      { nombre: 'Atención al Cliente', puntuacion: 5 },
      { nombre: 'Relación Calidad-Precio', puntuacion: 4 }
    ],
    preguntas: [
      {
        id: 'Q1',
        texto: '¿Cómo calificaría la calidad de nuestras semillas?',
        tipo: 'rating',
        respuesta: 5,
        categoria: 'Calidad del Producto'
      },
      {
        id: 'Q2',
        texto: '¿La entrega se realizó en el tiempo acordado?',
        tipo: 'rating',
        respuesta: 4,
        categoria: 'Tiempo de Entrega'
      },
      {
        id: 'Q3',
        texto: '¿Cómo calificaría la atención de nuestro equipo técnico?',
        tipo: 'rating',
        respuesta: 5,
        categoria: 'Atención al Cliente'
      },
      {
        id: 'Q4',
        texto: '¿Considera que el precio es adecuado para la calidad recibida?',
        tipo: 'rating',
        respuesta: 4,
        categoria: 'Relación Calidad-Precio'
      },
      {
        id: 'Q5',
        texto: '¿Qué podríamos mejorar en nuestros productos o servicios?',
        tipo: 'texto',
        respuesta: 'Podrían mejorar el embalaje para que sea más fácil de manipular en campo.',
        categoria: 'Mejoras'
      }
    ],
    comentarios: 'Muy satisfechos con la calidad de las semillas. Esperamos seguir trabajando juntos.',
    created_by: 'VEN-001',
    created_by_name: 'Carlos Rodriguez'
  },
  {
    id: 'SUR-002',
    titulo: 'Encuesta Post-Venta - Fertilizantes',
    oportunidad_id: '2',
    oportunidad_titulo: 'Venta de Fertilizantes - Agropecuaria Los Pinos',
    cliente_id: 'CLI-002',
    cliente_nombre: 'Agropecuaria Los Pinos',
    contacto_id: 'CON-002',
    contacto_nombre: 'Juan Martínez',
    fecha_creacion: '2024-02-15',
    fecha_envio: '2024-02-16',
    fecha_respuesta: null,
    estado: 'enviada',
    link_unico: 'https://9001app.com/encuestas/SUR-002/def456',
    puntuacion_general: null,
    categorias: [
      { nombre: 'Calidad del Producto', puntuacion: null },
      { nombre: 'Tiempo de Entrega', puntuacion: null },
      { nombre: 'Atención al Cliente', puntuacion: null },
      { nombre: 'Relación Calidad-Precio', puntuacion: null }
    ],
    preguntas: [
      {
        id: 'Q1',
        texto: '¿Cómo calificaría la calidad de nuestros fertilizantes?',
        tipo: 'rating',
        respuesta: null,
        categoria: 'Calidad del Producto'
      },
      {
        id: 'Q2',
        texto: '¿La entrega se realizó en el tiempo acordado?',
        tipo: 'rating',
        respuesta: null,
        categoria: 'Tiempo de Entrega'
      },
      {
        id: 'Q3',
        texto: '¿Cómo calificaría la atención de nuestro equipo técnico?',
        tipo: 'rating',
        respuesta: null,
        categoria: 'Atención al Cliente'
      },
      {
        id: 'Q4',
        texto: '¿Considera que el precio es adecuado para la calidad recibida?',
        tipo: 'rating',
        respuesta: null,
        categoria: 'Relación Calidad-Precio'
      },
      {
        id: 'Q5',
        texto: '¿Qué podríamos mejorar en nuestros productos o servicios?',
        tipo: 'texto',
        respuesta: null,
        categoria: 'Mejoras'
      }
    ],
    comentarios: null,
    created_by: 'VEN-002',
    created_by_name: 'María González'
  },
  {
    id: 'SUR-003',
    titulo: 'Encuesta de Satisfacción - Asesoramiento Técnico',
    oportunidad_id: '3',
    oportunidad_titulo: 'Servicio de Asesoramiento Técnico - Campo Verde SA',
    cliente_id: 'CLI-003',
    cliente_nombre: 'Campo Verde SA',
    contacto_id: 'CON-003',
    contacto_nombre: 'Roberto Silva',
    fecha_creacion: '2024-02-18',
    fecha_envio: null,
    fecha_respuesta: null,
    estado: 'pendiente',
    link_unico: 'https://9001app.com/encuestas/SUR-003/ghi789',
    puntuacion_general: null,
    categorias: [
      { nombre: 'Calidad del Servicio', puntuacion: null },
      { nombre: 'Conocimiento Técnico', puntuacion: null },
      { nombre: 'Tiempo de Respuesta', puntuacion: null },
      { nombre: 'Relación Calidad-Precio', puntuacion: null }
    ],
    preguntas: [
      {
        id: 'Q1',
        texto: '¿Cómo calificaría la calidad de nuestro asesoramiento técnico?',
        tipo: 'rating',
        respuesta: null,
        categoria: 'Calidad del Servicio'
      },
      {
        id: 'Q2',
        texto: '¿El conocimiento técnico de nuestros asesores fue adecuado?',
        tipo: 'rating',
        respuesta: null,
        categoria: 'Conocimiento Técnico'
      },
      {
        id: 'Q3',
        texto: '¿El tiempo de respuesta a sus consultas fue satisfactorio?',
        tipo: 'rating',
        respuesta: null,
        categoria: 'Tiempo de Respuesta'
      },
      {
        id: 'Q4',
        texto: '¿Considera que el precio es adecuado para el servicio recibido?',
        tipo: 'rating',
        respuesta: null,
        categoria: 'Relación Calidad-Precio'
      },
      {
        id: 'Q5',
        texto: '¿Qué podríamos mejorar en nuestros servicios de asesoramiento?',
        tipo: 'texto',
        respuesta: null,
        categoria: 'Mejoras'
      }
    ],
    comentarios: null,
    created_by: 'VEN-001',
    created_by_name: 'Carlos Rodriguez'
  }
];

export default function SatisfaccionPage() {
  const router = useRouter();
  const { organizationId } = useOrganization();
  const [encuestas, setEncuestas] = useState<any[]>(encuestasEjemplo);
  const [filteredEncuestas, setFilteredEncuestas] = useState<any[]>(encuestasEjemplo);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todas');
  const [loading, setLoading] = useState(false);

  // Estadísticas
  const stats = {
    total: encuestas.length,
    respondidas: encuestas.filter(e => e.estado === 'respondida').length,
    enviadas: encuestas.filter(e => e.estado === 'enviada').length,
    pendientes: encuestas.filter(e => e.estado === 'pendiente').length,
    puntuacionPromedio: encuestas.filter(e => e.puntuacion_general).reduce((sum, e) => sum + e.puntuacion_general, 0) /
      encuestas.filter(e => e.puntuacion_general).length || 0
  };

  // Filtrar encuestas
  useEffect(() => {
    let filtered = encuestas;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.oportunidad_titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filterEstado !== 'todas') {
      filtered = filtered.filter(e => e.estado === filterEstado);
    }

    setFilteredEncuestas(filtered);
  }, [searchTerm, filterEstado, encuestas]);

  // Función para obtener color según estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'respondida': return 'bg-green-100 text-green-800';
      case 'enviada': return 'bg-blue-100 text-blue-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'vencida': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener etiqueta según estado
  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'respondida': return 'Respondida';
      case 'enviada': return 'Enviada';
      case 'pendiente': return 'Pendiente';
      case 'vencida': return 'Vencida';
      default: return estado;
    }
  };

  // Función para crear nueva encuesta
  const handleNuevaEncuesta = () => {
    router.push('/crm/satisfaccion/nueva');
  };

  // Función para ver detalle de encuesta
  const handleVerEncuesta = (id: string) => {
    router.push(`/crm/satisfaccion/${id}`);
  };

  // Función para enviar encuesta
  const handleEnviarEncuesta = (id: string) => {
    toast.success('Encuesta enviada exitosamente');
    // Actualizar estado local
    setEncuestas(prev =>
      prev.map(e =>
        e.id === id
          ? { ...e, estado: 'enviada', fecha_envio: new Date().toISOString().split('T')[0] }
          : e
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Satisfacción de Clientes</h1>
          <p className="text-gray-600 mt-2">Gestión de encuestas ISO 9001:2015 - Cláusula 9.1.2</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={handleNuevaEncuesta}
        >
          <Plus className="h-4 w-4" />
          Nueva Encuesta
        </Button>
      </div>
    </div>

      {/* Estadísticas */ }
  <div className="grid gap-4 md:grid-cols-4">
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Encuestas</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Respondidas</p>
            <p className="text-2xl font-bold text-gray-900">{stats.respondidas}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Pendientes/Enviadas</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pendientes + stats.enviadas}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Star className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Puntuación Promedio</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.puntuacionPromedio.toFixed(1)}/5
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Filtros */ }
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div className="relative w-full md:w-64">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Buscar encuestas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant={filterEstado === 'todas' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilterEstado('todas')}
      >
        Todas
      </Button>
      <Button
        variant={filterEstado === 'respondida' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilterEstado('respondida')}
        className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
      >
        Respondidas
      </Button>
      <Button
        variant={filterEstado === 'enviada' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilterEstado('enviada')}
        className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
      >
        Enviadas
      </Button>
      <Button
        variant={filterEstado === 'pendiente' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setFilterEstado('pendiente')}
        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"
      >
        Pendientes
      </Button>
    </div>
  </div>

  {/* Lista de Encuestas */ }
  <div className="space-y-4">
    {filteredEncuestas.length > 0 ? (
      filteredEncuestas.map((encuesta) => (
        <Card key={encuesta.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{encuesta.titulo}</h3>
                  <Badge className={getEstadoColor(encuesta.estado)}>
                    {getEstadoLabel(encuesta.estado)}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Cliente: <span className="font-medium">{encuesta.cliente_nombre}</span>
              </p>
              <p className="text-sm text-gray-600">
                Oportunidad: <span className="font-medium">{encuesta.oportunidad_titulo}</span>
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Creada: {encuesta.fecha_creacion}</span>
                {encuesta.fecha_envio && <span>Enviada: {encuesta.fecha_envio}</span>}
                {encuesta.fecha_respuesta && <span>Respondida: {encuesta.fecha_respuesta}</span>}
              </div>
              {encuesta.puntuacion_general && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{encuesta.puntuacion_general.toFixed(1)}/5</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 self-end md:self-auto">
              {encuesta.estado === 'pendiente' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEnviarEncuesta(encuesta.id)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVerEncuesta(encuesta.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalle
              </Button>
            </div>
          </div>
        </div>
              </CardContent>
            </Card >
          ))
        ) : (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron encuestas</h3>
      <p className="text-gray-600 mb-4">No hay encuestas que coincidan con los filtros aplicados.</p>
      <Button onClick={() => { setSearchTerm(''); setFilterEstado('todas'); }}>
        Limpiar Filtros
      </Button>
    </div>
  )
}
      </div >
    </div >
  );
}