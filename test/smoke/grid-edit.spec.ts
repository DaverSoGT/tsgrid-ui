import { test, expect } from '@playwright/test'

test.describe('Grid Edit', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/test/smoke/grid-edit.html')
        await page.waitForFunction(() => (window as any)._smokeReady === true)
        await page.waitForSelector('.tsg-grid', { state: 'attached' })
        await page.waitForSelector('.tsg-grid-records', { state: 'attached' })
    })

    test('renders editable grid', async ({ page }) => {
        await expect(page.locator('.tsg-grid')).toBeAttached()
    })

    test('renders 3 data rows', async ({ page }) => {
        const rows = page.locator('.tsg-grid-records tr.tsg-record')
        await expect(rows).toHaveCount(3)
    })

    test('first row contains correct name value', async ({ page }) => {
        const firstRow = page.locator('.tsg-grid-records tr.tsg-record').first()
        const text = await firstRow.innerText()
        expect(text).toContain('Item One')
    })

    test('getChanges returns empty array initially', async ({ page }) => {
        const changes = await page.evaluate(() => {
            return (window as any)._smokeGrid.getChanges()
        })
        expect(Array.isArray(changes)).toBe(true)
        expect(changes.length).toBe(0)
    })
})
