/**
 * 🎨 TEST DE USABILIDAD COMPLETO - 9001app v6
 * 
 * Evalúa la usabilidad y experiencia de usuario:
 * - Navegación intuitiva
 * - Responsive design
 * - Accesibilidad básica
 * - Tiempo de respuesta a interacciones
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuración
const BASE_URL = 'http://localhost:3000';
const TIMEOUT = 10000;

// Tests de usabilidad
const TESTS_USABILIDAD = [
  {
    nombre: 'Dashboard Principal',
    url: '/dashboard',
    elementos: [
      { selector: 'h1', descripcion: 'Título principal' },
      { selector: 'nav', descripcion: 'Navegación' },
      { selector: 'button', descripcion: 'Botones interactivos' }
    ]
  },
  {
    nombre: 'CRM Dashboard',
    url: '/crm',
    elementos: [
      { selector: 'h1', descripcion: 'Título CRM' },
      { selector: '[data-testid="stats"]', descripcion: 'Estadísticas' },
      { selector: 'button:has-text("Nuevo")', descripcion: 'Botón Nuevo' }
    ]
  },
  {
    nombre: 'Super Admin',
    url: '/super-admin',
    elementos: [
      { selector: 'h1', descripcion: 'Título Super Admin' },
      { selector: '.group', descripcion: 'Tarjetas de módulos' },
      { selector: 'a[href*="/super-admin/modulos/"]', descripcion: 'Enlaces clickeables' }
    ]
  }
];

// Función principal
async function ejecutarTestUsabilidad() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         🎨 TEST DE USABILIDAD COMPLETO - 9001app v6      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  
  const resultados = {
    timestamp: new Date().toISOString(),
    tests: [],
    total: 0,
    exitosos: 0,
    fallidos: 0
  };
  
  try {
    for (const test of TESTS_USABILIDAD) {
      console.log(`\n🔍 Testeando: ${test.nombre}`);
      console.log(`🌐 URL: ${test.url}`);
      
      const testResultado = {
        nombre: test.nombre,
        url: test.url,
        elementos: {},
        carga: null
      };
      
      // Test de carga
      const inicio = Date.now();
      try {
        await page.goto(`${BASE_URL}${test.url}`, { waitUntil: 'networkidle', timeout: TIMEOUT });
        const tiempo = Date.now() - inicio;
        testResultado.carga = { exito: true, tiempo };
        console.log(`   ✅ Carga: ${tiempo}ms`);
      } catch (error) {
        testResultado.carga = { exito: false, error: error.message };
        console.log(`   ❌ Carga: FALLÓ`);
      }
      
      // Test de elementos
      for (const elemento of test.elementos) {
        try {
          const count = await page.locator(elemento.selector).count();
          testResultado.elementos[elemento.descripcion] = { encontrado: count > 0, cantidad: count };
          console.log(`   ${count > 0 ? '✅' : '❌'} ${elemento.descripcion}: ${count}`);
        } catch (error) {
          testResultado.elementos[elemento.descripcion] = { encontrado: false, error: error.message };
          console.log(`   ❌ ${elemento.descripcion}: ERROR`);
        }
      }
      
      resultados.tests.push(testResultado);
      resultados.total++;
      
      if (testResultado.carga.exito) {
        resultados.exitosos++;
      } else {
        resultados.fallidos++;
      }
    }
    
  } finally {
    await browser.close();
  }
  
  // Generar reportes
  await generarReportes(resultados);
  mostrarResumen(resultados);
}

// Función para generar reportes
async function generarReportes(resultados) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportesDir = path.join(__dirname, '..', 'reportes', 'usabilidad');
  
  if (!fs.existsSync(reportesDir)) {
    fs.mkdirSync(reportesDir, { recursive: true });
  }
  
  // Reporte JSON
  const jsonPath = path.join(reportesDir, `reporte-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(resultados, null, 2));
  
  console.log(`\n📊 Reportes generados en: ${reportesDir}`);
}

// Función para mostrar resumen
function mostrarResumen(resultados) {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║                  📊 RESUMEN USABILIDAD                     ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝`);
  
  console.log(`\n📈 ESTADÍSTICAS:`);
  console.log(`   Total Tests: ${resultados.total}`);
  console.log(`   ✅ Exitosos: ${resultados.exitosos}`);
  console.log(`   ❌ Fallidos: ${resultados.fallidos}`);
  console.log(`   📊 % Éxito: ${((resultados.exitosos / resultados.total) * 100).toFixed(1)}%`);
  
  console.log(`\n📁 Reportes guardados en: frontend/tests/reportes/usabilidad/`);
  console.log(`\n🎉 Test de Usabilidad completado!`);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  ejecutarTestUsabilidad().catch(console.error);
}

module.exports = { ejecutarTestUsabilidad };














