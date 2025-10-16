'use client';

import {
    BarChart3,
    ClipboardCheck,
    Download,
    FileText,
    Filter,
    FolderOpen,
    Layout,
    Plus,
    Search,
    Settings
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Importar componentes específicos
import { DocumentCategories } from '@/components/documents/DocumentCategories';
import { DocumentDashboard } from '@/components/documents/DocumentDashboard';
import { DocumentManagement } from '@/components/documents/DocumentManagement';
import { DocumentSettings } from '@/components/documents/DocumentSettings';
import { DocumentTemplates } from '@/components/documents/DocumentTemplates';
import { DocumentVersions } from '@/components/documents/DocumentVersions';

export default function DocumentosPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['dashboard', 'management', 'categories', 'versions', 'templates', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Documentos
              </h1>
              <p className="text-gray-600 mt-1">
                Control y administración de documentos del Sistema de Gestión de Calidad
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Documento
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Buscar documentos, categorías..." className="pl-10" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Horizontal Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-gray-50">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="management" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Gestión</span>
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <FolderOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Categorías</span>
                </TabsTrigger>
                <TabsTrigger value="versions" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <ClipboardCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Versiones</span>
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <Layout className="w-4 h-4" />
                  <span className="hidden sm:inline">Plantillas</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Configuración</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6 mt-6">
                <DocumentDashboard />
              </TabsContent>
              <TabsContent value="management" className="space-y-6 mt-6">
                <DocumentManagement />
              </TabsContent>
              <TabsContent value="categories" className="space-y-6 mt-6">
                <DocumentCategories />
              </TabsContent>
              <TabsContent value="versions" className="space-y-6 mt-6">
                <DocumentVersions />
              </TabsContent>
              <TabsContent value="templates" className="space-y-6 mt-6">
                <DocumentTemplates />
              </TabsContent>
              <TabsContent value="settings" className="space-y-6 mt-6">
                <DocumentSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}