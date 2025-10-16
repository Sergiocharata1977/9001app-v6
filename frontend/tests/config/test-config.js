/**
 * 🧪 CONFIGURACIÓN CENTRALIZADA DE TESTING
 * 
 * Configuración estándar para todos los tests del sistema 9001app v6
 */

// Configuración de navegador
export const BROWSER_CONFIG = {
  headless: false,           // Para ver qué pasa durante los tests
  slowMo: 100,              // 100ms entre acciones
  timeout: 15000,           // 15 segundos timeout general
  viewport: { width: 1280, height: 720 }
};

// Configuración de URLs
export const URLS = {
  base: 'http://localhost:3000',
  dashboard: '/dashboard',
  superAdmin: '/super-admin',
  crm: '/crm',
  rrhh: '/rrhh',
  calidad: '/calidad',
  procesos: '/procesos',
  auditorias: '/auditorias',
  documentos: '/documentos',
  normas: '/normas'
};

// Selectores estándar para testing
export const SELECTORS = {
  // Botones de acción
  crear: '[data-testid="btn-crear"], button:has-text("Nuevo"), button:has-text("Crear")',
  editar: '[data-testid="btn-editar"] >> nth=0, button:has-text("Editar") >> nth=0',
  eliminar: '[data-testid="btn-eliminar"] >> nth=0, button:has-text("Eliminar") >> nth=0',
  guardar: '[data-testid="btn-guardar"], button:has-text("Guardar"), button:has-text("Guardar cambios")',
  cancelar: '[data-testid="btn-cancelar"], button:has-text("Cancelar")',
  
  // Listas y contenido
  lista: '[data-testid="lista-items"], table tbody tr, .grid > div',
  items: '[data-testid="item"], tr, .space-y-4 > div',
  
  // Modales
  modal: '[role="dialog"], .modal, [data-testid="modal"]',
  modalCrear: '[data-testid="modal-crear"]',
  modalEditar: '[data-testid="modal-editar"]',
  
  // Formularios
  formulario: '[data-testid="formulario"], form',
  input: 'input, textarea, select',
  
  // Navegación
  menu: 'nav, [data-testid="menu"]',
  breadcrumb: '[data-testid="breadcrumb"]',
  
  // Loading states
  loading: '[data-testid="loading"], .loading, .spinner',
  error: '[data-testid="error"], .error',
  success: '[data-testid="success"], .success'
};

// Umbrales de velocidad optimizados
export const UMBRALES_VELOCIDAD = {
  excelente: 500,    // < 500ms - Súper rápido
  bueno: 1000,       // 500-1000ms - Bueno
  aceptable: 2000,   // 1-2s - Aceptable
  lento: 3000,       // 2-3s - Lento
  critico: 5000      // > 3s - Crítico
};

// Configuración de timeouts por operación
export const TIMEOUTS = {
  navegacion: 10000,     // 10s para navegar entre páginas
  carga: 8000,           // 8s para cargar contenido
  interaccion: 5000,     // 5s para clicks y formularios
  api: 10000,            // 10s para llamadas API
  modal: 3000            // 3s para abrir/cerrar modales
};

// Configuración de esperas inteligentes
export const ESPERAS = {
  elementoVisible: 3000,
  elementoClickable: 2000,
  contenidoCargado: 5000,
  redIdle: 2000
};

// Módulos del sistema
export const MODULOS = {
  RRHH: [
    { nombre: 'Departamentos', url: '/rrhh/departamentos' },
    { nombre: 'Puestos', url: '/rrhh/puestos' },
    { nombre: 'Personal', url: '/rrhh/personal' },
    { nombre: 'Capacitaciones', url: '/rrhh/capacitaciones' },
    { nombre: 'Evaluaciones', url: '/rrhh/evaluaciones' }
  ],
  CRM: [
    { nombre: 'Dashboard', url: '/crm' },
    { nombre: 'Empresas', url: '/crm/empresas' },
    { nombre: 'Contactos', url: '/crm/contactos' },
    { nombre: 'Oportunidades', url: '/crm/oportunidades' },
    { nombre: 'Actividades', url: '/crm/actividades' },
    { nombre: 'Análisis de Riesgo', url: '/crm/analisis-riesgo' },
    { nombre: 'Legajos', url: '/crm/legajos' }
  ],
  DOCUMENTOS: [
    { nombre: 'Documentos', url: '/documentos' },
    { nombre: 'Categorías', url: '/documentos/categorias' }
  ],
  AUDITORIAS: [
    { nombre: 'Auditorías', url: '/auditorias' },
    { nombre: 'Hallazgos', url: '/hallazgos' },
    { nombre: 'Acciones', url: '/acciones' }
  ],
  SUPER_ADMIN: [
    { nombre: 'Dashboard', url: '/super-admin' },
    { nombre: 'CRM Single', url: '/super-admin/modulos/crm' },
    { nombre: 'RRHH Single', url: '/super-admin/modulos/rrhh' },
    { nombre: 'Procesos Single', url: '/super-admin/modulos/procesos' },
    { nombre: 'Auditorías Single', url: '/super-admin/modulos/auditorias' },
    { nombre: 'Normas Single', url: '/super-admin/modulos/normas' },
    { nombre: 'Documentos Single', url: '/super-admin/modulos/documentos' },
    { nombre: 'Calidad Single', url: '/super-admin/modulos/calidad' }
  ]
};

// Funciones helper para testing
export const TEST_HELPERS = {
  // Clasificar velocidad
  clasificarVelocidad: (tiempo) => {
    if (tiempo < UMBRALES_VELOCIDAD.excelente) return { nivel: 'EXCELENTE', emoji: '🚀', color: 'green' };
    if (tiempo < UMBRALES_VELOCIDAD.bueno) return { nivel: 'BUENO', emoji: '✅', color: 'blue' };
    if (tiempo < UMBRALES_VELOCIDAD.aceptable) return { nivel: 'ACEPTABLE', emoji: '⚠️', color: 'yellow' };
    if (tiempo < UMBRALES_VELOCIDAD.lento) return { nivel: 'LENTO', emoji: '🐌', color: 'orange' };
    return { nivel: 'CRÍTICO', emoji: '🔴', color: 'red' };
  },
  
  // Esperar elemento de forma inteligente
  esperarElemento: async (page, selector, timeout = ESPERAS.elementoVisible) => {
    try {
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      return false;
    }
  },
  
  // Verificar si elemento está habilitado
  elementoHabilitado: async (page, selector) => {
    try {
      const elemento = await page.locator(selector).first();
      return await elemento.isEnabled();
    } catch (error) {
      return false;
    }
  },
  
  // Generar timestamp para reportes
  generarTimestamp: () => {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }
};

// Configuración de reportes
export const REPORTES = {
  directorio: 'reportes',
  formatos: ['json', 'html', 'txt'],
  incluirFecha: true,
  incluirTimestamp: true,
  incluirMetricas: true
};

export default {
  BROWSER_CONFIG,
  URLS,
  SELECTORS,
  UMBRALES_VELOCIDAD,
  TIMEOUTS,
  ESPERAS,
  MODULOS,
  TEST_HELPERS,
  REPORTES
};














