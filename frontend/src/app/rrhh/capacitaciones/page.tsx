"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, List, Grid, Plus, FileEdit, Trash2, Calendar } from "lucide-react";
import { capacitacionService } from "@/services/capacitacionService";

export default function CapacitacionesPage() {
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarCapacitaciones = async () => {
      setIsLoading(true);
      try {
        // Datos de ejemplo para capacitaciones
        const datosEjemplo = [
          { id: "cap_1", titulo: "Taller de Liderazgo", instructor: "Roberto Gómez", fecha_inicio: "2023-04-10", fecha_fin: "2023-04-15", estado: "Programada", participantes: 12, competencia_asociada: "Liderazgo" },
          { id: "cap_2", titulo: "Curso de Comunicación Efectiva", instructor: "Laura Torres", fecha_inicio: "2023-04-20", fecha_fin: "2023-04-22", estado: "En progreso", participantes: 15, competencia_asociada: "Comunicación" },
          { id: "cap_3", titulo: "Seminario de Trabajo en Equipo", instructor: "Miguel Ángel Ruiz", fecha_inicio: "2023-03-15", fecha_fin: "2023-03-17", estado: "Completada", participantes: 20, competencia_asociada: "Trabajo en equipo" },
          { id: "cap_4", titulo: "Workshop de Resolución de Problemas", instructor: "Sofía Martínez", fecha_inicio: "2023-05-05", fecha_fin: "2023-05-07", estado: "Programada", participantes: 10, competencia_asociada: "Resolución de problemas" },
          { id: "cap_5", titulo: "Curso de Innovación y Creatividad", instructor: "Daniel López", fecha_inicio: "2023-03-01", fecha_fin: "2023-03-05", estado: "Completada", participantes: 18, competencia_asociada: "Innovación" },
        ];
        
        // Intentamos obtener datos reales, si falla usamos los de ejemplo
        try {
          const data = await capacitacionService.listCapacitaciones();
          setCapacitaciones(data.length > 0 ? data : datosEjemplo);
        } catch (error) {
          console.log("Usando datos de ejemplo para capacitaciones");
          setCapacitaciones(datosEjemplo);
        }
      } catch (error) {
        console.error("Error cargando capacitaciones:", error);
        setCapacitaciones(datosEjemplo);
      } finally {
        setIsLoading(false);
      }
    };

    cargarCapacitaciones();
  }, []);

  const handleEliminar = (id) => {
    // Implementación de eliminación
    console.log(`Eliminando capacitación con ID: ${id}`);
    setCapacitaciones(prev => prev.filter(cap => cap.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          Capacitaciones
        </h1>
        <div className="flex gap-3">
          <Link href="/rrhh/capacitaciones/sesiones">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Sesiones
            </Button>
          </Link>
          <Link href="/rrhh/capacitaciones/nueva">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Capacitación
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
                      <TableHead>Título</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Fecha Inicio</TableHead>
                      <TableHead>Fecha Fin</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Participantes</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {capacitaciones.map((cap) => (
                      <TableRow key={cap.id}>
                        <TableCell className="font-medium">{cap.titulo}</TableCell>
                        <TableCell>{cap.instructor}</TableCell>
                        <TableCell>{cap.fecha_inicio}</TableCell>
                        <TableCell>{cap.fecha_fin}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            cap.estado === 'Completada' ? 'bg-green-100 text-green-800' : 
                            cap.estado === 'En progreso' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {cap.estado}
                          </span>
                        </TableCell>
                        <TableCell>{cap.participantes}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/rrhh/capacitaciones/${cap.id}`}>
                              <Button variant="ghost" size="sm">
                                <FileEdit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={() => handleEliminar(cap.id)}>
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
              {capacitaciones.map((cap) => (
                <Card key={cap.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg">{cap.titulo}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        cap.estado === 'Completada' ? 'bg-green-100 text-green-800' : 
                        cap.estado === 'En progreso' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cap.estado}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm"><span className="font-medium">Instructor:</span> {cap.instructor}</p>
                      <p className="text-sm"><span className="font-medium">Fechas:</span> {cap.fecha_inicio} al {cap.fecha_fin}</p>
                      <p className="text-sm"><span className="font-medium">Participantes:</span> {cap.participantes}</p>
                      <p className="text-sm"><span className="font-medium">Competencia:</span> {cap.competencia_asociada}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Link href={`/rrhh/capacitaciones/${cap.id}`}>
                        <Button variant="ghost" size="sm">
                          <FileEdit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleEliminar(cap.id)}>
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