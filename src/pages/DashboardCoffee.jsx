import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useCoffeeItems from '../hooks/useCoffeeItems.js'
import { selectCoffeeStats, selectDrinkTypes } from '../store/coffeeSlice.js'

function Stat({ label, value, note }) {
  return <article className="rounded-3xl border border-white bg-white/85 p-5 shadow-sm">
    <p className="text-sm text-stone-500">{label}</p>
    <p className="mt-2 text-3xl font-semibold text-stone-900">{value}</p>
    <p className="mt-1 text-xs text-stone-500">{note}</p>
  </article>
}

export default function DashboardCoffee() {
  const { status, error, offlineData } = useCoffeeItems()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedType = searchParams.get('type') || ''
  const types = useSelector(selectDrinkTypes)
  const stats = useSelector((state) => selectCoffeeStats(state, selectedType))

  const updateType = (type) => {
    const next = new URLSearchParams(searchParams)
    if (type) next.set('type', type)
    else next.delete('type')
    setSearchParams(next)
  }

  return <main className="min-h-[70vh] px-5 py-12 md:px-10 lg:px-16">
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-900">Steppe Coffee · Insights</p>
          <h1 className="text-4xl font-semibold text-stone-900 md:text-5xl">Статистика меню</h1>
          <p className="mt-3 text-stone-600">Цены и типы напитков из API.</p>
        </div>
        <Link to="/items" className="rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white">Перейти к меню →</Link>
      </div>

      {offlineData && <p className="mb-4 rounded-xl bg-amber-100 p-3 text-sm text-amber-950" role="status">Показаны сохранённые данные меню.</p>}
      {status === 'loading' && <p className="rounded-2xl bg-white p-8 text-center" role="status">Загружаем данные…</p>}
      {status === 'error' && <p className="rounded-2xl bg-red-50 p-6 text-red-900" role="alert">Не удалось загрузить статистику: {error}</p>}
      {status === 'success' && <>
        <section className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/75 p-5">
          <div><h2 className="font-semibold text-stone-900">Тип напитка</h2><p className="mt-1 text-sm text-stone-500">Фильтр применяется ко всем показателям.</p></div>
          <select aria-label="Фильтр по типу напитка" value={selectedType} onChange={(event) => updateType(event.target.value)} className="min-w-56 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm">
            <option value="">All drinks</option>
            {types.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Основные показатели">
          <Stat label="Напитков" value={stats.count} note={selectedType || 'Все типы'} />
          <Stat label="Горячих" value={stats.hotCount} note="В выборке" />
          <Stat label="Холодных" value={stats.coldCount} note="В выборке" />
          <Stat label="Средняя цена" value={stats.averagePrice} note={stats.mostExpensive ? `Дороже всего: ${stats.mostExpensive.title} · ${stats.mostExpensive.price.toFixed(2)}` : 'Нет данных'} />
        </section>

        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <section className="rounded-3xl bg-white/85 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-900">Напитки по типу</h2>
            <ul className="mt-5 space-y-4">
              {stats.typeBreakdown.map(([type, count]) => <li key={type}>
                <div className="mb-1 flex justify-between gap-3 text-sm"><Link className="font-medium text-amber-900 hover:underline" to={`/items?type=${encodeURIComponent(type)}`}>{type}</Link><span>{count} напитков</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-amber-100"><div className="h-full rounded-full bg-amber-700" style={{ width: `${stats.count ? Math.round((count / stats.count) * 100) : 0}%` }} /></div>
              </li>)}
            </ul>
          </section>
          <section className="rounded-3xl bg-white/85 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-900">Диапазон цен</h2>
            <ul className="mt-5 space-y-5">
              {stats.priceBreakdown.map(({ label, count }) => <li key={label}>
                <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span>{count} · {stats.count ? Math.round((count / stats.count) * 100) : 0}%</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-amber-500" style={{ width: `${stats.count ? Math.round((count / stats.count) * 100) : 0}%` }} /></div>
              </li>)}
            </ul>
          </section>
        </div>
      </>}
    </div>
  </main>
}
