import { useEffect, useState } from 'react'

const COFFEE_API = 'https://api.sampleapis.com/coffee/hot'

export default function useCoffeeItems() {
  const [state, setState] = useState({ status: 'loading', items: [], error: '' })

  useEffect(() => {
    const controller = new AbortController()

    fetch(COFFEE_API, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Не удалось загрузить меню (${response.status})`)
        return response.json()
      })
      .then((items) => {
        if (!Array.isArray(items)) throw new Error('API вернул данные в неожиданном формате')
        setState({ status: 'success', items, error: '' })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ status: 'error', items: [], error: error.message })
      })

    return () => controller.abort()
  }, [])

  return state
}
