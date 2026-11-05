import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import useCoffeeItems from '../hooks/useCoffeeItems.js'

function Stat({ label, value, note }) {
  return (
    <article className="rounded-3xl border border-white bg-white/85 p-5 shadow-sm">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-stone-900">{value}</p>
      <p className="mt-1 text-xs text-stone-500">{note}</p>
    </article>
  )
}

export default function DashboardCoffee() {
  const { status, items, error } = useCoffeeItems()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedIngredient = searchParams.get('ingredient') ?? ''
  const ingredients = useMemo(() => [...new Set(items.flatMap((item) => item.ingredients ?? []))].sort((a, b) => a.localeCompare(b)), [items])
  const scopedItems = useMemo(
    () => selectedIngredient ? items.filter((item) => (item.ingredients ?? []).includes(selectedIngredient)) : items,
    [items, selectedIngredient],
  )

  const stats = useMemo(() => {
    const ingredientCounts = new Map()
    let totalIngredients = 0
    let mostComplex = null

    for (const item of scopedItems) {
      const list = item.ingredients ?? []
      totalIngredients += list.length
      if (!mostComplex || list.length > (mostComplex.ingredients?.length ?? 0)) mostComplex = item
      for (const ingredient of list) ingredientCounts.set(ingredient, (ingredientCounts.get(ingredient) ?? 0) + 1)
    }

    const ingredientBreakdown = [...ingredientCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    const simple = scopedItems.filter((item) => (item.ingredients?.length ?? 0) <= 2).length
    const expanded = scopedItems.length - simple

    return {
      count: scopedItems.length,
      uniqueIngredients: ingredientCounts.size,
      averageIngredients: scopedItems.length ? (totalIngredients / scopedItems.length).toFixed(1) : '0',
      mostComplex,
      ingredientBreakdown,
      recipeBreakdown: [
        { label: 'Простые рецепты · до 2 ингредиентов', count: simple },
        { label: 'Расширенные рецепты · от 3 ингредиентов', count: expanded },
      ],
    }
  }, [scopedItems])

  const updateIngredient = (value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('ingredient', value)
    else next.delete('ingredient')
    setSearchParams(next)
  }

  return (
    <main className="min-h-[70vh] px-5 py-12 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-900">Steppe Coffee · Insights</p>
            <h1 className="text-4xl font-semibold text-stone-900 md:text-5xl">Статистика меню</h1>
            <p className="mt-3 text-stone-600">Состав напитков и популярность ингредиентов по данным меню.</p>
          </div>
          <Link to="/items" className="rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-amber-900">Перейти к меню →</Link>
        </div>

        {status === 'loading' && <p className="rounded-2xl bg-white p-8 text-center text-stone-600" role="status">Загружаем данные…</p>}
        {status === 'error' && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900" role="alert">Не удалось загрузить статистику: {error}</div>}
        {status === 'success' && <>
          <section className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white bg-white/75 p-5">
            <div><h2 className="font-semibold text-stone-900">Фильтр статистики</h2><p className="mt-1 text-sm text-stone-500">Фильтр меняет все показатели и диаграммы ниже.</p></div>
            <select aria-label="Фильтр статистики по ингредиенту" value={selectedIngredient} onChange={(event) => updateIngredient(event.target.value)} className="min-w-56 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-700">
              <option value="">Все напитки</option>
              {ingredients.map((ingredient) => <option key={ingredient} value={ingredient}>{ingredient}</option>)}
            </select>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Основные показатели">
            <Stat label="Напитков в выборке" value={stats.count} note={selectedIngredient || 'Все позиции API'} />
            <Stat label="Уникальных ингредиентов" value={stats.uniqueIngredients} note="В отфильтрованном меню" />
            <Stat label="Ингредиентов на напиток" value={stats.averageIngredients} note="Среднее значение" />
            <Stat label="Самый насыщенный состав" value={stats.mostComplex?.ingredients?.length ?? 0} note={stats.mostComplex?.title ?? 'Нет данных'} />
          </section>

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            <section className="rounded-3xl border border-white bg-white/85 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-900">Ингредиенты в напитках</h2>
              <p className="mb-5 mt-1 text-sm text-stone-500">Частота встречаемости каждого ингредиента.</p>
              {stats.ingredientBreakdown.length ? <ul className="space-y-4">
                {stats.ingredientBreakdown.slice(0, 8).map(([ingredient, count]) => {
                  const percent = Math.max(4, Math.round((count / stats.count) * 100))
                  return <li key={ingredient}>
                    <div className="mb-1 flex justify-between gap-3 text-sm"><Link className="font-medium text-amber-900 hover:underline" to={`/items?ingredient=${encodeURIComponent(ingredient)}`}>{ingredient}</Link><span className="text-stone-500">{count} напитков</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-amber-100"><div className="h-full rounded-full bg-amber-700" style={{ width: `${percent}%` }} /></div>
                  </li>
                })}
              </ul> : <p className="text-sm text-stone-500">Нет данных для выбранного фильтра.</p>}
            </section>

            <section className="rounded-3xl border border-white bg-white/85 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-900">Сложность рецептов</h2>
              <p className="mb-5 mt-1 text-sm text-stone-500">Группировка по количеству ингредиентов.</p>
              <ul className="space-y-5">
                {stats.recipeBreakdown.map(({ label, count }) => {
                  const percent = stats.count ? Math.round((count / stats.count) * 100) : 0
                  return <li key={label}>
                    <div className="mb-1 flex justify-between gap-3 text-sm"><span className="font-medium text-stone-800">{label}</span><span className="text-stone-500">{count} · {percent}%</span></div>
                    <div className="h-3 overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-amber-500" style={{ width: `${percent}%` }} /></div>
                  </li>
                })}
              </ul>
              {stats.mostComplex && <div className="mt-7 rounded-2xl bg-amber-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-amber-900">Больше всего ингредиентов</p><Link className="mt-1 block font-semibold text-stone-900 hover:underline" to={`/items?search=${encodeURIComponent(stats.mostComplex.title)}`}>{stats.mostComplex.title} →</Link><p className="mt-1 text-sm text-stone-600">{(stats.mostComplex.ingredients ?? []).join(', ')}</p></div>}
            </section>
          </div>
        </>}
      </div>
    </main>
  )
}
