const VERSION = 'circle-v1'
const SHELL = `${VERSION}-shell`
const STATIC = `${VERSION}-static`
const API = `${VERSION}-api`
const PAGES = `${VERSION}-pages`
const MAX_API_ENTRIES = 20

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const response = await fetch('/precache-manifest.json', { cache: 'no-store' })
    const files = await response.json()
    const shell = await caches.open(SHELL)
    await shell.addAll([...new Set([...files, '/offline.html', '/manifest.json'])])
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys()
    await Promise.all(names.filter((name) => name.startsWith('circle-') && ![SHELL, STATIC, API, PAGES].includes(name)).map((name) => caches.delete(name)))
    await self.clients.claim()
    const clients = await self.clients.matchAll({ type: 'window' })
    clients.forEach((client) => client.postMessage({ type: 'SW_ACTIVATED' }))
  })())
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})

async function trimApiCache(cache) {
  const keys = await cache.keys()
  while (keys.length > MAX_API_ENTRIES) await cache.delete(keys.shift())
}

async function trimCache(cache, limit) {
  const keys = await cache.keys()
  while (keys.length > limit) await cache.delete(keys.shift())
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET') return

  if (url.origin === 'https://api.sampleapis.com' && url.pathname === '/coffee/hot' && !request.headers.has('authorization')) {
    event.respondWith((async () => {
      const cache = await caches.open(API)
      try {
        const response = await fetch(request)
        if (response.ok) { await cache.put(request, response.clone()); await trimApiCache(cache) }
        return response
      } catch {
        return (await cache.match(request)) || new Response('Нет сохранённых данных меню', { status: 503 })
      }
    })())
    return
  }

  if (url.origin !== self.location.origin) return

  if (url.pathname.startsWith('/icons/') || /\.(?:png|jpe?g|svg|webp|woff2?)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC)
      const saved = await cache.match(request)
      if (saved) return saved
      try {
        const response = await fetch(request)
        if (response.ok) { await cache.put(request, response.clone()); await trimCache(cache, 50) }
        return response
      } catch { return new Response('', { status: 404 }) }
    })())
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request)
        if (response.ok) {
          const pages = await caches.open(PAGES)
          await pages.put(request, response.clone())
          const keys = await pages.keys()
          while (keys.length > 20) await pages.delete(keys.shift())
        }
        return response
      }
      catch {
        const shell = await caches.open(SHELL)
        const savedPage = await (await caches.open(PAGES)).match(request)
        return savedPage || (await shell.match('/index.html')) || (await shell.match('/offline.html'))
      }
    })())
  }
})
