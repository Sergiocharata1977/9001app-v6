'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrganization } from '@/contexts/OrganizationContext';
import {
    AlertCircle,
    ArrowLeft,
    BarChart3,
    CheckCircle,
    Clock,
    Copy,
    Download,
    ExternalLink,
    Mail,
    MessageSquare,
    Phone,
    Send,
    Share,
    Star
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Datos de ejemplo para la encuesta
const encuestaEjemplo = {
    id: 'SUR-001',
    titulo: 'Encuesta de Satisfacción - Semillas de Soja',
    oportunidad_id: '1',
    oportunidad_titulo: 'Venta de Semillas de Soja - Estancia San Miguel',
    cliente_id: 'CLI-001',
    cliente_nombre: 'Estancia San Miguel S.A.',
    contacto_id: 'CON-001',
    contacto_nombre: 'María González',
    contacto_email: 'maria.gonzalez@estanciasanmiguel.com',
    contacto_telefono: '+54 11 1234-5678',
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
};

export default function EncuestaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { organizationId } = useOrganization();
    const [encuesta, setEncuesta] = useState<any>(encuestaEjemplo);
    const [loading, setLoading] = useState(false);

    const encuestaId = params?.id as string;

    useEffect(() => {
        if (encuestaId && encuestaId !== 'SUR-001') {
            loadEncuestaData();
        }
    }, [encuestaId, organizationId]);

    const loadEncuestaData = async () => {
        try {
            setLoading(true);
            // En un entorno real, aquí se haría la llamada a la API
            // const response = await crmSatisfaccionService.getById(encuestaId, organizationId);
            // if (response.success && response.data) {
            //   setEncuesta(response.data);
            // }

            // Simulamos carga
            setTimeout(() => {
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error cargando datos de encuesta:', error);
            toast.error('Error al cargar los datos de la encuesta');
            setLoading(false);
        }
    };

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

    // Función para enviar encuesta
    const handleEnviarEncuesta = () => {
        if (encuesta.estado !== 'pendiente') {
            toast.error('Esta encuesta ya ha sido enviada');
            return;
        }

        toast.success('Encuesta enviada exitosamente');
        setEncuesta(prev => ({
            ...prev,
            estado: 'enviada',
            fecha_envio: new Date().toISOString().split('T')[0]
        }));
    };

    // Función para copiar enlace
    const handleCopiarEnlace = () => {
        navigator.clipboard.writeText(encuesta.link_unico);
        toast.success('Enlace copiado al portapapeles');
    };

    // Función para renderizar estrellas
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 ${star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                    />
                ))}
                <span className="ml-2 text-sm font-medium">{rating}/5</span>
            </div>
        );
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
            {/* Header */}
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
                        <h1 className="text-2xl font-bold text-gray-900">{encuesta.titulo}</h1>
                        <p className="text-gray-600">Encuesta #{encuesta.id}</p>
                    </div>
                </div>
                <Badge className={getEstadoColor(encuesta.estado)}>
                    {getEstadoLabel(encuesta.estado)}
                </Badge>
            </div>

            {/* Información General */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        Información General
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Oportunidad</label>
                                <p className="text-sm font-medium">{encuesta.oportunidad_titulo}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Cliente</label>
                                <p className="text-sm">{encuesta.cliente_nombre}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Contacto</label>
                                <p className="text-sm">{encuesta.contacto_nombre}</p>
                                <div className="flex items-center gap-4 mt-1">
                                    <Button variant="outline" size="sm" className="h-7 text-xs">
                                        <Mail className="h-3 w-3 mr-1" />
                                        {encuesta.contacto_email}
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-7 text-xs">
                                        <Phone className="h-3 w-3 mr-1" />
                                        {encuesta.contacto_telefono}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Fechas</label>
                                <div className="grid grid-cols-3 gap-2 mt-1">
                                    <div className="p-2 bg-gray-50 rounded text-center">
                                        <p className="text-xs text-gray-500">Creación</p>
                                        <p className="text-sm font-medium">{encuesta.fecha_creacion}</p>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded text-center">
                                        <p className="text-xs text-gray-500">Envío</p>
                                        <p className="text-sm font-medium">{encuesta.fecha_envio || '-'}</p>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded text-center">
                                        <p className="text-xs text-gray-500">Respuesta</p>
                                        <p className="text-sm font-medium">{encuesta.fecha_respuesta || '-'}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Enlace Único</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <input
                                        type="text"
                                        value={encuesta.link_unico}
                                        readOnly
                                        className="flex-1 p-2 text-xs bg-gray-50 border rounded"
                                    />
                                    <Button variant="outline" size="sm" onClick={handleCopiarEnlace}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            {encuesta.estado === 'pendiente' && (
                                <div className="mt-4">
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        onClick={handleEnviarEncuesta}
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Enviar Encuesta
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="respuestas" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="respuestas">Respuestas</TabsTrigger>
                    <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
                </TabsList>

                {/* Tab Respuestas */}
                <TabsContent value="respuestas" className="space-y-4">
                    {encuesta.estado === 'respondida' ? (
                        <>
                            {/* Puntuación General */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Puntuación General</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center p-6">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center mb-2">
                                                {renderStars(encuesta.puntuacion_general)}
                                            </div>
                                            <p className="text-3xl font-bold text-gray-900">{encuesta.puntuacion_general.toFixed(1)}</p>
                                            <p className="text-sm text-gray-600">Puntuación promedio</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Respuestas por Categoría */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Respuestas por Categoría</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {encuesta.categorias.map((categoria: any) => (
                                            <div key={categoria.nombre} className="p-4 border rounded-lg">
                                                <h4 className="font-medium mb-2">{categoria.nombre}</h4>
                                                {renderStars(categoria.puntuacion)}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Respuestas Detalladas */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Respuestas Detalladas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {encuesta.preguntas.map((pregunta: any) => (
                                            <div key={pregunta.id} className="p-4 border rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium">{pregunta.texto}</h4>
                                                    <Badge variant="outline">{pregunta.categoria}</Badge>
                                                </div>
                                                {pregunta.tipo === 'rating' ? (
                                                    <div className="mt-2">
                                                        {renderStars(pregunta.respuesta)}
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                                        <p className="text-sm">{pregunta.respuesta}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Comentarios Adicionales */}
                            {encuesta.comentarios && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Comentarios Adicionales</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm italic">"{encuesta.comentarios}"</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            {encuesta.estado === 'pendiente' ? (
                                <>
                                    <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Encuesta Pendiente de Envío</h3>
                                    <p className="text-gray-600 mb-4">Esta encuesta aún no ha sido enviada al cliente.</p>
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700"
                                        onClick={handleEnviarEncuesta}
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Enviar Ahora
                                    </Button>
                                </>
                            ) : encuesta.estado === 'enviada' ? (
                                <>
                                    <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Esperando Respuesta</h3>
                                    <p className="text-gray-600 mb-4">La encuesta fue enviada el {encuesta.fecha_envio} y está pendiente de respuesta.</p>
                                    <Button variant="outline" onClick={handleCopiarEnlace}>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copiar Enlace
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Encuesta Vencida</h3>
                                    <p className="text-gray-600 mb-4">Esta encuesta ha vencido sin recibir respuesta.</p>
                                    <Button variant="outline">
                                        <Send className="h-4 w-4 mr-2" />
                                        Reenviar Encuesta
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </TabsContent>

                {/* Tab Estadísticas */}
                <TabsContent value="estadisticas" className="space-y-4">
                    {encuesta.estado === 'respondida' ? (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-blue-600" />
                                        Análisis de Satisfacción
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 bg-blue-50 rounded-lg mb-4">
                                        <p className="text-sm text-blue-800">
                                            <strong>Análisis ISO 9001:</strong> Esta encuesta cumple con los requisitos de la cláusula 9.1.2 de ISO 9001:2015 para el seguimiento de la satisfacción del cliente.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium mb-2">Puntos Fuertes</h4>
                                            <div className="grid gap-2 md:grid-cols-2">
                                                {encuesta.categorias
                                                    .filter((cat: any) => cat.puntuacion >= 4)
                                                    .map((cat: any) => (
                                                        <div key={cat.nombre} className="p-3 bg-green-50 rounded-lg">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-medium text-green-800">{cat.nombre}</span>
                                                                <Badge className="bg-green-100 text-green-800">
                                                                    {cat.puntuacion}/5
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2">Áreas de Mejora</h4>
                                            <div className="grid gap-2 md:grid-cols-2">
                                                {encuesta.categorias
                                                    .filter((cat: any) => cat.puntuacion < 4)
                                                    .map((cat: any) => (
                                                        <div key={cat.nombre} className="p-3 bg-yellow-50 rounded-lg">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-medium text-yellow-800">{cat.nombre}</span>
                                                                <Badge className="bg-yellow-100 text-yellow-800">
                                                                    {cat.puntuacion}/5
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    ))}
                                                {encuesta.categorias.filter((cat: any) => cat.puntuacion < 4).length === 0 && (
                                                    <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                                                        <p className="text-sm text-gray-600 text-center">No se identificaron áreas de mejora significativas.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Acciones Recomendadas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="p-3 border rounded-lg">
                                            <h4 className="font-medium mb-1">Seguimiento con el Cliente</h4>
                                            <p className="text-sm text-gray-600">Programar una llamada de seguimiento para agradecer la retroalimentación y discutir posibles mejoras.</p>
                                            <Button variant="outline" size="sm" className="mt-2">
                                                <Phone className="h-4 w-4 mr-2" />
                                                Programar Llamada
                                            </Button>
                                        </div>

                                        <div className="p-3 border rounded-lg">
                                            <h4 className="font-medium mb-1">Documentar para ISO 9001</h4>
                                            <p className="text-sm text-gray-600">Registrar los resultados de esta encuesta en el sistema de gestión de calidad para cumplir con ISO 9001:2015.</p>
                                            <Button variant="outline" size="sm" className="mt-2">
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Registrar en SGC
                                            </Button>
                                        </div>

                                        <div className="p-3 border rounded-lg">
                                            <h4 className="font-medium mb-1">Compartir con Equipo</h4>
                                            <p className="text-sm text-gray-600">Compartir los resultados con el equipo de ventas y producción para implementar mejoras.</p>
                                            <Button variant="outline" size="sm" className="mt-2">
                                                <Share className="h-4 w-4 mr-2" />
                                                Compartir Resultados
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Estadísticas No Disponibles</h3>
                            <p className="text-gray-600 mb-4">Las estadísticas estarán disponibles una vez que el cliente responda la encuesta.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-4">
                <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Resultados
                </Button>
                {encuesta.estado === 'respondida' && (
                    <Button>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar como Revisada
                    </Button>
                )}
            </div>
        </div>
    );
}