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
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Módulo Calidad</h1>
              <p className="text-xs text-slate-400">ISO 9001:2015</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'dashboard' ? 'bg-emerald-600' : 'hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('policy')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'policy' ? 'bg-emerald-600' : 'hover:bg-slate-800'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-sm">Política de Calidad</span>
          </button>
          <button 
            onClick={() => setActiveTab('amfe')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'amfe' ? 'bg-emerald-600' : 'hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">Análisis AMFE</span>
          </button>
          <button 
            onClick={() => setActiveTab('swot')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'swot' ? 'bg-emerald-600' : 'hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Análisis FODA</span>
          </button>
          <button 
            onClick={() => setActiveTab('meetings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'meetings' ? 'bg-emerald-600' : 'hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Reuniones</span>
          </button>
          <button 
            onClick={() => setActiveTab('organization')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'organization' ? 'bg-emerald-600' : 'hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-sm">Organigrama</span>
          </button>
        </nav>
      </div>

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

            {/* Content based on active tab */}
            {activeTab === 'dashboard' && <QualityDashboard />}
            {activeTab === 'policy' && <PolicyCard />}
            {activeTab === 'amfe' && <AMFETable />}
            {activeTab === 'swot' && <SWOTMatrix />}
            {activeTab === 'meetings' && <MeetingScheduler />}
            {activeTab === 'organization' && <OrgChart />}
          </div>
        </div>
      </div>
    </div>
  );
}

