import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <p className="p-10 text-center" role="status">Проверяем сессию…</p>
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}
