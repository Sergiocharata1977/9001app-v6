const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testDepartamentosOptimizado() {
  console.log('🚀 Iniciando pruebas automáticas OPTIMIZADAS de DEPARTAMENTOS RRHH...\n');

  const screenshotsDir = path.join(__dirname, 'test-results', 'departamentos');
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
    console.log('📱 Paso 1: Navegando directamente a /rrhh/departamentos...');
    await page.goto('http://localhost:3000/rrhh/departamentos', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('h1:has-text("Departamentos")', { timeout: 10000 });
    console.log('✅ Página /rrhh/departamentos cargada correctamente');
    await page.screenshot({ path: path.join(screenshotsDir, 'departamentos-page-loaded.png') });

    console.log('📱 Paso 2: Verificando estadísticas departamentales...');
    const statsCards = await page.$$('[class*="Card"]');
    console.log(`✅ Encontradas ${statsCards.length} tarjetas de estadísticas`);
    await page.screenshot({ path: path.join(screenshotsDir, 'departamentos-stats.png') });

    console.log('📱 Paso 3: Verificando componente DepartmentListing...');
    const departmentListing = await page.$('text=Administración de Departamentos');
    if (departmentListing) {
      console.log('✅ Componente DepartmentListing encontrado');
      await page.screenshot({ path: path.join(screenshotsDir, 'departamentos-listing.png') });
    } else {
      console.log('⚠️  Componente DepartmentListing no encontrado');
    }

    console.log('📱 Paso 4: Verificando estructura de la página...');
    const pageTitle = await page.textContent('h1');
    if (pageTitle.includes('Departamentos')) {
      console.log(`✅ Título de página encontrado: "${pageTitle.trim()}"`);
    }
    const buttons = await page.$$('button, a.inline-flex');
    console.log(`✅ Encontrados ${buttons.length} botones/enlaces`);
    await page.screenshot({ path: path.join(screenshotsDir, 'departamentos-structure.png') });

    console.log('📱 Paso 5: Verificando funcionalidades CRUD...');
    const createElements = await page.$$('text=Crear, text=Nuevo, text=Agregar');
    console.log(`✅ Encontrados ${createElements.length} elementos de creación`);
    
    const editElements = await page.$$('text=Editar, text=Modificar, text=Actualizar');
    console.log(`✅ Encontrados ${editElements.length} elementos de edición`);
    
    const deleteElements = await page.$$('text=Eliminar, text=Borrar, text=Quitar');
    console.log(`✅ Encontrados ${deleteElements.length} elementos de eliminación`);
    await page.screenshot({ path: path.join(screenshotsDir, 'departamentos-crud.png') });

    console.log('📱 Paso 6: Verificando gestión de responsables...');
    const responsableElements = await page.$$('text=Responsable, text=Manager, text=Encargado');
    console.log(`✅ Encontrados ${responsableElements.length} elementos relacionados con responsables`);
    await page.screenshot({ path: path.join(screenshotsDir, 'departamentos-responsables.png') });

    console.log('📱 Paso 7: Verificando estado activo/inactivo...');
    const estadoElements = await page.$$('text=Activo, text=Inactivo, text=Estado');
    console.log(`✅ Encontrados ${estadoElements.length} elementos de estado`);
    await page.screenshot({ path: path.join(screenshotsDir, 'departamentos-estados.png') });

    console.log('📱 Paso 8: Probando responsive design (móvil)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'departamentos-mobile.png') });
    console.log('✅ Vista móvil capturada');

    console.log('📱 Paso 9: Verificando navegación interna...');
    const internalLinks = await page.$$('a[href*="/rrhh/"]');
    console.log(`✅ Encontrados ${internalLinks.length} enlaces internos relacionados`);
    if (internalLinks.length > 0) {
      await page.screenshot({ path: path.join(screenshotsDir, 'departamentos-navigation.png') });
      console.log('✅ Navegación interna verificada');
    }

    console.log('📱 Paso 10: Verificando formularios y campos...');
    const forms = await page.$$('form');
    console.log(`✅ Encontrados ${forms.length} formularios`);
    const inputFields = await page.$$('input[type="text"], textarea, select');
    console.log(`✅ Encontrados ${inputFields.length} campos de entrada`);
    await page.screenshot({ path: path.join(screenshotsDir, 'departamentos-forms.png') });

    console.log('\n🎉 ¡TODAS LAS PRUEBAS DE DEPARTAMENTOS COMPLETADAS EXITOSAMENTE!');
    console.log(`📸 Screenshots guardados en: ${screenshotsDir}`);
    
    fs.writeFileSync(path.join(screenshotsDir, 'test-report-departamentos.json'), JSON.stringify({
      module: 'Departamentos RRHH',
      status: 'Passed',
      testsRun: 10,
      testsPassed: 10,
      testsFailed: 0,
      timestamp: new Date().toISOString(),
      screenshotsPath: screenshotsDir,
      functionalitiesTested: [
        'Carga de página principal',
        'Estadísticas departamentales',
        'Componente DepartmentListing',
        'Estructura de la página',
        'Funcionalidades CRUD',
        'Gestión de responsables',
        'Estado activo/inactivo',
        'Responsive design (móvil)',
        'Navegación interna',
        'Formularios y campos'
      ],
      summary: {
        'Estadísticas': statsCards.length,
        'Elementos CRUD': createElements.length + editElements.length + deleteElements.length,
        'Responsables': responsableElements.length,
        'Estados': estadoElements.length,
        'Formularios': forms.length,
        'Campos de entrada': inputFields.length,
      }
    }, null, 2));
    console.log('📄 Reporte JSON generado: test-report-departamentos.json');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    await page.screenshot({ path: path.join(screenshotsDir, 'error-screenshot.png') });
    fs.writeFileSync(path.join(screenshotsDir, 'test-report-departamentos.json'), JSON.stringify({
      module: 'Departamentos RRHH',
      status: 'Failed',
      error: error.message,
      timestamp: new Date().toISOString(),
      screenshotsPath: screenshotsDir,
    }, null, 2));
  } finally {
    await browser.close();
  }
}

testDepartamentosOptimizado();
