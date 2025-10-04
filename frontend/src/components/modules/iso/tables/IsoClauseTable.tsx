'use client';

import React, { useState, useEffect } from 'react';
import { IsoClause, ComplianceStatus } from '@/shared-types/entities/IsoClause';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  User,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IsoClauseFormV2 } from '../forms/IsoClauseFormV2';

interface IsoClauseTableProps {
  onEdit?: (clause: IsoClause) => void;
  onDelete?: (id: string) => void;
  onView?: (clause: IsoClause) => void;
  onEvaluate?: (clause: IsoClause) => void;
}

export function IsoClauseTable({ onEdit, onDelete, onView, onEvaluate }: IsoClauseTableProps) {
  const [clauses, setClauses] = useState<IsoClause[]>([]);
  const [filteredClauses, setFilteredClauses] = useState<IsoClause[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [complianceFilter, setComplianceFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingClause, setEditingClause] = useState<IsoClause | null>(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockClauses: IsoClause[] = [
      {
        id: '1',
        clauseNumber: '4.1',
        title: 'Comprensión de la organización y de su contexto',
        description: 'La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y su dirección estratégica.',
        requirements: [
          'Determinar cuestiones externas e internas pertinentes',
          'Realizar seguimiento y revisión de estas cuestiones',
          'Considerar el impacto en el sistema de gestión de calidad'
        ],
        level: 1,
        sortOrder: 1,
        complianceStatus: 'compliant',
        compliancePercentage: 95,
        lastEvaluationDate: new Date('2024-01-15'),
        nextEvaluationDate: new Date('2024-07-15'),
        evidenceDocuments: ['doc-1', 'doc-2'],
        processIds: ['proc-1'],
        responsibleDepartmentId: 'dept-1',
        responsiblePersonId: 'person-1',
        evaluations: [],
        findings: [],
        isoVersion: '2015',
        isActive: true,
        organizationId: 'org-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
        totalFindings: 0,
        openFindings: 0,
        criticalFindings: 0
      },
      {
        id: '2',
        clauseNumber: '4.2',
        title: 'Comprensión de las necesidades y expectativas de las partes interesadas',
        description: 'La organización debe determinar las partes interesadas que son pertinentes al sistema de gestión de la calidad.',
        requirements: [
          'Determinar las partes interesadas pertinentes',
          'Determinar los requisitos de estas partes interesadas',
          'Realizar seguimiento y revisión de la información'
        ],
        level: 1,
        sortOrder: 2,
        complianceStatus: 'partially_compliant',
        compliancePercentage: 75,
        lastEvaluationDate: new Date('2024-01-20'),
        nextEvaluationDate: new Date('2024-07-20'),
        evidenceDocuments: ['doc-3'],
        processIds: ['proc-1', 'proc-2'],
        responsibleDepartmentId: 'dept-1',
        responsiblePersonId: 'person-2',
        evaluations: [],
        findings: [],
        isoVersion: '2015',
        isActive: true,
        organizationId: 'org-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-20'),
        totalFindings: 2,
        openFindings: 1,
        criticalFindings: 0
      },
      {
        id: '3',
        clauseNumber: '7.1.2',
        title: 'Personas',
        description: 'La organización debe determinar y proporcionar las personas necesarias para la implementación eficaz de su sistema de gestión de la calidad.',
        requirements: [
          'Determinar las personas necesarias',
          'Asegurar la competencia del personal',
          'Proporcionar formación cuando sea necesario'
        ],
        level: 2,
        sortOrder: 3,
        parentClauseId: '7',
        complianceStatus: 'non_compliant',
        compliancePercentage: 45,
        lastEvaluationDate: new Date('2024-01-25'),
        nextEvaluationDate: new Date('2024-04-25'),
        evidenceDocuments: ['doc-4', 'doc-5'],
        processIds: ['proc-3'],
        responsibleDepartmentId: 'dept-3',
        responsiblePersonId: 'person-3',
        evaluations: [],
        findings: [],
        isoVersion: '2015',
        isActive: true,
        organizationId: 'org-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-25'),
        totalFindings: 5,
        openFindings: 4,
        criticalFindings: 2
      },
      {
        id: '4',
        clauseNumber: '8.5.1',
        title: 'Control de la producción y de la provisión del servicio',
        description: 'La organización debe implementar la producción y provisión del servicio bajo condiciones controladas.',
        requirements: [
          'Disponibilidad de información sobre características del producto',
          'Disponibilidad de instrucciones de trabajo',
          'Uso de equipo apropiado',
          'Implementación de seguimiento y medición'
        ],
        level: 2,
        sortOrder: 4,
        parentClauseId: '8',
        complianceStatus: 'compliant',
        compliancePercentage: 88,
        lastEvaluationDate: new Date('2024-01-30'),
        nextEvaluationDate: new Date('2024-07-30'),
        evidenceDocuments: ['doc-6', 'doc-7', 'doc-8'],
        processIds: ['proc-2'],
        responsibleDepartmentId: 'dept-2',
        responsiblePersonId: 'person-4',
        evaluations: [],
        findings: [],
        isoVersion: '2015',
        isActive: true,
        organizationId: 'org-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-30'),
        totalFindings: 1,
        openFindings: 0,
        criticalFindings: 0
      },
      {
        id: '5',
        clauseNumber: '9.2',
        title: 'Auditoría interna',
        description: 'La organización debe llevar a cabo auditorías internas a intervalos planificados.',
        requirements: [
          'Planificar programa de auditorías',
          'Definir criterios y alcance de auditoría',
          'Seleccionar auditores competentes',
          'Comunicar resultados a la dirección'
        ],
        level: 1,
        sortOrder: 5,
        complianceStatus: 'not_evaluated',
        compliancePercentage: 0,
        evidenceDocuments: [],
        processIds: ['proc-1'],
        responsibleDepartmentId: 'dept-1',
        evaluations: [],
        findings: [],
        isoVersion: '2015',
        isActive: true,
        organizationId: 'org-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        totalFindings: 0,
        openFindings: 0,
        criticalFindings: 0
      }
    ];

    setTimeout(() => {
      setClauses(mockClauses);
      setFilteredClauses(mockClauses);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter clauses
  useEffect(() => {
    let filtered = clauses;

    if (searchTerm) {
      filtered = filtered.filter(clause =>
        clause.clauseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clause.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (complianceFilter !== 'all') {
      filtered = filtered.filter(clause => clause.complianceStatus === complianceFilter);
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(clause => clause.level === parseInt(levelFilter));
    }

    setFilteredClauses(filtered);
  }, [clauses, searchTerm, complianceFilter, levelFilter]);

  const getComplianceBadge = (status: ComplianceStatus) => {
    const configs = {
      not_evaluated: { label: 'No Evaluado', color: 'bg-gray-100 text-gray-800' },
      non_compliant: { label: 'No Conforme', color: 'bg-red-100 text-red-800' },
      partially_compliant: { label: 'Parcial', color: 'bg-yellow-100 text-yellow-800' },
      compliant: { label: 'Conforme', color: 'bg-green-100 text-green-800' },
      not_applicable: { label: 'No Aplica', color: 'bg-blue-100 text-blue-800' }
    };

    const config = configs[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getComplianceIcon = (status: ComplianceStatus) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partially_compliant':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'non_compliant':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'not_evaluated':
        return <Eye className="h-4 w-4 text-gray-400" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleEdit = (clause: IsoClause) => {
    setEditingClause(clause);
    setShowForm(true);
    onEdit?.(clause);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta cláusula?')) {
      setClauses(prev => prev.filter(clause => clause.id !== id));
      onDelete?.(id);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (editingClause) {
      // Update existing clause
      setClauses(prev => prev.map(clause => 
        clause.id === editingClause.id 
          ? { ...clause, ...data, updatedAt: new Date() }
          : clause
      ));
    } else {
      // Add new clause
      const newClause: IsoClause = {
        id: Date.now().toString(),
        clauseNumber: data.clauseNumber,
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        level: data.level,
        sortOrder: clauses.length + 1,
        parentClauseId: data.parentClauseId,
        complianceStatus: data.complianceStatus,
        compliancePercentage: data.compliancePercentage,
        nextEvaluationDate: data.nextEvaluationDate ? new Date(data.nextEvaluationDate) : undefined,
        evidenceDocuments: data.evidenceDocuments || [],
        processIds: data.processIds || [],
        responsibleDepartmentId: data.responsibleDepartmentId,
        responsiblePersonId: data.responsiblePersonId,
        evaluations: [],
        findings: [],
        isoVersion: '2015',
        isActive: true,
        organizationId: 'org-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        totalFindings: 0,
        openFindings: 0,
        criticalFindings: 0
      };
      setClauses(prev => [...prev, newClause]);
    }
    
    setShowForm(false);
    setEditingClause(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar cláusulas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={complianceFilter} onValueChange={setComplianceFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Cumplimiento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="compliant">Conforme</SelectItem>
              <SelectItem value="partially_compliant">Parcial</SelectItem>
              <SelectItem value="non_compliant">No Conforme</SelectItem>
              <SelectItem value="not_evaluated">No Evaluado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="1">Nivel 1</SelectItem>
              <SelectItem value="2">Nivel 2</SelectItem>
              <SelectItem value="3">Nivel 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Cláusula
        </Button>
      </div>

      {/* Clauses Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cláusula</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Cumplimiento</TableHead>
              <TableHead>Hallazgos</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Próxima Evaluación</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClauses.map((clause) => (
              <TableRow key={clause.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-start gap-3">
                    {getComplianceIcon(clause.complianceStatus)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-medium text-blue-600">
                          {clause.clauseNumber}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Nivel {clause.level}
                        </Badge>
                      </div>
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {clause.title}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {clause.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{clause.requirements.length} requisitos</span>
                        {clause.evidenceDocuments.length > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {clause.evidenceDocuments.length} documentos
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getComplianceBadge(clause.complianceStatus)}
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={clause.compliancePercentage} 
                        className="flex-1 h-2"
                      />
                      <span className="text-sm font-medium text-gray-600 w-12">
                        {clause.compliancePercentage}%
                      </span>
                    </div>
                    {clause.lastEvaluationDate && (
                      <div className="text-xs text-gray-500">
                        Evaluado: {clause.lastEvaluationDate.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {clause.totalFindings || 0}
                      </span>
                      <span className="text-xs text-gray-500">total</span>
                    </div>
                    {clause.openFindings! > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-orange-600">
                          {clause.openFindings} abiertos
                        </span>
                      </div>
                    )}
                    {clause.criticalFindings! > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        <span className="text-xs text-red-600">
                          {clause.criticalFindings} críticos
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Dept. Calidad</div>
                    <div className="text-gray-500">Ana García</div>
                  </div>
                </TableCell>
                <TableCell>
                  {clause.nextEvaluationDate ? (
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span>{clause.nextEvaluationDate.toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.ceil((clause.nextEvaluationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No programada</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView?.(clause)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEvaluate?.(clause)}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Evaluar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(clause)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(clause.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredClauses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron cláusulas
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || complianceFilter !== 'all' || levelFilter !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando las cláusulas ISO 9001'
            }
          </p>
          {!searchTerm && complianceFilter === 'all' && levelFilter === 'all' && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Cláusula
            </Button>
          )}
        </div>
      )}

      {/* Clause Form Modal */}
      {showForm && (
        <IsoClauseFormV2
          clause={editingClause}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingClause(null);
          }}
        />
      )}
    </div>
  );
}