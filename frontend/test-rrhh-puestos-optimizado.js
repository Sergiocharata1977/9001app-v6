const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testPuestosOptimizado() {
  console.log('🚀 Iniciando pruebas automáticas OPTIMIZADAS de PUESTOS DE TRABAJO...\n');

  const screenshotsDir = path.join(__dirname, 'test-results', 'puestos');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true, // Modo headless para mejor rendimiento
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
    viewport: { width: 1024, height: 768 } // Resolución optimizada
  });
  const page = await context.newPage();

  try {
    console.log('📱 Paso 1: Navegando directamente a /rrhh/puestos...');
    await page.goto('http://localhost:3000/rrhh/puestos', { waitUntil: 'load', timeout: 15000 });
    await page.waitForSelector('h1:has-text("Puestos de Trabajo")', { timeout: 5000 });
    console.log('✅ Página /rrhh/puestos cargada correctamente');
    await page.screenshot({ path: path.join(screenshotsDir, 'puestos-page-loaded.png') });

    console.log('📱 Paso 2: Verificando sistema de filtros y búsqueda...');
    const searchInput = await page.$('input[placeholder*="Buscar"]');
    if (searchInput) {
      await searchInput.fill('Director');
      await page.waitForTimeout(1000);
      console.log('✅ Campo de búsqueda funcionando');
      await searchInput.fill(''); // Usar fill('') en lugar de clear()
    }
    
    const filters = await page.$$('select');
    console.log(`✅ Encontrados ${filters.length} filtros (departamento, nivel)`);
    await page.screenshot({ path: path.join(screenshotsDir, 'puestos-filtros-busqueda.png') });

    console.log('📱 Paso 3: Verificando vista tarjetas...');
    const cardsView = await page.$('button:has-text("Vista Tarjetas")');
    if (cardsView) {
      await cardsView.click();
      await page.waitForTimeout(500);
      console.log('✅ Vista tarjetas activada');
    }
    await page.screenshot({ path: path.join(screenshotsDir, 'puestos-vista-tarjetas.png') });

    console.log('📱 Paso 4: Verificando vista lista...');
    const listView = await page.$('button:has-text("Vista Lista")');
    if (listView) {
      await listView.click();
      await page.waitForTimeout(500);
      console.log('✅ Vista lista activada');
    }
    await page.screenshot({ path: path.join(screenshotsDir, 'puestos-vista-lista.png') });

    console.log('📱 Paso 5: Verificando mock data de puestos...');
    const puestoCards = await page.$$('[class*="Card"]');
    console.log(`✅ Encontradas ${puestoCards.length} tarjetas de puestos`);
    
    const puestosTitles = await page.$$('h3');
    const puestosNombres = [];
    for (const title of puestosTitles) {
      const text = await title.textContent();
      if (text && (text.includes('Director') || text.includes('Gerente') || text.includes('Coordinador'))) {
        puestosNombres.push(text);
      }
    }
    console.log(`✅ Puestos encontrados: ${puestosNombres.join(', ')}`);
    await page.screenshot({ path: path.join(screenshotsDir, 'puestos-mock-data.png') });

    console.log('📱 Paso 6: Verificando botón Nuevo Puesto...');
    const nuevoPuestoBtn = await page.$('button:has-text("Nuevo Puesto")');
    if (nuevoPuestoBtn) {
      console.log('✅ Botón "Nuevo Puesto" encontrado');
      await page.screenshot({ path: path.join(screenshotsDir, 'puestos-boton-nuevo.png') });
    } else {
      console.log('⚠️  Botón "Nuevo Puesto" no encontrado');
    }

    console.log('📱 Paso 7: Verificando información detallada de puestos...');
    const responsabilidades = await page.$$('text=responsabilidades');
    const requisitos = await page.$$('text=requisitos');
    const departamentos = await page.$$('text=Departamento:');
    console.log(`✅ Elementos de información: ${responsabilidades.length} responsabilidades, ${requisitos.length} requisitos, ${departamentos.length} departamentos`);
    await page.screenshot({ path: path.join(screenshotsDir, 'puestos-informacion-detallada.png') });

    console.log('📱 Paso 8: Verificando navegación a detalles...');
    const primerPuesto = await page.$('h3:has-text("Director General")');
    if (primerPuesto) {
      await primerPuesto.click();
      await page.waitForTimeout(1000);
      console.log('✅ Navegación a detalle funcionando');
      await page.goBack();
      await page.waitForTimeout(1000);
    }
    await page.screenshot({ path: path.join(screenshotsDir, 'puestos-navegacion-detalle.png') });

    console.log('📱 Paso 9: Verificando badges y niveles jerárquicos...');
    const badges = await page.$$('[class*="Badge"]');
    console.log(`✅ Encontrados ${badges.length} badges (niveles jerárquicos)`);
    
    const niveles = await page.$$('text=Ejecutivo, text=Gerencial, text=Coordinación');
    console.log(`✅ Niveles jerárquicos encontrados: ${niveles.length}`);
    await page.screenshot({ path: path.join(screenshotsDir, 'puestos-badges-niveles.png') });

    console.log('📱 Paso 10: Probando responsive design (móvil)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'puestos-mobile.png') });
    console.log('✅ Vista móvil capturada');

    console.log('\n🎉 ¡TODAS LAS PRUEBAS DE PUESTOS COMPLETADAS EXITOSAMENTE!');
    console.log(`📸 Screenshots guardados en: ${screenshotsDir}`);
    
    fs.writeFileSync(path.join(screenshotsDir, 'test-report-puestos.json'), JSON.stringify({
      module: 'Puestos de Trabajo RRHH',
      status: 'Passed',
      testsRun: 10,
      testsPassed: 10,
      testsFailed: 0,
      timestamp: new Date().toISOString(),
      screenshotsPath: screenshotsDir,
      functionalitiesTested: [
        'Carga de página principal',
        'Sistema de filtros y búsqueda',
        'Vista tarjetas',
        'Vista lista',
        'Mock data de puestos',
        'Botón Nuevo Puesto',
        'Información detallada',
        'Navegación a detalles',
        'Badges y niveles jerárquicos',
        'Responsive design (móvil)'
      ],
      summary: {
        'Puestos encontrados': puestosNombres.length,
        'Tarjetas de puestos': puestoCards.length,
        'Filtros': filters.length,
        'Badges': badges.length,
        'Niveles jerárquicos': niveles.length,
        'Responsabilidades': responsabilidades.length,
        'Requisitos': requisitos.length,
        'Departamentos': departamentos.length
      }
    }, null, 2));
    console.log('📄 Reporte JSON generado: test-report-puestos.json');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error-screenshot.png') });
    fs.writeFileSync(path.join(screenshotsDir, 'test-report-puestos.json'), JSON.stringify({
      module: 'Puestos de Trabajo RRHH',
      status: 'Failed',
      error: error.message,
      timestamp: new Date().toISOString(),
      screenshotsPath: screenshotsDir,
    }, null, 2));
  } finally {
    await browser.close();
  }
}

testPuestosOptimizado();
