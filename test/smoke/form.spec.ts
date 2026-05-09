import { test, expect } from '@playwright/test'

test.describe('Form', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/test/smoke/form.html')
        await page.waitForFunction(() => (window as any)._smokeReady === true)
        await page.waitForSelector('.TsUi-form', { state: 'attached' })
    })

    test('renders form container', async ({ page }) => {
        await expect(page.locator('.TsUi-form')).toBeAttached()
    })

    test('renders 3 input fields', async ({ page }) => {
        const inputs = page.locator('input[name]')
        await expect(inputs).toHaveCount(3)
    })

    test('first_name field has correct initial value', async ({ page }) => {
        const input = page.locator('input[name="first_name"]')
        await expect(input).toHaveValue('Alice')
    })

    test('age field has correct initial value', async ({ page }) => {
        const input = page.locator('input[name="age"]')
        await expect(input).toHaveValue('30')
    })

    test('form record accessible via API', async ({ page }) => {
        const record = await page.evaluate(() => {
            return (window as any)._smokeForm.record
        })
        expect(record.first_name).toBe('Alice')
        expect(record.age).toBe(30)
    })
})
