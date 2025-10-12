'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Assets, Maquinaria, Propiedad, Vehiculo } from '@/types/legajo';
import { Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface AssetsFormProps {
  initialData?: Assets;
  onSubmit: (data: Assets) => void;
  onCancel?: () => void;
}

/**
 * Formulario para gestionar activos patrimoniales
 */
const AssetsForm: React.FC<AssetsFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [properties, setProperties] = useState<Propiedad[]>(initialData?.properties || []);
  const [vehicles, setVehicles] = useState<Vehiculo[]>(initialData?.vehicles || []);
  const [machinery, setMachinery] = useState<Maquinaria[]>(initialData?.machinery || []);

  // Estado para nuevo item
  const [newProperty, setNewProperty] = useState<Partial<Propiedad>>({});
  const [newVehicle, setNewVehicle] = useState<Partial<Vehiculo>>({});
  const [newMachine, setNewMachine] = useState<Partial<Maquinaria>>({});

  // Agregar propiedad
  const addProperty = () => {
    if (!newProperty.address || !newProperty.valuation) return;
    
    setProperties([...properties, {
      ...newProperty,
      address: newProperty.address!,
      usage: newProperty.usage || 'agricultura',
      ownership: newProperty.ownership || 'propio',
      valuation: newProperty.valuation!,
      type: newProperty.type || 'rural'
    } as Propiedad]);
    
    setNewProperty({});
  };

  // Eliminar propiedad
  const removeProperty = (index: number) => {
    setProperties(properties.filter((_, i) => i !== index));
  };

  // Agregar vehículo
  const addVehicle = () => {
    if (!newVehicle.brand || !newVehicle.model || !newVehicle.valor) return;
    
    setVehicles([...vehicles, {
      ...newVehicle,
      brand: newVehicle.brand!,
      model: newVehicle.model!,
      year: newVehicle.year || new Date().getFullYear(),
      valor: newVehicle.valor!,
      type: newVehicle.type || 'auto',
      usage: newVehicle.usage || 'comercial'
    } as Vehiculo]);
    
    setNewVehicle({});
  };

  // Eliminar vehículo
  const removeVehicle = (index: number) => {
    setVehicles(vehicles.filter((_, i) => i !== index));
  };

  // Agregar maquinaria
  const addMachine = () => {
    if (!newMachine.brand || !newMachine.model || !newMachine.valor) return;
    
    setMachinery([...machinery, {
      ...newMachine,
      brand: newMachine.brand!,
      model: newMachine.model!,
      year: newMachine.year || new Date().getFullYear(),
      valor: newMachine.valor!,
      type: newMachine.type || 'tractor',
      condition: newMachine.condition || 'bueno'
    } as Maquinaria]);
    
    setNewMachine({});
  };

  // Eliminar maquinaria
  const removeMachine = (index: number) => {
    setMachinery(machinery.filter((_, i) => i !== index));
  };

  // Calcular total
  const totalValue = 
    properties.reduce((sum, p) => sum + p.valuation, 0) +
    vehicles.reduce((sum, v) => sum + v.valor, 0) +
    machinery.reduce((sum, m) => sum + m.valor, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assets: Assets = {
      properties,
      vehicles,
      machinery
    };
    
    onSubmit(assets);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resumen Total */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Valor Total de Activos Patrimoniales</p>
            <p className="text-3xl font-bold text-green-600">
              ${totalValue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {properties.length} propiedades · {vehicles.length} vehículos · {machinery.length} maquinarias
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs por tipo de activo */}
      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="properties">Propiedades ({properties.length})</TabsTrigger>
          <TabsTrigger value="vehicles">Vehículos ({vehicles.length})</TabsTrigger>
          <TabsTrigger value="machinery">Maquinaria ({machinery.length})</TabsTrigger>
        </TabsList>

        {/* Tab Propiedades */}
        <TabsContent value="properties" className="space-y-4">
          {/* Lista de propiedades */}
          {properties.map((prop, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{prop.nombre || prop.address}</h4>
                    <p className="text-sm text-muted-foreground">{prop.address}</p>
                    <p className="text-sm mt-1">
                      Valuación: <span className="font-medium">${prop.valuation.toLocaleString()}</span>
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProperty(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Formulario agregar propiedad */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Agregar Propiedad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Dirección"
                  value={newProperty.address || ''}
                  onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Valuación"
                  value={newProperty.valuation || ''}
                  onChange={(e) => setNewProperty({...newProperty, valuation: parseFloat(e.target.value)})}
                />
              </div>
              <Button type="button" onClick={addProperty} size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Propiedad
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Vehículos */}
        <TabsContent value="vehicles" className="space-y-4">
          {vehicles.map((veh, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{veh.brand} {veh.model}</h4>
                    <p className="text-sm text-muted-foreground">Año {veh.year}</p>
                    <p className="text-sm mt-1">
                      Valor: <span className="font-medium">${veh.valor.toLocaleString()}</span>
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVehicle(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Agregar Vehículo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Marca"
                  value={newVehicle.brand || ''}
                  onChange={(e) => setNewVehicle({...newVehicle, brand: e.target.value})}
                />
                <Input
                  placeholder="Modelo"
                  value={newVehicle.model || ''}
                  onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Valor"
                  value={newVehicle.valor || ''}
                  onChange={(e) => setNewVehicle({...newVehicle, valor: parseFloat(e.target.value)})}
                />
              </div>
              <Button type="button" onClick={addVehicle} size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Vehículo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Maquinaria */}
        <TabsContent value="machinery" className="space-y-4">
          {machinery.map((maq, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{maq.brand} {maq.model}</h4>
                    <p className="text-sm text-muted-foreground">Tipo: {maq.type}</p>
                    <p className="text-sm mt-1">
                      Valor: <span className="font-medium">${maq.valor.toLocaleString()}</span>
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMachine(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Agregar Maquinaria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Marca"
                  value={newMachine.brand || ''}
                  onChange={(e) => setNewMachine({...newMachine, brand: e.target.value})}
                />
                <Input
                  placeholder="Modelo"
                  value={newMachine.model || ''}
                  onChange={(e) => setNewMachine({...newMachine, model: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Valor"
                  value={newMachine.valor || ''}
                  onChange={(e) => setNewMachine({...newMachine, valor: parseFloat(e.target.value)})}
                />
              </div>
              <Button type="button" onClick={addMachine} size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Maquinaria
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botones finales */}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">
          Guardar Activos
        </Button>
      </div>
    </form>
  );
};

export default AssetsForm;

