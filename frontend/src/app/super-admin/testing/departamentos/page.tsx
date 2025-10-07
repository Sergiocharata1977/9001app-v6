'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Camera,
  BookOpen,
  Download,
  Users,
  Settings
} from 'lucide-react';

export default function DepartamentosTestingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Building2 className="h-8 w-8 text-blue-500" />
          Testing - Departamentos RRHH
        </h1>
        <p className="text-gray-600 mt-2">
          Resultados detallados del testing automático del módulo de Departamentos
        </p>
      </div>

      <Tabs defaultValue="resumen" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="funcionalidades">Funcionalidades</TabsTrigger>
          <TabsTrigger value="capturas">Capturas</TabsTrigger>
          <TabsTrigger value="casos">Casos de Uso</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Testing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">10</div>
                  <div className="text-sm text-gray-600">Tests Pasados</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">0</div>
                  <div className="text-sm text-gray-600">Tests Fallidos</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Camera className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">10</div>
                  <div className="text-sm text-gray-600">Screenshots</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">6</div>
                  <div className="text-sm text-gray-600">Funcionalidades</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tecnologías Utilizadas:</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Playwright</Badge>
                  <Badge>Next.js 14</Badge>
                  <Badge>React</Badge>
                  <Badge>Tailwind CSS</Badge>
                  <Badge>MongoDB</Badge>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">Nota Importante</h3>
                </div>
                <p className="text-yellow-700 text-sm">
                  El componente DepartmentListing no fue encontrado durante el testing, 
                  lo que indica que puede estar en desarrollo. La página base está funcional.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funcionalidades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades Testeadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {[
                  { nombre: 'Carga de Página', estado: 'Funcional', descripcion: 'Navegación a /rrhh/departamentos' },
                  { nombre: 'Estructura Básica', estado: 'Funcional', descripcion: '4 botones/enlaces encontrados' },
                  { nombre: 'Responsive Design', estado: 'Funcional', descripcion: 'Adaptación móvil verificada' },
                  { nombre: 'Navegación', estado: 'Funcional', descripcion: 'Enlaces internos verificados' },
                  { nombre: 'Formularios', estado: 'En Desarrollo', descripcion: '0 formularios encontrados' },
                  { nombre: 'Componente Listing', estado: 'En Desarrollo', descripcion: 'DepartmentListing no encontrado' }
                ].map((func, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{func.nombre}</div>
                      <div className="text-sm text-gray-600">{func.descripcion}</div>
                    </div>
                    <Badge className={
                      func.estado === 'Funcional' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }>{func.estado}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capturas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Screenshots del Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  'Página Principal',
                  'Estadísticas', 
                  'Componente Listing',
                  'Estructura',
                  'Funcionalidades CRUD',
                  'Responsables',
                  'Estados',
                  'Vista Móvil',
                  'Navegación',
                  'Formularios'
                ].map((nombre, index) => (
                  <div key={index} className="border rounded-lg p-4 text-center">
                    <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="text-sm font-medium">{nombre}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="casos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Casos de Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 'CU-DEPT-001',
                    titulo: 'Verificar carga de página principal',
                    pasos: ['Navegar a /rrhh/departamentos', 'Verificar título "Departamentos"', 'Verificar carga completa']
                  },
                  {
                    id: 'CU-DEPT-002', 
                    titulo: 'Verificar estructura básica',
                    pasos: ['Verificar elementos de la página', 'Contar botones y enlaces', 'Verificar navegación']
                  },
                  {
                    id: 'CU-DEPT-003',
                    titulo: 'Verificar responsive design',
                    pasos: ['Cambiar a vista móvil', 'Verificar adaptación', 'Probar navegación móvil']
                  },
                  {
                    id: 'CU-DEPT-004',
                    titulo: 'Verificar funcionalidades CRUD',
                    pasos: ['Buscar elementos de creación', 'Verificar elementos de edición', 'Verificar elementos de eliminación']
                  },
                  {
                    id: 'CU-DEPT-005',
                    titulo: 'Verificar gestión de responsables',
                    pasos: ['Buscar elementos de responsables', 'Verificar asignación', 'Verificar jerarquía']
                  },
                  {
                    id: 'CU-DEPT-006',
                    titulo: 'Verificar estado activo/inactivo',
                    pasos: ['Buscar controles de estado', 'Verificar activación', 'Verificar desactivación']
                  }
                ].map((caso, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{caso.id}</Badge>
                      <div className="font-medium">{caso.titulo}</div>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                      {caso.pasos.map((paso, i) => (
                        <li key={i}>{paso}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual de Usuario - Departamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">1. Acceso al Módulo</h3>
                  <p className="text-gray-600">Navegue a Recursos Humanos > Departamentos desde el menú principal.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Estado Actual</h3>
                  <p className="text-gray-600">El módulo de Departamentos está en desarrollo. La página base está funcional pero el componente de gestión principal (DepartmentListing) aún no está implementado.</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3. Funcionalidades Disponibles</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Navegación a la página de departamentos</li>
                    <li>Visualización de la estructura básica</li>
                    <li>Adaptación responsive para móviles</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">4. Próximas Funcionalidades</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Crear nuevos departamentos</li>
                    <li>Editar departamentos existentes</li>
                    <li>Eliminar departamentos</li>
                    <li>Asignar responsables</li>
                    <li>Gestionar estado activo/inactivo</li>
                    <li>Estadísticas departamentales</li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Descargar Manual PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

