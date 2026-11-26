import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import CoffeeCard from '../ui/CoffeeCard.jsx'
import useCoffeeItems from '../hooks/useCoffeeItems.js'
import { selectDrinkTypes, selectFilteredCoffee } from '../store/coffeeSlice.js'

const PAGE_SIZE = 8
const inputClass = 'w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100'

function setParam(params, key, value) {
  const next = new URLSearchParams(params)
  if (value) next.set(key, value)
  else next.delete(key)
  if (key !== 'page') next.delete('page')
  return next
}

export default function Items() {
  const { status, error, refetch, offlineData } = useCoffeeItems()
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const drinkType = searchParams.get('type') ?? ''
  const sort = searchParams.get('sort') ?? 'title-asc'
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)

  const filterOptions = useMemo(() => ({ search, type: drinkType, sort }), [search, drinkType, sort])
  const drinkTypes = useSelector(selectDrinkTypes)
  const filteredItems = useSelector((state) => selectFilteredCoffee(state, filterOptions))

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <main className="min-h-[70vh] px-5 py-12 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-900">Steppe Coffee</p>
            <h1 className="text-4xl font-semibold text-stone-900 md:text-5xl">Кофейное меню</h1>
            <p className="mt-3 max-w-2xl text-stone-600">Найдите любимый напиток по названию или составу.</p>
          </div>
          <Link to="/dashboard" className="rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-amber-900">
            Статистика меню →
          </Link>
        </div>

        {offlineData && <p className="mb-4 rounded-xl bg-amber-100 p-3 text-sm text-amber-950" role="status">Показаны сохранённые данные меню: подключение к API недоступно.</p>}
        <section aria-label="Поиск и фильтры" className="mb-8 grid gap-3 rounded-3xl border border-white bg-white/70 p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <input className={`${inputClass} lg:col-span-2`} type="search" value={search} onChange={(event) => setSearchParams(setParam(searchParams, 'search', event.target.value))} placeholder="Поиск по названию или типу" aria-label="Поиск по названию или типу" />
          <select className={inputClass} value={drinkType} onChange={(event) => setSearchParams(setParam(searchParams, 'type', event.target.value))} aria-label="Filter by drink type">
            <option value="">All drink types</option>
            {drinkTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <select className={inputClass} value={sort} onChange={(event) => setSearchParams(setParam(searchParams, 'sort', event.target.value))} aria-label="Сортировка">
            <option value="title-asc">Название: А—Я</option>
            <option value="title-desc">Название: Я—А</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
          <div className="flex items-center justify-between gap-3 text-sm text-stone-600 sm:col-span-2 lg:col-span-3">
            <span>{filteredItems.length} напитков найдено</span>
            <button className="font-medium text-amber-900 underline underline-offset-4" onClick={() => setSearchParams({})}>Сбросить фильтры</button>
          </div>
        </section>

        {status === 'loading' && <p className="rounded-2xl bg-white p-8 text-center text-stone-600" role="status">Загружаем меню…</p>}
        {status === 'error' && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900" role="alert"><p>Не удалось загрузить меню: {error}</p><button className="mt-3 underline" onClick={refetch}>Попробовать снова</button></div>}
        {status === 'success' && filteredItems.length === 0 && <div className="rounded-2xl bg-white p-10 text-center"><h2 className="text-xl font-semibold">Ничего не найдено</h2><p className="mt-2 text-stone-600">Измените запрос или сбросьте фильтры.</p><button className="mt-4 font-medium text-amber-900 underline" onClick={() => setSearchParams({})}>Сбросить фильтры</button></div>}
        {status === 'success' && filteredItems.length > 0 && <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{pageItems.map((item) => <CoffeeCard key={item.id} item={item} />)}</div>
          <nav className="mt-9 flex items-center justify-center gap-4" aria-label="Страницы меню">
            <button disabled={currentPage <= 1} onClick={() => setSearchParams(setParam(searchParams, 'page', String(currentPage - 1)))} className="rounded-full bg-white px-4 py-2 text-sm disabled:opacity-40">Назад</button>
            <span className="text-sm text-stone-600">Страница {currentPage} из {pageCount}</span>
            <button disabled={currentPage >= pageCount} onClick={() => setSearchParams(setParam(searchParams, 'page', String(currentPage + 1)))} className="rounded-full bg-white px-4 py-2 text-sm disabled:opacity-40">Далее</button>
          </nav>
        </>}
      </div>
    </main>
  )
}
