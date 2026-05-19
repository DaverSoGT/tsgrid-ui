import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        projects: [
            // serial-build: build-determinism-js runs pnpm build:js twice, mutating
            // dist/chunks/. Must be isolated so no other test reads dist/ while it runs.
            // fileParallelism: false serializes execution within this project.
            {
                test: {
                    name: 'serial-build',
                    include: ['test/unit/build-determinism-js.test.ts'],
                    environment: 'node',
                    fileParallelism: false,
                },
            },
            // parallel: all other unit tests — read dist/ at rest, no build mutation.
            // environment: 'jsdom' matches the previous global default; many source
            // files reference DOM globals (Node, Event) at module load time.
            // icons-treeshake.test.ts has // @vitest-environment node pragma which
            // overrides to 'node' for that single file.
            {
                test: {
                    name: 'parallel',
                    include: ['test/unit/**/*.test.ts'],
                    exclude: [
                        'test/unit/build-determinism-js.test.ts',
                        'test/smoke/**',
                        'dist/**',
                        'node_modules/**',
                    ],
                    environment: 'jsdom',
                },
            },
        ],
    },
})
