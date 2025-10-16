/**
 * 🧪 CONFIGURACIÓN DE TESTING PARA MVP
 * 
 * Configuración simplificada para tests del MVP de 9001app v6
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
    login: '/login',
    dashboard: '/super-admin',
    superAdmin: '/super-admin',
    crm: '/crm',
    rrhh: '/rrhh',
    documentos: '/documentos',
    normas: '/normas'
};

// Selectores estándar para testing
export const SELECTORS = {
    // Botones de acción
    crear: '[data-testid="btn-crear"], button:has-text("Nuevo"), button:has-text("Crear")',
    editar: '[data-testid="btn-editar"], button:has-text("Editar")',
    eliminar: '[data-testid="btn-eliminar"], button:has-text("Eliminar")',
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
    success: '[data-testid="success"], .success',

    // Login
    loginForm: 'form',
    emailInput: 'input[type="email"]',
    passwordInput: 'input[type="password"]',
    loginButton: 'button[type="submit"]'
};

// Timeouts reducidos para MVP
export const TIMEOUTS = {
    navegacion: 5000,      // 5s para navegar entre páginas
    carga: 3000,           // 3s para cargar contenido
    interaccion: 2000,     // 2s para clicks y formularios
    api: 5000,             // 5s para llamadas API
    modal: 2000            // 2s para abrir/cerrar modales
};

// Credenciales para login
export const CREDENCIALES = {
    email: 'admin@9001app.com',
    password: 'admin123'
};

// Funciones helper para testing
export const TEST_HELPERS = {
    // Login helper
    login: async (page) => {
        await page.goto(URLS.login);
        await page.waitForSelector(SELECTORS.loginForm);
        await page.fill(SELECTORS.emailInput, CREDENCIALES.email);
        await page.fill(SELECTORS.passwordInput, CREDENCIALES.password);
        await page.click(SELECTORS.loginButton);
        await page.waitForURL(URLS.superAdmin, { timeout: TIMEOUTS.navegacion });
    },

    // Esperar elemento de forma inteligente
    esperarElemento: async (page, selector, timeout = TIMEOUTS.carga) => {
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
    }
};

export default {
    BROWSER_CONFIG,
    URLS,
    SELECTORS,
    TIMEOUTS,
    CREDENCIALES,
    TEST_HELPERS
};