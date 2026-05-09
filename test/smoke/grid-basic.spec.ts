import { test, expect } from '@playwright/test'

test.describe('Grid Basic', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/test/smoke/grid-basic.html')
        await page.waitForFunction(() => (window as any)._smokeReady === true)
        await page.waitForSelector('.tsg-grid', { state: 'attached' })
        await page.waitForSelector('.tsg-grid-records', { state: 'attached' })
    })

    test('renders grid container', async ({ page }) => {
        await expect(page.locator('.tsg-grid')).toBeAttached()
    })

    test('renders 10 data rows', async ({ page }) => {
        // tsg-record is the class for real data rows (excludes filler rows)
        const rows = page.locator('.tsg-grid-records tr.tsg-record')
        await expect(rows).toHaveCount(10)
    })

    test('renders 4 column headers', async ({ page }) => {
        const headers = page.locator('.tsg-col-header')
        const count = await headers.count()
        expect(count).toBeGreaterThanOrEqual(4)
    })

    test('DOM snapshot matches baseline', async ({ page }) => {
        const records = await page.locator('.tsg-grid-records').innerHTML()
        expect(records).toMatchSnapshot('grid-basic-records.txt')
    })
})
