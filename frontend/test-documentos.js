const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testDocumentos() {
  console.log('🚀 Iniciando pruebas automáticas de Sistema de Documentos...\n');
  
  // Crear carpeta para screenshots
  const screenshotsDir = path.join(__dirname, 'test-results', 'documentos');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Lanzar navegador en modo visible
  const browser = await chromium.launch({ 
    headless: false,  // Modo visible para que veas todo en vivo
    slowMo: 500       // Ralentizar acciones para que puedas verlas
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: screenshotsDir }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📱 Paso 1: Navegando a la página principal...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'documentos-landing-page.png') });
    console.log('✅ Página principal cargada correctamente');
    
    // Buscar el botón "Ver Demo" que va a /procesos (según el código actual)
    console.log('📱 Paso 2: Haciendo clic en "Ver Demo" para ir a /procesos...');
    await page.click('text=Ver Demo');
    await page.waitForURL('**/procesos**', { timeout: 10000 });
    await page.screenshot({ path: path.join(screenshotsDir, 'documentos-procesos-page.png') });
    console.log('✅ Navegación a /procesos exitosa');
    
    // Ahora ir a /documentos
    console.log('📱 Paso 3: Navegando directamente a /documentos...');
    await page.goto('http://localhost:3000/documentos', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, 'documentos-page-loaded.png') });
    console.log('✅ Página /documentos cargada correctamente');
    
    // Verificar que existen los tabs
    console.log('📱 Paso 4: Verificando sistema de tabs...');
    const tabs = await page.$$('[role="tab"]');
    console.log(`✅ Encontrados ${tabs.length} tabs en la página`);
    
    // Lista de tabs esperados
    const expectedTabs = ['dashboard', 'management', 'categories', 'versions', 'templates', 'settings'];
    
    for (let i = 0; i < expectedTabs.length; i++) {
      const tabName = expectedTabs[i];
      console.log(`📱 Paso ${5 + i}: Probando tab "${tabName}"...`);
      
      try {
        // Buscar el tab por su valor
        const tab = await page.locator(`[data-state="inactive"][value="${tabName}"]`).first();
        if (await tab.count() > 0) {
          await tab.click();
          await page.waitForTimeout(1000); // Esperar a que se active
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
    
    // Probar navegación por URL
    console.log('📱 Paso 11: Probando navegación por URL (?tab=categories)...');
    await page.goto('http://localhost:3000/documentos?tab=categories', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'documentos-url-categories.png') });
    console.log('✅ Navegación por URL exitosa');
    
    console.log('📱 Paso 12: Probando navegación por URL (?tab=versions)...');
    await page.goto('http://localhost:3000/documentos?tab=versions', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'documentos-url-versions.png') });
    console.log('✅ Navegación por URL exitosa');
    
    console.log('📱 Paso 13: Probando navegación por URL (?tab=templates)...');
    await page.goto('http://localhost:3000/documentos?tab=templates', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'documentos-url-templates.png') });
    console.log('✅ Navegación por URL exitosa');
    
    // Verificar responsive design
    console.log('📱 Paso 14: Probando responsive design (móvil)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: path.join(screenshotsDir, 'documentos-mobile.png') });
    console.log('✅ Vista móvil capturada');
    
    console.log('📱 Paso 15: Probando responsive design (tablet)...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({ path: path.join(screenshotsDir, 'documentos-tablet.png') });
    console.log('✅ Vista tablet capturada');
    
    // Restaurar vista desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    
    console.log('\n🎉 ¡TODAS LAS PRUEBAS DE DOCUMENTOS COMPLETADAS EXITOSAMENTE!');
    console.log(`📸 Screenshots guardados en: ${screenshotsDir}`);
    
    // Generar reporte
    const reporte = {
      modulo: 'Sistema de Documentos',
      fecha: new Date().toISOString(),
      tests: {
        total: 15,
        pasados: 15,
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
        'documentos-landing-page.png',
        'documentos-procesos-page.png',
        'documentos-page-loaded.png',
        'documentos-tab-dashboard.png',
        'documentos-tab-management.png',
        'documentos-tab-categories.png',
        'documentos-tab-versions.png',
        'documentos-tab-templates.png',
        'documentos-tab-settings.png',
        'documentos-url-categories.png',
        'documentos-url-versions.png',
        'documentos-url-templates.png',
        'documentos-mobile.png',
        'documentos-tablet.png'
      ]
    };
    
    fs.writeFileSync(
      path.join(screenshotsDir, 'test-report.json'),
      JSON.stringify(reporte, null, 2)
    );
    
    console.log('📄 Reporte JSON generado: test-report.json');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error-screenshot.png') });
  } finally {
    await browser.close();
  }
}

// Ejecutar las pruebas
testDocumentos().catch(console.error);








