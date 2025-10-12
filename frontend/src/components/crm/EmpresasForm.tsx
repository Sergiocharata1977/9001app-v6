import ABMBase from '@/components/ABM/ABMBase';
import React from 'react';

// Campos específicos para Empresas
const empresasFields = [
  {
    name: 'nombre',
    label: 'Nombre de la Empresa',
    type: 'text' as const,
    required: true,
    placeholder: 'Empresa S.A.'
  },
  {
    name: 'cuit',
    label: 'CUIT',
    type: 'text' as const,
    required: true,
    placeholder: '20-12345678-9'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email' as const,
    required: true,
    placeholder: 'contacto@empresa.com'
  },
  {
    name: 'telefono',
    label: 'Teléfono',
    type: 'text' as const,
    placeholder: '+54 11 1234-5678'
  },
  {
    name: 'direccion',
    label: 'Dirección',
    type: 'text' as const,
    placeholder: 'Av. Corrientes 1234, CABA'
  },
  {
    name: 'ciudad',
    label: 'Ciudad',
    type: 'text' as const,
    placeholder: 'Buenos Aires'
  },
  {
    name: 'provincia',
    label: 'Provincia',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'buenos_aires', label: 'Buenos Aires' },
      { value: 'capital_federal', label: 'Capital Federal' },
      { value: 'cordoba', label: 'Córdoba' },
      { value: 'santa_fe', label: 'Santa Fe' },
      { value: 'mendoza', label: 'Mendoza' },
      { value: 'tucuman', label: 'Tucumán' },
      { value: 'otro', label: 'Otra' }
    ]
  },
  {
    name: 'codigo_postal',
    label: 'Código Postal',
    type: 'text' as const,
    placeholder: '1000'
  },
  {
    name: 'sector',
    label: 'Sector',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'tecnologia', label: 'Tecnología' },
      { value: 'manufactura', label: 'Manufactura' },
      { value: 'servicios', label: 'Servicios' },
      { value: 'comercio', label: 'Comercio' },
      { value: 'construccion', label: 'Construcción' },
      { value: 'salud', label: 'Salud' },
      { value: 'educacion', label: 'Educación' },
      { value: 'finanzas', label: 'Finanzas' },
      { value: 'otro', label: 'Otro' }
    ]
  },
  {
    name: 'tamaño',
    label: 'Tamaño de la Empresa',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'micro', label: 'Micro (1-10 empleados)' },
      { value: 'pequeña', label: 'Pequeña (11-50 empleados)' },
      { value: 'mediana', label: 'Mediana (51-200 empleados)' },
      { value: 'grande', label: 'Grande (200+ empleados)' }
    ]
  },
  {
    name: 'fecha_registro',
    label: 'Fecha de Registro',
    type: 'date' as const,
    required: true
  },
  {
    name: 'estado',
    label: 'Estado',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'activo', label: 'Activo' },
      { value: 'inactivo', label: 'Inactivo' },
      { value: 'prospecto', label: 'Prospecto' },
      { value: 'cliente', label: 'Cliente' },
      { value: 'ex_cliente', label: 'Ex Cliente' }
    ]
  },
  {
    name: 'observaciones',
    label: 'Observaciones',
    type: 'textarea' as const,
    placeholder: 'Notas adicionales sobre la empresa...'
  }
];

interface EmpresasFormProps {
  mode: 'create' | 'edit' | 'view';
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string;
}

export const EmpresasForm: React.FC<EmpresasFormProps> = ({
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
        return 'Nueva Empresa';
      case 'edit':
        return 'Editar Empresa';
      case 'view':
        return 'Ver Empresa';
      default:
        return 'Empresa';
    }
  };

  return (
    <ABMBase
      title={getTitle()}
      fields={empresasFields}
      endpoint="/crm/empresas"
      onSave={onSave}
      onCancel={onCancel}
      mode={mode}
      initialData={initialData}
      loading={loading}
      error={error}
    />
  );
};

export default EmpresasForm;



