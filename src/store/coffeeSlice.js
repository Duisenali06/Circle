import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { getCoffeeDetails, getCoffeeItems, isCoffeeDataOffline } from '../services/coffeeApi.js'

export const fetchCoffeeItems = createAsyncThunk('coffee/fetchItems', async ({ force = false } = {}, { rejectWithValue }) => {
  try { return await getCoffeeItems({ force }) }
  catch (error) { return rejectWithValue(error.message || 'Не удалось загрузить меню') }
}, { condition: ({ force } = {}, { getState }) => force || getState().coffee.status !== 'loading' })

export const fetchCoffeeDetails = createAsyncThunk('coffee/fetchDetails', async (id, { rejectWithValue }) => {
  try {
    return await getCoffeeDetails(id)
  } catch (error) { return rejectWithValue(error.message || 'Не удалось загрузить напиток') }
})

const coffeeSlice = createSlice({
  name: 'coffee',
  initialState: { items: [], status: 'idle', error: '', offlineData: false, requestId: null, details: {}, detailsStatus: 'idle', detailsError: '', detailsRequestId: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoffeeItems.pending, (state, action) => { state.status = 'loading'; state.error = ''; state.requestId = action.meta.requestId })
      .addCase(fetchCoffeeItems.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = 'success'; state.items = action.payload; state.offlineData = isCoffeeDataOffline()
        state.requestId = null
      })
      .addCase(fetchCoffeeItems.rejected, (state, action) => {
        if (action.meta.condition || state.requestId !== action.meta.requestId) return
        state.status = 'error'; state.error = action.payload || action.error.message; state.requestId = null
      })
      .addCase(fetchCoffeeDetails.pending, (state, action) => { state.detailsStatus = 'loading'; state.detailsError = ''; state.detailsRequestId = action.meta.requestId })
      .addCase(fetchCoffeeDetails.fulfilled, (state, action) => {
        if (state.detailsRequestId !== action.meta.requestId) return
        state.detailsStatus = 'success'; state.details[action.payload.id] = action.payload; state.detailsRequestId = null
      })
      .addCase(fetchCoffeeDetails.rejected, (state, action) => {
        if (state.detailsRequestId !== action.meta.requestId) return
        state.detailsStatus = 'error'; state.detailsError = action.payload || action.error.message; state.detailsRequestId = null
      })
  },
})

export default coffeeSlice.reducer
const selectItems = (state) => state.coffee.items
export const selectCoffeeStatus = (state) => state.coffee.status
export const selectCoffeeError = (state) => state.coffee.error
export const selectCoffeeOffline = (state) => state.coffee.offlineData
export const selectCoffeeDetailsStatus = (state) => state.coffee.detailsStatus
export const selectCoffeeDetailsError = (state) => state.coffee.detailsError
export const selectCoffeeById = (state, id) => state.coffee.details[id] || state.coffee.items.find((item) => String(item.id) === String(id))
export const selectIngredients = createSelector([selectItems], (items) => [...new Set(items.flatMap((item) => item.ingredients || []))].sort((a, b) => a.localeCompare(b)))
export const selectDrinkTypes = createSelector([selectItems], (items) => [...new Set(items.map((item) => item.type).filter(Boolean))].sort())
export const selectCoffeeStats = createSelector([selectItems, (_, type) => type], (items, type) => {
  const filtered = type ? items.filter((item) => item.type === type) : items
  const typeCounts = new Map()
  const totalPrice = filtered.reduce((sum, item) => sum + item.price, 0)
  const mostExpensive = filtered.reduce((top, item) => item.price > (top?.price ?? -1) ? item : top, null)
  for (const item of filtered) typeCounts.set(item.type, (typeCounts.get(item.type) || 0) + 1)
  const hotCount = filtered.filter((item) => item.type === 'hot').length
  const coldCount = filtered.filter((item) => item.type === 'cold').length
  const underFour = filtered.filter((item) => item.price < 4).length
  return {
    count: filtered.length, typeCount: typeCounts.size, hotCount, coldCount,
    averagePrice: filtered.length ? (totalPrice / filtered.length).toFixed(2) : '0.00', mostExpensive,
    typeBreakdown: [...typeCounts].sort((a, b) => b[1] - a[1]),
    priceBreakdown: [
      { label: 'Under 4', count: underFour },
      { label: '4 and over', count: filtered.length - underFour },
    ],
  }
})
export const selectFilteredCoffee = createSelector([selectItems, (_, filters) => filters], (items, { search = '', type = '', sort = 'title-asc' }) => {
  const query = search.trim().toLocaleLowerCase()
  return items.filter((item) => {
    const matchesQuery = !query || `${item.title} ${item.description} ${item.type}`.toLocaleLowerCase().includes(query)
    return matchesQuery && (!type || item.type === type)
  }).slice().sort((a, b) => {
    if (sort === 'title-desc') return b.title.localeCompare(a.title)
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'price-asc') return a.price - b.price
    return a.title.localeCompare(b.title)
  })
})
