import ABMBase from '@/components/ABM/ABMBase';
import React from 'react';

// Campos específicos para Personal
const personalFields = [
  {
    name: 'nombre',
    label: 'Nombre',
    type: 'text' as const,
    required: true,
    placeholder: 'Ingrese el nombre completo'
  },
  {
    name: 'apellido',
    label: 'Apellido',
    type: 'text' as const,
    required: true,
    placeholder: 'Ingrese el apellido'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email' as const,
    required: true,
    placeholder: 'correo@empresa.com'
  },
  {
    name: 'telefono',
    label: 'Teléfono',
    type: 'text' as const,
    placeholder: '+54 9 11 1234-5678'
  },
  {
    name: 'departamento',
    label: 'Departamento',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'rrhh', label: 'Recursos Humanos' },
      { value: 'ventas', label: 'Ventas' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'it', label: 'Tecnología' },
      { value: 'finanzas', label: 'Finanzas' },
      { value: 'operaciones', label: 'Operaciones' }
    ]
  },
  {
    name: 'puesto',
    label: 'Puesto',
    type: 'text' as const,
    required: true,
    placeholder: 'Desarrollador Frontend'
  },
  {
    name: 'fecha_ingreso',
    label: 'Fecha de Ingreso',
    type: 'date' as const,
    required: true
  },
  {
    name: 'salario',
    label: 'Salario',
    type: 'number' as const,
    placeholder: '50000'
  },
  {
    name: 'estado',
    label: 'Estado',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'activo', label: 'Activo' },
      { value: 'inactivo', label: 'Inactivo' },
      { value: 'vacaciones', label: 'En Vacaciones' },
      { value: 'licencia', label: 'En Licencia' }
    ]
  },
  {
    name: 'observaciones',
    label: 'Observaciones',
    type: 'textarea' as const,
    placeholder: 'Notas adicionales sobre el empleado...'
  }
];

interface PersonalFormProps {
  mode: 'create' | 'edit' | 'view';
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string;
}

export const PersonalForm: React.FC<PersonalFormProps> = ({
  mode,
  initialData,
  onSave,
  onCancel,
  loading,
  error
}) => {
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Nuevo Empleado';
      case 'edit':
        return 'Editar Empleado';
      case 'view':
        return 'Ver Empleado';
      default:
        return 'Empleado';
    }
  };

  return (
    <ABMBase
      title={getTitle()}
      fields={personalFields}
      endpoint="/rrhh/personal"
      onSave={onSave}
      onCancel={onCancel}
      mode={mode}
      initialData={initialData}
      loading={loading}
      error={error}
    />
  );
};

export default PersonalForm;



