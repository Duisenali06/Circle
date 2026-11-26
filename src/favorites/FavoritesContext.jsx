import useUserSelection from '../hooks/useUserSelection.js'

// Keep this small hook so components can use the existing, readable API.
export function useFavorites() {
  return useUserSelection()
}
