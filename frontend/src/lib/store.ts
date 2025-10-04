import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Tipos para el estado global
export interface IProcess {
  _id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  objetivo: string;
  alcance: string;
  parent_proceso_id?: string;
  responsable_id: string;
  organization_id: string;
  procesos_relacionados: string[];
  documentos_asociados: string[];
  indicadores: IIndicador[];
  estado: 'activo' | 'revision' | 'obsoleto';
  version: string;
  tipo_proceso: 'estrategico' | 'operativo' | 'apoyo';
  nivel_jerarquia: number;
  orden_visualizacion: number;
  activo: boolean;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface IIndicador {
  nombre: string;
  formula: string;
  meta: number;
  frecuencia: 'diaria' | 'semanal' | 'mensual' | 'trimestral' | 'semestral' | 'anual';
  unidad_medida: string;
}

export interface ProcessFilters {
  search?: string;
  tipo_proceso?: string;
  estado?: string;
  responsable_id?: string;
}

export type ViewType = 'lista' | 'tarjetas' | 'kanban';

// Estado de la aplicación
interface AppState {
  // Vista actual
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;

  // Filtros
  filters: ProcessFilters;
  setFilters: (filters: ProcessFilters) => void;
  clearFilters: () => void;

  // Procesos
  processes: IProcess[];
  setProcesses: (processes: IProcess[]) => void;
  addProcess: (process: IProcess) => void;
  updateProcess: (id: string, process: Partial<IProcess>) => void;
  removeProcess: (id: string) => void;

  // Estados de carga
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Modales
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  editingProcess: IProcess | null;
  setEditingProcess: (process: IProcess | null) => void;
}

// Store principal
export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Vista inicial
      currentView: 'lista',
      setCurrentView: (view) => set({ currentView: view }),

      // Filtros
      filters: {},
      setFilters: (filters) => set({ filters }),
      clearFilters: () => set({ filters: {} }),

      // Procesos
      processes: [],
      setProcesses: (processes) => set({ processes }),
      addProcess: (process) => 
        set((state) => ({ processes: [...state.processes, process] })),
      updateProcess: (id, updatedProcess) =>
        set((state) => ({
          processes: state.processes.map((p) =>
            p._id === id ? { ...p, ...updatedProcess } : p
          ),
        })),
      removeProcess: (id) =>
        set((state) => ({
          processes: state.processes.filter((p) => p._id !== id),
        })),

      // Estados de carga
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Modales
      isCreateModalOpen: false,
      setIsCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
      editingProcess: null,
      setEditingProcess: (process) => set({ editingProcess: process }),
    }),
    {
      name: 'app-store',
    }
  )
);