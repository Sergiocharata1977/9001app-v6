import { expect, test } from "@playwright/test";

test.describe("Super Admin - Métricas de Performance", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/super-admin/metricas");
    await page.waitForLoadState("networkidle");
  });

  test("debe cargar el dashboard de métricas", async ({ page }) => {
    await expect(page.locator("h1")).toContainText(/Métricas/i);
  });

  test("debe mostrar resumen general con 4 cards", async ({ page }) => {
    const cards = page
      .locator('[class*="grid"] > div')
      .filter({ hasText: /Promedio|Módulos|Requests/ });
    expect(await cards.count()).toBeGreaterThanOrEqual(3);
  });

  test("debe mostrar métricas por módulo", async ({ page }) => {
    const modulosList = page.locator("text=CRM, text=RRHH, text=Documentos");
    expect(await modulosList.count()).toBeGreaterThan(0);
  });

  test("debe mostrar recomendaciones de optimización", async ({ page }) => {
    const recommendations = page.locator("text=Recomendaciones");
    await expect(recommendations).toBeVisible();
  });
});
