import { getDb } from './firebase.js'

const cacheKey = (uid) => `circle-selection:${uid}`
const queueKey = (uid) => `circle-selection-queue:${uid}`

async function selectionReference(uid) {
  const [{ doc, runTransaction }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  return { reference: doc(db, 'users', uid, 'appData', 'selection'), runTransaction, db }
}

function normalizeSelection(data = {}) {
  return {
    favorites: Array.isArray(data.favorites) ? data.favorites : [],
    cart: Array.isArray(data.cart) ? data.cart : [],
  }
}

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback }
  catch { return fallback }
}

function readQueue(uid) { return readJson(queueKey(uid), []) }
function readCache(uid) { return normalizeSelection(readJson(cacheKey(uid), {})) }
function writeCache(uid, selection) { localStorage.setItem(cacheKey(uid), JSON.stringify(selection)) }

function applyChange(selection, change) {
  if (change.type === 'favorite') {
    const exists = selection.favorites.some((item) => String(item.id) === String(change.item.id))
    selection.favorites = exists
      ? selection.favorites.filter((item) => String(item.id) !== String(change.item.id))
      : [...selection.favorites, change.item]
    return selection
  }
  const existing = selection.cart.find((item) => String(item.id) === String(change.item.id))
  const quantity = (existing?.quantity || 0) + change.quantity
  selection.cart = selection.cart.filter((item) => String(item.id) !== String(change.item.id))
  if (quantity > 0) selection.cart.push({ ...change.item, quantity })
  return selection
}

function canSaveOffline(error) {
  return !navigator.onLine || ['unavailable', 'deadline-exceeded'].includes(error?.code)
}

async function updateUserSelection(uid, change) {
  if (!navigator.onLine) {
    const next = applyChange(readCache(uid), change)
    writeCache(uid, next)
    localStorage.setItem(queueKey(uid), JSON.stringify([...readQueue(uid), change]))
    return next
  }
  const { reference, runTransaction, db } = await selectionReference(uid)
  try {
    const selection = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(reference)
      const current = normalizeSelection(snapshot.data())
      const next = applyChange(current, change)
      transaction.set(reference, next)
      return next
    })
    writeCache(uid, selection)
    return selection
  } catch (error) {
    if (!canSaveOffline(error)) throw error
    const next = applyChange(readCache(uid), change)
    writeCache(uid, next)
    localStorage.setItem(queueKey(uid), JSON.stringify([...readQueue(uid), change]))
    return next
  }
}

export async function loadUserSelection(uid, guestSelection) {
  if (!navigator.onLine) return readCache(uid)
  const { reference, runTransaction, db } = await selectionReference(uid)
  const changes = readQueue(uid)
  try {
    const selection = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(reference)
      const current = snapshot.exists() ? normalizeSelection(snapshot.data()) : normalizeSelection(guestSelection)
      const next = changes.reduce(applyChange, current)
      transaction.set(reference, next)
      return next
    })
    writeCache(uid, selection)
    localStorage.removeItem(queueKey(uid))
    return selection
  } catch (error) {
    if (!canSaveOffline(error)) throw error
    const cached = readCache(uid)
    const next = changes.reduce(applyChange, cached)
    writeCache(uid, next)
    return next
  }
}

export function toggleFavoriteForUser(uid, item) {
  return updateUserSelection(uid, { type: 'favorite', item })
}

export function updateCartForUser(uid, item, quantity) {
  return updateUserSelection(uid, { type: 'cart', item, quantity })
}

export async function saveGuestSelection(selection) {
  localStorage.setItem('circle-favorites', JSON.stringify(selection.favorites))
  localStorage.setItem('circle-cart', JSON.stringify(selection.cart))
  return selection
}
