import { useNavigate } from 'react-router-dom'

export default function Offline() {
  const navigate = useNavigate()
  return <main className="grid min-h-[70vh] place-items-center px-5 py-12 text-center">
    <section className="max-w-lg rounded-3xl bg-white p-8 shadow-sm sm:p-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-900">Steppe Coffee</p>
      <h1 className="mt-3 text-3xl font-semibold text-stone-900 sm:text-4xl">Вы сейчас офлайн</h1>
      <p className="mt-4 text-stone-600">Проверьте подключение. Ранее загруженное меню останется доступным.</p>
      <button className="mt-7 min-h-12 rounded-full bg-stone-900 px-6 text-white" onClick={() => window.location.reload()}>Повторить подключение</button>
      <button className="ml-2 mt-3 min-h-12 rounded-full border border-stone-300 px-6" onClick={() => navigate('/')}>На главную</button>
    </section>
  </main>
}
