import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Eye, Loader2, Save, X } from 'lucide-react';
import React, { useState } from 'react';

// Tipos para el componente base ABM
interface Field {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'date';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface ABMBaseProps {
  title: string;
  fields: Field[];
  endpoint: string;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  mode: 'create' | 'edit' | 'view';
  initialData?: any;
  loading?: boolean;
  error?: string;
}

export const ABMBase: React.FC<ABMBaseProps> = ({
  title,
  fields,
  endpoint,
  onSave,
  onCancel,
  mode,
  initialData = {},
  loading = false,
  error
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Manejar cambios en el formulario
  const handleChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Limpiar error del campo
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} es requerido`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSave(formData);
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  // Renderizar campo según tipo
  const renderField = (field: Field) => {
    const value = formData[field.name] || '';
    const hasError = !!errors[field.name];
    
    switch (field.type) {
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(val) => handleChange(field.name, val)}
            disabled={mode === 'view'}
          >
            <SelectTrigger className={hasError ? 'border-red-500' : ''}>
              <SelectValue placeholder={field.placeholder || `Selecciona ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={mode === 'view'}
            className={hasError ? 'border-red-500' : ''}
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            disabled={mode === 'view'}
            className={hasError ? 'border-red-500' : ''}
          />
        );
      
      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={mode === 'view'}
            className={hasError ? 'border-red-500' : ''}
          />
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {mode === 'create' && <Save className="h-5 w-5" />}
          {mode === 'edit' && <Edit className="h-5 w-5" />}
          {mode === 'view' && <Eye className="h-5 w-5" />}
          {title}
        </CardTitle>
        <Separator />
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(field => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              {renderField(field)}
              
              {errors[field.name] && (
                <p className="text-sm text-red-500">{errors[field.name]}</p>
              )}
            </div>
          ))}
          
          <Separator className="my-6" />
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            
            {mode !== 'view' && (
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {mode === 'create' ? 'Crear' : 'Actualizar'}
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ABMBase;



