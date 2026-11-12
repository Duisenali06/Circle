import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Profile() {
  const { user, logout, error } = useAuth()
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const handleLogout = async () => {
    setBusy(true)
    try { await logout(); navigate('/login', { replace: true }) }
    catch { setBusy(false) }
  }
  return <main className="mx-auto min-h-[60vh] max-w-2xl px-5 py-12">
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-3xl font-semibold">Профиль</h1>
      <p><strong>Email:</strong> {user?.email || 'Не указан'}</p>
      <p className="mt-2 break-all"><strong>UID:</strong> {user?.uid}</p>
      {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
      <button disabled={busy} onClick={handleLogout} className="mt-6 rounded-full bg-stone-900 px-6 py-3 text-white disabled:opacity-60">{busy ? 'Выходим…' : 'Выйти'}</button>
    </section>
  </main>
}
