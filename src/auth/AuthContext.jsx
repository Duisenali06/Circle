import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth } from '../services/firebase.js'

const AuthContext = createContext(null)
const googleProvider = new GoogleAuthProvider()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setPersistence(auth, browserLocalPersistence)
      .catch((reason) => { if (active) setError(reason.message) })
      .finally(() => {
        if (!active) return
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser)
          setLoading(false)
          setError('')
        }, (reason) => {
          setError(reason.message)
          setLoading(false)
        })
        cleanup = unsubscribe
      })
    let cleanup = () => {}
    return () => { active = false; cleanup() }
  }, [])

  const run = async (action) => {
    setError('')
    try { return await action() }
    catch (reason) { setError(reason.message || 'Не удалось выполнить действие'); throw reason }
  }

  const value = useMemo(() => ({
    user, loading, error,
    signup: (email, password) => run(() => createUserWithEmailAndPassword(auth, email, password)),
    login: (email, password) => run(() => signInWithEmailAndPassword(auth, email, password)),
    loginWithGoogle: () => run(() => signInWithPopup(auth, googleProvider)),
    logout: () => run(() => signOut(auth)),
    clearError: () => setError(''),
  }), [user, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth должен использоваться внутри AuthProvider')
  return context
}
