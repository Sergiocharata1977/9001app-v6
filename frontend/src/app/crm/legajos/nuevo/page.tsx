'use client';

import AssetsForm from '@/components/legajos/forms/AssetsForm';
import FinancialDataForm from '@/components/legajos/forms/FinancialDataForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LegajoService from '@/services/legajoService';
import { Assets, CreateLegajoDTO, FiscalYear } from '@/types/legajo';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Página para crear un nuevo legajo
 */
export default function NuevoLegajoPage() {
  const router = useRouter();
  
  const [companyId, setCompanyId] = useState('');
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
  const [assets, setAssets] = useState<Assets>({ properties: [], vehicles: [], machinery: [] });
  const [observaciones, setObservaciones] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'basic' | 'financial' | 'assets'>('basic');

  // Guardar año fiscal
  const handleSaveFiscalYear = (fiscalYear: FiscalYear) => {
    setFiscalYears([...fiscalYears, fiscalYear]);
    setCurrentStep('assets');
    toast.success(`Datos financieros del año ${fiscalYear.year} guardados`);
  };

  // Guardar activos
  const handleSaveAssets = (assetsData: Assets) => {
    setAssets(assetsData);
    toast.success('Activos guardados');
  };

  // Crear legajo
  const handleCreate = async () => {
    if (!companyId) {
      setError('Debe seleccionar una empresa');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data: CreateLegajoDTO = {
        company_id: companyId,
        fiscal_years: fiscalYears,
        assets,
        observaciones
      };

      const newLegajo = await LegajoService.create(data);
      
      toast.success('Legajo creado exitosamente');
      router.push(`/crm/legajos/${newLegajo._id}`);
      
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error creando legajo');
      toast.error('Error creando legajo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Legajo</h1>
          <p className="text-muted-foreground">Crear un nuevo legajo empresarial</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Wizard de pasos */}
      <Card>
        <CardHeader>
          <CardTitle>Paso {currentStep === 'basic' ? '1' : currentStep === 'financial' ? '2' : '3'} de 3</CardTitle>
          <CardDescription>
            {currentStep === 'basic' && 'Información básica'}
            {currentStep === 'financial' && 'Datos financieros'}
            {currentStep === 'assets' && 'Activos patrimoniales'}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={currentStep} onValueChange={(v) => setCurrentStep(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">1. Básico</TabsTrigger>
          <TabsTrigger value="financial" disabled={!companyId}>2. Financiero</TabsTrigger>
          <TabsTrigger value="assets" disabled={!companyId}>3. Activos</TabsTrigger>
        </TabsList>

        {/* Step 1: Básico */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company_id">ID de Empresa (Company ID)</Label>
                <Input
                  id="company_id"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  placeholder="ID de la empresa en CRM"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Buscar en CRM → Clientes Agro para obtener el ID
                </p>
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Input
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Observaciones generales..."
                />
              </div>

              <Button 
                onClick={() => setCurrentStep('financial')}
                disabled={!companyId}
                className="w-full"
              >
                Continuar a Datos Financieros
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Financiero */}
        <TabsContent value="financial">
          <FinancialDataForm
            onSubmit={handleSaveFiscalYear}
            onCancel={() => setCurrentStep('basic')}
          />
          {fiscalYears.length > 0 && (
            <Button 
              onClick={() => setCurrentStep('assets')}
              variant="outline"
              className="w-full mt-4"
            >
              Continuar a Activos (Opcional)
            </Button>
          )}
        </TabsContent>

        {/* Step 3: Activos */}
        <TabsContent value="assets">
          <AssetsForm
            initialData={assets}
            onSubmit={handleSaveAssets}
            onCancel={() => setCurrentStep('financial')}
          />
        </TabsContent>
      </Tabs>

      {/* Resumen y Guardar */}
      {(fiscalYears.length > 0 || assets.properties.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Años Fiscales</p>
                <p className="text-2xl font-bold">{fiscalYears.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activos Totales</p>
                <p className="text-2xl font-bold">
                  {assets.properties.length + assets.vehicles.length + assets.machinery.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completitud</p>
                <p className="text-2xl font-bold">
                  {Math.round((fiscalYears.length > 0 ? 50 : 0) + (assets.properties.length > 0 ? 50 : 0))}%
                </p>
              </div>
            </div>

            <Button 
              onClick={handleCreate} 
              disabled={loading || !companyId}
              className="w-full"
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creando...' : 'Crear Legajo'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

