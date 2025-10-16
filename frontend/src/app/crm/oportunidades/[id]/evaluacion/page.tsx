'use client';

import EvaluacionNecesidadesForm from '@/components/crm/forms/EvaluacionNecesidadesForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrganization } from '@/contexts/OrganizationContext';
import { crmRequisitosService } from '@/services/crmRequisitosService';
import { crmOportunidadService } from '@/services/crmService';
import { AlertCircle, ArrowLeft, ClipboardCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EvaluacionNecesidadesPage() {
    const params = useParams();
    const router = useRouter();
    const { organizationId } = useOrganization();
    const [oportunidad, setOportunidad] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const oportunidadId = params?.id as string;

    useEffect(() => {
        if (oportunidadId) {
            loadOportunidadData();
        }
    }, [oportunidadId, organizationId]);

    const loadOportunidadData = async () => {
        try {
            setLoading(true);
            const response = await crmOportunidadService.getById(oportunidadId, organizationId);

            if (response.success && response.data) {
                setOportunidad(response.data);
            } else {
                toast.error('No se pudo cargar la información de la oportunidad');
            }
        } catch (error) {
            console.error('Error cargando datos de oportunidad:', error);
            toast.error('Error al cargar los datos de la oportunidad');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitEvaluacion = async (evaluacionData: any) => {
        try {
            setSaving(true);

            // Actualizar la evaluación de necesidades
            const response = await crmRequisitosService.updateEvaluacion(
                oportunidadId,
                {
                    ...evaluacionData,
                    organization_id: organizationId
                }
            );

            if (response.success) {
                toast.success('Evaluación guardada exitosamente');

                // Actualizar datos locales
                setOportunidad(prev => ({
                    ...prev,
                    evaluacion_necesidades: evaluacionData
                }));

                // Redirigir a la página de detalle de la oportunidad
                router.push(`/crm/oportunidades/${oportunidadId}`);
            } else {
                toast.error('Error al guardar la evaluación');
            }
        } catch (error) {
            console.error('Error guardando evaluación:', error);
            toast.error('Error al guardar la evaluación');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        router.push(`/crm/oportunidades/${oportunidadId}`);
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
                        <h1 className="text-2xl font-bold text-gray-900">Evaluación de Necesidades ISO 9001</h1>
                        <p className="text-gray-600">{oportunidad?.titulo || 'Oportunidad'}</p>
                    </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    ISO 9001:2015 - Cláusula 8.2.2
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
                            "La organización debe determinar los requisitos para productos y servicios que se ofrecerán a los clientes, incluyendo:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1 text-blue-700">
                            <li>Cualquier requisito legal y reglamentario aplicable</li>
                            <li>Aquellos considerados necesarios por la organización</li>
                            <li>La capacidad de cumplir con la definición del producto y las reclamaciones</li>
                        </ul>
                        <p className="mt-2 text-blue-800 font-medium">
                            Cláusula 8.2.2 - Determinación de los requisitos para los productos y servicios
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Formulario de Evaluación */}
            <EvaluacionNecesidadesForm
                initialData={oportunidad?.evaluacion_necesidades || {}}
                onSubmit={handleSubmitEvaluacion}
                onCancel={handleCancel}
                readOnly={false}
            />
        </div>
    );
}