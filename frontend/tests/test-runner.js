#!/usr/bin/env node

/**
 * 🧪 TEST RUNNER - 9001APP
 * Ejecuta 13 iteraciones de pruebas de navegación completa
 * Genera reportes detallados y formularios de problemas
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.results = [];
    this.problems = [];
    this.startTime = Date.now();
  }

  async runTests() {
    console.log('🚀 INICIANDO PRUEBAS AUTOMATIZADAS - 9001APP');
    console.log('===============================================');
    console.log('📊 Se ejecutarán 13 iteraciones de pruebas completas\n');

    const browser = await chromium.launch({ 
      headless: false, // Mostrar navegador para debugging
      slowMo: 1000 // Ralentizar acciones para mejor observación
    });

    for (let i = 1; i <= 13; i++) {
      console.log(`🔄 ITERACIÓN ${i}/13`);
      const result = await this.runIteration(browser, i);
      this.results.push(result);
      
      // Esperar entre iteraciones
      await this.sleep(1000);
    }

    await browser.close();
    
    this.generateReport();
    this.generateProblemForm();
  }

  async runIteration(browser, iteration) {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const result = {
      iteration,
      timestamp: new Date().toISOString(),
      tests: {},
      errors: [],
      performance: {}
    };

    try {
      // 1. Login
      console.log(`   🔐 Iteración ${iteration} - Login...`);
      await page.goto('http://localhost:3000/login');
      await page.fill('input[type="email"]', 'admin@9001app.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button:has-text("Iniciar Sesión")');
      await page.waitForURL(/.*dashboard/);
      result.tests.login = 'PASS';
      console.log(`   ✅ Login exitoso`);

      // 2. Dashboard
      console.log(`   🏠 Iteración ${iteration} - Dashboard...`);
      await page.waitForSelector('h1');
      const dashboardTitle = await page.textContent('h1');
      if (dashboardTitle.includes('Dashboard')) {
        result.tests.dashboard = 'PASS';
        console.log(`   ✅ Dashboard cargado`);
      } else {
        result.tests.dashboard = 'FAIL';
        result.errors.push('Dashboard no cargado correctamente');
      }

      // 3. Navegación del menú
      const menuItems = [
        { name: 'CRM', url: '/crm', selector: 'a[href="/crm"]' },
        { name: 'RRHH', url: '/rrhh', selector: 'a[href="/rrhh"]' },
        { name: 'Calidad', url: '/calidad', selector: 'a[href="/calidad"]' },
        { name: 'Procesos', url: '/procesos', selector: 'a[href="/procesos"]' },
        { name: 'Documentos', url: '/documentos', selector: 'a[href="/documentos"]' },
        { name: 'Normas', url: '/normas', selector: 'a[href="/normas"]' },
        { name: 'Mejoras', url: '/mejoras', selector: 'a[href="/mejoras"]' }
      ];

      for (const item of menuItems) {
        console.log(`   🔍 Iteración ${iteration} - ${item.name}...`);
        
        try {
          await page.click(item.selector);
          await page.waitForURL(new RegExp(`.*${item.url.replace('/', '')}`));
          
          // Verificar que no redirige al login
          const currentUrl = page.url();
          if (!currentUrl.includes('/login')) {
            result.tests[item.name.toLowerCase()] = 'PASS';
            console.log(`   ✅ ${item.name} accesible`);
          } else {
            result.tests[item.name.toLowerCase()] = 'FAIL';
            result.errors.push(`${item.name} redirige al login`);
            console.log(`   ❌ ${item.name} redirige al login`);
          }
        } catch (error) {
          result.tests[item.name.toLowerCase()] = 'FAIL';
          result.errors.push(`Error en ${item.name}: ${error.message}`);
          console.log(`   ❌ Error en ${item.name}: ${error.message}`);
        }

        // Volver al dashboard
        try {
          await page.click('a[href="/dashboard"]');
          await page.waitForURL(/.*dashboard/);
        } catch (error) {
          // Si no hay enlace al dashboard, ir directamente
          await page.goto('http://localhost:3000/dashboard');
        }
      }

      // 4. Verificar elementos de la interfaz
      console.log(`   🎨 Iteración ${iteration} - Verificando interfaz...`);
      
      // Sidebar
      const sidebar = await page.locator('[class*="bg-slate-800"]').isVisible();
      result.tests.sidebar = sidebar ? 'PASS' : 'FAIL';
      
      // Header
      const header = await page.locator('header').isVisible();
      result.tests.header = header ? 'PASS' : 'FAIL';

      // 5. Verificar errores de consola
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      await this.sleep(2000);
      
      result.tests.consoleErrors = consoleErrors.length === 0 ? 'PASS' : 'FAIL';
      if (consoleErrors.length > 0) {
        result.errors.push(`Errores de consola: ${consoleErrors.join(', ')}`);
      }

      // 6. Medir rendimiento
      const performance = await page.evaluate(() => {
        return {
          loadTime: performance.now(),
          memory: performance.memory?.usedJSHeapSize || 0
        };
      });
      
      result.performance = performance;
      result.tests.performance = performance.loadTime < 5000 ? 'PASS' : 'FAIL';

      result.overall = result.errors.length === 0 ? 'PASS' : 'FAIL';
      console.log(`   🎉 Iteración ${iteration} - ${result.overall}`);

    } catch (error) {
      result.overall = 'FAIL';
      result.errors.push(`Error general: ${error.message}`);
      console.log(`   ❌ Iteración ${iteration} - ERROR: ${error.message}`);
    }

    await context.close();
    return result;
  }

  generateReport() {
    const totalIterations = this.results.length;
    const passedIterations = this.results.filter(r => r.overall === 'PASS').length;
    const failedIterations = this.results.filter(r => r.overall === 'FAIL').length;
    const successRate = Math.round((passedIterations / totalIterations) * 100);

    console.log('\n📊 REPORTE FINAL:');
    console.log(`✅ Iteraciones exitosas: ${passedIterations}/${totalIterations}`);
    console.log(`❌ Iteraciones fallidas: ${failedIterations}/${totalIterations}`);
    console.log(`📈 Tasa de éxito: ${successRate}%`);

    // Resumen por módulo
    const moduleStats = {};
    const modules = ['login', 'dashboard', 'crm', 'rrhh', 'calidad', 'procesos', 'documentos', 'normas', 'mejoras', 'sidebar', 'header', 'consoleErrors', 'performance'];
    
    modules.forEach(module => {
      const passed = this.results.filter(r => r.tests[module] === 'PASS').length;
      moduleStats[module] = { passed, total: totalIterations, percentage: Math.round((passed / totalIterations) * 100) };
    });

    console.log('\n📋 RESUMEN POR MÓDULO:');
    Object.entries(moduleStats).forEach(([module, stats]) => {
      console.log(`   ${module}: ${stats.passed}/${stats.total} (${stats.percentage}%)`);
    });

    // Guardar reporte JSON
    const report = {
      testName: '9001app - Navegación Completa',
      timestamp: new Date().toISOString(),
      totalIterations,
      passedIterations,
      failedIterations,
      successRate: `${successRate}%`,
      duration: Date.now() - this.startTime,
      moduleStats,
      results: this.results
    };

    fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Reporte guardado en: test-report.json');
  }

  generateProblemForm() {
    const failedResults = this.results.filter(r => r.overall === 'FAIL');
    
    if (failedResults.length > 0) {
      console.log('\n🚨 PROBLEMAS ENCONTRADOS:');
      failedResults.forEach(result => {
        console.log(`   Iteración ${result.iteration}:`);
        result.errors.forEach(error => {
          console.log(`     - ${error}`);
        });
      });

      // Generar formulario de problemas
      const problemForm = {
        timestamp: new Date().toISOString(),
        totalProblems: failedResults.length,
        problems: failedResults.map(result => ({
          iteration: result.iteration,
          errors: result.errors,
          tests: result.tests,
          performance: result.performance
        })),
        recommendations: this.generateRecommendations(failedResults)
      };

      fs.writeFileSync('problem-form.json', JSON.stringify(problemForm, null, 2));
      console.log('\n📝 Formulario de problemas guardado en: problem-form.json');
    }
  }

  generateRecommendations(failedResults) {
    const recommendations = [];
    
    const loginIssues = failedResults.filter(r => r.tests.login === 'FAIL').length;
    const navigationIssues = failedResults.filter(r => 
      r.tests.crm === 'FAIL' || r.tests.rrhh === 'FAIL' || r.tests.calidad === 'FAIL'
    ).length;
    const performanceIssues = failedResults.filter(r => r.tests.performance === 'FAIL').length;
    const consoleIssues = failedResults.filter(r => r.tests.consoleErrors === 'FAIL').length;

    if (loginIssues > 0) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Problemas de autenticación',
        count: loginIssues,
        solution: 'Verificar sistema de login y credenciales demo'
      });
    }

    if (navigationIssues > 0) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Problemas de navegación',
        count: navigationIssues,
        solution: 'Revisar rutas y redirecciones en el layout principal'
      });
    }

    if (performanceIssues > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        issue: 'Problemas de rendimiento',
        count: performanceIssues,
        solution: 'Optimizar carga de componentes y reducir tiempo de respuesta'
      });
    }

    if (consoleIssues > 0) {
      recommendations.push({
        priority: 'LOW',
        issue: 'Errores de consola',
        count: consoleIssues,
        solution: 'Revisar y corregir errores JavaScript en la consola'
      });
    }

    return recommendations;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Ejecutar pruebas
async function main() {
  const runner = new TestRunner();
  await runner.runTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = TestRunner;






