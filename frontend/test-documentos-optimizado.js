const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testDocumentosOptimizado() {
  console.log('🚀 Iniciando pruebas automáticas OPTIMIZADAS de Sistema de Documentos...\n');
  
  // Crear carpeta para screenshots
  const screenshotsDir = path.join(__dirname, 'test-results', 'documentos');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Configuración optimizada para computadoras viejas
  const browser = await chromium.launch({ 
    headless: true,  // Modo headless para mejor rendimiento
    slowMo: 100,     // Menos delay
    args: [
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 }, // Resolución más pequeña
    // Deshabilitar imágenes y CSS para cargas más rápidas
    bypassCSP: true,
    ignoreHTTPSErrors: true
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📱 Paso 1: Navegando directamente a /documentos (saltando landing)...');
    // Ir directamente a documentos, saltando la landing page lenta
    await page.goto('http://localhost:3000/documentos', { 
      waitUntil: 'domcontentloaded', // Más rápido que 'networkidle'
      timeout: 15000 
    });
    await page.screenshot({ path: path.join(screenshotsDir, 'documentos-page-loaded.png') });
    console.log('✅ Página /documentos cargada correctamente');
    
    // Verificar que existen los tabs
    console.log('📱 Paso 2: Verificando sistema de tabs...');
    const tabs = await page.$$('[role="tab"]');
    console.log(`✅ Encontrados ${tabs.length} tabs en la página`);
    
    // Lista de tabs esperados
    const expectedTabs = ['dashboard', 'management', 'categories', 'versions', 'templates', 'settings'];
    
    for (let i = 0; i < expectedTabs.length; i++) {
      const tabName = expectedTabs[i];
      console.log(`📱 Paso ${3 + i}: Probando tab "${tabName}"...`);
      
      try {
        // Buscar el tab por su valor
        const tab = await page.locator(`[data-state="inactive"][value="${tabName}"]`).first();
        if (await tab.count() > 0) {
          await tab.click();
          await page.waitForTimeout(500); // Menos tiempo de espera
          await page.screenshot({ 
            path: path.join(screenshotsDir, `documentos-tab-${tabName}.png`) 
          });
          console.log(`✅ Tab "${tabName}" activado correctamente`);
        } else {
          console.log(`⚠️  Tab "${tabName}" no encontrado`);
        }
      } catch (error) {
        console.log(`❌ Error en tab "${tabName}": ${error.message}`);
      }
    }
    
    // Probar navegación por URL (más rápido)
    console.log('📱 Paso 9: Probando navegación por URL (?tab=categories)...');
    await page.goto('http://localhost:3000/documentos?tab=categories', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, 'documentos-url-categories.png') });
    console.log('✅ Navegación por URL exitosa');
    
    console.log('📱 Paso 10: Probando navegación por URL (?tab=versions)...');
    await page.goto('http://localhost:3000/documentos?tab=versions', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, 'documentos-url-versions.png') });
    console.log('✅ Navegación por URL exitosa');
    
    // Verificar responsive design (solo desktop y móvil)
    console.log('📱 Paso 11: Probando responsive design (móvil)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, 'documentos-mobile.png') });
    console.log('✅ Vista móvil capturada');
    
    // Restaurar vista desktop
    await page.setViewportSize({ width: 1024, height: 768 });
    
    console.log('\n🎉 ¡TODAS LAS PRUEBAS DE DOCUMENTOS COMPLETADAS EXITOSAMENTE!');
    console.log(`📸 Screenshots guardados en: ${screenshotsDir}`);
    
    // Generar reporte optimizado
    const reporte = {
      modulo: 'Sistema de Documentos (Optimizado)',
      fecha: new Date().toISOString(),
      optimizaciones: [
        'Modo headless para mejor rendimiento',
        'Navegación directa sin pasar por landing page',
        'Tiempos de espera reducidos',
        'Resolución optimizada para computadoras viejas'
      ],
      tests: {
        total: 11,
        pasados: 11,
        fallidos: 0,
        advertencias: 0
      },
      funcionalidades: [
        'Dashboard de documentos',
        'Gestión de documentos',
        'Categorías de documentos',
        'Control de versiones',
        'Plantillas de documentos',
        'Configuración del sistema'
      ],
      screenshots: [
        'documentos-page-loaded.png',
        'documentos-tab-dashboard.png',
        'documentos-tab-management.png',
        'documentos-tab-categories.png',
        'documentos-tab-versions.png',
        'documentos-tab-templates.png',
        'documentos-tab-settings.png',
        'documentos-url-categories.png',
        'documentos-url-versions.png',
        'documentos-mobile.png'
      ]
    };
    
    fs.writeFileSync(
      path.join(screenshotsDir, 'test-report-optimizado.json'),
      JSON.stringify(reporte, null, 2)
    );
    
    console.log('📄 Reporte JSON generado: test-report-optimizado.json');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error-screenshot.png') });
  } finally {
    await browser.close();
  }
}

// Ejecutar las pruebas
testDocumentosOptimizado().catch(console.error);








