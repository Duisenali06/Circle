import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CoffeeCard from '../ui/CoffeeCard.jsx'
import useCoffeeItems from '../hooks/useCoffeeItems.js'

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
  const { status, items, error, refetch } = useCoffeeItems()
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const ingredientFilter = searchParams.get('ingredient') ?? ''
  const recipeSize = searchParams.get('size') ?? ''
  const sort = searchParams.get('sort') ?? 'title-asc'
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)

  const ingredients = useMemo(
    () => [...new Set(items.flatMap((item) => item.ingredients ?? []))].sort((a, b) => a.localeCompare(b)),
    [items],
  )
  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    const result = items.filter((item) => {
      const itemIngredients = item.ingredients ?? []
      const matchesQuery = !query || `${item.title} ${item.description} ${itemIngredients.join(' ')}`.toLocaleLowerCase().includes(query)
      const matchesIngredient = !ingredientFilter || itemIngredients.includes(ingredientFilter)
      const matchesSize = !recipeSize || (recipeSize === 'simple' ? itemIngredients.length <= 2 : itemIngredients.length >= 3)
      return matchesQuery && matchesIngredient && matchesSize
    })

    return result.sort((a, b) => {
      if (sort === 'title-desc') return b.title.localeCompare(a.title)
      if (sort === 'ingredients-desc') return (b.ingredients?.length ?? 0) - (a.ingredients?.length ?? 0)
      if (sort === 'ingredients-asc') return (a.ingredients?.length ?? 0) - (b.ingredients?.length ?? 0)
      return a.title.localeCompare(b.title)
    })
  }, [items, search, ingredientFilter, recipeSize, sort])

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

        <section aria-label="Поиск и фильтры" className="mb-8 grid gap-3 rounded-3xl border border-white bg-white/70 p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <input className={`${inputClass} lg:col-span-2`} type="search" value={search} onChange={(event) => setSearchParams(setParam(searchParams, 'search', event.target.value))} placeholder="Поиск по названию и составу" aria-label="Поиск по названию и составу" />
          <select className={inputClass} value={ingredientFilter} onChange={(event) => setSearchParams(setParam(searchParams, 'ingredient', event.target.value))} aria-label="Фильтр по ингредиенту">
            <option value="">Все ингредиенты</option>
            {ingredients.map((ingredient) => <option key={ingredient} value={ingredient}>{ingredient}</option>)}
          </select>
          <select className={inputClass} value={recipeSize} onChange={(event) => setSearchParams(setParam(searchParams, 'size', event.target.value))} aria-label="Фильтр по количеству ингредиентов">
            <option value="">Любой состав</option>
            <option value="simple">Простой (до 2 ингредиентов)</option>
            <option value="complex">Расширенный (3 и больше)</option>
          </select>
          <select className={inputClass} value={sort} onChange={(event) => setSearchParams(setParam(searchParams, 'sort', event.target.value))} aria-label="Сортировка">
            <option value="title-asc">Название: А—Я</option>
            <option value="title-desc">Название: Я—А</option>
            <option value="ingredients-desc">Сначала больше ингредиентов</option>
            <option value="ingredients-asc">Сначала меньше ингредиентов</option>
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
