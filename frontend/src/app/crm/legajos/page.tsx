'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useLegajos } from '@/hooks/useLegajos';
import { AlertCircle, Building2, FileText, Plus, Search, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

/**
 * Página de listado de legajos
 * Muestra todos los legajos con filtros y paginación
 */
export default function LegajosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    legajos,
    loading,
    error,
    page,
    totalPages,
    total,
    hasMore,
    updateFilters,
    nextPage,
    prevPage,
    refresh
  } = useLegajos({
    limit: 10,
    sort_by: 'updated_at',
    sort_order: 'desc'
  });

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  // Navegar a detalle
  const handleViewDetails = (legajoId: string) => {
    router.push(`/crm/legajos/${legajoId}`);
  };

  // Navegar a crear
  const handleCreate = () => {
    router.push('/crm/legajos/nuevo');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">📋 Legajos Empresariales</h1>
          <p className="text-muted-foreground mt-1">
            Gestión integral de información empresarial
          </p>
        </div>
        {/* Botón "Nuevo" deshabilitado - Los legajos se crean desde el detalle de empresa */}
        <div className="flex flex-col items-end gap-2">
          <Button disabled variant="outline" title="Los legajos se crean automáticamente desde el detalle de cada empresa">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Legajo
          </Button>
          <p className="text-xs text-gray-500 text-right max-w-xs">
            💡 Los legajos se crean automáticamente desde el detalle de cada empresa
          </p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Legajos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Con Datos Financieros</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {legajos.filter(l => l.fiscal_years.length > 0).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Con Activos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {legajos.filter(l => 
                l.assets.properties.length > 0 || 
                l.assets.vehicles.length > 0 || 
                l.assets.machinery.length > 0
              ).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Con Análisis de Riesgo</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {legajos.filter(l => l.risk_links.length > 0).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda y filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Legajos</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en observaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Buscar</Button>
            {searchTerm && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  updateFilters({ search: undefined });
                }}
              >
                Limpiar
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Tabla de legajos */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Legajos</CardTitle>
          <CardDescription>
            {total} legajo{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : legajos.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No se encontraron legajos
              </p>
              <Button onClick={handleCreate} className="mt-4">
                Crear el primer legajo
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>CUIT</TableHead>
                    <TableHead>Datos Financieros</TableHead>
                    <TableHead>Activos</TableHead>
                    <TableHead>Último Score</TableHead>
                    <TableHead>Actualizado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {legajos.map((legajo) => {
                    const latestYear = legajo.fiscal_years[legajo.fiscal_years.length - 1];
                    const latestScore = legajo.risk_links[legajo.risk_links.length - 1];
                    const totalAssets = 
                      legajo.assets.properties.length + 
                      legajo.assets.vehicles.length + 
                      legajo.assets.machinery.length;

                    return (
                      <TableRow key={legajo._id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {legajo.company?.razon_social || 'N/A'}
                        </TableCell>
                        <TableCell>{legajo.company?.cuit || '-'}</TableCell>
                        <TableCell>
                          {latestYear ? (
                            <Badge variant="outline">
                              Año {latestYear.year}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Sin datos</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {totalAssets > 0 ? (
                            <Badge variant="secondary">
                              <Building2 className="w-3 h-3 mr-1" />
                              {totalAssets}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {latestScore ? (
                            <Badge 
                              variant={
                                latestScore.score_snapshot >= 7 ? 'default' :
                                latestScore.score_snapshot >= 5 ? 'outline' : 'destructive'
                              }
                            >
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {latestScore.score_snapshot.toFixed(1)}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(legajo.updated_at).toLocaleDateString('es-AR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(legajo._id)}
                          >
                            Ver Detalle
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Página {page} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevPage}
                      disabled={page === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextPage}
                      disabled={!hasMore}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

