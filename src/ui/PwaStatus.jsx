import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectOnline, setOnline } from '../store/pwaSlice.js'

export default function PwaStatus() {
  const dispatch = useDispatch()
  const online = useSelector(selectOnline)
  const [registration, setRegistration] = useState(null)
  const [update, setUpdate] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    const onlineNow = () => dispatch(setOnline(true))
    const offlineNow = () => dispatch(setOnline(false))
    const installAvailable = (event) => { event.preventDefault(); setInstallPrompt(event) }
    const controllerChanged = () => window.location.reload()
    window.addEventListener('online', onlineNow)
    window.addEventListener('offline', offlineNow)
    window.addEventListener('beforeinstallprompt', installAvailable)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).then((reg) => {
        setRegistration(reg)
        if (reg.waiting) setUpdate(true)
        reg.addEventListener('updatefound', () => reg.installing?.addEventListener('statechange', (event) => {
          if (event.target.state === 'installed' && navigator.serviceWorker.controller) setUpdate(true)
        }))
      }).catch(() => {})
      navigator.serviceWorker.addEventListener('controllerchange', controllerChanged)
    }
    return () => {
      window.removeEventListener('online', onlineNow)
      window.removeEventListener('offline', offlineNow)
      window.removeEventListener('beforeinstallprompt', installAvailable)
      navigator.serviceWorker?.removeEventListener('controllerchange', controllerChanged)
    }
  }, [dispatch])
  const install = async () => { await installPrompt?.prompt(); setInstallPrompt(null) }
  return <div className={`px-4 py-2 text-center text-sm ${online ? 'bg-green-100 text-green-900' : 'bg-amber-100 text-amber-950'}`} role="status">
    {online ? 'Вы в сети' : 'Нет подключения к интернету'}
    {!online && <> · <a className="underline" href={`${import.meta.env.BASE_URL}offline`}>Открыть офлайн страницу</a></>}
    {installPrompt && <button className="ml-3 min-h-10 rounded-full bg-stone-900 px-4 text-white" onClick={install}>Установить приложение</button>}
    {update && <button className="ml-3 min-h-10 rounded-full bg-stone-900 px-4 text-white" onClick={() => registration?.waiting?.postMessage({ type: 'SKIP_WAITING' })}>Обновить приложение</button>}
  </div>
}
