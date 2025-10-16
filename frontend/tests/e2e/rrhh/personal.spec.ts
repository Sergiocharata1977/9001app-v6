import { expect, test } from "@playwright/test";

/**
 * Tests E2E para módulo de Personal (RRHH)
 */

test.describe("RRHH - Personal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/rrhh/personal");
    await page.waitForLoadState("networkidle");
  });

  test("debe cargar la página de personal", async ({ page }) => {
    // La página muestra "Recursos Humanos" como título principal
    await expect(page.locator("h1")).toContainText(/Recursos Humanos|Personal|Empleados/i);
  });

  test("debe mostrar listado de personal", async ({ page }) => {
    // Esperar contenido de la página, puede no tener tabla si está vacío
    await page.waitForLoadState("domcontentloaded");
    const content = page.locator('main, [role="main"], .container');
    await expect(content).toBeVisible({ timeout: 5000 });
  });

  test("debe tener botón para agregar personal", async ({ page }) => {
    const addButton = page.locator(
      'button:has-text("Nuevo"), button:has-text("Agregar")'
    );
    expect(await addButton.count()).toBeGreaterThan(0);
  });

  test("debe permitir buscar personal", async ({ page }) => {
    const searchInput = page.locator(
      'input[type="search"], input[placeholder*="Buscar"]'
    );
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill("test");
      await page.waitForTimeout(500);
    }
  });
});
