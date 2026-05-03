import { test, expect } from "@playwright/test"

test.describe("Panel de administración", () => {
  test("redirige al login si no está autenticado", async ({ page }) => {
    await page.goto("/admin/dashboard")
    // Debe redirigir a /admin (login)
    await expect(page).toHaveURL(/\/admin$/)
  })

  test("la página de login muestra el formulario", async ({ page }) => {
    await page.goto("/admin")
    await expect(page.getByRole("button", { name: /acceder/i })).toBeVisible()
  })

  test("login fallido muestra error", async ({ page }) => {
    await page.goto("/admin")
    await page.getByLabel(/contraseña/i).fill("wrong-password")
    await page.getByRole("button", { name: /acceder/i }).click()
    await expect(page.locator("text=/incorrecta|error/i")).toBeVisible({ timeout: 5_000 })
  })
})
