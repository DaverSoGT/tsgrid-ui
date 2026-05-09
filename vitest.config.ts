import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        include: ['test/unit/**/*.test.ts'],
        exclude: ['test/smoke/**', 'node_modules/**', 'dist/**'],
        globals: false,
        watch: false,
    },
})
