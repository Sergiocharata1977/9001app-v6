import { expect, test } from "@playwright/test";
import { TEST_HELPERS, URLS } from "../../config/test-config-mvp";

/**
 * Tests E2E para Dashboard Super Admin MVP
 * Valida: Carga de dashboard, visualización de módulos, estado del sistema
 */

test.describe("MVP - Dashboard Super Admin", () => {
    // Realizar login antes de cada test
    test.beforeEach(async ({ page }) => {
        await TEST_HELPERS.login(page);
        // Navegar al dashboard de Super Admin
        await page.goto(URLS.superAdmin);
        await page.waitForLoadState("networkidle");
    });

    test("debe cargar el dashboard correctamente", async ({ page }) => {
        // Verificar título
        const title = page.locator("h1, h2").first();
        await expect(title).toContainText(/Dashboard|Super Admin/i);

        // Verificar que hay contenido
        const content = page.locator("main, [role='main']").first();
        await expect(content).toBeVisible();
    });

    test("debe mostrar estado de módulos", async ({ page }) => {
        // Buscar componente de estado de módulos
        const moduleStatus = page.locator("text=Estado de Módulos, text=Módulos Activos");

        // Verificar que existe algún contenido relacionado con módulos
        const hasModuleContent = await page.locator("text=/Módulos|RRHH|CRM|Documentos/i").count() > 0;
        expect(hasModuleContent).toBeTruthy();
    });

    test("debe mostrar estadísticas del sistema", async ({ page }) => {
        // Buscar componente de estadísticas
        const statsComponent = page.locator("text=Rendimiento del Sistema, text=Tests Pasando");

        // Verificar que hay alguna estadística visible
        const hasStats = await page.locator("text=/Salud|Memoria|CPU|Disco|Usuarios/i").count() > 0;
        expect(hasStats).toBeTruthy();
    });

    test("debe mostrar logs del sistema", async ({ page }) => {
        // Buscar componente de logs
        const logsComponent = page.locator("text=Logs del Sistema");

        // Verificar que hay algún log o contenedor de logs
        const hasLogs = await page.locator("text=/Info|Error|Advertencia|Éxito/i").count() > 0;
        expect(hasLogs).toBeTruthy();
    });

    test("debe tener botón de cierre de sesión", async ({ page }) => {
        // Buscar botón de logout
        const logoutButton = page.locator("button:has-text('Cerrar sesión')");

        // Verificar que existe
        await expect(logoutButton).toBeVisible();
    });
});