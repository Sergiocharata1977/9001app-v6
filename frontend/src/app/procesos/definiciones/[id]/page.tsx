'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  ArrowLeft, 
  Hash, 
  GitBranch, 
  Users, 
  Target, 
  Maximize, 
  Book, 
  Workflow, 
  FileText, 
  Briefcase,
  Plus,
  X,
  Edit,
  Save,
  Trash2
} from 'lucide-react';

interface Proceso {
  id: string;
  nombre: string;
  codigo: string;
  version: string;
  funciones_involucradas?: string;
  objetivo?: string;
  alcance?: string;
  definiciones_abreviaturas?: string;
  desarrollo?: string;
  puesto_responsable?: {
    id: string;
    nombre: string;
  };
  puesto_responsable_id?: string;
  normas_relacionadas?: Array<{
    id: string;
    codigo: string;
    titulo: string;
  }>;
  documentos_relacionados?: Array<{
    id: string;
    titulo: string;
    tipo: string;
  }>;
  objetivos_relacionados?: Array<{
    id: string;
    nombre: string;
    descripcion: string;
  }>;
  indicadores_relacionados?: Array<{
    id: string;
    nombre: string;
    tipo: string;
  }>;
  mediciones_relacionadas?: Array<{
    id: string;
    nombre: string;
    unidad: string;
  }>;
}

interface Puesto {
  id: string;
  nombre: string;
}

interface Norma {
  id: string;
  codigo: string;
  titulo: string;
}

interface Documento {
  id: string;
  titulo: string;
  tipo: string;
}

interface Objetivo {
  id: string;
  nombre: string;
  descripcion: string;
}

interface Indicador {
  id: string;
  nombre: string;
  tipo: string;
}

interface Medicion {
  id: string;
  nombre: string;
  unidad: string;
}

export default function ProcesoDefinitionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [proceso, setProceso] = useState<Proceso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [normas, setNormas] = useState<Norma[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [mediciones, setMediciones] = useState<Medicion[]>([]);
  
  // Estados para gestión de relaciones
  const [showPuestoSelect, setShowPuestoSelect] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState<string>('');
  const [isSavingPuesto, setIsSavingPuesto] = useState(false);
  
  const [selectedNorma, setSelectedNorma] = useState<string>('');
  const [selectedDocumento, setSelectedDocumento] = useState<string>('');
  const [selectedObjetivo, setSelectedObjetivo] = useState<string>('');
  const [selectedIndicador, setSelectedIndicador] = useState<string>('');
  const [selectedMedicion, setSelectedMedicion] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadProceso();
      loadPuestos();
      loadNormas();
      loadDocumentos();
      loadObjetivos();
      loadIndicadores();
      loadMediciones();
    }
  }, [id]);

  const loadProceso = async () => {
    try {
      setLoading(true);
      // TODO: Implementar servicio real
      // const data = await procesosService.getProcesoById(id);
      
      // Datos de ejemplo
      const mockProceso: Proceso = {
        id: id,
        nombre: 'Proceso de Ventas',
        codigo: 'PV-001',
        version: '1.0',
        funciones_involucradas: 'Ventas, Marketing, Atención al Cliente',
        objetivo: 'Garantizar la satisfacción del cliente mediante un proceso de ventas eficiente y transparente, que permita identificar oportunidades de negocio y establecer relaciones comerciales duraderas.',
        alcance: 'Este proceso aplica a todas las actividades de ventas de productos y servicios de la empresa, desde la identificación de oportunidades hasta el cierre de negocios y seguimiento post-venta.',
        definiciones_abreviaturas: 'PV: Proceso de Ventas\nCRM: Customer Relationship Management\nKPI: Key Performance Indicator\nROI: Return on Investment',
        desarrollo: '1. Identificación de oportunidades\n2. Calificación de leads\n3. Presentación de propuestas\n4. Negociación\n5. Cierre de ventas\n6. Seguimiento post-venta',
        puesto_responsable: {
          id: '1',
          nombre: 'Gerente de Ventas'
        },
        puesto_responsable_id: '1',
        normas_relacionadas: [
          { id: '1', codigo: 'ISO 9001:2015', titulo: 'Sistemas de gestión de la calidad' },
          { id: '2', codigo: 'ISO 10002:2018', titulo: 'Gestión de la satisfacción del cliente' }
        ],
        documentos_relacionados: [
          { id: '1', titulo: 'Manual de Ventas', tipo: 'Manual' },
          { id: '2', titulo: 'Procedimiento de Atención al Cliente', tipo: 'Procedimiento' }
        ],
        objetivos_relacionados: [
          { id: '1', nombre: 'Aumentar ventas en 15%', descripcion: 'Incrementar el volumen de ventas en un 15% respecto al año anterior' },
          { id: '2', nombre: 'Mejorar satisfacción del cliente', descripcion: 'Alcanzar una puntuación de satisfacción del cliente superior a 4.5/5' }
        ],
        indicadores_relacionados: [
          { id: '1', nombre: 'Tasa de conversión', tipo: 'Porcentaje' },
          { id: '2', nombre: 'Tiempo promedio de cierre', tipo: 'Días' }
        ],
        mediciones_relacionadas: [
          { id: '1', nombre: 'Ventas mensuales', unidad: 'Unidades' },
          { id: '2', nombre: 'Satisfacción del cliente', unidad: 'Puntuación 1-5' }
        ]
      };
      
      setProceso(mockProceso);
    } catch (err) {
      setError('No se pudo cargar el proceso');
    } finally {
      setLoading(false);
    }
  };

  const loadPuestos = async () => {
    // TODO: Implementar servicio real
    const mockPuestos: Puesto[] = [
      { id: '1', nombre: 'Gerente de Ventas' },
      { id: '2', nombre: 'Ejecutivo de Ventas' },
      { id: '3', nombre: 'Coordinador de Ventas' }
    ];
    setPuestos(mockPuestos);
  };

  const loadNormas = async () => {
    // TODO: Implementar servicio real
    const mockNormas: Norma[] = [
      { id: '1', codigo: 'ISO 9001:2015', titulo: 'Sistemas de gestión de la calidad' },
      { id: '2', codigo: 'ISO 10002:2018', titulo: 'Gestión de la satisfacción del cliente' },
      { id: '3', codigo: 'ISO 14001:2015', titulo: 'Sistemas de gestión ambiental' }
    ];
    setNormas(mockNormas);
  };

  const loadDocumentos = async () => {
    // TODO: Implementar servicio real
    const mockDocumentos: Documento[] = [
      { id: '1', titulo: 'Manual de Ventas', tipo: 'Manual' },
      { id: '2', titulo: 'Procedimiento de Atención al Cliente', tipo: 'Procedimiento' },
      { id: '3', titulo: 'Formulario de Evaluación de Cliente', tipo: 'Formulario' }
    ];
    setDocumentos(mockDocumentos);
  };

  const loadObjetivos = async () => {
    // TODO: Implementar servicio real
    const mockObjetivos: Objetivo[] = [
      { id: '1', nombre: 'Aumentar ventas en 15%', descripcion: 'Incrementar el volumen de ventas en un 15% respecto al año anterior' },
      { id: '2', nombre: 'Mejorar satisfacción del cliente', descripcion: 'Alcanzar una puntuación de satisfacción del cliente superior a 4.5/5' },
      { id: '3', nombre: 'Reducir tiempo de respuesta', descripcion: 'Disminuir el tiempo de respuesta a consultas de clientes en un 20%' }
    ];
    setObjetivos(mockObjetivos);
  };

  const loadIndicadores = async () => {
    // TODO: Implementar servicio real
    const mockIndicadores: Indicador[] = [
      { id: '1', nombre: 'Tasa de conversión', tipo: 'Porcentaje' },
      { id: '2', nombre: 'Tiempo promedio de cierre', tipo: 'Días' },
      { id: '3', nombre: 'Valor promedio de venta', tipo: 'Moneda' }
    ];
    setIndicadores(mockIndicadores);
  };

  const loadMediciones = async () => {
    // TODO: Implementar servicio real
    const mockMediciones: Medicion[] = [
      { id: '1', nombre: 'Ventas mensuales', unidad: 'Unidades' },
      { id: '2', nombre: 'Satisfacción del cliente', unidad: 'Puntuación 1-5' },
      { id: '3', nombre: 'Tiempo de respuesta', unidad: 'Horas' }
    ];
    setMediciones(mockMediciones);
  };

  const handleSavePuesto = async () => {
    if (!selectedPuesto || !proceso) return;
    setIsSavingPuesto(true);
    try {
      // TODO: Implementar servicio real
      console.log('Guardando puesto responsable:', selectedPuesto);
      
      // Simular actualización
      setProceso(prev => prev ? {
        ...prev,
        puesto_responsable_id: selectedPuesto,
        puesto_responsable: puestos.find(p => p.id === selectedPuesto)
      } : null);
      
      setShowPuestoSelect(false);
    } catch (error) {
      console.error('Error guardando puesto:', error);
    } finally {
      setIsSavingPuesto(false);
    }
  };

  const handleAddNorma = async () => {
    if (!selectedNorma || !proceso) return;
    try {
      const norma = normas.find(n => n.id === selectedNorma);
      if (norma) {
        setProceso(prev => prev ? {
          ...prev,
          normas_relacionadas: [...(prev.normas_relacionadas || []), norma]
        } : null);
        setSelectedNorma('');
      }
    } catch (error) {
      console.error('Error agregando norma:', error);
    }
  };

  const handleRemoveNorma = (normaId: string) => {
    setProceso(prev => prev ? {
      ...prev,
      normas_relacionadas: prev.normas_relacionadas?.filter(n => n.id !== normaId) || []
    } : null);
  };

  const handleAddDocumento = async () => {
    if (!selectedDocumento || !proceso) return;
    try {
      const documento = documentos.find(d => d.id === selectedDocumento);
      if (documento) {
        setProceso(prev => prev ? {
          ...prev,
          documentos_relacionados: [...(prev.documentos_relacionados || []), documento]
        } : null);
        setSelectedDocumento('');
      }
    } catch (error) {
      console.error('Error agregando documento:', error);
    }
  };

  const handleRemoveDocumento = (documentoId: string) => {
    setProceso(prev => prev ? {
      ...prev,
      documentos_relacionados: prev.documentos_relacionados?.filter(d => d.id !== documentoId) || []
    } : null);
  };

  const handleAddObjetivo = async () => {
    if (!selectedObjetivo || !proceso) return;
    try {
      const objetivo = objetivos.find(o => o.id === selectedObjetivo);
      if (objetivo) {
        setProceso(prev => prev ? {
          ...prev,
          objetivos_relacionados: [...(prev.objetivos_relacionados || []), objetivo]
        } : null);
        setSelectedObjetivo('');
      }
    } catch (error) {
      console.error('Error agregando objetivo:', error);
    }
  };

  const handleRemoveObjetivo = (objetivoId: string) => {
    setProceso(prev => prev ? {
      ...prev,
      objetivos_relacionados: prev.objetivos_relacionados?.filter(o => o.id !== objetivoId) || []
    } : null);
  };

  const handleAddIndicador = async () => {
    if (!selectedIndicador || !proceso) return;
    try {
      const indicador = indicadores.find(i => i.id === selectedIndicador);
      if (indicador) {
        setProceso(prev => prev ? {
          ...prev,
          indicadores_relacionados: [...(prev.indicadores_relacionados || []), indicador]
        } : null);
        setSelectedIndicador('');
      }
    } catch (error) {
      console.error('Error agregando indicador:', error);
    }
  };

  const handleRemoveIndicador = (indicadorId: string) => {
    setProceso(prev => prev ? {
      ...prev,
      indicadores_relacionados: prev.indicadores_relacionados?.filter(i => i.id !== indicadorId) || []
    } : null);
  };

  const handleAddMedicion = async () => {
    if (!selectedMedicion || !proceso) return;
    try {
      const medicion = mediciones.find(m => m.id === selectedMedicion);
      if (medicion) {
        setProceso(prev => prev ? {
          ...prev,
          mediciones_relacionadas: [...(prev.mediciones_relacionadas || []), medicion]
        } : null);
        setSelectedMedicion('');
      }
    } catch (error) {
      console.error('Error agregando medición:', error);
    }
  };

  const handleRemoveMedicion = (medicionId: string) => {
    setProceso(prev => prev ? {
      ...prev,
      mediciones_relacionadas: prev.mediciones_relacionadas?.filter(m => m.id !== medicionId) || []
    } : null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500">Cargando definición del proceso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-xl font-semibold text-red-600">Error al Cargar</h2>
        <p className="text-gray-500 mt-2">{error}</p>
        <Button variant="outline" onClick={() => router.push('/procesos/definiciones')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Definiciones
        </Button>
      </div>
    );
  }

  if (!proceso) {
    return null;
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Header Principal */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Button onClick={() => router.push('/procesos/definiciones')} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-grow">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Definición: {proceso.nombre}
            </h1>
            <p className="text-sm text-gray-500">
              Sistema de Gestión de Calidad ISO 9001
            </p>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal (contenido del proceso) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <FileText className="w-6 h-6 mr-3 text-blue-600" />
                  {proceso.nombre}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Hash className="w-4 h-4 mr-2" />
                    <strong>Código:</strong><span className="ml-2">{proceso.codigo}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <GitBranch className="w-4 h-4 mr-2" />
                    <strong>Versión:</strong><span className="ml-2">{proceso.version}</span>
                  </div>
                  <div className="flex items-center text-gray-600 sm:col-span-2 md:col-span-1">
                    <Users className="w-4 h-4 mr-2" />
                    <strong>Funciones:</strong><span className="ml-2">{proceso.funciones_involucradas || 'No definidas'}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <strong>Responsable:</strong>
                    <span className="ml-2">{proceso.puesto_responsable?.nombre || 'No asignado'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center"><Target className="w-5 h-5 mr-2" />1. Objetivo</CardTitle></CardHeader>
              <CardContent><p className="text-gray-700 whitespace-pre-wrap">{proceso.objetivo || 'No definido.'}</p></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center"><Maximize className="w-5 h-5 mr-2" />2. Alcance</CardTitle></CardHeader>
              <CardContent><p className="text-gray-700 whitespace-pre-wrap">{proceso.alcance || 'No definido.'}</p></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center"><Book className="w-5 h-5 mr-2" />3. Definiciones y Abreviaturas</CardTitle></CardHeader>
              <CardContent><p className="text-gray-700 whitespace-pre-wrap">{proceso.definiciones_abreviaturas || 'No definidas.'}</p></CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center"><Workflow className="w-5 h-5 mr-2" />4. Desarrollo del Proceso</CardTitle></CardHeader>
              <CardContent><p className="text-gray-700 whitespace-pre-wrap">{proceso.desarrollo || 'No definido.'}</p></CardContent>
            </Card>
          </div>

          {/* Columna de relaciones */}
          <div className="space-y-6">
            {/* Responsable */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Responsable
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showPuestoSelect ? (
                  <Button 
                    className="w-full" 
                    onClick={() => { 
                      setShowPuestoSelect(true); 
                      setSelectedPuesto(proceso.puesto_responsable_id || ''); 
                    }}
                  >
                    {proceso.puesto_responsable ? 'Cambiar Responsable' : 'Asignar Responsable'}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <select 
                      value={selectedPuesto || ''} 
                      onChange={(e) => setSelectedPuesto(e.target.value)} 
                      className="w-full p-2 border rounded"
                    >
                      <option value="" disabled>Seleccione un puesto responsable</option>
                      {puestos.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSavePuesto} 
                        disabled={!selectedPuesto || isSavingPuesto} 
                        className="flex-1"
                      >
                        {isSavingPuesto ? 'Guardando...' : 'Guardar'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowPuestoSelect(false)} 
                        disabled={isSavingPuesto}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Normas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Normas Aplicables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-2">
                  <select 
                    value={selectedNorma} 
                    onChange={(e) => setSelectedNorma(e.target.value)}
                    className="flex-1 p-2 border rounded"
                  >
                    <option value="">Seleccionar norma</option>
                    {normas.map(norma => (
                      <option key={norma.id} value={norma.id}>{norma.codigo} - {norma.titulo}</option>
                    ))}
                  </select>
                  <Button onClick={handleAddNorma} disabled={!selectedNorma} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {proceso.normas_relacionadas?.map(norma => (
                    <Badge key={norma.id} className="bg-emerald-700 text-white flex items-center gap-1">
                      {norma.codigo}
                      <button onClick={() => handleRemoveNorma(norma.id)} className="ml-1 text-xs">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documentos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentos Relacionados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-2">
                  <select 
                    value={selectedDocumento} 
                    onChange={(e) => setSelectedDocumento(e.target.value)}
                    className="flex-1 p-2 border rounded"
                  >
                    <option value="">Seleccionar documento</option>
                    {documentos.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.titulo}</option>
                    ))}
                  </select>
                  <Button onClick={handleAddDocumento} disabled={!selectedDocumento} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {proceso.documentos_relacionados?.map(doc => (
                    <Badge key={doc.id} className="bg-blue-700 text-white flex items-center gap-1">
                      {doc.titulo}
                      <button onClick={() => handleRemoveDocumento(doc.id)} className="ml-1 text-xs">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Objetivos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objetivos Relacionados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-2">
                  <select 
                    value={selectedObjetivo} 
                    onChange={(e) => setSelectedObjetivo(e.target.value)}
                    className="flex-1 p-2 border rounded"
                  >
                    <option value="">Seleccionar objetivo</option>
                    {objetivos.map(obj => (
                      <option key={obj.id} value={obj.id}>{obj.nombre}</option>
                    ))}
                  </select>
                  <Button onClick={handleAddObjetivo} disabled={!selectedObjetivo} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {proceso.objetivos_relacionados?.map(obj => (
                    <Badge key={obj.id} className="bg-green-700 text-white flex items-center gap-1">
                      {obj.nombre}
                      <button onClick={() => handleRemoveObjetivo(obj.id)} className="ml-1 text-xs">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Indicadores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Indicadores Relacionados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-2">
                  <select 
                    value={selectedIndicador} 
                    onChange={(e) => setSelectedIndicador(e.target.value)}
                    className="flex-1 p-2 border rounded"
                  >
                    <option value="">Seleccionar indicador</option>
                    {indicadores.map(ind => (
                      <option key={ind.id} value={ind.id}>{ind.nombre}</option>
                    ))}
                  </select>
                  <Button onClick={handleAddIndicador} disabled={!selectedIndicador} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {proceso.indicadores_relacionados?.map(ind => (
                    <Badge key={ind.id} className="bg-purple-700 text-white flex items-center gap-1">
                      {ind.nombre}
                      <button onClick={() => handleRemoveIndicador(ind.id)} className="ml-1 text-xs">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mediciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Mediciones Relacionadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-2">
                  <select 
                    value={selectedMedicion} 
                    onChange={(e) => setSelectedMedicion(e.target.value)}
                    className="flex-1 p-2 border rounded"
                  >
                    <option value="">Seleccionar medición</option>
                    {mediciones.map(med => (
                      <option key={med.id} value={med.id}>{med.nombre}</option>
                    ))}
                  </select>
                  <Button onClick={handleAddMedicion} disabled={!selectedMedicion} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {proceso.mediciones_relacionadas?.map(med => (
                    <Badge key={med.id} className="bg-orange-700 text-white flex items-center gap-1">
                      {med.nombre}
                      <button onClick={() => handleRemoveMedicion(med.id)} className="ml-1 text-xs">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

