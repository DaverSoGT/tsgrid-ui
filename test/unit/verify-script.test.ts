// font-externalization (v2.14.0): verify script regression guard (R-FE-10, FR-7)
// Asserts pkg.scripts.verify starts with "pnpm build &&" (NOT "pnpm build:js &&").
// This prevents silent W-3 reintroduction if a future cycle downgrades verify again.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

describe('verify script uses pnpm build (W-3 regression guard, R-FE-10)', () => {
    it('scripts.verify starts with "pnpm build &&" (NOT "pnpm build:js &&")', () => {
        expect(pkg.scripts.verify).toMatch(/^pnpm build &&/)
    })

    it('scripts.verify does NOT start with "pnpm build:js &&"', () => {
        expect(pkg.scripts.verify).not.toMatch(/^pnpm build:js &&/)
    })
})
