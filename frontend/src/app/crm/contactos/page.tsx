'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Users, 
  Mail, 
  Phone,
  Search,
  Grid3X3,
  List,
  Building2,
  Edit,
  Trash2,
  Eye,
  MessageSquare
} from 'lucide-react';

export default function ContactosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [filterImportancia, setFilterImportancia] = useState('todos');

  const contactos = [
    {
      id: 'CONT-001',
      nombre: 'Carlos',
      apellido: 'Rodriguez',
      cargo: 'Gerente General',
      empresa: 'Estancia San Miguel',
      empresaId: 'CLI-2024-001',
      email: 'carlos.rodriguez@estanciasanmiguel.com',
      telefono: '+54 11 1234-5678',
      importancia: 'alta',
      tipoContacto: 'decision'
    },
    {
      id: 'CONT-002',
      nombre: 'María',
      apellido: 'González',
      cargo: 'Directora de Compras',
      empresa: 'Agropecuaria Los Pinos',
      empresaId: 'CLI-2024-002',
      email: 'maria.gonzalez@lospinos.com',
      telefono: '+54 351 987-6543',
      importancia: 'alta',
      tipoContacto: 'decision'
    },
    {
      id: 'CONT-003',
      nombre: 'Roberto',
      apellido: 'Silva',
      cargo: 'Ingeniero Agrónomo',
      empresa: 'Campo Verde SA',
      empresaId: 'CLI-2024-003',
      email: 'roberto.silva@campoverde.com',
      telefono: '+54 342 555-1234',
      importancia: 'media',
      tipoContacto: 'tecnico'
    },
  ];

  const getImportanciaColor = (importancia: string) => {
    const colors = {
      alta: 'bg-red-100 text-red-800',
      media: 'bg-yellow-100 text-yellow-800',
      baja: 'bg-green-100 text-green-800'
    };
    return colors[importancia as keyof typeof colors] || colors.media;
  };

  const getTipoContactoColor = (tipo: string) => {
    const colors = {
      decision: 'bg-purple-100 text-purple-800',
      influenciador: 'bg-blue-100 text-blue-800',
      usuario: 'bg-green-100 text-green-800',
      tecnico: 'bg-orange-100 text-orange-800',
      financiero: 'bg-pink-100 text-pink-800'
    };
    return colors[tipo as keyof typeof colors] || colors.usuario;
  };

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre[0]}${apellido[0]}`.toUpperCase();
  };

  const filteredContactos = contactos.filter(contacto => {
    const matchesSearch = 
      contacto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacto.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacto.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contacto.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesImportancia = filterImportancia === 'todos' || contacto.importancia === filterImportancia;
    return matchesSearch && matchesImportancia;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contactos</h1>
          <p className="text-gray-600 mt-2">Gestión de contactos de clientes</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Contacto
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, empresa o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterImportancia}
            onChange={(e) => setFilterImportancia(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todas las importancias</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Contactos</p>
                <p className="text-2xl font-bold text-gray-900">{contactos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Con Email</p>
                <p className="text-2xl font-bold text-gray-900">{contactos.filter(c => c.email).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Con Teléfono</p>
                <p className="text-2xl font-bold text-gray-900">{contactos.filter(c => c.telefono).length}</p>
              </div>
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
          {filteredContactos.length} contactos encontrados
        </div>
      </div>

      {/* Content - Vista Tarjetas */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContactos.map((contacto) => (
            <Card key={contacto.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {getInitials(contacto.nombre, contacto.apellido)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{contacto.nombre} {contacto.apellido}</h3>
                    <p className="text-sm text-gray-600">{contacto.cargo}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">{contacto.empresa}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{contacto.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{contacto.telefono}</span>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <Badge className={getImportanciaColor(contacto.importancia)}>
                  {contacto.importancia}
                </Badge>
                <Badge className={getTipoContactoColor(contacto.tipoContacto)}>
                  {contacto.tipoContacto}
                </Badge>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button size="sm" className="flex-1" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Vista Lista */
        <div className="space-y-4">
          {filteredContactos.map((contacto) => (
            <Card key={contacto.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {getInitials(contacto.nombre, contacto.apellido)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{contacto.nombre} {contacto.apellido}</h3>
                      <Badge className={getImportanciaColor(contacto.importancia)}>
                        {contacto.importancia}
                      </Badge>
                      <Badge className={getTipoContactoColor(contacto.tipoContacto)}>
                        {contacto.tipoContacto}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>{contacto.cargo}</span>
                      <span>{contacto.empresa}</span>
                      <span>{contacto.email}</span>
                      <span>{contacto.telefono}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredContactos.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron contactos</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
}