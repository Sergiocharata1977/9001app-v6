'use client';

import React, { useState, useEffect } from 'react';
import { Finding, FindingSource, FindingType, FindingSeverity, FindingStatus } from '@/shared-types/entities/Finding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
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
  CheckCircle,
  Clock,
  Target,
  FileText,
  Camera
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
import { FindingFormV2 } from '../forms/FindingFormV2';

interface FindingTableProps {
  onEdit?: (finding: Finding) => void;
  onDelete?: (id: string) => void;
  onView?: (finding: Finding) => void;
  onCreateAction?: (finding: Finding) => void;
}

export function FindingTable({ onEdit, onDelete, onView, onCreateAction }: FindingTableProps) {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [filteredFindings, setFilteredFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingFinding, setEditingFinding] = useState<Finding | null>(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockFindings: Finding[] = [
      {
        id: '1',
        findingNumber: 'AUDIT-001-HALL-001',
        title: 'Falta de registros de calibración de equipos',
        description: 'Se encontró que los equipos de medición en el área de producción no tienen registros actualizados de calibración.',
        source: 'audit',
        sourceId: 'audit-1',
        sourceName: 'Auditoría Interna 2024-01',
        sourceReference: 'AI-2024-001',
        findingType: 'non_conformity',
        severity: 'major',
        category: 'equipment',
        riskLevel: 'high',
        departmentId: 'dept-2',
        departmentName: 'Producción',
        processId: 'proc-2',
        processName: 'Producción',
        location: 'Línea de producción A',
        isoClause: '7.1.5',
        requirement: 'Recursos de seguimiento y medición',
        evidence: 'Revisión de registros de calibración - última calibración: 15/06/2023',
        identifiedBy: 'auditor-1',
        identifiedByName: 'José Martínez - Auditor Interno',
        responsiblePersonId: 'person-3',
        responsiblePersonName: 'María López - Jefe de Producción',
        status: 'open',
        priority: 'high',
        identifiedDate: new Date('2024-01-25'),
        targetCloseDate: new Date('2024-03-25'),
        actionsCount: 2,
        openActionsCount: 2,
        completedActionsCount: 0,
        isVerified: false,
        isRecurrent: false,
        customerImpact: true,
        regulatoryImpact: true,
        organizationId: 'org-1',
        createdBy: 'auditor-1',
        createdAt: new Date('2024-01-25'),
        updatedBy: 'auditor-1',
        updatedAt: new Date('2024-01-25'),
        daysOpen: 35,
        isOverdue: false,
        completionPercentage: 25,
        evidenceDocuments: ['doc-1', 'doc-2']
      },
      {
        id: '2',
        findingNumber: 'EMP-001-HALL-001',
        title: 'Procedimiento de limpieza no se está siguiendo',
        description: 'Un empleado reportó que el procedimiento de limpieza establecido no se está siguiendo correctamente en el turno nocturno.',
        source: 'employee',
        sourceId: 'emp-1',
        sourceName: 'Juan Pérez - Operario',
        findingType: 'observation',
        severity: 'minor',
        category: 'process',
        riskLevel: 'medium',
        departmentId: 'dept-2',
        departmentName: 'Producción',
        processId: 'proc-2',
        processName: 'Producción',
        location: 'Área de envasado',
        evidence: 'Reporte del empleado con fotografías del área',
        identifiedBy: 'emp-1',
        identifiedByName: 'Juan Pérez',
        responsiblePersonId: 'person-4',
        responsiblePersonName: 'José Martínez - Supervisor',
        status: 'in_analysis',
        priority: 'medium',
        identifiedDate: new Date('2024-01-30'),
        targetCloseDate: new Date('2024-02-28'),
        actionsCount: 1,
        openActionsCount: 1,
        completedActionsCount: 0,
        isVerified: false,
        isRecurrent: false,
        customerImpact: false,
        regulatoryImpact: false,
        organizationId: 'org-1',
        createdBy: 'emp-1',
        createdAt: new Date('2024-01-30'),
        updatedBy: 'emp-1',
        updatedAt: new Date('2024-01-30'),
        daysOpen: 30,
        isOverdue: false,
        completionPercentage: 10,
        evidenceDocuments: ['doc-3']
      },
      {
        id: '3',
        findingNumber: 'CLI-001-HALL-001',
        title: 'Queja por demora en entrega de producto',
        description: 'Cliente reporta demoras constantes en la entrega de productos, afectando su operación.',
        source: 'customer',
        sourceId: 'customer-1',
        sourceName: 'ABC Corporation',
        sourceReference: 'QUEJA-2024-001',
        findingType: 'complaint',
        severity: 'major',
        category: 'customer_service',
        riskLevel: 'high',
        departmentId: 'dept-5',
        departmentName: 'Ventas',
        processId: 'proc-5',
        processName: 'Ventas',
        evidence: 'Email del cliente con historial de entregas tardías',
        identifiedBy: 'customer-1',
        identifiedByName: 'Cliente ABC Corp',
        responsiblePersonId: 'person-5',
        responsiblePersonName: 'Ana Rodríguez - Jefe de Ventas',
        status: 'action_planned',
        priority: 'urgent',
        identifiedDate: new Date('2024-02-01'),
        targetCloseDate: new Date('2024-02-15'),
        rootCause: 'Falta de coordinación entre producción y logística',
        actionsCount: 3,
        openActionsCount: 2,
        completedActionsCount: 1,
        isVerified: false,
        isRecurrent: true,
        recurrenceCount: 2,
        customerImpact: true,
        regulatoryImpact: false,
        organizationId: 'org-1',
        createdBy: 'customer-service',
        createdAt: new Date('2024-02-01'),
        updatedBy: 'customer-service',
        updatedAt: new Date('2024-02-05'),
        daysOpen: 28,
        isOverdue: true,
        completionPercentage: 60,
        evidenceDocuments: ['doc-4', 'doc-5']
      },
      {
        id: '4',
        findingNumber: 'AUDIT-002-HALL-001',
        title: 'Oportunidad de mejora en gestión documental',
        description: 'Se identificó una oportunidad para mejorar el sistema de gestión documental mediante digitalización.',
        source: 'audit',
        sourceId: 'audit-2',
        sourceName: 'Auditoría Externa ISO 9001',
        sourceReference: 'AE-2024-001',
        findingType: 'opportunity',
        severity: 'low',
        category: 'documentation',
        riskLevel: 'low',
        departmentId: 'dept-1',
        departmentName: 'Calidad',
        processId: 'proc-1',
        processName: 'Gestión de Calidad',
        isoClause: '4.2.3',
        requirement: 'Control de documentos',
        evidence: 'Observación durante auditoría externa',
        identifiedBy: 'external-auditor',
        identifiedByName: 'Auditor Externo - Certificadora XYZ',
        responsiblePersonId: 'person-1',
        responsiblePersonName: 'Ana García - Director de Calidad',
        status: 'closed',
        priority: 'low',
        identifiedDate: new Date('2024-01-15'),
        targetCloseDate: new Date('2024-06-15'),
        actualCloseDate: new Date('2024-02-10'),
        verificationDate: new Date('2024-02-10'),
        verifiedBy: 'person-1',
        verificationEvidence: 'Implementación de sistema digital completada',
        isVerified: true,
        actionsCount: 1,
        openActionsCount: 0,
        completedActionsCount: 1,
        isRecurrent: false,
        customerImpact: false,
        regulatoryImpact: false,
        organizationId: 'org-1',
        createdBy: 'external-auditor',
        createdAt: new Date('2024-01-15'),
        updatedBy: 'person-1',
        updatedAt: new Date('2024-02-10'),
        daysOpen: 0,
        isOverdue: false,
        completionPercentage: 100,
        evidenceDocuments: ['doc-6']
      }
    ];

    setTimeout(() => {
      setFindings(mockFindings);
      setFilteredFindings(mockFindings);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter findings
  useEffect(() => {
    let filtered = findings;

    if (searchTerm) {
      filtered = filtered.filter(finding =>
        finding.findingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        finding.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        finding.sourceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(finding => finding.source === sourceFilter);
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(finding => finding.severity === severityFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(finding => finding.status === statusFilter);
    }

    setFilteredFindings(filtered);
  }, [findings, searchTerm, sourceFilter, severityFilter, statusFilter]);

  const getSourceBadge = (source: FindingSource) => {
    const configs = {
      audit: { label: 'Auditoría', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      employee: { label: 'Empleado', color: 'bg-green-100 text-green-800', icon: User },
      customer: { label: 'Cliente', color: 'bg-purple-100 text-purple-800', icon: User },
      supplier: { label: 'Proveedor', color: 'bg-orange-100 text-orange-800', icon: Building2 },
      management: { label: 'Dirección', color: 'bg-red-100 text-red-800', icon: Target },
      inspection: { label: 'Inspección', color: 'bg-yellow-100 text-yellow-800', icon: Eye },
      complaint: { label: 'Queja', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      incident: { label: 'Incidente', color: 'bg-red-200 text-red-900', icon: AlertTriangle },
      self_assessment: { label: 'Autoevaluación', color: 'bg-indigo-100 text-indigo-800', icon: FileText }
    };

    const config = configs[source];
    return (
      <Badge className={config.color}>
        <config.icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: FindingSeverity) => {
    const configs = {
      critical: { label: 'Crítico', color: 'bg-red-100 text-red-800' },
      major: { label: 'Mayor', color: 'bg-orange-100 text-orange-800' },
      minor: { label: 'Menor', color: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Bajo', color: 'bg-blue-100 text-blue-800' }
    };

    const config = configs[severity];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: FindingStatus) => {
    const configs = {
      open: { label: 'Abierto', color: 'bg-red-100 text-red-800' },
      in_analysis: { label: 'En Análisis', color: 'bg-yellow-100 text-yellow-800' },
      action_planned: { label: 'Acción Planificada', color: 'bg-blue-100 text-blue-800' },
      in_progress: { label: 'En Progreso', color: 'bg-purple-100 text-purple-800' },
      pending_verification: { label: 'Pendiente Verificación', color: 'bg-orange-100 text-orange-800' },
      verified: { label: 'Verificado', color: 'bg-green-100 text-green-800' },
      closed: { label: 'Cerrado', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelado', color: 'bg-gray-200 text-gray-600' }
    };

    const config = configs[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getTypeIcon = (type: FindingType) => {
    switch (type) {
      case 'non_conformity':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'observation':
        return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'opportunity':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'positive_finding':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'complaint':
        return <AlertTriangle className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleEdit = (finding: Finding) => {
    setEditingFinding(finding);
    setShowForm(true);
    onEdit?.(finding);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este hallazgo?')) {
      setFindings(prev => prev.filter(finding => finding.id !== id));
      onDelete?.(id);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (editingFinding) {
      // Update existing finding
      setFindings(prev => prev.map(finding => 
        finding.id === editingFinding.id 
          ? { ...finding, ...data, updatedAt: new Date() }
          : finding
      ));
    } else {
      // Add new finding
      const newFinding: Finding = {
        id: Date.now().toString(),
        findingNumber: `${data.source.toUpperCase()}-${String(findings.length + 1).padStart(3, '0')}-HALL-001`,
        title: data.title,
        description: data.description,
        source: data.source,
        sourceId: data.sourceId,
        sourceName: data.sourceName,
        sourceReference: data.sourceReference,
        findingType: data.findingType,
        severity: data.severity,
        category: data.category,
        riskLevel: data.riskLevel,
        departmentId: data.departmentId,
        departmentName: 'Departamento',
        processId: data.processId,
        processName: 'Proceso',
        location: data.location,
        isoClause: data.isoClause,
        requirement: data.requirement,
        evidence: data.evidence,
        identifiedBy: 'current-user',
        identifiedByName: 'Usuario Actual',
        responsiblePersonId: data.responsiblePersonId,
        responsiblePersonName: 'Responsable',
        status: 'open',
        priority: data.priority,
        identifiedDate: new Date(),
        targetCloseDate: data.targetCloseDate ? new Date(data.targetCloseDate) : undefined,
        rootCause: data.rootCause,
        actionsCount: 0,
        openActionsCount: 0,
        completedActionsCount: 0,
        isVerified: false,
        isRecurrent: false,
        customerImpact: data.customerImpact,
        regulatoryImpact: data.regulatoryImpact,
        organizationId: 'org-1',
        createdBy: 'current-user',
        createdAt: new Date(),
        updatedBy: 'current-user',
        updatedAt: new Date(),
        daysOpen: 0,
        isOverdue: false,
        completionPercentage: 0,
        evidenceDocuments: []
      };
      setFindings(prev => [...prev, newFinding]);
    }
    
    setShowForm(false);
    setEditingFinding(null);
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
              placeholder="Buscar hallazgos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Origen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="audit">Auditoría</SelectItem>
              <SelectItem value="employee">Empleado</SelectItem>
              <SelectItem value="customer">Cliente</SelectItem>
              <SelectItem value="supplier">Proveedor</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Severidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="critical">Crítico</SelectItem>
              <SelectItem value="major">Mayor</SelectItem>
              <SelectItem value="minor">Menor</SelectItem>
              <SelectItem value="low">Bajo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="open">Abierto</SelectItem>
              <SelectItem value="in_progress">En Progreso</SelectItem>
              <SelectItem value="closed">Cerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Hallazgo
        </Button>
      </div>

      {/* Findings Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hallazgo</TableHead>
              <TableHead>Origen</TableHead>
              <TableHead>Severidad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Fecha Objetivo</TableHead>
              <TableHead className="w-[100px]">Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFindings.map((finding) => (
              <TableRow key={finding.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-start gap-3">
                    {getTypeIcon(finding.findingType)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-medium text-blue-600">
                          {finding.findingNumber}
                        </span>
                        {finding.isRecurrent && (
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                            Recurrente
                          </Badge>
                        )}
                        {finding.isOverdue && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                            Vencido
                          </Badge>
                        )}
                      </div>
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {finding.title}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {finding.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        {finding.departmentName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {finding.departmentName}
                          </span>
                        )}
                        {finding.location && (
                          <span>{finding.location}</span>
                        )}
                        {finding.isoClause && (
                          <span>ISO {finding.isoClause}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {getSourceBadge(finding.source)}
                    <div className="text-xs text-gray-500">
                      {finding.sourceName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getSeverityBadge(finding.severity)}
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    {getStatusBadge(finding.status)}
                    {finding.status !== 'closed' && (
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={finding.completionPercentage || 0} 
                          className="flex-1 h-1"
                        />
                        <span className="text-xs text-gray-500 w-8">
                          {finding.completionPercentage || 0}%
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {finding.actionsCount}
                      </span>
                      <span className="text-xs text-gray-500">total</span>
                    </div>
                    {finding.openActionsCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-orange-600">
                          {finding.openActionsCount} abiertas
                        </span>
                      </div>
                    )}
                    {finding.completedActionsCount > 0 && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600">
                          {finding.completedActionsCount} completadas
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {finding.responsiblePersonName?.split(' - ')[1] || 'Sin asignar'}
                    </div>
                    <div className="text-gray-500">
                      {finding.responsiblePersonName?.split(' - ')[0]}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {finding.targetCloseDate ? (
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span>{finding.targetCloseDate.toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {finding.daysOpen !== undefined && finding.daysOpen > 0 ? (
                          <span className={finding.isOverdue ? 'text-red-600' : 'text-gray-500'}>
                            {finding.daysOpen} días abierto
                          </span>
                        ) : (
                          'Cerrado'
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No definida</span>
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
                      <DropdownMenuItem onClick={() => onView?.(finding)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onCreateAction?.(finding)}>
                        <Target className="h-4 w-4 mr-2" />
                        Crear Acción
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(finding)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(finding.id)}
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

      {filteredFindings.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron hallazgos
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || sourceFilter !== 'all' || severityFilter !== 'all' || statusFilter !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza registrando tu primer hallazgo'
            }
          </p>
          {!searchTerm && sourceFilter === 'all' && severityFilter === 'all' && statusFilter === 'all' && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Hallazgo
            </Button>
          )}
        </div>
      )}

      {/* Finding Form Modal */}
      {showForm && (
        <FindingFormV2
          finding={editingFinding}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingFinding(null);
          }}
        />
      )}
    </div>
  );
}
