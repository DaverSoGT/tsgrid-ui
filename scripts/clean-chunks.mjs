// clean-chunks.mjs — pre-build sweep for dist/chunks/
//
// Removes all files from dist/chunks/ before tsup runs so that orphan chunks
// from prior builds do not accumulate in the committed dist/. Invoked via the
// npm lifecycle hook "prebuild:js" in package.json.
//
// Design decisions:
// - Pure Node stdlib (fs + path): no shell commands, cross-platform safe (D-DOS-5)
// - fs.rmSync { force: true }: swallows ENOENT on first build; propagates EACCES/EBUSY (D-DOS-6)
// - fs.mkdirSync { recursive: true }: re-creates the directory so tsup finds its target (D-DOS-3)
// - path.join(__dirname): uses fileURLToPath for ESM __dirname equivalent (D-DOS-2, D-DOS-14)

import { rmSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_CHUNKS = join(__dirname, '..', 'dist', 'chunks')

rmSync(DIST_CHUNKS, { recursive: true, force: true })
mkdirSync(DIST_CHUNKS, { recursive: true })

console.log('[clean-chunks] removed dist/chunks/')
