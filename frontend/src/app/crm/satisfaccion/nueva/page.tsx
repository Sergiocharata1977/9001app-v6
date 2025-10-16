'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useOrganization } from '@/contexts/OrganizationContext';
import { crmOportunidadService } from '@/services/crmService';
import {
    AlertCircle,
    ArrowLeft,
    MessageSquare,
    Plus,
    Save,
    Send,
    Star,
    Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Categorías predefinidas para encuestas
const categoriasPredefinidas = [
    'Calidad del Producto',
    'Tiempo de Entrega',
    'Atención al Cliente',
    'Relación Calidad-Precio',
    'Conocimiento Técnico',
    'Servicio Post-Venta',
    'Comunicación',
    'Resolución de Problemas',
    'Mejoras'
];

// Tipos de preguntas
const tiposPregunta = [
    { id: 'rating', nombre: 'Calificación (1-5 estrellas)' },
    { id: 'texto', nombre: 'Respuesta de texto' },
    { id: 'si_no', nombre: 'Sí/No' }
];

export default function NuevaEncuestaPage() {
    const router = useRouter();
    const { organizationId } = useOrganization();
    const [loading, setLoading] = useState(false);
    const [oportunidades, setOportunidades] = useState<any[]>([]);
    const [loadingOportunidades, setLoadingOportunidades] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState({
        titulo: '',
        oportunidad_id: '',
        preguntas: [
            {
                id: `Q${Date.now()}`,
                texto: '¿Cómo calificaría la calidad de nuestro producto/servicio?',
                tipo: 'rating',
                categoria: 'Calidad del Producto'
            }
        ]
    });

    // Cargar oportunidades
    useEffect(() => {
        const loadOportunidades = async () => {
            try {
                setLoadingOportunidades(true);
                const response = await crmOportunidadService.getAll(organizationId, {
                    etapa: 'cierre',
                    limit: 100
                });

                if (response.success && response.data) {
                    setOportunidades(response.data);
                }
            } catch (error) {
                console.error('Error cargando oportunidades:', error);
                toast.error('Error al cargar las oportunidades');
            } finally {
                setLoadingOportunidades(false);
            }
        };

        loadOportunidades();
    }, [organizationId]);

    // Manejar cambios en el formulario
    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Manejar cambios en preguntas
    const handlePreguntaChange = (index: number, field: string, value: any) => {
        setFormData(prev => {
            const nuevasPreguntas = [...prev.preguntas];
            nuevasPreguntas[index] = {
                ...nuevasPreguntas[index],
                [field]: value
            };
            return {
                ...prev,
                preguntas: nuevasPreguntas
            };
        });
    };

    // Agregar nueva pregunta
    const handleAgregarPregunta = () => {
        setFormData(prev => ({
            ...prev,
            preguntas: [
                ...prev.preguntas,
                {
                    id: `Q${Date.now()}`,
                    texto: '',
                    tipo: 'rating',
                    categoria: 'Calidad del Producto'
                }
            ]
        }));
    };

    // Eliminar pregunta
    const handleEliminarPregunta = (index: number) => {
        if (formData.preguntas.length <= 1) {
            toast.error('Debe haber al menos una pregunta en la encuesta');
            return;
        }

        setFormData(prev => {
            const nuevasPreguntas = [...prev.preguntas];
            nuevasPreguntas.splice(index, 1);
            return {
                ...prev,
                preguntas: nuevasPreguntas
            };
        });
    };

    // Guardar encuesta
    const handleGuardarEncuesta = async () => {
        // Validar formulario
        if (!formData.titulo) {
            toast.error('El título de la encuesta es obligatorio');
            return;
        }

        if (!formData.oportunidad_id) {
            toast.error('Debe seleccionar una oportunidad');
            return;
        }

        if (formData.preguntas.some(p => !p.texto)) {
            toast.error('Todas las preguntas deben tener un texto');
            return;
        }

        try {
            setLoading(true);

            // En un entorno real, aquí se haría la llamada a la API
            // const response = await crmSatisfaccionService.create({
            //   ...formData,
            //   organization_id: organizationId
            // });

            // Simulamos éxito
            setTimeout(() => {
                toast.success('Encuesta creada exitosamente');
                router.push('/crm/satisfaccion');
            }, 1000);

        } catch (error) {
            console.error('Error guardando encuesta:', error);
            toast.error('Error al guardar la encuesta');
        } finally {
            setLoading(false);
        }
    };

    // Obtener datos de oportunidad seleccionada
    const getOportunidadSeleccionada = () => {
        return oportunidades.find(o => o.id === formData.oportunidad_id);
    };

    const oportunidadSeleccionada = getOportunidadSeleccionada();

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
                        <h1 className="text-2xl font-bold text-gray-900">Nueva Encuesta de Satisfacción</h1>
                        <p className="text-gray-600">ISO 9001:2015 - Cláusula 9.1.2 Satisfacción del Cliente</p>
                    </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    ISO 9001:2015
                </Badge>
            </div>

            {/* Información de la Cláusula ISO */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                        Requisito ISO 9001:2015
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-blue-800 italic">
                            "La organización debe realizar el seguimiento de las percepciones de los clientes del grado en que se cumplen sus necesidades y expectativas. La organización debe determinar los métodos para obtener, realizar el seguimiento y revisar esta información."
                        </p>
                        <p className="mt-2 text-blue-800 font-medium">
                            Cláusula 9.1.2 - Satisfacción del cliente
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Formulario de Encuesta */}
            <Card>
                <CardHeader>
                    <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="titulo">Título de la Encuesta *</Label>
                        <Input
                            id="titulo"
                            value={formData.titulo}
                            onChange={(e) => handleInputChange('titulo', e.target.value)}
                            placeholder="Ej: Encuesta de Satisfacción - Venta de Semillas"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="oportunidad">Oportunidad Relacionada *</Label>
                        <Select
                            value={formData.oportunidad_id}
                            onValueChange={(value) => handleInputChange('oportunidad_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar oportunidad" />
                            </SelectTrigger>
                            <SelectContent>
                                {oportunidades.map((opp) => (
                                    <SelectItem key={opp.id} value={opp.id}>
                                        {opp.titulo}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {oportunidadSeleccionada && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">Detalles de la Oportunidad</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Cliente:</span>
                                    <span className="ml-2 font-medium">{oportunidadSeleccionada.cliente_id}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Contacto:</span>
                                    <span className="ml-2 font-medium">{oportunidadSeleccionada.contacto_id}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Valor:</span>
                                    <span className="ml-2 font-medium">${oportunidadSeleccionada.valor_estimado?.toLocaleString()}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Etapa:</span>
                                    <Badge variant="outline" className="ml-2">
                                        {oportunidadSeleccionada.etapa}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Preguntas de la Encuesta */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Preguntas de la Encuesta</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAgregarPregunta}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Pregunta
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {formData.preguntas.map((pregunta, index) => (
                        <div key={pregunta.id} className="p-4 border rounded-lg space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">Pregunta #{index + 1}</h4>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEliminarPregunta(index)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div>
                                <Label htmlFor={`pregunta-${index}`}>Texto de la Pregunta *</Label>
                                <Textarea
                                    id={`pregunta-${index}`}
                                    value={pregunta.texto}
                                    onChange={(e) => handlePreguntaChange(index, 'texto', e.target.value)}
                                    placeholder="Ej: ¿Cómo calificaría la calidad de nuestro producto?"
                                    rows={2}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor={`tipo-${index}`}>Tipo de Respuesta</Label>
                                    <Select
                                        value={pregunta.tipo}
                                        onValueChange={(value) => handlePreguntaChange(index, 'tipo', value)}
                                    >
                                        <SelectTrigger id={`tipo-${index}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tiposPregunta.map((tipo) => (
                                                <SelectItem key={tipo.id} value={tipo.id}>
                                                    {tipo.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor={`categoria-${index}`}>Categoría</Label>
                                    <Select
                                        value={pregunta.categoria}
                                        onValueChange={(value) => handlePreguntaChange(index, 'categoria', value)}
                                    >
                                        <SelectTrigger id={`categoria-${index}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoriasPredefinidas.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {pregunta.tipo === 'rating' && (
                                <div className="flex items-center gap-1 mt-2">
                                    <span className="text-xs text-gray-500">Vista previa:</span>
                                    <div className="flex items-center gap-1 ml-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className="h-5 w-5 text-gray-300"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-4">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleGuardarEncuesta}
                    disabled={loading}
                >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Encuesta
                </Button>
                <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                        handleGuardarEncuesta();
                        // Aquí se enviaría la encuesta directamente
                    }}
                    disabled={loading}
                >
                    <Send className="h-4 w-4 mr-2" />
                    Guardar y Enviar
                </Button>
            </div>
        </div>
    );
}