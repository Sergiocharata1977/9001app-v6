"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, List, Grid, Plus, Edit, Trash2, Target, Users } from "lucide-react";

export default function CompetenciasPage() {
  const [competencias, setCompetencias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Datos de ejemplo para competencias
    const datosEjemplo = [
      { 
        id: "comp_1", 
        nombre: "Liderazgo", 
        descripcion: "Capacidad para dirigir y motivar equipos", 
        nivel_requerido: "Avanzado", 
        area: "Gerencial", 
        estado: "Activa",
        empleados_asignados: 15,
        fecha_creacion: "2023-01-15"
      },
      { 
        id: "comp_2", 
        nombre: "Comunicación", 
        descripcion: "Habilidad para comunicarse efectivamente", 
        nivel_requerido: "Intermedio", 
        area: "General", 
        estado: "Activa",
        empleados_asignados: 45,
        fecha_creacion: "2023-01-10"
      },
      { 
        id: "comp_3", 
        nombre: "Trabajo en Equipo", 
        descripcion: "Colaboración efectiva con otros", 
        nivel_requerido: "Básico", 
        area: "General", 
        estado: "Activa",
        empleados_asignados: 38,
        fecha_creacion: "2023-01-05"
      },
      { 
        id: "comp_4", 
        nombre: "Resolución de Problemas", 
        descripcion: "Análisis y solución de problemas complejos", 
        nivel_requerido: "Avanzado", 
        area: "Técnica", 
        estado: "Inactiva",
        empleados_asignados: 12,
        fecha_creacion: "2023-01-20"
      }
    ];
    
    setTimeout(() => {
      setCompetencias(datosEjemplo);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Activa': return 'bg-green-100 text-green-800';
      case 'Inactiva': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Avanzado': return 'bg-red-100 text-red-800';
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'Básico': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          Competencias
        </h1>
        <div className="flex gap-3">
          <Link href="/rrhh/competencias/asignaciones">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Asignaciones
            </Button>
          </Link>
          <Link href="/rrhh/competencias/nueva">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Competencia
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
                      <TableHead>Competencia</TableHead>
                      <TableHead>Área</TableHead>
                      <TableHead>Nivel</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Empleados</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {competencias.map((comp) => (
                      <TableRow key={comp.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{comp.nombre}</div>
                            <div className="text-sm text-gray-500">{comp.descripcion}</div>
                          </div>
                        </TableCell>
                        <TableCell>{comp.area}</TableCell>
                        <TableCell>
                          <Badge className={getNivelColor(comp.nivel_requerido)}>
                            {comp.nivel_requerido}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getEstadoColor(comp.estado)}>
                            {comp.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>{comp.empleados_asignados}</TableCell>
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
              {competencias.map((comp) => (
                <Card key={comp.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{comp.nombre}</CardTitle>
                      <Badge className={getEstadoColor(comp.estado)}>
                        {comp.estado}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{comp.descripcion}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Área:</span>
                        <span className="text-sm font-medium">{comp.area}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Nivel:</span>
                        <Badge className={getNivelColor(comp.nivel_requerido)}>
                          {comp.nivel_requerido}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Empleados:</span>
                        <span className="text-sm font-medium">{comp.empleados_asignados}</span>
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