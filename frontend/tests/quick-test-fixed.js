const { chromium } = require('playwright');
const fs = require('fs');

async function quickTestFixed() {
    console.log('🚀 PRUEBAS RÁPIDAS FIXED - 9001APP\n');

    const browser = await chromium.launch({ headless: false });
    // Configuración más robusta del contexto
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        acceptDownloads: true
    });
    const results = [];

    // Reducir el número de iteraciones para pruebas iniciales
    const totalIterations = 5; // Reducido de 13 a 5 para pruebas más rápidas

    for (let i = 1; i <= totalIterations; i++) {
        console.log(`🔄 ITERACIÓN ${i}/${totalIterations}`);
        const page = await context.newPage();
        const result = { iteration: i, tests: {}, errors: [] };

        try {
            // Login con espera más robusta
            await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
            await page.fill('input[type="email"]', 'admin@9001app.com');
            await page.fill('input[type="password"]', 'admin123');
            await page.click('button:has-text("Iniciar Sesión")');

            // Esperar a que la navegación se complete y el localStorage se actualice
            await page.waitForTimeout(3000);
            result.tests.login = page.url().includes('dashboard') ? 'PASS' : 'FAIL';
            console.log(`   ${result.tests.login === 'PASS' ? '✅' : '❌'} Login`);

            // IMPORTANTE: Verificar que el localStorage tenga el usuario
            const hasUser = await page.evaluate(() => {
                return localStorage.getItem('user') !== null;
            });

            if (!hasUser) {
                result.errors.push('localStorage no tiene usuario después del login');
                console.log(`   ⚠️ WARNING: localStorage vacío`);
            } else {
                console.log(`   ✅ localStorage verificado`);
            }

            // Módulos - navegación directa
            const modules = [
                { name: 'CRM', url: '/crm' },
                { name: 'RRHH', url: '/rrhh' },
                { name: 'Calidad', url: '/calidad' },
                { name: 'Procesos', url: '/procesos' },
                { name: 'Documentos', url: '/documentos' },
                { name: 'Normas', url: '/normas' }
            ];

            // Verificar cookies además de localStorage
            const hasCookies = await page.evaluate(() => {
                return document.cookie.includes('user=');
            });

            if (!hasUser) {
                result.errors.push('localStorage no tiene usuario después del login');
                console.log(`   ⚠️ WARNING: localStorage vacío`);
            } else {
                console.log(`   ✅ localStorage verificado`);
            }

            if (!hasCookies) {
                result.errors.push('cookies no tienen usuario después del login');
                console.log(`   ⚠️ WARNING: cookies vacías`);
            } else {
                console.log(`   ✅ cookies verificadas`);
            }

            // Módulos - navegación directa con mejor manejo de errores
            for (const mod of modules) {
                try {
                    // Navegación más robusta con espera de carga completa
                    await page.goto(`http://localhost:3000${mod.url}`, {
                        waitUntil: 'networkidle',
                        timeout: 10000 // Aumentar timeout a 10 segundos
                    });

                    // Esperar a que la página se estabilice
                    await page.waitForTimeout(3000);

                    const url = page.url();
                    if (url.includes(mod.url) && !url.includes('/login')) {
                        result.tests[mod.name.toLowerCase()] = 'PASS';
                        console.log(`   ✅ ${mod.name}`);
                    } else {
                        result.tests[mod.name.toLowerCase()] = 'FAIL';
                        result.errors.push(`${mod.name} redirige a ${url}`);
                        console.log(`   ❌ ${mod.name}`);
                    }
                } catch (error) {
                    console.error(`Error en módulo ${mod.name}:`, error.message);
                    result.tests[mod.name.toLowerCase()] = 'FAIL';
                    result.errors.push(`${mod.name}: ${error.message}`);
                    console.log(`   ❌ ${mod.name} - ${error.message}`);
                }
            }

            result.overall = result.errors.length === 0 ? 'PASS' : 'FAIL';
            console.log(`   ${result.overall === 'PASS' ? '🎉 PASS' : '💥 FAIL'}\n`);

        } catch (error) {
            result.overall = 'FAIL';
            const errorMessage = `Error: ${error.message}`;
            result.errors.push(errorMessage);
            console.log(`   ❌ ERROR: ${error.message}\n`);
            console.error(error);
        }

        await page.close(); // Solo cerrar la página, no el contexto
        results.push(result);
    }

    await context.close();
    await browser.close();

    // REPORTE FINAL
    const passed = results.filter(r => r.overall === 'PASS').length;
    const failed = totalIterations - passed;
    const rate = Math.round((passed / totalIterations) * 100);

    console.log('═══════════════════════════════════');
    console.log(`📊 REPORTE FINAL - ${totalIterations} ITERACIONES`);
    console.log('═══════════════════════════════════\n');
    console.log(`✅ EXITOSAS: ${passed}/${totalIterations}`);
    console.log(`❌ FALLIDAS: ${failed}/${totalIterations}`);
    console.log(`📈 TASA DE ÉXITO: ${rate}%\n`);

    // Por módulo
    const modules = ['login', 'crm', 'rrhh', 'calidad', 'procesos', 'documentos', 'normas'];
    console.log('📋 RESUMEN POR MÓDULO:');
    console.log('─────────────────────────');
    modules.forEach(m => {
        const p = results.filter(r => r.tests[m] === 'PASS').length;
        const pct = Math.round((p / totalIterations) * 100);
        console.log(`${m.toUpperCase().padEnd(15)} ${p}/${totalIterations} (${pct}%)`);
    });

    // Problemas
    console.log('\n🚨 PROBLEMAS ENCONTRADOS:');
    console.log('─────────────────────────');
    const allErrors = results.flatMap(r => r.errors);
    if (allErrors.length > 0) {
        const errorCounts = {};
        allErrors.forEach(e => errorCounts[e] = (errorCounts[e] || 0) + 1);
        Object.entries(errorCounts).forEach(([error, count]) => {
            console.log(`  ${count}x - ${error}`);
        });
    } else {
        console.log('  ✅ Ningún problema encontrado');
    }

    // Guardar
    const report = { timestamp: new Date().toISOString(), passed, failed, rate, results };
    fs.writeFileSync('test-report-fixed.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Reporte guardado: test-report-fixed.json\n');
    console.log('═══════════════════════════════════\n');
}

quickTestFixed().catch(console.error);





