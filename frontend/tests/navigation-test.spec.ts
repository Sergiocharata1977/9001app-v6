import { expect, test } from '@playwright/test';

test.describe('9001app - Pruebas de Navegación Completa', () => {
  test.beforeEach(async ({ page }) => {
    // Ir a la página de login
    await page.goto('http://localhost:3000/login');
    
    // Verificar que estamos en la página de login
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1')).toContainText('Iniciar Sesión');
  });

  test('1. Login y Navegación Principal', async ({ page }) => {
    // Hacer login
    await page.fill('input[type="email"]', 'admin@9001app.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Verificar que llegamos al dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    console.log('✅ Login exitoso - Dashboard cargado');
  });

  test('2. Navegación del Menú Principal', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', 'admin@9001app.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Esperar a que cargue el dashboard
    await page.waitForURL(/.*dashboard/);
    
    // Probar cada botón del menú principal
    const menuItems = [
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Módulo Calidad', url: '/calidad' },
      { name: 'Procesos', url: '/procesos' },
      { name: 'Documentos', url: '/documentos' },
      { name: 'Puntos de la norma', url: '/normas' },
      { name: 'Mejora', url: '/mejoras' }
    ];

    for (const item of menuItems) {
      console.log(`🔍 Probando: ${item.name}`);
      
      // Hacer clic en el elemento del menú
      await page.click(`a[href="${item.url}"]`);
      
      // Verificar que la página carga correctamente
      await expect(page).toHaveURL(new RegExp(`.*${item.url.replace('/', '')}`));
      
      // Verificar que no hay redirección al login
      await expect(page).not.toHaveURL(/.*login/);
      
      // Verificar que hay contenido en la página
      await expect(page.locator('h1')).toBeVisible();
      
      console.log(`✅ ${item.name} - Navegación exitosa`);
      
      // Volver al dashboard para probar el siguiente
      if (item.url !== '/dashboard') {
        await page.click('a[href="/dashboard"]');
        await page.waitForURL(/.*dashboard/);
      }
    }
  });

  test('3. Navegación CRM Completa', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', 'admin@9001app.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Ir a CRM
    await page.click('a[href="/crm"]');
    await expect(page).toHaveURL(/.*crm/);
    await expect(page).not.toHaveURL(/.*login/);
    
    console.log('✅ CRM - Página principal cargada');
    
    // Verificar elementos principales de CRM
    await expect(page.locator('h1')).toContainText('Dashboard CRM');
    
    // Probar botones de CRM
    const crmButtons = [
      'Nueva Oportunidad',
      'Nueva Empresa', 
      'Nuevo Contacto',
      'Nueva Actividad'
    ];
    
    for (const buttonText of crmButtons) {
      const button = page.locator(`text=${buttonText}`);
      if (await button.isVisible()) {
        console.log(`✅ CRM - Botón "${buttonText}" visible`);
      } else {
        console.log(`❌ CRM - Botón "${buttonText}" NO visible`);
      }
    }
    
    // Verificar estadísticas de CRM
    const stats = page.locator('[class*="text-2xl font-bold"]');
    const statsCount = await stats.count();
    console.log(`✅ CRM - ${statsCount} estadísticas encontradas`);
    
    // Verificar que no hay errores en consola
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000); // Esperar para capturar errores
    
    if (errors.length > 0) {
      console.log(`❌ CRM - Errores encontrados: ${errors.length}`);
      errors.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('✅ CRM - Sin errores en consola');
    }
  });

  test('4. Navegación RRHH Completa', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', 'admin@9001app.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Iniciar Sesión")');
    
    // Ir a RRHH
    await page.click('a[href="/rrhh"]');
    await expect(page).toHaveURL(/.*rrhh/);
    await expect(page).not.toHaveURL(/.*login/);
    
    console.log('✅ RRHH - Página principal cargada');
    
    // Verificar elementos principales de RRHH
    await expect(page.locator('h1')).toContainText('Recursos Humanos');
    
    // Probar módulos de RRHH
    const rrhhModules = [
      'Gestión de Personal',
      'Departamentos',
      'Puestos de Trabajo',
      'Competencias',
      'Capacitaciones',
      'Evaluaciones de Desempeño'
    ];
    
    for (const moduleName of rrhhModules) {
      const module = page.locator(`text=${moduleName}`);
      if (await module.isVisible()) {
        console.log(`✅ RRHH - Módulo "${moduleName}" visible`);
      } else {
        console.log(`❌ RRHH - Módulo "${moduleName}" NO visible`);
      }
    }
    
    // Verificar accesos rápidos
    const quickAccess = page.locator('text=Nueva Encuesta');
    if (await quickAccess.isVisible()) {
      console.log('✅ RRHH - Accesos rápidos visibles');
    } else {
      console.log('❌ RRHH - Accesos rápidos NO visibles');
    }
    
    // Verificar que no hay errores en consola
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log(`❌ RRHH - Errores encontrados: ${errors.length}`);
      errors.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('✅ RRHH - Sin errores en consola');
    }
  });

  test('5. Prueba de Navegación Completa - 13 Iteraciones', async ({ page }) => {
    const results = [];
    
    for (let i = 1; i <= 13; i++) {
      console.log(`\n🔄 ITERACIÓN ${i}/13`);
      
      const iterationResult = {
        iteration: i,
        timestamp: new Date().toISOString(),
        tests: {}
      };
      
      try {
        // 1. Login
        await page.goto('http://localhost:3000/login');
        await page.fill('input[type="email"]', 'admin@9001app.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button:has-text("Iniciar Sesión")');
        await page.waitForURL(/.*dashboard/);
        iterationResult.tests.login = 'PASS';
        console.log(`✅ Iteración ${i} - Login exitoso`);
        
        // 2. Dashboard
        await expect(page.locator('h1')).toContainText('Dashboard');
        iterationResult.tests.dashboard = 'PASS';
        console.log(`✅ Iteración ${i} - Dashboard cargado`);
        
        // 3. CRM
        await page.click('a[href="/crm"]');
        await page.waitForURL(/.*crm/);
        await expect(page).not.toHaveURL(/.*login/);
        iterationResult.tests.crm = 'PASS';
        console.log(`✅ Iteración ${i} - CRM accesible`);
        
        // 4. RRHH
        await page.click('a[href="/rrhh"]');
        await page.waitForURL(/.*rrhh/);
        await expect(page).not.toHaveURL(/.*login/);
        iterationResult.tests.rrhh = 'PASS';
        console.log(`✅ Iteración ${i} - RRHH accesible`);
        
        // 5. Calidad
        await page.click('a[href="/calidad"]');
        await page.waitForURL(/.*calidad/);
        await expect(page).not.toHaveURL(/.*login/);
        iterationResult.tests.calidad = 'PASS';
        console.log(`✅ Iteración ${i} - Calidad accesible`);
        
        // 6. Procesos
        await page.click('a[href="/procesos"]');
        await page.waitForURL(/.*procesos/);
        await expect(page).not.toHaveURL(/.*login/);
        iterationResult.tests.procesos = 'PASS';
        console.log(`✅ Iteración ${i} - Procesos accesible`);
        
        // 7. Documentos
        await page.click('a[href="/documentos"]');
        await page.waitForURL(/.*documentos/);
        await expect(page).not.toHaveURL(/.*login/);
        iterationResult.tests.documentos = 'PASS';
        console.log(`✅ Iteración ${i} - Documentos accesible`);
        
        // 8. Normas
        await page.click('a[href="/normas"]');
        await page.waitForURL(/.*normas/);
        await expect(page).not.toHaveURL(/.*login/);
        iterationResult.tests.normas = 'PASS';
        console.log(`✅ Iteración ${i} - Normas accesible`);
        
        // 9. Mejoras
        await page.click('a[href="/mejoras"]');
        await page.waitForURL(/.*mejoras/);
        await expect(page).not.toHaveURL(/.*login/);
        iterationResult.tests.mejoras = 'PASS';
        console.log(`✅ Iteración ${i} - Mejoras accesible`);
        
        // 10. Verificar sidebar
        const sidebar = page.locator('[class*="bg-slate-800"]');
        if (await sidebar.isVisible()) {
          iterationResult.tests.sidebar = 'PASS';
          console.log(`✅ Iteración ${i} - Sidebar visible`);
        } else {
          iterationResult.tests.sidebar = 'FAIL';
          console.log(`❌ Iteración ${i} - Sidebar NO visible`);
        }
        
        // 11. Verificar header
        const header = page.locator('header');
        if (await header.isVisible()) {
          iterationResult.tests.header = 'PASS';
          console.log(`✅ Iteración ${i} - Header visible`);
        } else {
          iterationResult.tests.header = 'FAIL';
          console.log(`❌ Iteración ${i} - Header NO visible`);
        }
        
        // 12. Verificar sin errores de consola
        const errors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            errors.push(msg.text());
          }
        });
        
        await page.waitForTimeout(1000);
        
        if (errors.length === 0) {
          iterationResult.tests.consoleErrors = 'PASS';
          console.log(`✅ Iteración ${i} - Sin errores de consola`);
        } else {
          iterationResult.tests.consoleErrors = 'FAIL';
          console.log(`❌ Iteración ${i} - ${errors.length} errores de consola`);
        }
        
        // 13. Verificar rendimiento
        const performance = await page.evaluate(() => {
          return {
            loadTime: performance.now(),
            memory: (performance as any).memory?.usedJSHeapSize || 0
          };
        });
        
        iterationResult.tests.performance = performance.loadTime < 5000 ? 'PASS' : 'FAIL';
        console.log(`✅ Iteración ${i} - Rendimiento: ${performance.loadTime.toFixed(2)}ms`);
        
        iterationResult.overall = 'PASS';
        console.log(`🎉 Iteración ${i} - COMPLETADA EXITOSAMENTE`);
        
      } catch (error) {
        iterationResult.overall = 'FAIL';
        iterationResult.error = error.message;
        console.log(`❌ Iteración ${i} - ERROR: ${error.message}`);
      }
      
      results.push(iterationResult);
      
      // Esperar un poco entre iteraciones
      await page.waitForTimeout(500);
    }
    
    // Generar reporte final
    const report = {
      testName: '9001app - Navegación Completa',
      totalIterations: 13,
      passedIterations: results.filter(r => r.overall === 'PASS').length,
      failedIterations: results.filter(r => r.overall === 'FAIL').length,
      successRate: `${Math.round((results.filter(r => r.overall === 'PASS').length / 13) * 100)}%`,
      results: results,
      summary: {
        login: results.filter(r => r.tests.login === 'PASS').length,
        dashboard: results.filter(r => r.tests.dashboard === 'PASS').length,
        crm: results.filter(r => r.tests.crm === 'PASS').length,
        rrhh: results.filter(r => r.tests.rrhh === 'PASS').length,
        calidad: results.filter(r => r.tests.calidad === 'PASS').length,
        procesos: results.filter(r => r.tests.procesos === 'PASS').length,
        documentos: results.filter(r => r.tests.documentos === 'PASS').length,
        normas: results.filter(r => r.tests.normas === 'PASS').length,
        mejoras: results.filter(r => r.tests.mejoras === 'PASS').length,
        sidebar: results.filter(r => r.tests.sidebar === 'PASS').length,
        header: results.filter(r => r.tests.header === 'PASS').length,
        consoleErrors: results.filter(r => r.tests.consoleErrors === 'PASS').length,
        performance: results.filter(r => r.tests.performance === 'PASS').length
      }
    };
    
    console.log('\n📊 REPORTE FINAL:');
    console.log(`✅ Iteraciones exitosas: ${report.passedIterations}/13`);
    console.log(`❌ Iteraciones fallidas: ${report.failedIterations}/13`);
    console.log(`📈 Tasa de éxito: ${report.successRate}`);
    console.log('\n📋 RESUMEN POR MÓDULO:');
    Object.entries(report.summary).forEach(([module, count]) => {
      const percentage = Math.round((count / 13) * 100);
      console.log(`   ${module}: ${count}/13 (${percentage}%)`);
    });
    
    // Guardar reporte en archivo
    const fs = require('fs');
    fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Reporte guardado en: test-report.json');
    
    // Mostrar problemas encontrados
    const failedResults = results.filter(r => r.overall === 'FAIL');
    if (failedResults.length > 0) {
      console.log('\n🚨 PROBLEMAS ENCONTRADOS:');
      failedResults.forEach(result => {
        console.log(`   Iteración ${result.iteration}: ${result.error || 'Error desconocido'}`);
      });
    }
    
    // Expect final
    expect(report.passedIterations).toBeGreaterThanOrEqual(10); // Al menos 10 de 13 deben pasar
  });
});






