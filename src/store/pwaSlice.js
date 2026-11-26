import { createSlice } from '@reduxjs/toolkit'
const pwaSlice = createSlice({ name: 'pwa', initialState: { online: navigator.onLine }, reducers: { setOnline(state, action) { state.online = action.payload } } })
export const { setOnline } = pwaSlice.actions
export const selectOnline = (state) => state.pwa.online
export default pwaSlice.reducer
