import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function pwaShell() {
  return {
    name: 'circle-pwa-shell',
    async closeBundle() {
      const dist = join(dirname(fileURLToPath(import.meta.url)), 'dist')
      const files = []
      async function collect(folder, prefix = '') {
        for (const entry of await readdir(folder, { withFileTypes: true })) {
          const path = prefix ? `${prefix}/${entry.name}` : entry.name
          if (entry.isDirectory()) await collect(join(folder, entry.name), path)
          else files.push(`/${path}`)
        }
      }
      await collect(dist)
      const shellFiles = files.filter((path) => path === '/index.html' || /\.(?:js|css)$/i.test(path) || /^\/icons\//.test(path))
      await writeFile(join(dist, 'precache-manifest.json'), JSON.stringify(shellFiles))
      const version = createHash('sha256').update(shellFiles.join('\n')).digest('hex').slice(0, 10)
      const workerPath = join(dist, 'sw.js')
      const worker = await readFile(workerPath, 'utf8')
      await writeFile(workerPath, worker.replace("'circle-v1'", `'circle-${version}'`))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [tailwindcss(), react(), pwaShell()],
})
