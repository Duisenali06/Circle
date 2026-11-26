import { configureStore } from '@reduxjs/toolkit'
import coffee from './coffeeSlice.js'
import selection from './selectionSlice.js'
import pwa from './pwaSlice.js'
export const store = configureStore({ reducer: { coffee, selection, pwa } })
