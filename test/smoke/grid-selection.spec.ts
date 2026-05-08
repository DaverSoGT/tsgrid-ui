import { test, expect } from '@playwright/test'

test.describe('Grid Selection', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/test/smoke/grid-selection.html')
        await page.waitForFunction(() => (window as any)._smokeReady === true)
        await page.waitForSelector('.w2ui-grid', { state: 'attached' })
        await page.waitForSelector('.w2ui-grid-records', { state: 'attached' })
    })

    test('renders grid with 5 rows', async ({ page }) => {
        const rows = page.locator('.w2ui-grid-records tr.w2ui-record')
        await expect(rows).toHaveCount(5)
    })

    test('getSelection returns empty array initially', async ({ page }) => {
        const selection = await page.evaluate(() => {
            return (window as any)._smokeGrid.getSelection()
        })
        expect(Array.isArray(selection)).toBe(true)
        expect(selection.length).toBe(0)
    })

    test('programmatic select sets selection', async ({ page }) => {
        await page.evaluate(() => {
            (window as any)._smokeGrid.select(1)
        })
        const selection = await page.evaluate(() => {
            return (window as any)._smokeGrid.getSelection()
        })
        expect(selection).toContain(1)
    })

    test('selectAll selects all 5 rows', async ({ page }) => {
        await page.evaluate(() => {
            (window as any)._smokeGrid.selectAll()
        })
        const selection = await page.evaluate(() => {
            return (window as any)._smokeGrid.getSelection()
        })
        expect(selection.length).toBe(5)
    })

    test('selectNone clears selection after selectAll', async ({ page }) => {
        await page.evaluate(() => {
            (window as any)._smokeGrid.selectAll()
            ;(window as any)._smokeGrid.selectNone()
        })
        const selection = await page.evaluate(() => {
            return (window as any)._smokeGrid.getSelection()
        })
        expect(selection.length).toBe(0)
    })
})
