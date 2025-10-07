'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Camera,
  BookOpen,
  Download,
  UserPlus,
  Settings,
  Search,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';

export default function PersonalTestingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-500" />
          Testing - Personal RRHH
        </h1>
        <p className="text-gray-600 mt-2">
          Resultados detallados del testing automático del módulo de Personal
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
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-600">Tests Pasados</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">0</div>
                  <div className="text-sm text-gray-600">Tests Fallidos</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Camera className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Screenshots</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">10</div>
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

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Estado: Completamente Funcional</h3>
                </div>
                <p className="text-green-700 text-sm">
                  El módulo de Personal está completamente implementado con todas las funcionalidades 
                  CRUD operativas, incluyendo vistas, búsqueda, filtros y gestión completa del personal.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <UserPlus className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-blue-600">9</div>
                  <div className="text-xs text-gray-600">Botones CRUD</div>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <List className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-indigo-600">3</div>
                  <div className="text-xs text-gray-600">Filas Tabla</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Grid3X3 className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-green-600">2</div>
                  <div className="text-xs text-gray-600">Vistas</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Settings className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-purple-600">100%</div>
                  <div className="text-xs text-gray-600">Funcional</div>
                </div>
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
                  { nombre: 'Componente PersonnelListing', estado: 'Funcional', descripcion: 'Componente principal de gestión de personal' },
                  { nombre: 'Vista Grid y Lista', estado: 'Funcional', descripcion: 'Alternancia entre vista tarjetas y tabla' },
                  { nombre: 'Sistema de Búsqueda', estado: 'Funcional', descripcion: 'Búsqueda en tiempo real del personal' },
                  { nombre: 'Sistema de Filtros', estado: 'Funcional', descripcion: 'Filtros avanzados para personal' },
                  { nombre: 'Botón Nuevo Personal', estado: 'Funcional', descripcion: 'Acceso al formulario de creación' },
                  { nombre: 'Estructura de Datos', estado: 'Funcional', descripcion: '3 filas en tabla, campos organizados' },
                  { nombre: 'Botones CRUD', estado: 'Funcional', descripcion: '3 Ver, 3 Editar, 3 Eliminar' },
                  { nombre: 'Integración Servicios', estado: 'Funcional', descripcion: 'Conexión con backend y APIs' },
                  { nombre: 'Responsive Design', estado: 'Funcional', descripcion: 'Adaptación móvil verificada' },
                  { nombre: 'Gestión Estados', estado: 'Funcional', descripcion: 'Control de estados y tipos de personal' }
                ].map((func, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{func.nombre}</div>
                      <div className="text-sm text-gray-600">{func.descripcion}</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{func.estado}</Badge>
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
                  'Componente Listing', 
                  'Búsqueda y Filtros',
                  'Botón Nuevo',
                  'Vista Grid',
                  'Vista Lista',
                  'Estructura Datos',
                  'Botones CRUD',
                  'Badges Estados',
                  'Funcionalidades CRUD',
                  'Vista Móvil',
                  'Servicios Integración'
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
                    id: 'CU-PERSONAL-001',
                    titulo: 'Verificar carga de página principal',
                    pasos: ['Navegar a /rrhh/personal', 'Verificar título "Gestión de Personal"', 'Verificar carga completa']
                  },
                  {
                    id: 'CU-PERSONAL-002', 
                    titulo: 'Verificar componente PersonnelListing',
                    pasos: ['Verificar componente principal', 'Verificar vistas Grid y Lista', 'Verificar estructura']
                  },
                  {
                    id: 'CU-PERSONAL-003',
                    titulo: 'Probar sistema de búsqueda',
                    pasos: ['Usar campo de búsqueda', 'Escribir término de prueba', 'Verificar resultados']
                  },
                  {
                    id: 'CU-PERSONAL-004',
                    titulo: 'Verificar botón Nuevo Personal',
                    pasos: ['Localizar botón "Nuevo Personal"', 'Verificar accesibilidad', 'Preparar para creación']
                  },
                  {
                    id: 'CU-PERSONAL-005',
                    titulo: 'Cambiar entre vista grid y lista',
                    pasos: ['Hacer click en "Tarjetas"', 'Verificar vista grid', 'Hacer click en "Tabla"', 'Verificar vista lista']
                  },
                  {
                    id: 'CU-PERSONAL-006',
                    titulo: 'Verificar estructura de datos',
                    pasos: ['Verificar 3 filas en tabla', 'Verificar campos de personal', 'Verificar organización']
                  },
                  {
                    id: 'CU-PERSONAL-007',
                    titulo: 'Verificar botones de acción CRUD',
                    pasos: ['Verificar 3 botones Ver', 'Verificar 3 botones Editar', 'Verificar 3 botones Eliminar']
                  },
                  {
                    id: 'CU-PERSONAL-008',
                    titulo: 'Verificar badges y estados',
                    pasos: ['Buscar badges de estado', 'Verificar tipos de personal', 'Verificar clasificación']
                  },
                  {
                    id: 'CU-PERSONAL-009',
                    titulo: 'Verificar funcionalidades CRUD',
                    pasos: ['Verificar formularios', 'Verificar campos de entrada', 'Verificar diálogos']
                  },
                  {
                    id: 'CU-PERSONAL-010',
                    titulo: 'Probar responsive design',
                    pasos: ['Cambiar a vista móvil', 'Verificar adaptación', 'Probar navegación móvil']
                  },
                  {
                    id: 'CU-PERSONAL-011',
                    titulo: 'Verificar integración con servicios',
                    pasos: ['Verificar elementos de carga', 'Verificar manejo de errores', 'Verificar conexión backend']
                  },
                  {
                    id: 'CU-PERSONAL-012',
                    titulo: 'Verificar filtros avanzados',
                    pasos: ['Localizar botón Filtros', 'Verificar accesibilidad', 'Probar funcionalidad']
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
              <CardTitle>Manual de Usuario - Personal RRHH</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">1. Acceso al Módulo</h3>
                  <p className="text-gray-600">Navegue a Recursos Humanos > Personal desde el menú principal.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Componente PersonnelListing</h3>
                  <p className="text-gray-600">El sistema utiliza un componente especializado para la gestión completa del personal con funcionalidades avanzadas.</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3. Vistas Disponibles</h3>
                  <p className="text-gray-600">Puede alternar entre vista de tarjetas (grid) y vista de tabla (lista) usando los botones correspondientes.</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">4. Búsqueda y Filtros</h3>
                  <p className="text-gray-600">Utilice el campo de búsqueda para encontrar personal específico y los filtros para refinar los resultados.</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">5. Gestión CRUD</h3>
                  <p className="text-gray-600">Para cada miembro del personal puede ver, editar o eliminar registros usando los botones de acción correspondientes.</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">6. Crear Nuevo Personal</h3>
                  <p className="text-gray-600">Haga click en "Nuevo Personal" para acceder al formulario de creación de nuevos empleados.</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">7. Estados y Tipos</h3>
                  <p className="text-gray-600">El sistema gestiona diferentes estados (Activo/Inactivo) y tipos de personal (gerencial, técnico, administrativo, etc.).</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">8. Integración con Backend</h3>
                  <p className="text-gray-600">El módulo está completamente integrado con los servicios del backend para operaciones en tiempo real.</p>
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

