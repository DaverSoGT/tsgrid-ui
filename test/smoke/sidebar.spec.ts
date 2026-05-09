import { test, expect } from '@playwright/test'

test.describe('Sidebar', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/test/smoke/sidebar.html')
        await page.waitForFunction(() => (window as any)._smokeReady === true)
        await page.waitForSelector('.tsg-sidebar', { state: 'attached' })
    })

    test('renders sidebar container', async ({ page }) => {
        await expect(page.locator('.tsg-sidebar')).toBeAttached()
    })

    test('renders tree nodes', async ({ page }) => {
        // tsg-node class for each tree node rendered
        const nodes = page.locator('.tsg-node')
        const count = await nodes.count()
        // 5 root-level + parent with 2 children = 7 total (children hidden until expanded)
        // But only root nodes visible before expand; count >= 5
        expect(count).toBeGreaterThanOrEqual(5)
    })

    test('sidebar nodes accessible via API', async ({ page }) => {
        const nodeCount = await page.evaluate(() => {
            return (window as any)._smokeSidebar.nodes.length
        })
        // 5 top-level nodes (root1, root2, parent1, root3, root4)
        expect(nodeCount).toBe(5)
    })

    test('expandable parent node exists', async ({ page }) => {
        const hasParent = await page.evaluate(() => {
            const sidebar = (window as any)._smokeSidebar
            const parent = sidebar.get('parent1')
            return parent !== null && parent.nodes && parent.nodes.length > 0
        })
        expect(hasParent).toBe(true)
    })

    test('expand parent node makes children visible in DOM', async ({ page }) => {
        await page.evaluate(() => {
            (window as any)._smokeSidebar.expand('parent1')
        })
        // after expand, children nodes should be rendered in DOM
        await page.waitForTimeout(200)
        const nodes = page.locator('.tsg-node')
        const count = await nodes.count()
        // now should have root nodes + children
        expect(count).toBeGreaterThanOrEqual(7)
    })
})
