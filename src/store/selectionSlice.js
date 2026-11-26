import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import {
  loadUserSelection, saveGuestSelection, toggleFavoriteForUser, updateCartForUser,
} from '../services/userSelectionApi.js'

const readList = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]') }
  catch { return [] }
}
const guestSelection = () => ({ favorites: readList('circle-favorites'), cart: readList('circle-cart') })

export const loadSelection = createAsyncThunk('selection/load', async (uid) => {
  if (!uid) return guestSelection()
  return loadUserSelection(uid, guestSelection())
}, { condition: (uid, { getState }) => getState().selection.status !== 'loading' || getState().selection.uid !== uid })

export const toggleFavorite = createAsyncThunk('selection/toggleFavorite', async ({ item, uid }, { getState }) => {
  const selection = getState().selection
  if (uid) return toggleFavoriteForUser(uid, item)
  const favorites = selection.favorites.some((saved) => String(saved.id) === String(item.id))
    ? selection.favorites.filter((saved) => String(saved.id) !== String(item.id))
    : [...selection.favorites, item]
  return saveGuestSelection({ favorites, cart: selection.cart })
})

export const changeCartQuantity = createAsyncThunk('selection/changeCart', async ({ item, quantity, uid }, { getState }) => {
  const selection = getState().selection
  if (uid) return updateCartForUser(uid, item, quantity)
  const current = selection.cart.find((saved) => String(saved.id) === String(item.id))
  const nextQuantity = (current?.quantity || 0) + quantity
  const cart = selection.cart.filter((saved) => String(saved.id) !== String(item.id))
  if (nextQuantity > 0) cart.push({ ...item, quantity: nextQuantity })
  return saveGuestSelection({ favorites: selection.favorites, cart })
})

const selectionSlice = createSlice({
  name: 'selection',
  initialState: { favorites: [], cart: [], uid: null, status: 'idle', mutationStatus: 'idle', error: '', requestId: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSelection.pending, (state, action) => {
        state.status = 'loading'; state.error = ''; state.uid = action.meta.arg; state.requestId = action.meta.requestId
        state.favorites = []; state.cart = []
      })
      .addCase(loadSelection.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = 'success'; state.favorites = action.payload.favorites; state.cart = action.payload.cart; state.requestId = null
      })
      .addCase(loadSelection.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = 'error'; state.error = action.error.message || 'Не удалось загрузить ваши товары'; state.requestId = null
      })
      .addMatcher((action) => [toggleFavorite.pending.type, changeCartQuantity.pending.type].includes(action.type), (state) => {
        state.mutationStatus = 'loading'; state.error = ''
      })
      .addMatcher((action) => [toggleFavorite.fulfilled.type, changeCartQuantity.fulfilled.type].includes(action.type), (state, action) => {
        if (state.uid !== action.meta.arg.uid) return
        state.mutationStatus = 'success'; state.favorites = action.payload.favorites; state.cart = action.payload.cart
      })
      .addMatcher((action) => [toggleFavorite.rejected.type, changeCartQuantity.rejected.type].includes(action.type), (state, action) => {
        if (state.uid !== action.meta.arg.uid) return
        state.mutationStatus = 'error'; state.error = action.error.message || 'Не удалось сохранить изменения'
      })
  },
})

export default selectionSlice.reducer
export const selectFavorites = (state) => state.selection.favorites
export const selectCart = (state) => state.selection.cart
export const selectSelectionStatus = (state) => state.selection.status
export const selectSelectionError = (state) => state.selection.error
export const selectSelectionBusy = (state) => state.selection.mutationStatus === 'loading'
export const selectFavoriteIds = createSelector([selectFavorites], (items) => new Set(items.map((item) => String(item.id))))
export const selectCartCount = createSelector([selectCart], (items) => items.reduce((total, item) => total + item.quantity, 0))
