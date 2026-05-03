import { test, expect } from "@playwright/test"

test.describe("Página de encargos", () => {
  test("carga la carta desde el menú", async ({ page }) => {
    await page.goto("/encargar")
    await expect(page.getByRole("heading", { name: /elige lo que/i })).toBeVisible()
    // Espera que cargue el menú (tabs de categorías)
    await expect(page.locator(".menu-tabs")).toBeVisible({ timeout: 10_000 })
  })

  test("permite añadir platos al carrito", async ({ page }) => {
    await page.goto("/encargar")
    await page.locator(".menu-tabs").waitFor()
    // Añadir el primer plato disponible
    const addBtn = page.getByRole("button", { name: /añadir/i }).first()
    await addBtn.click()
    // El carrito debe mostrar 1 plato
    await expect(page.locator("text=1 plato")).toBeVisible()
  })

  test("el botón de confirmar está deshabilitado si falta info", async ({ page }) => {
    await page.goto("/encargar")
    await expect(page.getByRole("button", { name: /confirmar pedido/i })).toBeDisabled()
  })
})
