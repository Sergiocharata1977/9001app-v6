'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';

export default function AusenciasPage() {
    const [ausencias, setAusencias] = useState([
        {
            id: '1',
            tipo: 'vacaciones',
            fecha_inicio: '2024-12-20',
            fecha_fin: '2024-12-31',
            dias_habiles: 8,
            estado: 'aprobado',
            motivo: 'Vacaciones de fin de año'
        },
        {
            id: '2',
            tipo: 'licencia_medica',
            fecha_inicio: '2024-11-15',
            fecha_fin: '2024-11-17',
            dias_habiles: 3,
            estado: 'pendiente',
            motivo: 'Consulta médica'
        }
    ]);

    const [balance] = useState({
        vacaciones_disponibles: 21,
        vacaciones_tomadas: 8,
        licencias_tomadas: 3
    });

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'aprobado':
                return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>;
            case 'pendiente':
                return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
            case 'rechazado':
                return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
            default:
                return <Badge variant="secondary">{estado}</Badge>;
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Control de Ausencias</h1>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Solicitar Ausencia
                </Button>
            </div>

            {/* Balance de Días */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vacaciones Disponibles</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {balance.vacaciones_disponibles - balance.vacaciones_tomadas}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            de {balance.vacaciones_disponibles} días anuales
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vacaciones Tomadas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{balance.vacaciones_tomadas}</div>
                        <p className="text-xs text-muted-foreground">días este año</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Licencias Tomadas</CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{balance.licencias_tomadas}</div>
                        <p className="text-xs text-muted-foreground">días este año</p>
                    </CardContent>
                </Card>
            </div>

            {/* Lista de Ausencias */}
            <Card>
                <CardHeader>
                    <CardTitle>Mis Solicitudes de Ausencia</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {ausencias.map((ausencia) => (
                            <div key={ausencia.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold capitalize">
                                            {ausencia.tipo.replace('_', ' ')}
                                        </h3>
                                        {getEstadoBadge(ausencia.estado)}
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        {ausencia.motivo}
                                    </p>
                                    <p className="text-sm">
                                        {new Date(ausencia.fecha_inicio).toLocaleDateString()} - {' '}
                                        {new Date(ausencia.fecha_fin).toLocaleDateString()} ({ausencia.dias_habiles} días hábiles)
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Ver Detalles</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}