const COFFEE_API = 'https://api.sampleapis.com/coffee/hot'
const CACHE_KEY = 'coffee:hot'
const CACHE_TTL = 5 * 60 * 1000
let cached = null
let pending = null
let generation = 0
const DB_NAME = 'circle-public-data'

function readOffline() {
  return new Promise((resolve) => {
    if (!('indexedDB' in window)) return resolve(null)
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore('responses')
    request.onsuccess = () => {
      const get = request.result.transaction('responses').objectStore('responses').get(CACHE_KEY)
      get.onsuccess = () => resolve(get.result ?? null)
      get.onerror = () => resolve(null)
    }
    request.onerror = () => resolve(null)
  })
}

function saveOffline(items) {
  if (!('indexedDB' in window)) return
  const request = indexedDB.open(DB_NAME, 1)
  request.onsuccess = () => request.result.transaction('responses', 'readwrite').objectStore('responses').put(items, CACHE_KEY)
}

async function fetchCoffee() {
  const requestGeneration = generation
  const response = await fetch(COFFEE_API)
  if (!response.ok) throw new Error(`Не удалось загрузить меню (${response.status})`)
  const items = await response.json()
  if (!Array.isArray(items)) throw new Error('API вернул данные в неожиданном формате')
  if (requestGeneration === generation) {
    cached = { items, expiresAt: Date.now() + CACHE_TTL, offline: false }
    saveOffline(items)
  }
  return items
}

export function getCoffeeItems({ force = false } = {}) {
  if (!force && cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.items)
  if (!force && pending) return pending
  const request = fetchCoffee().catch(async (error) => {
    const offlineItems = await readOffline()
    if (offlineItems) {
      cached = { items: offlineItems, expiresAt: 0, offline: true }
      return offlineItems
    }
    throw error
  })
  pending = request
  return request.finally(() => { if (pending === request) pending = null })
}

export function isCoffeeDataOffline() { return Boolean(cached?.offline || !navigator.onLine) }

export function invalidateCoffeeCache() {
  generation += 1
  cached = null
  pending = null
}

export { CACHE_KEY as coffeeQueryKey }
