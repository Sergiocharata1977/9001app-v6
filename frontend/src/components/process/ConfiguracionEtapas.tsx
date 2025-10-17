'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Plus, Trash2, GripVertical, Check, X } from 'lucide-react';

interface Etapa {
  id: string;
  nombre: string;
  color: string;
  orden: number;
  es_inicial: boolean;
  es_final: boolean;
  campos: Campo[];
}

interface Campo {
  id: string;
  nombre: string;
  tipo: 'texto' | 'numero' | 'fecha' | 'select' | 'checkbox' | 'archivo';
  opciones?: string[];
  requerido: boolean;
}

interface ConfiguracionEtapasProps {
  isOpen: boolean;
  onClose: () => void;
  etapas: Etapa[];
  onSave: (etapas: Etapa[]) => void;
}

export default function ConfiguracionEtapas({
  isOpen,
  onClose,
  etapas,
  onSave
}: ConfiguracionEtapasProps) {
  const [etapasLocales, setEtapasLocales] = useState<Etapa[]>(etapas);
  const [etapaEditando, setEtapaEditando] = useState<string | null>(null);
  const [nuevaEtapa, setNuevaEtapa] = useState<Partial<Etapa>>({});

  const handleAgregarEtapa = () => {
    if (!nuevaEtapa.nombre) return;

    const etapa: Etapa = {
      id: `etapa_${Date.now()}`,
      nombre: nuevaEtapa.nombre,
      color: nuevaEtapa.color || '#6B7280',
      orden: etapasLocales.length,
      es_inicial: etapasLocales.length === 0, // Primera etapa es inicial por defecto
      es_final: false,
      campos: []
    };

    setEtapasLocales([...etapasLocales, etapa]);
    setNuevaEtapa({});
  };

  const handleEliminarEtapa = (etapaId: string) => {
    setEtapasLocales(etapasLocales.filter(e => e.id !== etapaId));
  };

  const handleToggleInicial = (etapaId: string) => {
    setEtapasLocales(etapasLocales.map(etapa => ({
      ...etapa,
      es_inicial: etapa.id === etapaId ? !etapa.es_inicial : false // Solo una puede ser inicial
    })));
  };

  const handleToggleFinal = (etapaId: string) => {
    setEtapasLocales(etapasLocales.map(etapa => ({
      ...etapa,
      es_final: etapa.id === etapaId ? !etapa.es_final : false // Solo una puede ser final
    })));
  };

  const handleGuardar = () => {
    // Validaciones básicas
    const etapasIniciales = etapasLocales.filter(e => e.es_inicial);
    const etapasFinales = etapasLocales.filter(e => e.es_final);

    if (etapasIniciales.length !== 1) {
      alert('Debe haber exactamente una etapa inicial');
      return;
    }

    if (etapasFinales.length !== 1) {
      alert('Debe haber exactamente una etapa final');
      return;
    }

    onSave(etapasLocales);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configuración de Etapas">
      <div className="space-y-6">
        {/* Agregar nueva etapa */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agregar Nueva Etapa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Nombre de la etapa"
                value={nuevaEtapa.nombre || ''}
                onChange={(e) => setNuevaEtapa({ ...nuevaEtapa, nombre: e.target.value })}
              />
              <Input
                type="color"
                value={nuevaEtapa.color || '#6B7280'}
                onChange={(e) => setNuevaEtapa({ ...nuevaEtapa, color: e.target.value })}
                className="w-16"
              />
              <Button onClick={handleAgregarEtapa} disabled={!nuevaEtapa.nombre}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de etapas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Etapas Configuradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {etapasLocales.map((etapa) => (
                <div key={etapa.id} className="flex items-center gap-3 p-3 border rounded">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />

                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: etapa.color }}
                  />

                  <span className="flex-1 font-medium">{etapa.nombre}</span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={etapa.es_inicial ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleInicial(etapa.id)}
                    >
                      {etapa.es_inicial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Inicial
                    </Button>

                    <Button
                      variant={etapa.es_final ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleFinal(etapa.id)}
                    >
                      {etapa.es_final ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Final
                    </Button>

                    <Badge variant="secondary">
                      {etapa.campos.length} campos
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEtapaEditando(etapa.id)}
                    >
                      <Settings className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEliminarEtapa(etapa.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Editor de campos (placeholder) */}
        {etapaEditando && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Campos de la Etapa: {etapasLocales.find(e => e.id === etapaEditando)?.nombre}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Aquí se implementará el editor de campos por etapa.
                Permitirá agregar campos de diferentes tipos (texto, número, fecha, etc.)
                con validaciones y configuraciones específicas.
              </p>
              <Button
                variant="outline"
                onClick={() => setEtapaEditando(null)}
                className="mt-4"
              >
                Cerrar Editor
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Acciones */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleGuardar}>
            Guardar Configuración
          </Button>
        </div>
      </div>
    </Modal>
  );
}