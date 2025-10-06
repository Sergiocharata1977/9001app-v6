'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  Target, 
  Calendar, 
  Building2,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Upload,
  Download,
  Plus,
  Search,
  Filter,
  BarChart3,
  Grid3X3,
  Bell,
  ClipboardCheck,
  MoreHorizontal
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Importar componentes específicos
import { PolicyCard } from './policy/PolicyCard';
import AMFETable from './amfe/AMFETable';
import { SWOTMatrix } from './aspects/SWOTMatrix';
import { MeetingScheduler } from './meetings/MeetingScheduler';
import { OrgChart } from './organization/OrgChart';
import { QualityDashboard } from './shared/QualityDashboard';

export default function QualityModule() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState('cards');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema de Gestión de Calidad ISO 9001
              </h1>
              <p className="text-gray-600 mt-1">
                Gestión integral de calidad, AMFE, análisis organizacional y procesos
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Registro
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
                <Input placeholder="Buscar políticas, AMFE, reuniones..." className="pl-10" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Horizontal Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-gray-50">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="policy" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Política</span>
                </TabsTrigger>
                <TabsTrigger value="amfe" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="hidden sm:inline">AMFE</span>
                </TabsTrigger>
                <TabsTrigger value="swot" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">FODA</span>
                </TabsTrigger>
                <TabsTrigger value="meetings" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Reuniones</span>
                </TabsTrigger>
                <TabsTrigger value="organization" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Building2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Organigrama</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6 mt-6">
                <QualityDashboard />
              </TabsContent>
              <TabsContent value="policy" className="space-y-6 mt-6">
                <PolicyCard />
              </TabsContent>
              <TabsContent value="amfe" className="space-y-6 mt-6">
                <AMFETable />
              </TabsContent>
              <TabsContent value="swot" className="space-y-6 mt-6">
                <SWOTMatrix />
              </TabsContent>
              <TabsContent value="meetings" className="space-y-6 mt-6">
                <MeetingScheduler />
              </TabsContent>
              <TabsContent value="organization" className="space-y-6 mt-6">
                <OrgChart />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

