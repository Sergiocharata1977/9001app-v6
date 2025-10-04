// Tipos para el store global (Zustand)

import { ProcessRecord, ProcessRecordFilters, ProcessState } from './process-record';

// Estado global de la aplicación
export interface AppState {
  // UI State
  ui: UIState;
  
  // Process Records State
  processRecords: ProcessRecordsState;
  
  // User State
  user: UserState;
  
  // Actions
  actions: AppActions;
}

// Estado de UI
export interface UIState {
  // Vista actual
  currentView: 'list' | 'cards' | 'kanban';
  
  // Sidebar
  sidebarOpen: boolean;
  
  // Modales
  modals: {
    createProcess: boolean;
    editProcess: boolean;
    deleteProcess: boolean;
    processDetails: boolean;
  };
  
  // Loading states
  loading: {
    processes: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
  };
  
  // Notificaciones
  notifications: Notification[];
  
  // Tema
  theme: 'light' | 'dark';
}

// Estado de registros de procesos
export interface ProcessRecordsState {
  // Datos
  records: ProcessRecord[];
  selectedRecord: ProcessRecord | null;
  
  // Filtros y búsqueda
  filters: ProcessRecordFilters;
  searchQuery: string;
  
  // Paginación
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Ordenamiento
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  
  // Estadísticas
  stats: {
    total: number;
    byState: Record<ProcessState, number>;
    overdue: number;
  };
  
  // Cache
  lastFetch: string | null;
  cacheExpiry: number;
}

// Estado del usuario
export interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  organizationId: string | null;
  permissions: string[];
  isAuthenticated: boolean;
}

// Notificación
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: string;
}

// Acciones del store
export interface AppActions {
  // UI Actions
  setCurrentView: (view: 'list' | 'cards' | 'kanban') => void;
  toggleSidebar: () => void;
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  setLoading: (key: keyof UIState['loading'], loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Process Records Actions
  setProcessRecords: (records: ProcessRecord[]) => void;
  addProcessRecord: (record: ProcessRecord) => void;
  updateProcessRecord: (id: string, updates: Partial<ProcessRecord>) => void;
  removeProcessRecord: (id: string) => void;
  setSelectedRecord: (record: ProcessRecord | null) => void;
  setFilters: (filters: Partial<ProcessRecordFilters>) => void;
  setSearchQuery: (query: string) => void;
  setPagination: (pagination: Partial<ProcessRecordsState['pagination']>) => void;
  setSort: (field: string, direction: 'asc' | 'desc') => void;
  updateStats: (stats: Partial<ProcessRecordsState['stats']>) => void;
  clearCache: () => void;
  
  // User Actions
  setUser: (user: Partial<UserState>) => void;
  logout: () => void;
  
  // Utility Actions
  reset: () => void;
}

// Tipos para hooks personalizados
export interface UseProcessRecordsReturn {
  records: ProcessRecord[];
  selectedRecord: ProcessRecord | null;
  filters: ProcessRecordFilters;
  searchQuery: string;
  pagination: ProcessRecordsState['pagination'];
  sort: ProcessRecordsState['sort'];
  stats: ProcessRecordsState['stats'];
  loading: UIState['loading'];
  
  // Actions
  setRecords: (records: ProcessRecord[]) => void;
  selectRecord: (record: ProcessRecord | null) => void;
  updateFilters: (filters: Partial<ProcessRecordFilters>) => void;
  search: (query: string) => void;
  changePage: (page: number) => void;
  changeSort: (field: string, direction: 'asc' | 'desc') => void;
  refresh: () => Promise<void>;
}

export interface UseUIReturn {
  currentView: UIState['currentView'];
  sidebarOpen: boolean;
  modals: UIState['modals'];
  notifications: Notification[];
  theme: UIState['theme'];
  
  // Actions
  setView: (view: 'list' | 'cards' | 'kanban') => void;
  toggleSidebar: () => void;
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  notify: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  toggleTheme: () => void;
}

// Tipos para persistencia
export interface PersistedState {
  ui: Pick<UIState, 'currentView' | 'theme' | 'sidebarOpen'>;
  processRecords: Pick<ProcessRecordsState, 'filters' | 'sort' | 'pagination'>;
  user: UserState;
}

// Tipos para middleware
export interface StoreMiddleware {
  persist?: {
    name: string;
    partialize?: (state: AppState) => Partial<AppState>;
  };
  devtools?: boolean;
}