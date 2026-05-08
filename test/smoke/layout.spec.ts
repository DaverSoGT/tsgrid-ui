import { test, expect } from '@playwright/test'

test.describe('Layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/test/smoke/layout.html')
        await page.waitForFunction(() => (window as any)._smokeReady === true)
        await page.waitForSelector('.w2ui-layout', { state: 'attached' })
    })

    test('renders layout container', async ({ page }) => {
        await expect(page.locator('.w2ui-layout')).toBeAttached()
    })

    test('renders expected panel elements', async ({ page }) => {
        // w2ui renders panel wrapper divs; expect at least the 4 configured ones
        const panels = page.locator('.w2ui-panel')
        const count = await panels.count()
        expect(count).toBeGreaterThanOrEqual(4)
    })

    test('top panel contains expected text', async ({ page }) => {
        // panels are rendered inside the layout; check text presence
        const layoutEl = page.locator('.w2ui-layout')
        const text = await layoutEl.innerText()
        expect(text).toContain('Top Panel')
    })

    test('main panel contains expected text', async ({ page }) => {
        const layoutEl = page.locator('.w2ui-layout')
        const text = await layoutEl.innerText()
        expect(text).toContain('Main Panel')
    })

    test('layout API exposes panels array', async ({ page }) => {
        const panelCount = await page.evaluate(() => {
            return (window as any)._smokeLayout.panels.length
        })
        // w2layout always has at least the configured panels (4); may include internal ones
        expect(panelCount).toBeGreaterThanOrEqual(4)
    })
})
