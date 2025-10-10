"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, List, Grid, Plus, Edit, Trash2, FileText, User, Calendar } from "lucide-react";

export default function EvaluacionesPage() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Datos de ejemplo para evaluaciones
    const datosEjemplo = [
      { 
        id: "eval_1", 
        empleado: "Ana García", 
        evaluador: "Carlos Rodríguez", 
        fecha: "2023-03-15", 
        puntaje_total: 4.2, 
        estado: "Completada",
        competencias_evaluadas: 5,
        periodo: "Q1 2023"
      },
      { 
        id: "eval_2", 
        empleado: "Miguel López", 
        evaluador: "Laura Torres", 
        fecha: "2023-03-20", 
        puntaje_total: 3.8, 
        estado: "Completada",
        competencias_evaluadas: 4,
        periodo: "Q1 2023"
      },
      { 
        id: "eval_3", 
        empleado: "Sofía Martínez", 
        evaluador: "Roberto Gómez", 
        fecha: "2023-03-25", 
        puntaje_total: 0, 
        estado: "Pendiente",
        competencias_evaluadas: 0,
        periodo: "Q1 2023"
      },
      { 
        id: "eval_4", 
        empleado: "Daniel Ruiz", 
        evaluador: "María Fernández", 
        fecha: "2023-03-10", 
        puntaje_total: 4.5, 
        estado: "Completada",
        competencias_evaluadas: 6,
        periodo: "Q1 2023"
      }
    ];
    
    setTimeout(() => {
      setEvaluaciones(datosEjemplo);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Completada': return 'bg-green-100 text-green-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'En Progreso': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPuntajeColor = (puntaje: number) => {
    if (puntaje >= 4.0) return 'text-green-600';
    if (puntaje >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6 text-primary" />
          Evaluaciones
        </h1>
        <div className="flex gap-3">
          <Link href="/rrhh/evaluaciones/reportes">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Reportes
            </Button>
          </Link>
          <Link href="/rrhh/evaluaciones/nueva">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Evaluación
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="lista">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="lista" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                Lista
              </TabsTrigger>
              <TabsTrigger value="tarjetas" className="flex items-center gap-1">
                <Grid className="h-4 w-4" />
                Tarjetas
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="lista" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empleado</TableHead>
                      <TableHead>Evaluador</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Puntaje</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Competencias</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluaciones.map((evaluacion) => (
                      <TableRow key={evaluacion.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{evaluacion.empleado}</span>
                          </div>
                        </TableCell>
                        <TableCell>{evaluacion.evaluador}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {evaluacion.fecha}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${getPuntajeColor(evaluacion.puntaje_total)}`}>
                            {evaluacion.puntaje_total > 0 ? evaluacion.puntaje_total.toFixed(1) : 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getEstadoColor(evaluacion.estado)}>
                            {evaluacion.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>{evaluacion.competencias_evaluadas}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tarjetas" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evaluaciones.map((evaluacion) => (
                <Card key={evaluacion.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{evaluacion.empleado}</CardTitle>
                      <Badge className={getEstadoColor(evaluacion.estado)}>
                        {evaluacion.estado}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Evaluador:</span>
                        <span className="text-sm font-medium">{evaluacion.evaluador}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Fecha:</span>
                        <span className="text-sm font-medium">{evaluacion.fecha}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Puntaje:</span>
                        <span className={`text-sm font-semibold ${getPuntajeColor(evaluacion.puntaje_total)}`}>
                          {evaluacion.puntaje_total > 0 ? evaluacion.puntaje_total.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Competencias:</span>
                        <span className="text-sm font-medium">{evaluacion.competencias_evaluadas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Período:</span>
                        <span className="text-sm font-medium">{evaluacion.periodo}</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}