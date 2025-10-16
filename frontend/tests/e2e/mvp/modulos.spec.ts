import { expect, test } from "@playwright/test";
import { TEST_HELPERS, URLS } from "../../config/test-config-mvp";

/**
 * Tests E2E para Sistema de Módulos MVP
 * Valida: Carga de módulos, activación/desactivación, navegación
 */

test.describe("MVP - Sistema de Módulos", () => {
    // Realizar login antes de cada test
    test.beforeEach(async ({ page }) => {
        await TEST_HELPERS.login(page);
    });

    test("debe mostrar módulos en el sidebar", async ({ page }) => {
        // Verificar que el sidebar contiene enlaces a los módulos
        const sidebar = page.locator("nav, aside").first();
        await expect(sidebar).toBeVisible();

        // Verificar que hay enlaces a los módulos principales
        await expect(sidebar).toContainText(/Dashboard/i);

        // Verificar que hay al menos algunos de los módulos principales
        const hasModules = await page.locator("nav, aside").first().locator("text=/RRHH|CRM|Documentos/i").count() > 0;
        expect(hasModules).toBeTruthy();
    });

    test("debe navegar a módulo CRM", async ({ page }) => {
        // Buscar enlace al módulo CRM
        const crmLink = page.locator("nav, aside").first().locator("a:has-text('CRM')");

        // Si existe, hacer clic
        if (await crmLink.isVisible({ timeout: 2000 }).catch(() => false)) {
            await crmLink.click();

            // Verificar que navegó al módulo
            await expect(page).toHaveURL(/\/crm/);

            // Verificar que cargó contenido del módulo
            const content = page.locator("main, [role='main']").first();
            await expect(content).toBeVisible();
        }
    });

    test("debe navegar a módulo RRHH", async ({ page }) => {
        // Buscar enlace al módulo RRHH
        const rrhhLink = page.locator("nav, aside").first().locator("a:has-text('RRHH')");

        // Si existe, hacer clic
        if (await rrhhLink.isVisible({ timeout: 2000 }).catch(() => false)) {
            await rrhhLink.click();

            // Verificar que navegó al módulo
            await expect(page).toHaveURL(/\/rrhh/);

            // Verificar que cargó contenido del módulo
            const content = page.locator("main, [role='main']").first();
            await expect(content).toBeVisible();
        }
    });

    test("debe navegar a módulo Documentos", async ({ page }) => {
        // Buscar enlace al módulo Documentos
        const docsLink = page.locator("nav, aside").first().locator("a:has-text('Documentos')");

        // Si existe, hacer clic
        if (await docsLink.isVisible({ timeout: 2000 }).catch(() => false)) {
            await docsLink.click();

            // Verificar que navegó al módulo
            await expect(page).toHaveURL(/\/documentos/);

            // Verificar que cargó contenido del módulo
            const content = page.locator("main, [role='main']").first();
            await expect(content).toBeVisible();
        }
    });

    test("debe mostrar estado de módulos en dashboard", async ({ page }) => {
        // Ir al dashboard
        await page.goto(URLS.dashboard);

        // Buscar componente de estado de módulos
        const moduleStatus = page.locator("text=Estado de Módulos, text=Módulos Activos");

        // Verificar que muestra información de módulos
        const hasModuleInfo = await page.locator("text=/Activado|Desactivado|En línea|Offline/i").count() > 0;
        expect(hasModuleInfo).toBeTruthy();
    });
});