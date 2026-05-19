import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        include: ['test/unit/**/*.test.ts'],
        exclude: ['test/smoke/**', 'node_modules/**', 'dist/**'],
        globals: false,
        watch: false,
        // build-determinism-js sweeps dist/chunks/ via pnpm build:js (prebuild:js hook)
        // during test execution. Concurrent runs of this test with other tests that read
        // dist/chunks/ (icons-treeshake, chunks-orphan-free, build-output) cause FS races.
        // Use a single thread so test files run one at a time in the same process. (v3.0.2)
        pool: 'threads',
        singleThread: true,
    },
})
