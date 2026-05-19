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
            // environment: 'node' is the DESIGN INTENT from spec #1185, restored in
            // v3.0.4 once src/ stopped referencing DOM globals at runtime (replaced
            // by isDOMNode/isDOMEvent/isHTMLElement/isDOMWindow helpers).
            // icons-treeshake.test.ts has // @vitest-environment node pragma which
            // remains; tests that require real DOM use // @vitest-environment jsdom.
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
                    environment: 'node',
                },
            },
        ],
    },
})
