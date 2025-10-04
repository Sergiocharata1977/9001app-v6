// Tipos específicos para componentes de UI

import { ReactNode } from 'react';
import { IProcessRecord } from './index';
import { IProcessState } from './process';
import { IProcessState } from './process';
import { IProcessState } from './process';
import { IProcess } from '@/lib/store';
import { IProcessState } from './process';

// Tipos para botones
export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}

// Tipos para inputs
export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

// Tipos para textarea
export interface TextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

// Tipos para select
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

// Tipos para modal
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

// Tipos para card
export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

// Tipos para badge
export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Tipos para DataTable
export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T, index: number) => ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
  onSort?: (column: keyof T, direction: 'asc' | 'desc') => void;
  sortColumn?: keyof T;
  sortDirection?: 'asc' | 'desc';
  className?: string;
}

// Tipos para Pagination
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  className?: string;
}

// Tipos para Loading
export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

// Tipos para Empty State
export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

// Tipos para Toast/Notification
export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

// Tipos para Dropdown
export interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  className?: string;
}

// Tipos para Search
export interface SearchProps {
  placeholder?: string;
  value?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  loading?: boolean;
  className?: string;
}

// Tipos para Filter
export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text';
  options?: SelectOption[];
  value?: any;
}

export interface FilterProps {
  filters: FilterOption[];
  onFiltersChange: (filters: Record<string, any>) => void;
  onClear: () => void;
  className?: string;
}

// Tipos para Kanban con Pragmatic Drag and Drop
export interface KanbanColumn {
  state: IProcessState;
  records: IProcessRecord[];
  canAddRecord: boolean;
  canEditState: boolean;
  canDeleteState: boolean;
}

export interface KanbanProps {
  process: IProcess;
  columns: KanbanColumn[];
  onRecordMove: (recordId: string, sourceStateId: string, targetStateId: string) => Promise<void>;
  onRecordCreate: (stateId: string) => void;
  onRecordEdit: (record: IProcessRecord) => void;
  onRecordDelete: (record: IProcessRecord) => void;
  onStateEdit?: (state: IProcessState) => void;
  onStateDelete?: (state: IProcessState) => void;
  className?: string;
}

// Tipos específicos para Pragmatic Drag and Drop
export interface DraggableRecordProps {
  record: IProcessRecord;
  onEdit: (record: IProcessRecord) => void;
  onDelete: (record: IProcessRecord) => void;
  isDragging?: boolean;
  className?: string;
}

export interface DroppableStateColumnProps {
  state: IProcessState;
  records: IProcessRecord[];
  onRecordCreate: () => void;
  onRecordMove: (recordId: string) => void;
  onStateEdit?: () => void;
  onStateDelete?: () => void;
  isDropTarget?: boolean;
  className?: string;
}

// Tipos para ProcessCard
export interface ProcessCardProps {
  process: IProcessRecord;
  onClick?: (process: IProcessRecord) => void;
  onEdit?: (process: IProcessRecord) => void;
  onDelete?: (process: IProcessRecord) => void;
  onStateChange?: (process: IProcessRecord, newState: string) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

// Tipos para StateColumn (Kanban)
export interface StateColumnProps {
  column: KanbanColumn;
  onDrop: (processId: string, newState: string) => void;
  onProcessClick?: (process: IProcessRecord) => void;
  className?: string;
}

// Tipos para ViewToggle
export interface ViewToggleOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface ViewToggleProps {
  options: ViewToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Tipos para Breadcrumb
export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

// Tipos para Sidebar
export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
  children?: SidebarItem[];
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

// Tipos para Header
export interface HeaderProps {
  title?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onUserMenuClick?: () => void;
  onNotificationsClick?: () => void;
  notificationCount?: number;
  className?: string;
}

// Tipos para Layout
export interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  header?: ReactNode;
  className?: string;
}

// Tipos para Form
export interface FormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode;
  className?: string;
}

export interface FormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

// Tipos para File Upload
export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onUpload: (files: File[]) => void;
  onError?: (error: string) => void;
  loading?: boolean;
  className?: string;
}

// Tipos para Progress
export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
}

// Tipos para Avatar
export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Tipos para Tooltip
export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}