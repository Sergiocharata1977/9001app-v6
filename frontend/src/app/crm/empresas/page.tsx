'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Plus,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  Grid3X3,
  List,
  User,
  TrendingUp
} from 'lucide-react';

export default function EmpresasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [filterTipo, setFilterTipo] = useState('todos');

  const empresas = [
    {
      id: 'CLI-2024-001',
      razonSocial: 'Estancia San Miguel',
      rfc: 'ESM-123456',
      tipoCliente: 'grande',
      zona: 'Pampa Húmeda',
      ciudad: 'Buenos Aires',
      telefono: '+54 11 1234-5678',
      email: 'contacto@estanciasanmiguel.com',
      superficieTotal: 5000,
      vendedor: 'Juan Pérez'
    },
    {
      id: 'CLI-2024-002',
      razonSocial: 'Agropecuaria Los Pinos',
      rfc: 'ALP-789012',
      tipoCliente: 'mediano',
      zona: 'Región Centro',
      ciudad: 'Córdoba',
      telefono: '+54 351 987-6543',
      email: 'info@lospinos.com',
      superficieTotal: 2500,
      vendedor: 'María González'
    },
    {
      id: 'CLI-2024-003',
      razonSocial: 'Campo Verde SA',
      rfc: 'CVS-345678',
      tipoCliente: 'corporativo',
      zona: 'Litoral',
      ciudad: 'Santa Fe',
      telefono: '+54 342 555-1234',
      email: 'ventas@campoverde.com',
      superficieTotal: 8000,
      vendedor: 'Carlos Rodríguez'
    },
  ];

  const getTipoClienteColor = (tipo: string) => {
    const colors = {
      pequeño: 'bg-blue-100 text-blue-800',
      mediano: 'bg-green-100 text-green-800',
      grande: 'bg-purple-100 text-purple-800',
      corporativo: 'bg-orange-100 text-orange-800'
    };
    return colors[tipo as keyof typeof colors] || colors.mediano;
  };

  const getInitials = (razonSocial: string) => {
    return razonSocial.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  const filteredEmpresas = empresas.filter(empresa => {
    const matchesSearch = empresa.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa.ciudad.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === 'todos' || empresa.tipoCliente === filterTipo;
    return matchesSearch && matchesTipo;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
          <p className="text-gray-600 mt-2">Gestión de clientes y empresas agropecuarias</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Empresa
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, ciudad o zona..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todos los tipos</option>
            <option value="pequeño">Pequeño</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
            <option value="corporativo">Corporativo</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Total Empresas</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{empresas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Superficie Total</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {empresas.reduce((sum, e) => sum + e.superficieTotal, 0).toLocaleString()} ha
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Clientes Grandes</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {empresas.filter(e => e.tipoCliente === 'grande' || e.tipoCliente === 'corporativo').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Zonas Activas</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {new Set(empresas.map(e => e.zona)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'cards'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
            Vista Tarjetas
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="h-4 w-4" />
            Vista Lista
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {filteredEmpresas.length} empresas encontradas
        </div>
      </div>

      {/* Content - Vista Tarjetas */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmpresas.map((empresa) => (
            <Card key={empresa.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                    {getInitials(empresa.razonSocial)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{empresa.razonSocial}</h3>
                    <p className="text-sm text-gray-600">{empresa.id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{empresa.ciudad}, {empresa.zona}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{empresa.telefono}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{empresa.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Vendedor: {empresa.vendedor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Superficie: {empresa.superficieTotal.toLocaleString()} ha</span>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <Badge className={getTipoClienteColor(empresa.tipoCliente)}>
                  {empresa.tipoCliente}
                </Badge>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button size="sm" className="flex-1" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Vista Lista */
        <div className="space-y-4">
          {filteredEmpresas.map((empresa) => (
            <Card key={empresa.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {getInitials(empresa.razonSocial)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{empresa.razonSocial}</h3>
                      <Badge className={getTipoClienteColor(empresa.tipoCliente)}>
                        {empresa.tipoCliente}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>{empresa.ciudad}, {empresa.zona}</span>
                      <span>{empresa.email}</span>
                      <span>{empresa.telefono}</span>
                      <span>Superficie: {empresa.superficieTotal.toLocaleString()} ha</span>
                      <span>Vendedor: {empresa.vendedor}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredEmpresas.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron empresas</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
}