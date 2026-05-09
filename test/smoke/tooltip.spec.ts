import { test, expect } from '@playwright/test'

test.describe('Tooltip', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/test/smoke/tooltip.html')
        await page.waitForFunction(() => (window as any)._smokeReady === true)
    })

    test('TsTooltip global is available', async ({ page }) => {
        const hasTooltip = await page.evaluate(() => {
            return typeof (window as any).TsTooltip === 'object' && (window as any).TsTooltip !== null
        })
        expect(hasTooltip).toBe(true)
    })

    test('tooltip.attach() registers a named tooltip', async ({ page }) => {
        // verify that attach() registered the tooltip in Tooltip.active
        const isRegistered = await page.evaluate(() => {
            // Tooltip is the class exposed by the UMD bundle as part of TsTooltip module
            return typeof (window as any).Tooltip !== 'undefined'
                ? Object.prototype.hasOwnProperty.call((window as any).Tooltip.active, 'smoke-tip')
                : false
        })
        expect(isRegistered).toBe(true)
    })

    test('hover triggers mouseenter on anchor', async ({ page }) => {
        let mousenterFired = false

        // listen for mouseenter event before hovering
        await page.evaluate(() => {
            (window as any)._mouseenterFired = false
            document.getElementById('hover-target')!.addEventListener('mouseenter', () => {
                (window as any)._mouseenterFired = true
            })
        })

        await page.locator('#hover-target').hover()
        await page.waitForTimeout(200)

        const fired = await page.evaluate(() => (window as any)._mouseenterFired)
        expect(fired).toBe(true)
    })

    test('TsTooltip.show() returns an overlay object', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const res = (window as any).TsTooltip.show({
                anchor: document.getElementById('hover-target'),
                name: 'test-show-tip',
                text: 'show test'
            })
            return {
                hasOverlay: res && typeof res.overlay === 'object',
                overlayId: res?.overlay?.id ?? null
            }
        })
        expect(result.hasOverlay).toBe(true)
        expect(result.overlayId).toBe('w2overlay-test-show-tip')
    })
})
