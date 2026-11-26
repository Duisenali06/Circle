import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoffeeItems, selectCoffeeError, selectCoffeeOffline, selectCoffeeStatus } from '../store/coffeeSlice.js'

export default function useCoffeeItems() {
  const dispatch = useDispatch()
  const status = useSelector(selectCoffeeStatus)
  const items = useSelector((state) => state.coffee.items)
  const error = useSelector(selectCoffeeError)
  const offlineData = useSelector(selectCoffeeOffline)
  useEffect(() => {
    if (status === 'idle') dispatch(fetchCoffeeItems())
  }, [dispatch, status])
  return { status: status === 'idle' ? 'loading' : status, items, error, offlineData, refetch: () => dispatch(fetchCoffeeItems({ force: true })) }
}
