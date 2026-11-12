import { useCallback, useEffect, useRef, useState } from 'react'
import { getCoffeeItems } from '../services/coffeeApi.js'

export default function useCoffeeItems() {
  const [state, setState] = useState({ status: 'loading', items: [], error: '' })
  const requestId = useRef(0)
  const load = useCallback(async (force = false) => {
    const id = ++requestId.current
    setState((current) => ({ ...current, status: current.items.length ? 'success' : 'loading', error: '' }))
    try {
      const items = await getCoffeeItems({ force })
      if (requestId.current === id) setState({ status: 'success', items, error: '' })
    } catch (error) {
      if (requestId.current === id) setState((current) => ({ ...current, status: 'error', error: error.message }))
    }
  }, [])
  useEffect(() => { load(); return () => { requestId.current += 1 } }, [load])
  return { ...state, refetch: () => load(true) }
}
