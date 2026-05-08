import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './test/smoke',
    snapshotDir: './test/smoke/__snapshots__',
    outputDir: './test/smoke/__results__',
    fullyParallel: false,
    forbidOnly: !!process.env['CI'],
    retries: 0,
    workers: 1,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:3500',
        trace: 'off',
        screenshot: 'off',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: 'python -m http.server 3500',
        url: 'http://localhost:3500',
        reuseExistingServer: true,
        timeout: 30_000,
    },
})
