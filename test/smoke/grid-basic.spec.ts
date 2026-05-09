import { test, expect } from '@playwright/test'

test.describe('Grid Basic', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/test/smoke/grid-basic.html')
        await page.waitForFunction(() => (window as any)._smokeReady === true)
        await page.waitForSelector('.TsUi-grid', { state: 'attached' })
        await page.waitForSelector('.TsUi-grid-records', { state: 'attached' })
    })

    test('renders grid container', async ({ page }) => {
        await expect(page.locator('.TsUi-grid')).toBeAttached()
    })

    test('renders 10 data rows', async ({ page }) => {
        // TsUi-record is the class for real data rows (excludes filler rows)
        const rows = page.locator('.TsUi-grid-records tr.TsUi-record')
        await expect(rows).toHaveCount(10)
    })

    test('renders 4 column headers', async ({ page }) => {
        const headers = page.locator('.TsUi-col-header')
        const count = await headers.count()
        expect(count).toBeGreaterThanOrEqual(4)
    })

    test('DOM snapshot matches baseline', async ({ page }) => {
        const records = await page.locator('.TsUi-grid-records').innerHTML()
        expect(records).toMatchSnapshot('grid-basic-records.txt')
    })
})
