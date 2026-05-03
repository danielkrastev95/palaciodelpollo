import { test, expect } from "@playwright/test"

test.describe("Reserva de mesa", () => {
  test("muestra el formulario de reserva en la home", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: /reservar/i }).first().click()
    await expect(page.locator("#reservar")).toBeVisible()
    await expect(page.getByText("Reservar mesa")).toBeVisible()
  })

  test("puede seleccionar comensales y avanzar al paso 1", async ({ page }) => {
    await page.goto("/#reservar")
    // Seleccionar 4 comensales
    await page.getByRole("button", { name: "4 personas" }).click()
    // El botón de paso 1 debe estar visible
    await expect(page.getByRole("button", { name: /siguiente/i })).toBeDisabled()
  })

  test("el step 2 muestra el resumen del paso 1", async ({ page }) => {
    await page.goto("/#reservar")
    // Seleccionar comensales
    await page.getByRole("button", { name: "2 personas" }).click()
    // Seleccionar el primer día disponible (no pasado)
    const firstAvailable = page.locator(".cal-day:not(.disabled)").first()
    await firstAvailable.click()
    // Seleccionar un horario
    const firstSlot = page.locator(".time-btn:not(.disabled)").first()
    await firstSlot.click()
    // Avanzar al step 2
    await page.getByRole("button", { name: /siguiente/i }).click()
    // El resumen debe mostrar "personas"
    await expect(page.locator("text=personas")).toBeVisible()
  })
})
