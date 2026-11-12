import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Signup() {
  const { user, loading, error, signup, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  if (loading) return <p className="p-10 text-center" role="status">Проверяем сессию…</p>
  if (user) return <Navigate to="/profile" replace />

  const submit = async (event) => {
    event.preventDefault(); clearError(); setValidationError('')
    if (password.length < 6) return setValidationError('Пароль должен содержать не менее 6 символов.')
    if (password !== confirmPassword) return setValidationError('Пароли не совпадают.')
    setBusy(true)
    try { await signup(email, password); navigate('/profile', { replace: true }) }
    catch { /* Ошибка показана из AuthContext */ }
    finally { setBusy(false) }
  }

  return <main className="mx-auto min-h-[60vh] max-w-lg px-5 py-12">
    <h1 className="mb-6 text-3xl font-semibold">Регистрация</h1>
    <form className="space-y-4 rounded-3xl bg-white p-6 shadow-sm" onSubmit={submit}>
      <label className="block">Email<input className="mt-1 w-full rounded-xl border p-3" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label className="block">Пароль<input className="mt-1 w-full rounded-xl border p-3" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <label className="block">Подтвердите пароль<input className="mt-1 w-full rounded-xl border p-3" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></label>
      {(validationError || error) && <p className="text-sm text-red-700" role="alert">{validationError || error}</p>}
      <button disabled={busy} className="w-full rounded-full bg-stone-900 p-3 text-white disabled:opacity-60">{busy ? 'Создаём аккаунт…' : 'Создать аккаунт'}</button>
      <p className="text-sm">Уже есть аккаунт? <Link className="underline" to="/login">Войти</Link></p>
    </form>
  </main>
}
