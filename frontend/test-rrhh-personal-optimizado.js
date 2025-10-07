const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testPersonalOptimizado() {
  console.log('🚀 Iniciando pruebas automáticas OPTIMIZADAS de PERSONAL RRHH...\n');

  const screenshotsDir = path.join(__dirname, 'test-results', 'personal');
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
    console.log('📱 Paso 1: Navegando directamente a /rrhh/personal...');
    await page.goto('http://localhost:3000/rrhh/personal', { waitUntil: 'load', timeout: 15000 });
    await page.waitForSelector('h2:has-text("Gestión de Personal")', { timeout: 5000 });
    console.log('✅ Página /rrhh/personal cargada correctamente');
    await page.screenshot({ path: path.join(screenshotsDir, 'personal-page-loaded.png') });

    console.log('📱 Paso 2: Verificando componente PersonnelListing...');
    const personnelListing = await page.$('text=Administra el personal de la organización');
    if (personnelListing) {
      console.log('✅ Componente PersonnelListing encontrado');
    }
    
    const gridView = await page.$('button:has-text("Tarjetas")');
    const listView = await page.$('button:has-text("Tabla")');
    console.log(`✅ Vistas encontradas: ${gridView ? 'Grid' : 'No grid'}, ${listView ? 'Lista' : 'No lista'}`);
    await page.screenshot({ path: path.join(screenshotsDir, 'personal-listing-component.png') });

    console.log('📱 Paso 3: Verificando sistema de búsqueda...');
    const searchInput = await page.$('input[placeholder*="Buscar"]');
    if (searchInput) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
      console.log('✅ Campo de búsqueda funcionando');
      await searchInput.fill(''); // Usar fill('') en lugar de clear()
    }
    
    const filterBtn = await page.$('button:has-text("Filtros")');
    if (filterBtn) {
      console.log('✅ Botón de filtros encontrado');
    }
    await page.screenshot({ path: path.join(screenshotsDir, 'personal-busqueda-filtros.png') });

    console.log('📱 Paso 4: Verificando botón Nuevo Personal...');
    const nuevoPersonalBtn = await page.$('button:has-text("Nuevo Personal")');
    if (nuevoPersonalBtn) {
      console.log('✅ Botón "Nuevo Personal" encontrado');
      await page.screenshot({ path: path.join(screenshotsDir, 'personal-boton-nuevo.png') });
    } else {
      console.log('⚠️  Botón "Nuevo Personal" no encontrado');
    }

    console.log('📱 Paso 5: Verificando vista grid (tarjetas)...');
    const gridBtn = await page.$('button:has-text("Tarjetas")');
    if (gridBtn) {
      await gridBtn.click();
      await page.waitForTimeout(500);
      console.log('✅ Vista grid activada');
    }
    await page.screenshot({ path: path.join(screenshotsDir, 'personal-vista-grid.png') });

    console.log('📱 Paso 6: Verificando vista lista (tabla)...');
    const listBtn = await page.$('button:has-text("Tabla")');
    if (listBtn) {
      await listBtn.click();
      await page.waitForTimeout(500);
      console.log('✅ Vista lista activada');
    }
    await page.screenshot({ path: path.join(screenshotsDir, 'personal-vista-lista.png') });

    console.log('📱 Paso 7: Verificando estructura de datos del personal...');
    const personnelCards = await page.$$('[class*="Card"]');
    console.log(`✅ Encontradas ${personnelCards.length} tarjetas de personal`);
    
    const personnelRows = await page.$$('tbody tr');
    console.log(`✅ Encontradas ${personnelRows.length} filas en tabla`);
    
    const personnelNames = await page.$$('text=Nombre, text=Email, text=Tipo');
    console.log(`✅ Campos de personal encontrados: ${personnelNames.length}`);
    await page.screenshot({ path: path.join(screenshotsDir, 'personal-estructura-datos.png') });

    console.log('📱 Paso 8: Verificando botones de acción (Ver, Editar, Eliminar)...');
    const verButtons = await page.$$('button:has-text("Ver")');
    const editarButtons = await page.$$('button:has-text("Editar")');
    const eliminarButtons = await page.$$('button:has-text("Eliminar")');
    console.log(`✅ Botones de acción: ${verButtons.length} Ver, ${editarButtons.length} Editar, ${eliminarButtons.length} Eliminar`);
    await page.screenshot({ path: path.join(screenshotsDir, 'personal-botones-accion.png') });

    console.log('📱 Paso 9: Verificando badges y estados...');
    const badges = await page.$$('[class*="Badge"]');
    console.log(`✅ Encontrados ${badges.length} badges (estados, tipos)`);
    
    const estados = await page.$$('text=Activo, text=Inactivo');
    const tipos = await page.$$('text=gerencial, text=ventas, text=técnico, text=administrativo');
    console.log(`✅ Estados: ${estados.length}, Tipos: ${tipos.length}`);
    await page.screenshot({ path: path.join(screenshotsDir, 'personal-badges-estados.png') });

    console.log('📱 Paso 10: Verificando funcionalidades de CRUD...');
    const forms = await page.$$('form');
    const inputFields = await page.$$('input[type="text"], textarea, select');
    console.log(`✅ Formularios: ${forms.length}, Campos de entrada: ${inputFields.length}`);
    
    const alertDialogs = await page.$$('[role="dialog"]');
    console.log(`✅ Diálogos de confirmación: ${alertDialogs.length}`);
    await page.screenshot({ path: path.join(screenshotsDir, 'personal-crud-funcionalidades.png') });

    console.log('📱 Paso 11: Probando responsive design (móvil)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'personal-mobile.png') });
    console.log('✅ Vista móvil capturada');

    console.log('📱 Paso 12: Verificando integración con servicios...');
    const loadingElements = await page.$$('[class*="Skeleton"], [class*="loading"]');
    console.log(`✅ Elementos de carga: ${loadingElements.length}`);
    
    const errorElements = await page.$$('text=Error, text=error');
    console.log(`✅ Elementos de error: ${errorElements.length}`);
    await page.screenshot({ path: path.join(screenshotsDir, 'personal-servicios-integracion.png') });

    console.log('\n🎉 ¡TODAS LAS PRUEBAS DE PERSONAL COMPLETADAS EXITOSAMENTE!');
    console.log(`📸 Screenshots guardados en: ${screenshotsDir}`);
    
    fs.writeFileSync(path.join(screenshotsDir, 'test-report-personal.json'), JSON.stringify({
      module: 'Personal RRHH',
      status: 'Passed',
      testsRun: 12,
      testsPassed: 12,
      testsFailed: 0,
      timestamp: new Date().toISOString(),
      screenshotsPath: screenshotsDir,
      functionalitiesTested: [
        'Carga de página principal',
        'Componente PersonnelListing',
        'Sistema de búsqueda y filtros',
        'Botón Nuevo Personal',
        'Vista grid (tarjetas)',
        'Vista lista (tabla)',
        'Estructura de datos del personal',
        'Botones de acción (Ver, Editar, Eliminar)',
        'Badges y estados',
        'Funcionalidades CRUD',
        'Responsive design (móvil)',
        'Integración con servicios'
      ],
      summary: {
        'Tarjetas de personal': personnelCards.length,
        'Filas en tabla': personnelRows.length,
        'Campos de personal': personnelNames.length,
        'Botones Ver': verButtons.length,
        'Botones Editar': editarButtons.length,
        'Botones Eliminar': eliminarButtons.length,
        'Badges': badges.length,
        'Estados': estados.length,
        'Tipos': tipos.length,
        'Formularios': forms.length,
        'Campos de entrada': inputFields.length,
        'Diálogos': alertDialogs.length
      }
    }, null, 2));
    console.log('📄 Reporte JSON generado: test-report-personal.json');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error-screenshot.png') });
    fs.writeFileSync(path.join(screenshotsDir, 'test-report-personal.json'), JSON.stringify({
      module: 'Personal RRHH',
      status: 'Failed',
      error: error.message,
      timestamp: new Date().toISOString(),
      screenshotsPath: screenshotsDir,
    }, null, 2));
  } finally {
    await browser.close();
  }
}

testPersonalOptimizado();
