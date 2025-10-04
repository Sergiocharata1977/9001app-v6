'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, FileText } from 'lucide-react';
import { relacionesService } from '@/services/relacionesService';
import normasService from '@/services/normasService';
import documentosService from '@/services/documentosService';
import { useToast } from '@/components/ui/use-toast';

interface ProcesoRelacionesTabProps {
  processId: string;
  processData: any;
  onUpdate: () => void;
}

export default function ProcesoRelacionesTab({ processId, processData, onUpdate }: ProcesoRelacionesTabProps) {
  const { toast } = useToast();

  const [normasRelacionadas, setNormasRelacionadas] = useState([]);
  const [documentosRelacionados, setDocumentosRelacionados] = useState([]);
  const [todasNormas, setTodasNormas] = useState([]);
  const [todosDocumentos, setTodosDocumentos] = useState([]);
  const [normaSeleccionada, setNormaSeleccionada] = useState('');
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState('');
  const [loadingRelaciones, setLoadingRelaciones] = useState(false);

  useEffect(() => {
    if (processData) {
      cargarRelaciones();
      cargarOpciones();
    }
  }, [processData]);

  const cargarRelaciones = async () => {
    setLoadingRelaciones(true);
    try {
      const normas = await relacionesService.getEntidadesRelacionadas('proceso', processId, 'norma');
      setNormasRelacionadas(normas);
      const docs = await relacionesService.getEntidadesRelacionadas('proceso', processId, 'documento');
      setDocumentosRelacionados(docs);
    } catch (e) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las relaciones',
        variant: 'destructive'
      });
    } finally {
      setLoadingRelaciones(false);
    }
  };

  const cargarOpciones = async () => {
    try {
      const normas = await normasService.getNormas();
      setTodasNormas(normas);
      const docs = await documentosService.getDocumentos();
      setTodosDocumentos(docs);
    } catch (e) {
      // Silently handle error
    }
  };

  const handleAgregarNorma = async () => {
    if (!normaSeleccionada) return;
    try {
      await relacionesService.create({
        organization_id: processData.organization_id,
        origen_tipo: 'proceso',
        origen_id: processId,
        destino_tipo: 'norma',
        destino_id: normaSeleccionada,
        usuario_creador: 'current_user' // TODO: Get from auth
      });
      setNormaSeleccionada('');
      cargarRelaciones();
      toast({
        title: 'Norma asociada',
        description: 'Norma asociada correctamente'
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
        variant: 'destructive'
      });
    }
  };

  const handleQuitarNorma = async (relacionId: string) => {
    try {
      await relacionesService.delete(relacionId);
      cargarRelaciones();
      toast({
        title: 'Norma quitada',
        description: 'Relación eliminada'
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
        variant: 'destructive'
      });
    }
  };

  const handleAgregarDocumento = async () => {
    if (!documentoSeleccionado) return;
    try {
      await relacionesService.create({
        organization_id: processData.organization_id,
        origen_tipo: 'proceso',
        origen_id: processId,
        destino_tipo: 'documento',
        destino_id: documentoSeleccionado,
        usuario_creador: 'current_user' // TODO: Get from auth
      });
      setDocumentoSeleccionado('');
      cargarRelaciones();
      toast({
        title: 'Documento asociado',
        description: 'Documento asociado correctamente'
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
        variant: 'destructive'
      });
    }
  };

  const handleQuitarDocumento = async (relacionId: string) => {
    try {
      await relacionesService.delete(relacionId);
      cargarRelaciones();
      toast({
        title: 'Documento quitado',
        description: 'Relación eliminada'
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-50/50">
      <div className="max-w-7xl mx-auto py-6 px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Relaciones con Normas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Normas aplicables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Select value={normaSeleccionada} onValueChange={setNormaSeleccionada}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Seleccionar norma" />
                  </SelectTrigger>
                  <SelectContent>
                    {todasNormas.map((norma: any) => (
                      <SelectItem key={norma.id} value={String(norma.id)}>
                        {norma.codigo} - {norma.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAgregarNorma} disabled={!normaSeleccionada}>
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {normasRelacionadas.map((rel: any) => (
                  <Badge key={rel.id} className="bg-emerald-700 text-white flex items-center gap-1">
                    {rel.destino_id}
                    <button
                      onClick={() => handleQuitarNorma(rel.id)}
                      className="ml-1 text-xs hover:text-red-300"
                    >
                      ✕
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Relaciones con Documentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos relacionados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Select value={documentoSeleccionado} onValueChange={setDocumentoSeleccionado}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Seleccionar documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {todosDocumentos.map((doc: any) => (
                      <SelectItem key={doc.id} value={String(doc.id)}>
                        {doc.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAgregarDocumento} disabled={!documentoSeleccionado}>
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {documentosRelacionados.map((rel: any) => (
                  <Badge key={rel.id} className="bg-blue-700 text-white flex items-center gap-1">
                    {rel.destino_id}
                    <button
                      onClick={() => handleQuitarDocumento(rel.id)}
                      className="ml-1 text-xs hover:text-red-300"
                    >
                      ✕
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Espacio para futuras relaciones */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Relaciones Adicionales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-sm">
                Aquí se pueden agregar más tipos de relaciones en el futuro
                (objetivos, indicadores, procesos relacionados, etc.)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}