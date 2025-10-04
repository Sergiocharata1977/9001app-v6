import mongoose from 'mongoose';
import { ProcessUnified } from '../models/ProcessUnified';
import { QualityObjective } from '../models/QualityObjective';
import { QualityIndicator } from '../models/QualityIndicator';
import { NormPoint } from '../models/NormPoint';

class ProcessUnifiedSeeder {
  private organizationId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'); // ID de organización de ejemplo

  async seed() {
    try {
      console.log('🌱 Iniciando seeder de procesos unificados...');

      // Verificar si ya existen datos
      const existingCount = await ProcessUnified.countDocuments();
      if (existingCount > 0) {
        console.log(`⚠️  Ya existen ${existingCount} procesos unificados. Omitiendo seeder.`);
        return;
      }

      // Obtener IDs de referencias existentes
      const objectives = await QualityObjective.find().limit(5);
      const indicators = await QualityIndicator.find().limit(5);
      const normPoints = await NormPoint.find().limit(5);

      console.log(`📊 Referencias encontradas - Objetivos: ${objectives.length}, Indicadores: ${indicators.length}, Puntos Norma: ${normPoints.length}`);

      // Datos de procesos unificados de ejemplo
      const processesData = [
        {
          code: 'PROC-2024-001',
          name: 'Gestión de Recursos Humanos',
          description: 'Proceso completo de reclutamiento, selección, desarrollo y gestión del personal',
          content: `
            <h2>🎯 Objetivos del Proceso</h2>
            <ul>
              <li>Reclutar y seleccionar personal calificado</li>
              <li>Desarrollar competencias del equipo</li>
              <li>Gestionar el rendimiento y motivación</li>
              <li>Asegurar cumplimiento normativo laboral</li>
            </ul>

            <h2>📋 Actividades Principales</h2>
            <ol>
              <li>Publicación de vacantes en diferentes canales</li>
              <li>Recepción y evaluación de CVs</li>
              <li>Entrevistas y evaluaciones técnicas</li>
              <li>Verificación de referencias</li>
              <li>Elaboración de ofertas de empleo</li>
              <li>Inducción y capacitación inicial</li>
            </ol>

            <h2>📊 Indicadores de Desempeño</h2>
            <ul>
              <li>Tiempo promedio de contratación: < 30 días</li>
              <li>Tasa de retención anual: > 85%</li>
              <li>Satisfacción del empleado: > 4.0/5.0</li>
            </ul>
          `,
          category: 'Recursos Humanos',
          type: 'operativo' as const,
          status: 'activo' as const,
          permite_registros: true,
          etapas_proceso: [
            {
              id: 'etapa-1',
              nombre: 'Iniciado',
              color: '#3B82F6',
              orden: 1,
              es_inicial: true,
              es_final: false,
              campos: [
                {
                  id: 'campo-1',
                  nombre: 'Tipo de Vacante',
                  tipo: 'select' as const,
                  opciones: ['Técnico', 'Administrativo', 'Directivo'],
                  requerido: true
                },
                {
                  id: 'campo-2',
                  nombre: 'Prioridad',
                  tipo: 'select' as const,
                  opciones: ['Baja', 'Media', 'Alta', 'Crítica'],
                  requerido: true
                }
              ]
            },
            {
              id: 'etapa-2',
              nombre: 'En Progreso',
              color: '#F59E0B',
              orden: 2,
              es_inicial: false,
              es_final: false,
              campos: [
                {
                  id: 'campo-3',
                  nombre: 'Candidatos Evaluados',
                  tipo: 'numero' as const,
                  requerido: false
                },
                {
                  id: 'campo-4',
                  nombre: 'Fecha Entrevista',
                  tipo: 'fecha' as const,
                  requerido: false
                }
              ]
            },
            {
              id: 'etapa-3',
              nombre: 'Completado',
              color: '#10B981',
              orden: 3,
              es_inicial: false,
              es_final: true,
              campos: [
                {
                  id: 'campo-5',
                  nombre: 'Fecha Contratación',
                  tipo: 'fecha' as const,
                  requerido: true
                },
                {
                  id: 'campo-6',
                  nombre: 'Salario Inicial',
                  tipo: 'numero' as const,
                  requerido: true
                }
              ]
            }
          ],
          registros: [
            {
              unique_code: 'REG-2024-001',
              title: 'Reclutamiento Desarrollador Senior Full Stack',
              description: 'Proceso de selección para puesto de desarrollador senior con experiencia en React, Node.js y bases de datos',
              current_state: 'En Progreso',
              priority: 'high' as const,
              progress_percentage: 65,
              custom_data: {
                tipo_vacante: 'Técnico',
                candidatos_evaluados: 12,
                fecha_entrevista: '2024-01-20'
              },
              checklist_items: [
                {
                  id: 'check-1',
                  description: 'Publicar vacante en LinkedIn',
                  completed: true,
                  completed_at: new Date('2024-01-15'),
                  completed_by: new mongoose.Types.ObjectId()
                },
                {
                  id: 'check-2',
                  description: 'Revisar CVs recibidos',
                  completed: true,
                  completed_at: new Date('2024-01-18'),
                  completed_by: new mongoose.Types.ObjectId()
                },
                {
                  id: 'check-3',
                  description: 'Realizar entrevistas técnicas',
                  completed: false
                }
              ],
              comments: [
                {
                  id: 'comment-1',
                  content: 'Se recibió buena cantidad de CVs calificados',
                  created_at: new Date('2024-01-16'),
                  created_by: new mongoose.Types.ObjectId(),
                  mentions: []
                }
              ],
              tags: ['desarrollo', 'fullstack', 'urgente'],
              responsible_user_id: new mongoose.Types.ObjectId(),
              assigned_users: [new mongoose.Types.ObjectId()],
              start_date: new Date('2024-01-15'),
              due_date: new Date('2024-02-15'),
              created_by: new mongoose.Types.ObjectId()
            },
            {
              unique_code: 'REG-2024-002',
              title: 'Contratación Especialista en Calidad',
              description: 'Selección de profesional para puesto de analista de calidad ISO 9001',
              current_state: 'Completado',
              priority: 'medium' as const,
              progress_percentage: 100,
              custom_data: {
                tipo_vacante: 'Técnico',
                fecha_contratacion: '2024-01-25',
                salario_inicial: 45000
              },
              checklist_items: [
                {
                  id: 'check-4',
                  description: 'Definir perfil del puesto',
                  completed: true,
                  completed_at: new Date('2024-01-10'),
                  completed_by: new mongoose.Types.ObjectId()
                },
                {
                  id: 'check-5',
                  description: 'Contratar candidato seleccionado',
                  completed: true,
                  completed_at: new Date('2024-01-25'),
                  completed_by: new mongoose.Types.ObjectId()
                }
              ],
              comments: [
                {
                  id: 'comment-2',
                  content: 'Candidato con excelente experiencia en ISO 9001',
                  created_at: new Date('2024-01-22'),
                  created_by: new mongoose.Types.ObjectId(),
                  mentions: []
                }
              ],
              tags: ['calidad', 'iso9001', 'especialista'],
              responsible_user_id: new mongoose.Types.ObjectId(),
              assigned_users: [new mongoose.Types.ObjectId()],
              start_date: new Date('2024-01-10'),
              due_date: new Date('2024-02-10'),
              completed_date: new Date('2024-01-25'),
              created_by: new mongoose.Types.ObjectId()
            }
          ],
          responsible_user_id: new mongoose.Types.ObjectId(),
          team_members: [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
          ],
          keywords: ['reclutamiento', 'selección', 'desarrollo', 'personal', 'RRHH'],
          estimated_duration: 45,
          frequency: 'Continuo',
          related_objectives: objectives.slice(0, 2).map(obj => obj._id),
          related_indicators: indicators.slice(0, 2).map(ind => ind._id),
          related_norm_points: normPoints.slice(0, 2).map(norm => norm._id),
          organization_id: this.organizationId,
          created_by: new mongoose.Types.ObjectId()
        },
        {
          code: 'PROC-2024-002',
          name: 'Control de Documentos',
          description: 'Gestión integral del ciclo de vida de documentos del sistema de calidad',
          content: `
            <h2>🎯 Objetivos del Proceso</h2>
            <ul>
              <li>Gestionar el ciclo de vida completo de documentos</li>
              <li>Asegurar versionado y trazabilidad</li>
              <li>Controlar acceso y distribución</li>
              <li>Mantener documentos actualizados y vigentes</li>
            </ul>

            <h2>📋 Actividades Principales</h2>
            <ol>
              <li>Creación y revisión de documentos</li>
              <li>Aprobación y autorización</li>
              <li>Distribución y publicación</li>
              <li>Control de versiones y cambios</li>
              <li>Archivo y disposición final</li>
            </ol>
          `,
          category: 'Calidad',
          type: 'apoyo' as const,
          status: 'activo' as const,
          permite_registros: true,
          etapas_proceso: [
            {
              id: 'etapa-doc-1',
              nombre: 'Borrador',
              color: '#6B7280',
              orden: 1,
              es_inicial: true,
              es_final: false,
              campos: [
                {
                  id: 'campo-doc-1',
                  nombre: 'Tipo Documento',
                  tipo: 'select' as const,
                  opciones: ['Procedimiento', 'Instrucción', 'Manual', 'Política'],
                  requerido: true
                }
              ]
            },
            {
              id: 'etapa-doc-2',
              nombre: 'Revisión',
              color: '#F59E0B',
              orden: 2,
              es_inicial: false,
              es_final: false,
              campos: [
                {
                  id: 'campo-doc-2',
                  nombre: 'Comentarios Revisión',
                  tipo: 'texto' as const,
                  requerido: false
                }
              ]
            },
            {
              id: 'etapa-doc-3',
              nombre: 'Aprobado',
              color: '#10B981',
              orden: 3,
              es_inicial: false,
              es_final: true,
              campos: [
                {
                  id: 'campo-doc-3',
                  nombre: 'Fecha Aprobación',
                  tipo: 'fecha' as const,
                  requerido: true
                }
              ]
            }
          ],
          registros: [
            {
              unique_code: 'REG-2024-003',
              title: 'Actualización Manual de Calidad v2.1',
              description: 'Revisión y actualización del manual del sistema de gestión de calidad',
              current_state: 'Revisión',
              priority: 'medium' as const,
              progress_percentage: 40,
              custom_data: {
                tipo_documento: 'Manual',
                comentarios_revision: 'Se requieren ajustes en el capítulo 4'
              },
              checklist_items: [
                {
                  id: 'check-doc-1',
                  description: 'Recopilar comentarios de revisión',
                  completed: true,
                  completed_at: new Date('2024-01-20'),
                  completed_by: new mongoose.Types.ObjectId()
                },
                {
                  id: 'check-doc-2',
                  description: 'Incorporar cambios solicitados',
                  completed: false
                }
              ],
              comments: [
                {
                  id: 'comment-doc-1',
                  content: 'Necesario actualizar referencias a nueva normativa ISO',
                  created_at: new Date('2024-01-18'),
                  created_by: new mongoose.Types.ObjectId(),
                  mentions: []
                }
              ],
              tags: ['manual', 'calidad', 'actualización'],
              responsible_user_id: new mongoose.Types.ObjectId(),
              assigned_users: [new mongoose.Types.ObjectId()],
              start_date: new Date('2024-01-15'),
              due_date: new Date('2024-02-15'),
              created_by: new mongoose.Types.ObjectId()
            }
          ],
          responsible_user_id: new mongoose.Types.ObjectId(),
          team_members: [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
          ],
          keywords: ['documentos', 'control', 'versionado', 'calidad', 'ISO9001'],
          estimated_duration: 30,
          frequency: 'Según necesidad',
          related_objectives: objectives.slice(1, 3).map(obj => obj._id),
          related_indicators: indicators.slice(1, 3).map(ind => ind._id),
          related_norm_points: normPoints.slice(1, 3).map(norm => norm._id),
          organization_id: this.organizationId,
          created_by: new mongoose.Types.ObjectId()
        },
        {
          code: 'PROC-2024-003',
          name: 'Desarrollo de Producto',
          description: 'Proceso completo de desarrollo de nuevos productos desde concepción hasta lanzamiento',
          content: `
            <h2>🎯 Objetivos del Proceso</h2>
            <ul>
              <li>Desarrollar productos innovadores y de calidad</li>
              <li>Optimizar tiempo de desarrollo y costos</li>
              <li>Asegurar cumplimiento de requisitos del cliente</li>
              <li>Minimizar riesgos en el lanzamiento</li>
            </ul>
          `,
          category: 'Producción',
          type: 'operativo' as const,
          status: 'activo' as const,
          permite_registros: true,
          etapas_proceso: [
            {
              id: 'etapa-prod-1',
              nombre: 'Ideación',
              color: '#8B5CF6',
              orden: 1,
              es_inicial: true,
              es_final: false,
              campos: []
            },
            {
              id: 'etapa-prod-2',
              nombre: 'Desarrollo',
              color: '#3B82F6',
              orden: 2,
              es_inicial: false,
              es_final: false,
              campos: []
            },
            {
              id: 'etapa-prod-3',
              nombre: 'Pruebas',
              color: '#F59E0B',
              orden: 3,
              es_inicial: false,
              es_final: false,
              campos: []
            },
            {
              id: 'etapa-prod-4',
              nombre: 'Lanzamiento',
              color: '#10B981',
              orden: 4,
              es_inicial: false,
              es_final: true,
              campos: []
            }
          ],
          registros: [
            {
              unique_code: 'REG-2024-004',
              title: 'Desarrollo Producto XYZ-2024',
              description: 'Nuevo producto electrónico con características innovadoras',
              current_state: 'Desarrollo',
              priority: 'high' as const,
              progress_percentage: 75,
              custom_data: {},
              checklist_items: [
                {
                  id: 'check-prod-1',
                  description: 'Completar diseño conceptual',
                  completed: true,
                  completed_at: new Date('2024-01-10'),
                  completed_by: new mongoose.Types.ObjectId()
                },
                {
                  id: 'check-prod-2',
                  description: 'Desarrollar prototipo funcional',
                  completed: true,
                  completed_at: new Date('2024-01-25'),
                  completed_by: new mongoose.Types.ObjectId()
                }
              ],
              comments: [
                {
                  id: 'comment-prod-1',
                  content: 'Prototipo superó expectativas de rendimiento',
                  created_at: new Date('2024-01-26'),
                  created_by: new mongoose.Types.ObjectId(),
                  mentions: []
                }
              ],
              tags: ['producto', 'innovación', 'desarrollo'],
              responsible_user_id: new mongoose.Types.ObjectId(),
              assigned_users: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
              start_date: new Date('2024-01-01'),
              due_date: new Date('2024-04-01'),
              created_by: new mongoose.Types.ObjectId()
            }
          ],
          responsible_user_id: new mongoose.Types.ObjectId(),
          team_members: [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
          ],
          keywords: ['producto', 'desarrollo', 'innovación', 'lanzamiento'],
          estimated_duration: 120,
          frequency: 'Por proyecto',
          related_objectives: objectives.slice(2, 4).map(obj => obj._id),
          related_indicators: indicators.slice(2, 4).map(ind => ind._id),
          related_norm_points: normPoints.slice(2, 4).map(norm => norm._id),
          organization_id: this.organizationId,
          created_by: new mongoose.Types.ObjectId()
        },
        {
          code: 'PROC-2024-004',
          name: 'Gestión de Proveedores',
          description: 'Evaluación, selección y gestión continua del desempeño de proveedores',
          content: `
            <h2>🎯 Objetivos del Proceso</h2>
            <ul>
              <li>Seleccionar proveedores confiables y competentes</li>
              <li>Evaluar y mejorar el desempeño de proveedores</li>
              <li>Optimizar costos y calidad de suministros</li>
            </ul>
          `,
          category: 'Compras',
          type: 'apoyo' as const,
          status: 'activo' as const,
          permite_registros: true,
          etapas_proceso: [
            {
              id: 'etapa-prov-1',
              nombre: 'Evaluación',
              color: '#6B7280',
              orden: 1,
              es_inicial: true,
              es_final: false,
              campos: []
            },
            {
              id: 'etapa-prov-2',
              nombre: 'Aprobado',
              color: '#10B981',
              orden: 2,
              es_inicial: false,
              es_final: true,
              campos: []
            }
          ],
          registros: [
            {
              unique_code: 'REG-2024-005',
              title: 'Evaluación Proveedor ABC Materials',
              description: 'Evaluación anual del proveedor de materiales electrónicos',
              current_state: 'Evaluación',
              priority: 'medium' as const,
              progress_percentage: 30,
              custom_data: {},
              checklist_items: [
                {
                  id: 'check-prov-1',
                  description: 'Revisar calidad de productos entregados',
                  completed: true,
                  completed_at: new Date('2024-01-15'),
                  completed_by: new mongoose.Types.ObjectId()
                }
              ],
              comments: [
                {
                  id: 'comment-prov-1',
                  content: 'Proveedor mantiene buen nivel de calidad',
                  created_at: new Date('2024-01-16'),
                  created_by: new mongoose.Types.ObjectId(),
                  mentions: []
                }
              ],
              tags: ['proveedor', 'evaluación', 'calidad'],
              responsible_user_id: new mongoose.Types.ObjectId(),
              assigned_users: [new mongoose.Types.ObjectId()],
              start_date: new Date('2024-01-10'),
              due_date: new Date('2024-01-31'),
              created_by: new mongoose.Types.ObjectId()
            }
          ],
          responsible_user_id: new mongoose.Types.ObjectId(),
          team_members: [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
          ],
          keywords: ['proveedores', 'evaluación', 'calidad', 'suministros'],
          estimated_duration: 15,
          frequency: 'Anual',
          related_objectives: objectives.slice(3, 5).map(obj => obj._id),
          related_indicators: indicators.slice(3, 5).map(ind => ind._id),
          related_norm_points: normPoints.slice(3, 5).map(norm => norm._id),
          organization_id: this.organizationId,
          created_by: new mongoose.Types.ObjectId()
        },
        {
          code: 'PROC-2024-005',
          name: 'Gestión de Ventas',
          description: 'Proceso completo de gestión comercial, desde prospección hasta cierre de ventas',
          content: `
            <h2>🎯 Objetivos del Proceso</h2>
            <ul>
              <li>Incrementar ventas y participación de mercado</li>
              <li>Optimizar el proceso de conversión de leads</li>
              <li>Mejorar satisfacción y retención de clientes</li>
            </ul>
          `,
          category: 'Ventas',
          type: 'operativo' as const,
          status: 'activo' as const,
          permite_registros: true,
          etapas_proceso: [
            {
              id: 'etapa-ventas-1',
              nombre: 'Prospección',
              color: '#3B82F6',
              orden: 1,
              es_inicial: true,
              es_final: false,
              campos: []
            },
            {
              id: 'etapa-ventas-2',
              nombre: 'Negociación',
              color: '#F59E0B',
              orden: 2,
              es_inicial: false,
              es_final: false,
              campos: []
            },
            {
              id: 'etapa-ventas-3',
              nombre: 'Cerrado',
              color: '#10B981',
              orden: 3,
              es_inicial: false,
              es_final: true,
              campos: []
            }
          ],
          registros: [
            {
              unique_code: 'REG-2024-006',
              title: 'Venta Mayorista - Empresa XYZ',
              description: 'Negociación de contrato anual con cliente mayorista',
              current_state: 'Negociación',
              priority: 'high' as const,
              progress_percentage: 80,
              custom_data: {},
              checklist_items: [
                {
                  id: 'check-ventas-1',
                  description: 'Presentar propuesta comercial',
                  completed: true,
                  completed_at: new Date('2024-01-12'),
                  completed_by: new mongoose.Types.ObjectId()
                },
                {
                  id: 'check-ventas-2',
                  description: 'Negociar términos y condiciones',
                  completed: true,
                  completed_at: new Date('2024-01-20'),
                  completed_by: new mongoose.Types.ObjectId()
                }
              ],
              comments: [
                {
                  id: 'comment-ventas-1',
                  content: 'Cliente interesado en condiciones especiales',
                  created_at: new Date('2024-01-18'),
                  created_by: new mongoose.Types.ObjectId(),
                  mentions: []
                }
              ],
              tags: ['ventas', 'mayorista', 'contrato'],
              responsible_user_id: new mongoose.Types.ObjectId(),
              assigned_users: [new mongoose.Types.ObjectId()],
              start_date: new Date('2024-01-10'),
              due_date: new Date('2024-02-10'),
              created_by: new mongoose.Types.ObjectId()
            }
          ],
          responsible_user_id: new mongoose.Types.ObjectId(),
          team_members: [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
          ],
          keywords: ['ventas', 'comercial', 'clientes', 'negociación'],
          estimated_duration: 60,
          frequency: 'Continuo',
          related_objectives: objectives.slice(0, 2).map(obj => obj._id),
          related_indicators: indicators.slice(0, 2).map(ind => ind._id),
          related_norm_points: normPoints.slice(0, 2).map(norm => norm._id),
          organization_id: this.organizationId,
          created_by: new mongoose.Types.ObjectId()
        }
      ];

      // Insertar procesos
      console.log('📝 Insertando procesos unificados...');
      const insertedProcesses = await ProcessUnified.insertMany(processesData);
      console.log(`✅ Insertados ${insertedProcesses.length} procesos unificados`);

      // Mostrar resumen
      for (const process of insertedProcesses) {
        const recordCount = process.registros.length;
        console.log(`   📋 ${process.code}: ${process.name} (${recordCount} registros)`);
      }

      console.log('🎉 Seeder completado exitosamente!');
      console.log('📊 Resumen:');
      console.log(`   - Procesos insertados: ${insertedProcesses.length}`);
      console.log(`   - Registros totales: ${insertedProcesses.reduce((sum, p) => sum + p.registros.length, 0)}`);
      console.log(`   - Etapas configuradas: ${insertedProcesses.reduce((sum, p) => sum + p.etapas_proceso.length, 0)}`);

    } catch (error) {
      console.error('❌ Error en el seeder:', error);
      throw error;
    }
  }
}

export const processUnifiedSeeder = new ProcessUnifiedSeeder();

// Ejecutar si se llama directamente
if (require.main === module) {
  require('dotenv').config();

  const mongoUri: string = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/9001app-v6';

  if (!mongoUri) {
    throw new Error('No se encontró una URI de MongoDB válida');
  }

  mongoose.connect(mongoUri)
  .then(async () => {
    console.log('✅ Conectado a MongoDB');
    await processUnifiedSeeder.seed();
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  })
  .catch((error) => {
    console.error('❌ Error de conexión:', error);
    process.exit(1);
  });
}