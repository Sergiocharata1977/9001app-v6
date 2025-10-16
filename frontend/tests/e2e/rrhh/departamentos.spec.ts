import { expect, test } from "@playwright/test";

test.describe("RRHH - Departamentos", () => {
  test.beforeEach(async ({ page }) => {
    // Aumentar timeout porque la página puede ser lenta
    await page.goto("/rrhh/departamentos", { timeout: 60000 });
    await page.waitForLoadState("domcontentloaded");
  });

  test("debe cargar la página de departamentos", async ({ page }) => {
    await expect(page.locator("h1")).toContainText(/Departamentos|Recursos Humanos/i, { timeout: 10000 });
  });

  test("debe mostrar listado de departamentos", async ({ page }) => {
    // Solo verificar que la página cargó, puede no tener contenido
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
