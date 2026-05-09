import { test, expect } from '@playwright/test'

test.describe('Layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/test/smoke/layout.html')
        await page.waitForFunction(() => (window as any)._smokeReady === true)
        await page.waitForSelector('.TsUi-layout', { state: 'attached' })
    })

    test('renders layout container', async ({ page }) => {
        await expect(page.locator('.TsUi-layout')).toBeAttached()
    })

    test('renders expected panel elements', async ({ page }) => {
        // TsUi renders panel wrapper divs; expect at least the 4 configured ones
        const panels = page.locator('.TsUi-panel')
        const count = await panels.count()
        expect(count).toBeGreaterThanOrEqual(4)
    })

    test('top panel contains expected text', async ({ page }) => {
        // panels are rendered inside the layout; check text presence
        const layoutEl = page.locator('.TsUi-layout')
        const text = await layoutEl.innerText()
        expect(text).toContain('Top Panel')
    })

    test('main panel contains expected text', async ({ page }) => {
        const layoutEl = page.locator('.TsUi-layout')
        const text = await layoutEl.innerText()
        expect(text).toContain('Main Panel')
    })

    test('layout API exposes panels array', async ({ page }) => {
        const panelCount = await page.evaluate(() => {
            return (window as any)._smokeLayout.panels.length
        })
        // TsLayout always has at least the configured panels (4); may include internal ones
        expect(panelCount).toBeGreaterThanOrEqual(4)
    })
})
