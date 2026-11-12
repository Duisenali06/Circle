import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Login() {
  const { user, loading, error, login, loginWithGoogle, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  if (loading) return <p className="p-10 text-center" role="status">Проверяем сессию…</p>
  if (user) return <Navigate to="/profile" replace />

  const submit = async (event) => {
    event.preventDefault(); clearError(); setBusy(true)
    try { await login(email, password); navigate(location.state?.from?.pathname || '/profile', { replace: true }) }
    catch { /* Ошибка показана из AuthContext */ }
    finally { setBusy(false) }
  }
  const google = async () => {
    clearError(); setBusy(true)
    try { await loginWithGoogle(); navigate('/profile', { replace: true }) }
    catch { /* Ошибка показана из AuthContext */ }
    finally { setBusy(false) }
  }

  return <main className="mx-auto min-h-[60vh] max-w-lg px-5 py-12">
    <h1 className="mb-6 text-3xl font-semibold">Вход</h1>
    <form className="space-y-4 rounded-3xl bg-white p-6 shadow-sm" onSubmit={submit}>
      <label className="block">Email<input className="mt-1 w-full rounded-xl border p-3" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label className="block">Пароль<input className="mt-1 w-full rounded-xl border p-3" type="password" autoComplete="current-password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      <button disabled={busy} className="w-full rounded-full bg-stone-900 p-3 text-white disabled:opacity-60">{busy ? 'Входим…' : 'Войти'}</button>
      <button type="button" disabled={busy} onClick={google} className="w-full rounded-full border p-3 disabled:opacity-60">Войти через Google</button>
      <p className="text-sm">Нет аккаунта? <Link className="underline" to="/signup">Зарегистрироваться</Link></p>
    </form>
  </main>
}
