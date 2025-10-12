'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Plus,
  Trash2
} from 'lucide-react';
import { AnalisisCredito, SubAspecto, CLASIFICACION_RIESGO } from '@/types/analisisCredito';
import { analisisCreditoService } from '@/services/analisisCreditoService';

interface AnalisisCreditoFormProps {
  analisis?: AnalisisCredito;
  onSave?: (analisis: AnalisisCredito) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const SUBASPECTOS_DEFAULT = [
  {
    categoria: 'Cualitativo',
    aspectos: [
      'Experiencia en el sector',
      'Calidad de la gestión',
      'Posición en el mercado',
      'Diversificación de productos',
      'Relación con proveedores'
    ]
  },
  {
    categoria: 'Legal',
    aspectos: [
      'Documentación legal',
      'Cumplimiento normativo',
      'Litigios pendientes',
      'Garantías disponibles',
      'Estructura societaria'
    ]
  },
  {
    categoria: 'Cuantitativo',
    aspectos: [
      'Liquidez corriente',
      'Endeudamiento',
      'Rentabilidad',
      'Flujo de caja',
      'Capital de trabajo'
    ]
  }
];

export default function AnalisisCreditoForm({ 
  analisis, 
  onSave, 
  onCancel, 
  isEditing = false 
}: AnalisisCreditoFormProps) {
  const [formData, setFormData] = useState<Partial<AnalisisCredito>>({
    cliente_nombre: '',
    analista_responsable: '',
    fecha_analisis: new Date().toISOString().split('T')[0],
    subaspectos: [],
    observaciones: '',
    condiciones_comerciales: 'Condiciones estándar',
    factores_criticos: [],
    frecuencia_revision: 'trimestral',
    estado: 'borrador'
  });

  const [subAspectos, setSubAspectos] = useState<SubAspecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nuevoFactorCritico, setNuevoFactorCritico] = useState('');

  useEffect(() => {
    if (analisis) {
      setFormData(analisis);
      setSubAspectos(analisis.subaspectos || []);
    } else {
      // Inicializar subaspectos por defecto
      const subaspectosIniciales: SubAspecto[] = [];
      SUBASPECTOS_DEFAULT.forEach(categoria => {
        categoria.aspectos.forEach(aspecto => {
          subaspectosIniciales.push({
            categoria: categoria.categoria as 'Cualitativo' | 'Legal' | 'Cuantitativo',
            aspecto,
            ponderacion: 5,
            calificacion: 5,
            observaciones: ''
          });
        });
      });
      setSubAspectos(subaspectosIniciales);
    }
  }, [analisis]);

  // Calcular resultado por categoría
  const calcularResultadoCategoria = (categoria: string) => {
    const aspectos = subAspectos.filter(sub => sub.categoria === categoria);
    if (aspectos.length === 0) return 0;
    
    const totalPonderado = aspectos.reduce((sum, sub) => sum + (sub.ponderacion * sub.calificacion), 0);
    const totalPonderacion = aspectos.reduce((sum, sub) => sum + sub.ponderacion, 0);
    
    return totalPonderacion > 0 ? totalPonderado / totalPonderacion : 0;
  };

  // Calcular resultado total
  const calcularResultadoTotal = () => {
    const cualitativo = calcularResultadoCategoria('Cualitativo');
    const legal = calcularResultadoCategoria('Legal');
    const cuantitativo = calcularResultadoCategoria('Cuantitativo');
    
    // Metodología: A × B × C
    return (cualitativo * legal * cuantitativo) / 100;
  };

  // Determinar categoría de riesgo
  const determinarCategoriaRiesgo = (resultado: number): keyof typeof CLASIFICACION_RIESGO => {
    if (resultado >= 8.5) return 'A';
    if (resultado >= 7.0) return 'B';
    if (resultado >= 5.5) return 'C';
    if (resultado >= 4.0) return 'D';
    return 'E';
  };

  // Calcular fecha próxima revisión
  const calcularProximaRevision = (frecuencia: string) => {
    const fecha = new Date();
    switch (frecuencia) {
      case 'mensual':
        fecha.setMonth(fecha.getMonth() + 1);
        break;
      case 'trimestral':
        fecha.setMonth(fecha.getMonth() + 3);
        break;
      case 'semestral':
        fecha.setMonth(fecha.getMonth() + 6);
        break;
      case 'anual':
        fecha.setFullYear(fecha.getFullYear() + 1);
        break;
      default:
        fecha.setMonth(fecha.getMonth() + 3);
    }
    return fecha.toISOString().split('T')[0];
  };

  // Actualizar subaspectos
  const actualizarSubAspecto = (index: number, campo: keyof SubAspecto, valor: any) => {
    const nuevosSubAspectos = [...subAspectos];
    nuevosSubAspectos[index] = { ...nuevosSubAspectos[index], [campo]: valor };
    setSubAspectos(nuevosSubAspectos);
  };

  // Agregar factor crítico
  const agregarFactorCritico = () => {
    if (nuevoFactorCritico.trim()) {
      setFormData(prev => ({
        ...prev,
        factores_criticos: [...(prev.factores_criticos || []), nuevoFactorCritico.trim()]
      }));
      setNuevoFactorCritico('');
    }
  };

  // Eliminar factor crítico
  const eliminarFactorCritico = (index: number) => {
    setFormData(prev => ({
      ...prev,
      factores_criticos: prev.factores_criticos?.filter((_, i) => i !== index) || []
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resultadoCualitativo = calcularResultadoCategoria('Cualitativo');
      const resultadoLegal = calcularResultadoCategoria('Legal');
      const resultadoCuantitativo = calcularResultadoCategoria('Cuantitativo');
      const resultadoTotal = calcularResultadoTotal();
      const categoriaRiesgo = determinarCategoriaRiesgo(resultadoTotal);

      const analisisCompleto: Partial<AnalisisCredito> = {
        ...formData,
        subaspectos: subAspectos,
        resultado_cualitativo: resultadoCualitativo,
        resultado_legal: resultadoLegal,
        resultado_cuantitativo: resultadoCuantitativo,
        resultado_total: resultadoTotal,
        categoria_riesgo: categoriaRiesgo,
        nivel_riesgo: CLASIFICACION_RIESGO[categoriaRiesgo],
        fecha_proxima_revision: calcularProximaRevision(formData.frecuencia_revision || 'trimestral'),
        version: (formData.version || 0) + 1,
        updated_at: new Date().toISOString()
      };

      let resultado: AnalisisCredito;
      if (isEditing && analisis?.id) {
        resultado = await analisisCreditoService.update(analisis.id, analisisCompleto);
      } else {
        resultado = await analisisCreditoService.create(analisisCompleto);
      }

      onSave?.(resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el análisis');
    } finally {
      setLoading(false);
    }
  };

  const resultadoTotal = calcularResultadoTotal();
  const categoriaRiesgo = determinarCategoriaRiesgo(resultadoTotal);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cliente_nombre">Cliente *</Label>
              <Input
                id="cliente_nombre"
                value={formData.cliente_nombre || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, cliente_nombre: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="analista_responsable">Analista Responsable *</Label>
              <Input
                id="analista_responsable"
                value={formData.analista_responsable || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, analista_responsable: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="fecha_analisis">Fecha de Análisis *</Label>
              <Input
                id="fecha_analisis"
                type="date"
                value={formData.fecha_analisis || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_analisis: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="frecuencia_revision">Frecuencia de Revisión</Label>
              <Select
                value={formData.frecuencia_revision || 'trimestral'}
                onValueChange={(value) => setFormData(prev => ({ ...prev, frecuencia_revision: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensual">Mensual</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="semestral">Semestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluación por Subaspectos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Evaluación por Subaspectos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {SUBASPECTOS_DEFAULT.map((categoria) => (
            <div key={categoria.categoria} className="mb-6">
              <h4 className="font-semibold mb-3 text-lg">{categoria.categoria}</h4>
              <div className="space-y-3">
                {subAspectos
                  .filter(sub => sub.categoria === categoria.categoria)
                  .map((subAspecto, index) => {
                    const globalIndex = subAspectos.findIndex(s => s === subAspecto);
                    return (
                      <div key={globalIndex} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg">
                        <div>
                          <Label className="text-sm">{subAspecto.aspecto}</Label>
                        </div>
                        <div>
                          <Label htmlFor={`ponderacion-${globalIndex}`} className="text-sm">Ponderación (1-10)</Label>
                          <Input
                            id={`ponderacion-${globalIndex}`}
                            type="number"
                            min="1"
                            max="10"
                            value={subAspecto.ponderacion}
                            onChange={(e) => actualizarSubAspecto(globalIndex, 'ponderacion', parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`calificacion-${globalIndex}`} className="text-sm">Calificación (1-10)</Label>
                          <Input
                            id={`calificacion-${globalIndex}`}
                            type="number"
                            min="1"
                            max="10"
                            value={subAspecto.calificacion}
                            onChange={(e) => actualizarSubAspecto(globalIndex, 'calificacion', parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`observaciones-${globalIndex}`} className="text-sm">Observaciones</Label>
                          <Input
                            id={`observaciones-${globalIndex}`}
                            value={subAspecto.observaciones || ''}
                            onChange={(e) => actualizarSubAspecto(globalIndex, 'observaciones', e.target.value)}
                            placeholder="Comentarios..."
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Resultado {categoria.categoria}:</span>
                  <Badge variant="outline">
                    {calcularResultadoCategoria(categoria.categoria).toFixed(2)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Resultado Final */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Resultado Final
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {calcularResultadoCategoria('Cualitativo').toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Cualitativo</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {calcularResultadoCategoria('Legal').toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Legal</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {calcularResultadoCategoria('Cuantitativo').toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Cuantitativo</div>
            </div>
          </div>

          <Separator />

          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold mb-2">
              {resultadoTotal.toFixed(2)}
            </div>
            <div className="text-lg mb-2">
              Categoría de Riesgo: 
              <Badge className="ml-2" variant={categoriaRiesgo === 'A' || categoriaRiesgo === 'B' ? 'default' : 'destructive'}>
                {categoriaRiesgo}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              {CLASIFICACION_RIESGO[categoriaRiesgo]}
            </div>
            <Progress value={(resultadoTotal / 10) * 100} className="mt-3" />
          </div>
        </CardContent>
      </Card>

      {/* Factores Críticos */}
      <Card>
        <CardHeader>
          <CardTitle>Factores Críticos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={nuevoFactorCritico}
              onChange={(e) => setNuevoFactorCritico(e.target.value)}
              placeholder="Agregar factor crítico..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarFactorCritico())}
            />
            <Button type="button" onClick={agregarFactorCritico} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.factores_criticos?.map((factor, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {factor}
                <button
                  type="button"
                  onClick={() => eliminarFactorCritico(index)}
                  className="ml-1 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Observaciones y Condiciones */}
      <Card>
        <CardHeader>
          <CardTitle>Observaciones y Condiciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="condiciones_comerciales">Condiciones Comerciales</Label>
            <Textarea
              id="condiciones_comerciales"
              value={formData.condiciones_comerciales || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, condiciones_comerciales: e.target.value }))}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'} Análisis
        </Button>
      </div>
    </form>
  );
}