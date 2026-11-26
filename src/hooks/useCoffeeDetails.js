import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchCoffeeDetails, selectCoffeeById, selectCoffeeDetailsError, selectCoffeeDetailsStatus } from '../store/coffeeSlice.js'

export default function useCoffeeDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const item = useSelector((state) => selectCoffeeById(state, id))
  const status = useSelector(selectCoffeeDetailsStatus)
  const error = useSelector(selectCoffeeDetailsError)
  useEffect(() => { dispatch(fetchCoffeeDetails(id)) }, [dispatch, id])
  return { item, status, error, retry: () => dispatch(fetchCoffeeDetails(id)) }
}
