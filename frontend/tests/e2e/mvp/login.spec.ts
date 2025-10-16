import { expect, test } from "@playwright/test";
import { CREDENCIALES, SELECTORS, URLS } from "../../config/test-config-mvp";

/**
 * Tests E2E para Login MVP
 * Valida: Acceso con credenciales simplificadas
 */

test.describe("MVP - Login", () => {
    test.beforeEach(async ({ page }) => {
        // Navegar a la página de login
        await page.goto(URLS.login);
        await page.waitForLoadState("networkidle");
    });

    test("debe cargar la página de login correctamente", async ({ page }) => {
        // Verificar que el formulario de login está visible
        const loginForm = page.locator(SELECTORS.loginForm);
        await expect(loginForm).toBeVisible();

        // Verificar que los campos de email y contraseña están presentes
        const emailInput = page.locator(SELECTORS.emailInput);
        const passwordInput = page.locator(SELECTORS.passwordInput);

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
    });

    test("debe mostrar error con credenciales incorrectas", async ({ page }) => {
        // Llenar el formulario con credenciales incorrectas
        await page.fill(SELECTORS.emailInput, "incorrecto@ejemplo.com");
        await page.fill(SELECTORS.passwordInput, "contraseñaincorrecta");

        // Enviar el formulario
        await page.click(SELECTORS.loginButton);

        // Verificar que aparece un mensaje de error
        const errorMessage = page.locator(".alert");
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(/incorrecta|inválida|error/i);
    });

    test("debe iniciar sesión con credenciales correctas", async ({ page }) => {
        // Llenar el formulario con credenciales correctas
        await page.fill(SELECTORS.emailInput, CREDENCIALES.email);
        await page.fill(SELECTORS.passwordInput, CREDENCIALES.password);

        // Enviar el formulario
        await page.click(SELECTORS.loginButton);

        // Verificar que redirige al dashboard
        await page.waitForURL(URLS.dashboard);

        // Verificar que estamos en el dashboard
        const content = page.locator("body");
        await expect(content).toContainText(/Dashboard|Admin/i);
    });
});