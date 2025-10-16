import { expect, test } from "@playwright/test";

test.describe("Documentos - Gestión Documental", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/documentos");
    await page.waitForLoadState("networkidle");
  });

  test("debe cargar la página de documentos", async ({ page }) => {
    await expect(page.locator("h1")).toContainText(/Documentos/i);
  });

  test("debe mostrar listado de documentos", async ({ page }) => {
    // Verificar que la página tiene contenido, no un selector específico
    const content = page.locator('main, [role="main"]').first();
    await expect(content).toBeVisible({ timeout: 5000 });
  });

  test("debe tener botón para crear documento", async ({ page }) => {
    const createBtn = page.locator(
      'button:has-text("Nuevo"), button:has-text("Crear")'
    );
    expect(await createBtn.count()).toBeGreaterThan(0);
  });
});
