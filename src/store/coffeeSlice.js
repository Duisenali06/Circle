import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { getCoffeeItems, isCoffeeDataOffline } from '../services/coffeeApi.js'

export const fetchCoffeeItems = createAsyncThunk('coffee/fetchItems', async ({ force = false } = {}, { rejectWithValue }) => {
  try { return await getCoffeeItems({ force }) }
  catch (error) { return rejectWithValue(error.message || 'Не удалось загрузить меню') }
}, { condition: ({ force } = {}, { getState }) => force || getState().coffee.status !== 'loading' })

export const fetchCoffeeDetails = createAsyncThunk('coffee/fetchDetails', async (id, { getState, rejectWithValue }) => {
  try {
    const items = getState().coffee.items.length ? getState().coffee.items : await getCoffeeItems()
    const item = items.find((coffee) => String(coffee.id) === String(id))
    if (!item) return rejectWithValue('Напиток не найден')
    return item
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
export const selectCoffeeStats = createSelector([selectItems, (_, ingredient) => ingredient], (items, ingredient) => {
  const filtered = ingredient ? items.filter((item) => (item.ingredients || []).includes(ingredient)) : items
  const counts = new Map()
  let total = 0
  let mostComplex = null
  for (const item of filtered) {
    const list = item.ingredients || []
    total += list.length
    if (!mostComplex || list.length > (mostComplex.ingredients?.length || 0)) mostComplex = item
    for (const name of list) counts.set(name, (counts.get(name) || 0) + 1)
  }
  const simple = filtered.filter((item) => (item.ingredients?.length || 0) <= 2).length
  return {
    count: filtered.length, uniqueIngredients: counts.size,
    averageIngredients: filtered.length ? (total / filtered.length).toFixed(1) : '0', mostComplex,
    ingredientBreakdown: [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    recipeBreakdown: [
      { label: 'Простые рецепты · до 2 ингредиентов', count: simple },
      { label: 'Расширенные рецепты · от 3 ингредиентов', count: filtered.length - simple },
    ],
  }
})
export const selectFilteredCoffee = createSelector([selectItems, (_, filters) => filters], (items, { search = '', ingredient = '', size = '', sort = 'title-asc' }) => {
  const query = search.trim().toLocaleLowerCase()
  return items.filter((item) => {
    const ingredients = item.ingredients || []
    const matchesQuery = !query || `${item.title} ${item.description} ${ingredients.join(' ')}`.toLocaleLowerCase().includes(query)
    const matchesSize = !size || (size === 'simple' ? ingredients.length <= 2 : ingredients.length >= 3)
    return matchesQuery && (!ingredient || ingredients.includes(ingredient)) && matchesSize
  }).slice().sort((a, b) => {
    if (sort === 'title-desc') return b.title.localeCompare(a.title)
    if (sort === 'ingredients-desc') return (b.ingredients?.length || 0) - (a.ingredients?.length || 0)
    if (sort === 'ingredients-asc') return (a.ingredients?.length || 0) - (b.ingredients?.length || 0)
    return a.title.localeCompare(b.title)
  })
})
