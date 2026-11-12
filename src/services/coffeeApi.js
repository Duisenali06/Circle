const COFFEE_API = 'https://api.sampleapis.com/coffee/hot'
const CACHE_KEY = 'coffee:hot'
const CACHE_TTL = 5 * 60 * 1000
let cached = null
let pending = null
let generation = 0

async function fetchCoffee() {
  const requestGeneration = generation
  const response = await fetch(COFFEE_API)
  if (!response.ok) throw new Error(`Не удалось загрузить меню (${response.status})`)
  const items = await response.json()
  if (!Array.isArray(items)) throw new Error('API вернул данные в неожиданном формате')
  if (requestGeneration === generation) cached = { items, expiresAt: Date.now() + CACHE_TTL }
  return items
}

export function getCoffeeItems({ force = false } = {}) {
  if (!force && cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.items)
  if (!force && pending) return pending
  const request = fetchCoffee()
  pending = request
  return request.finally(() => { if (pending === request) pending = null })
}

export function invalidateCoffeeCache() {
  generation += 1
  cached = null
  pending = null
}

export { CACHE_KEY as coffeeQueryKey }
