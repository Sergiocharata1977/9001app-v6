'use client';

import MetricsDashboard from '@/components/legajos/metrics/MetricsDashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLegajo } from '@/hooks/useLegajo';
import { useLegajoMetrics } from '@/hooks/useLegajoMetrics';
import LegajoService from '@/services/legajoService';
import {
    AlertCircle,
    ArrowLeft,
    Building2,
    Calculator,
    Edit,
    FileText,
    History,
    Plus,
    TrendingUp
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

/**
 * Página de detalle de un legajo
 * Muestra toda la información y métricas calculadas
 */
export default function LegajoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const legajoId = params.id as string;

  const { legajo, loading, error } = useLegajo(legajoId);
  const { metrics, riskEvolution, completeness, loading: loadingMetrics } = useLegajoMetrics(legajoId);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !legajo) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Legajo no encontrado'}
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/crm/legajos')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al listado
        </Button>
      </div>
    );
  }

  const latestYear = legajo.fiscal_years[legajo.fiscal_years.length - 1];
  const latestRisk = legajo.risk_links[legajo.risk_links.length - 1];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {legajo.company?.razon_social || 'Legajo'}
            </h1>
            <p className="text-muted-foreground">
              CUIT: {legajo.company?.cuit || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => router.push(`/crm/analisis-riesgo/nuevo?legajo_id=${legajoId}&empresa_id=${legajo.company_id}`)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Análisis de Riesgo
          </Button>
          <Button variant="outline" onClick={() => router.push(`/crm/legajos/${legajoId}/editar`)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Resumen Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Años Fiscales</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{legajo.fiscal_years.length}</p>
            {latestYear && (
              <p className="text-xs text-muted-foreground">Último: {latestYear.year}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Activos Patrimoniales</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {legajo.assets.properties.length + legajo.assets.vehicles.length + legajo.assets.machinery.length}
            </p>
            {metrics && (
              <p className="text-xs text-muted-foreground">
                Valor: {LegajoService.formatCurrency(metrics.total_activos_patrimonio)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Último Score de Riesgo</CardDescription>
          </CardHeader>
          <CardContent>
            {latestRisk ? (
              <>
                <p className="text-2xl font-bold">{latestRisk.score_snapshot.toFixed(1)}</p>
                <Badge variant={latestRisk.score_snapshot >= 7 ? 'default' : 'destructive'} className="mt-1">
                  {latestRisk.categoria_riesgo || 'N/A'}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Sin análisis</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completitud de Datos</CardDescription>
          </CardHeader>
          <CardContent>
            {completeness ? (
              <>
                <p className="text-2xl font-bold">{completeness.isComplete ? '100%' : `${Math.round((4 - completeness.missingFields.length) / 4 * 100)}%`}</p>
                <p className="text-xs text-muted-foreground">
                  {completeness.isComplete ? '✓ Completo' : `Faltan ${completeness.missingFields.length} secciones`}
                </p>
              </>
            ) : (
              <Skeleton className="h-8 w-16" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs de contenido */}
      <Tabs defaultValue="metricas" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="metricas">
            <Calculator className="w-4 h-4 mr-2" />
            Métricas
          </TabsTrigger>
          <TabsTrigger value="financieros">
            <FileText className="w-4 h-4 mr-2" />
            Datos Financieros
          </TabsTrigger>
          <TabsTrigger value="activos">
            <Building2 className="w-4 h-4 mr-2" />
            Activos
          </TabsTrigger>
          <TabsTrigger value="riesgo">
            <TrendingUp className="w-4 h-4 mr-2" />
            Análisis de Riesgo
          </TabsTrigger>
          <TabsTrigger value="historial">
            <History className="w-4 h-4 mr-2" />
            Historial
          </TabsTrigger>
        </TabsList>

        {/* Tab Métricas */}
        <TabsContent value="metricas">
          {latestYear ? (
            <MetricsDashboard legajo={legajo} metrics={metrics || undefined} showCharts={true} />
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No hay datos financieros cargados. Agrega un año fiscal para ver las métricas.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Tab Datos Financieros */}
        <TabsContent value="financieros" className="space-y-4">
          {legajo.fiscal_years.length > 0 ? (
            legajo.fiscal_years.map((fy, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Año {fy.year}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Balance */}
                  <div>
                    <h4 className="font-medium mb-2">Balance General</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Activo Corriente</p>
                        <p className="font-medium">{LegajoService.formatCurrency(fy.balance_sheet.activo_corriente)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Activo No Corriente</p>
                        <p className="font-medium">{LegajoService.formatCurrency(fy.balance_sheet.activo_no_corriente)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Activo</p>
                        <p className="font-bold text-blue-600">{LegajoService.formatCurrency(fy.balance_sheet.total_activo)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Patrimonio Neto</p>
                        <p className="font-bold text-green-600">{LegajoService.formatCurrency(fy.balance_sheet.total_patrimonio)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Estado de Resultados */}
                  <div>
                    <h4 className="font-medium mb-2">Estado de Resultados</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Ventas</p>
                        <p className="font-medium">{LegajoService.formatCurrency(fy.income_statement.ventas)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Resultado Bruto</p>
                        <p className="font-medium">{LegajoService.formatCurrency(fy.income_statement.resultado_bruto)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Resultado Ejercicio</p>
                        <p className={`font-bold ${fy.income_statement.resultado_del_ejercicio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {LegajoService.formatCurrency(fy.income_statement.resultado_del_ejercicio)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Alert>
              <AlertDescription>No hay datos financieros cargados</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Tab Activos */}
        <TabsContent value="activos" className="space-y-4">
          {/* Propiedades */}
          {legajo.assets.properties.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>🏠 Propiedades ({legajo.assets.properties.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {legajo.assets.properties.map((prop, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <p className="font-medium">{prop.nombre || prop.address}</p>
                      <p className="text-sm text-muted-foreground">{prop.type} · {prop.usage}</p>
                      <p className="text-sm font-medium mt-1">
                        {LegajoService.formatCurrency(prop.valuation)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Total */}
          {metrics && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-3xl font-bold text-green-600">
                    {LegajoService.formatCurrency(metrics.total_activos_patrimonio)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab Riesgo */}
        <TabsContent value="riesgo" className="space-y-4">
          {riskEvolution && riskEvolution.current ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Último Análisis de Riesgo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Score</p>
                        <p className="text-4xl font-bold">{riskEvolution.current.score_snapshot.toFixed(1)}</p>
                      </div>
                      <Badge 
                        variant={riskEvolution.current.score_snapshot >= 7 ? 'default' : 'destructive'}
                        className="text-lg px-4 py-2"
                      >
                        {riskEvolution.current.categoria_riesgo || 'N/A'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Calculado: {new Date(riskEvolution.current.computed_at).toLocaleString('es-AR')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {riskEvolution.previous && (
                <Card>
                  <CardHeader>
                    <CardTitle>Evolución</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Anterior</p>
                        <p className="text-2xl font-bold">{riskEvolution.previous.score_snapshot.toFixed(1)}</p>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="text-sm text-muted-foreground">Cambio</p>
                        <p className={`text-2xl font-bold ${riskEvolution.change! > 0 ? 'text-green-600' : riskEvolution.change! < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {riskEvolution.change! > 0 ? '+' : ''}{riskEvolution.change?.toFixed(2)}
                        </p>
                        <Badge className="mt-1">
                          {LegajoService.getTrendIcon(riskEvolution.trend)} {riskEvolution.trend}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Alert>
              <AlertDescription>
                No hay análisis de riesgo vinculados a este legajo
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Tab Historial */}
        <TabsContent value="historial">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Cambios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Creado</span>
                  <span>{new Date(legajo.created_at).toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Última actualización</span>
                  <span>{new Date(legajo.updated_at).toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Análisis de riesgo</span>
                  <span>{legajo.risk_links.length} realizado{legajo.risk_links.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Observaciones */}
      {legajo.observaciones && (
        <Card>
          <CardHeader>
            <CardTitle>Observaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{legajo.observaciones}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

