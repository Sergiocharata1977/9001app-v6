'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ProcessKanbanView from '@/components/process/ProcessKanbanView';
import ProcessRecordSingle from '@/components/process/ProcessRecordSingle';
import { processDataService, ProcessBoard } from '@/services/processDataService';
import { IProcessRecord } from '@/types/process';

// Transform IProcessRecord to ProcessKanbanView format
const transformRecordForKanban = (record: IProcessRecord) => {
  // Map state IDs to the format expected by ProcessKanbanView
  const stateMapping: Record<string, string> = {
    'state-started': 'iniciado',
    'state-in-progress': 'en-progreso',
    'state-review': 'en-revision',
    'state-approved': 'aprobado',
    'state-completed': 'completado',
    'state-cancelled': 'cancelado'
  };

  return {
    id: record._id,
    title: record.title,
    description: record.description || '',
    status: (stateMapping[record.current_state_id] || 'iniciado') as 'iniciado' | 'en-progreso' | 'en-revision' | 'aprobado' | 'completado',
    priority: record.priority as any,
    assignee: record.responsible_user_id,
    dueDate: record.due_date?.toISOString() || '',
    tags: record.tags,
    progress: record.progress_percentage,
    createdAt: record.created_at.toISOString(),
    updatedAt: record.updated_at.toISOString()
  };
};

// Transform IProcessRecord to ProcessRecordDetail format for ProcessRecordSingle
const transformRecordForDetail = (record: IProcessRecord, processName: string, processId: string) => ({
  id: record._id,
  title: record.title,
  description: record.description || '',
  status: record.current_state_id.replace('state-', '').replace('-', '_') as any,
  priority: record.priority as any,
  assignee: record.responsible_user_id,
  assigneeEmail: `${record.responsible_user_id}@example.com`, // Mock email
  dueDate: record.due_date?.toISOString() || '',
  startDate: record.start_date?.toISOString() || record.created_at.toISOString(),
  completedDate: record.current_state_id === 'state-completed' ? record.updated_at.toISOString() : undefined,
  tags: record.tags,
  progress: record.progress_percentage,
  createdAt: record.created_at.toISOString(),
  updatedAt: record.updated_at.toISOString(),
  processName,
  processId,
  customFields: record.custom_data || {},
  attachments: [], // TODO: Transform files
  comments: [], // TODO: Transform comments
  history: [] // TODO: Transform state history
});

export default function ProcessRecordsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const processId = params.id as string;
  const recordId = searchParams.get('record');

  const [board, setBoard] = useState<ProcessBoard | null>(null);
  const [records, setRecords] = useState<IProcessRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<IProcessRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load board and records data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load board info
        const boardData = await processDataService.getBoardById(processId);
        if (!boardData) {
          setError('Proceso no encontrado');
          return;
        }
        setBoard(boardData);

        // Load records for this process
        const recordsData = await processDataService.getRecordsByProcessId(processId);
        setRecords(recordsData);

        // If recordId is provided, load the specific record
        if (recordId) {
          const record = await processDataService.getRecordById(recordId);
          setSelectedRecord(record);
        }

      } catch (err) {
        console.error('Error loading process data:', err);
        setError('Error al cargar los datos del proceso');
      } finally {
        setIsLoading(false);
      }
    };

    if (processId) {
      loadData();
    }
  }, [processId, recordId]);

  const handleBack = () => {
    router.push('/procesos');
  };

  const handleRecordSelect = (record: any) => {
    // Transform back to IProcessRecord for the single view
    const fullRecord = records.find(r => r._id === record.id);
    if (fullRecord) {
      router.push(`/procesos/${processId}/registros?record=${record.id}`);
    }
  };

  const handleNewRecord = () => {
    // For now, just show a placeholder
    console.log('Crear nuevo registro en proceso:', processId);
    // TODO: Implement modal or redirect to create form
  };

  const handleRecordClose = () => {
    router.push(`/procesos/${processId}/registros`);
    setSelectedRecord(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver a Procesos
          </button>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Proceso no encontrado</h2>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver a Procesos
          </button>
        </div>
      </div>
    );
  }

  // If a specific record is selected, show the single record view
  if (selectedRecord && board) {
    const detailRecord = transformRecordForDetail(selectedRecord, board.name, board._id);
    return (
      <ProcessRecordSingle
        record={detailRecord}
        onBack={handleRecordClose}
        onEdit={(record) => console.log('Edit record:', record)}
        onDelete={(recordId) => console.log('Delete record:', recordId)}
        onStatusChange={(recordId, newStatus) => console.log('Change status:', recordId, newStatus)}
        onAddComment={(recordId, comment) => console.log('Add comment:', recordId, comment)}
        onUploadFile={(recordId, file) => console.log('Upload file:', recordId, file)}
      />
    );
  }

  // Show Kanban view
  const kanbanRecords = records.map(transformRecordForKanban);

  return (
    <ProcessKanbanView
      processId={processId}
      processName={board.name}
      records={kanbanRecords}
      onBack={handleBack}
      onRecordSelect={handleRecordSelect}
      onNewRecord={handleNewRecord}
    />
  );
}