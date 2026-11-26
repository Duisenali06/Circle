import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../auth/AuthContext.jsx'
import {
  changeCartQuantity, loadSelection, selectCart, selectCartCount, selectFavoriteIds, selectFavorites,
  selectSelectionBusy, selectSelectionError, selectSelectionStatus, toggleFavorite,
} from '../store/selectionSlice.js'

export default function useUserSelection() {
  const dispatch = useDispatch()
  const { user, loading: authLoading } = useAuth()
  const uid = user?.uid || null
  const status = useSelector(selectSelectionStatus)
  const selectionUid = useSelector((state) => state.selection.uid)
  const busy = useSelector(selectSelectionBusy)
  const error = useSelector(selectSelectionError)
  const isReady = !authLoading && status === 'success' && selectionUid === uid
  const favorites = useSelector(selectFavorites)
  const cart = useSelector(selectCart)
  const favoriteIds = useSelector(selectFavoriteIds)
  const count = useSelector(selectCartCount)

  return {
    favorites: isReady ? favorites : [],
    cart: isReady ? cart : [],
    count: isReady ? count : 0,
    ready: isReady,
    loading: authLoading || !isReady || busy,
    error,
    retry: () => dispatch(loadSelection(uid)),
    isFavorite: (id) => isReady && favoriteIds.has(String(id)),
    toggleFavorite: (item) => dispatch(toggleFavorite({ item, uid })),
    changeQuantity: (item, quantity) => dispatch(changeCartQuantity({ item, quantity, uid })),
  }
}
