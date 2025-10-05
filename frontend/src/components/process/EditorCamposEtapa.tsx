'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit, Check, X } from 'lucide-react';

interface Campo {
  id: string;
  nombre: string;
  tipo: 'texto' | 'numero' | 'fecha' | 'select' | 'checkbox' | 'archivo';
  opciones?: string[];
  requerido: boolean;
  validaciones?: any;
}

interface EditorCamposEtapaProps {
  campos: Campo[];
  onSave: (campos: Campo[]) => void;
  onCancel: () => void;
}

export default function EditorCamposEtapa({
  campos,
  onSave,
  onCancel
}: EditorCamposEtapaProps) {
  const [camposLocales, setCamposLocales] = useState<Campo[]>(campos);
  const [campoEditando, setCampoEditando] = useState<string | null>(null);
  const [nuevoCampo, setNuevoCampo] = useState<Partial<Campo>>({
    tipo: 'texto',
    requerido: false
  });

  const handleAgregarCampo = () => {
    if (!nuevoCampo.nombre) return;

    const campo: Campo = {
      id: `campo_${Date.now()}`,
      nombre: nuevoCampo.nombre,
      tipo: nuevoCampo.tipo as Campo['tipo'],
      opciones: nuevoCampo.opciones,
      requerido: nuevoCampo.requerido || false,
      validaciones: nuevoCampo.validaciones
    };

    setCamposLocales([...camposLocales, campo]);
    setNuevoCampo({ tipo: 'texto', requerido: false });
  };

  const handleEliminarCampo = (campoId: string) => {
    setCamposLocales(camposLocales.filter(c => c.id !== campoId));
  };

  const handleEditarCampo = (campoId: string, updates: Partial<Campo>) => {
    setCamposLocales(camposLocales.map(campo =>
      campo.id === campoId ? { ...campo, ...updates } : campo
    ));
  };

  const handleGuardar = () => {
    onSave(camposLocales);
  };

  const tiposCampo = [
    { value: 'texto', label: 'Texto' },
    { value: 'numero', label: 'Número' },
    { value: 'fecha', label: 'Fecha' },
    { value: 'select', label: 'Selección' },
    { value: 'checkbox', label: 'Casilla de verificación' },
    { value: 'archivo', label: 'Archivo' }
  ];

  return (
    <div className="space-y-6">
      {/* Agregar nuevo campo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agregar Nuevo Campo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Nombre del campo"
              value={nuevoCampo.nombre || ''}
              onChange={(e) => setNuevoCampo({ ...nuevoCampo, nombre: e.target.value })}
            />

            <Select
              value={nuevoCampo.tipo}
              onValueChange={(value) => setNuevoCampo({ ...nuevoCampo, tipo: value as Campo['tipo'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de campo" />
              </SelectTrigger>
              <SelectContent>
                {tiposCampo.map(tipo => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requerido"
                checked={nuevoCampo.requerido || false}
                onChange={(e) => setNuevoCampo({ ...nuevoCampo, requerido: e.target.checked })}
              />
              <label htmlFor="requerido" className="text-sm">Requerido</label>
            </div>

            <Button onClick={handleAgregarCampo} disabled={!nuevoCampo.nombre}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Campo
            </Button>
          </div>

          {/* Opciones para select */}
          {nuevoCampo.tipo === 'select' && (
            <div className="mt-3">
              <Textarea
                placeholder="Opciones separadas por comas (ej: Opción 1, Opción 2, Opción 3)"
                value={nuevoCampo.opciones?.join(', ') || ''}
                onChange={(e) => setNuevoCampo({
                  ...nuevoCampo,
                  opciones: e.target.value.split(',').map(o => o.trim()).filter(o => o)
                })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de campos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campos Configurados ({camposLocales.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {camposLocales.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay campos configurados para esta etapa.
            </p>
          ) : (
            <div className="space-y-3">
              {camposLocales.map((campo) => (
                <div key={campo.id} className="flex items-center gap-3 p-3 border rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{campo.nombre}</span>
                      <Badge variant="outline" className="text-xs">
                        {tiposCampo.find(t => t.value === campo.tipo)?.label}
                      </Badge>
                      {campo.requerido && (
                        <Badge variant="secondary" className="text-xs">
                          Requerido
                        </Badge>
                      )}
                    </div>

                    {campo.tipo === 'select' && campo.opciones && campo.opciones.length > 0 && (
                      <div className="text-sm text-gray-600">
                        Opciones: {campo.opciones.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCampoEditando(campo.id)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEliminarCampo(campo.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor de campo individual (placeholder) */}
      {campoEditando && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Editando Campo: {camposLocales.find(c => c.id === campoEditando)?.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Aquí se implementará la edición detallada del campo,
              incluyendo validaciones avanzadas, valores por defecto, etc.
            </p>
            <Button
              variant="outline"
              onClick={() => setCampoEditando(null)}
              className="mt-4"
            >
              Cerrar Editor
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Acciones */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleGuardar}>
          <Check className="w-4 h-4 mr-2" />
          Guardar Campos
        </Button>
      </div>
    </div>
  );
}