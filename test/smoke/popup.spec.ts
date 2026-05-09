import { test, expect } from '@playwright/test'

test.describe('Popup', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/test/smoke/popup.html')
        await page.waitForFunction(() => (window as any)._smokeReady === true)
    })

    test('TsPopup global is available', async ({ page }) => {
        const hasPopup = await page.evaluate(() => {
            return typeof (window as any).TsPopup === 'object' && (window as any).TsPopup !== null
        })
        expect(hasPopup).toBe(true)
    })

    test('popup opens and renders title', async ({ page }) => {
        await page.click('#btn-open')
        await page.waitForSelector('.tsg-popup', { state: 'attached' })
        await expect(page.locator('.tsg-popup')).toBeAttached()
        const title = await page.locator('.tsg-popup-title').innerText()
        expect(title).toContain('Smoke Test Popup')
    })

    test('popup body renders content', async ({ page }) => {
        await page.click('#btn-open')
        await page.waitForSelector('.tsg-popup', { state: 'attached' })
        await page.waitForSelector('#popup-body-content', { state: 'attached' })
        const body = page.locator('#popup-body-content')
        await expect(body).toBeAttached()
        const text = await body.innerText()
        expect(text).toContain('Hello from smoke test')
    })

    test('TsAlert API is available and callable', async ({ page }) => {
        const hasAlert = await page.evaluate(() => {
            return typeof (window as any).TsAlert === 'function'
        })
        expect(hasAlert).toBe(true)
    })

    test('TsConfirm API is available and callable', async ({ page }) => {
        const hasConfirm = await page.evaluate(() => {
            return typeof (window as any).TsConfirm === 'function'
        })
        expect(hasConfirm).toBe(true)
    })

    test('TsPrompt API is available and callable', async ({ page }) => {
        const hasPrompt = await page.evaluate(() => {
            return typeof (window as any).TsPrompt === 'function'
        })
        expect(hasPrompt).toBe(true)
    })
})
