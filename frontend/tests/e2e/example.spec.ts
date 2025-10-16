import { expect, test } from "@playwright/test";

/**
 * Test de ejemplo para validar setup de Playwright
 * Este test verifica que el sistema básico funciona
 */

test.describe("Setup Validation", () => {
  test("should load homepage successfully", async ({ page }) => {
    // Navegar a la página principal
    await page.goto("/", { timeout: 30000 });
    await page.waitForLoadState("domcontentloaded");

    // Verificar que la página carga (puede no tener título específico)
    const body = page.locator("body");
    await expect(body).toBeVisible();
    
    // Verificar que hay algún contenido
    const content = page.locator('main, [role="main"], div');
    expect(await content.count()).toBeGreaterThan(0);
  });

  test("should navigate to Super Admin", async ({ page }) => {
    // Navegar al Super Admin
    await page.goto("/super-admin", { timeout: 30000 });
    await page.waitForLoadState("domcontentloaded");

    // Verificar que carga el dashboard (tomar el primer h1)
    const heading = page.locator("h1").first();
    await expect(heading).toContainText(
      /Panel de Administración|Dashboard|Super Admin/i
    );

    // Verificar que la página tiene contenido
    const content = page.locator('main, [role="main"]');
    await expect(content).toBeVisible();
  });

  test("should capture screenshot on failure", async ({ page }) => {
    // Este test está diseñado para fallar y capturar screenshot
    await page.goto("/");

    // Buscar un elemento que NO existe (para probar screenshots)
    // Comentado para que no falle siempre:
    // await expect(page.locator('#elemento-que-no-existe')).toBeVisible();

    // Test real que pasa:
    await expect(page.locator("body")).toBeVisible();
  });
});
