import { Link } from 'react-router-dom'
import useUserSelection from '../hooks/useUserSelection.js'

export default function Cart() {
  const { cart, count, loading, error, retry, changeQuantity } = useUserSelection()

  return <main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-12">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-900">Steppe Coffee</p>
    <h1 className="mt-2 text-4xl font-semibold text-stone-900">Корзина</h1>
    <p className="mb-8 mt-2 text-stone-600">Товаров: {count}</p>
    {error && <div className="mb-5 rounded-xl bg-red-50 p-4 text-red-800" role="alert">{error} <button className="ml-2 underline" onClick={retry}>Повторить</button></div>}
    {loading ? <p className="rounded-2xl bg-white p-8 text-center" role="status">Загружаем ваши товары…</p> : cart.length ? <div className="space-y-3">
      {cart.map((item) => <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm">
        <div><h2 className="text-lg font-semibold">{item.title}</h2><p className="mt-1 text-sm text-stone-500">{(item.ingredients || []).join(', ')}</p></div>
        <div className="flex items-center gap-3">
          <button disabled={loading} onClick={() => changeQuantity(item, -1)} aria-label={`Уменьшить ${item.title}`} className="min-h-11 min-w-11 rounded-full bg-stone-100 text-xl disabled:opacity-50">−</button>
          <span className="min-w-6 text-center" aria-label="Количество">{item.quantity}</span>
          <button disabled={loading} onClick={() => changeQuantity(item, 1)} aria-label={`Увеличить ${item.title}`} className="min-h-11 min-w-11 rounded-full bg-stone-100 text-xl disabled:opacity-50">+</button>
          <button disabled={loading} onClick={() => changeQuantity(item, -item.quantity)} className="ml-2 text-sm text-red-700 underline disabled:opacity-50">Удалить</button>
        </div>
      </article>)}
    </div> : <section className="rounded-3xl bg-white p-8 text-center shadow-sm">
      <p className="text-lg text-stone-700">Корзина пока пуста. Добавьте напитки из меню.</p>
      <Link className="mt-5 inline-flex min-h-11 items-center rounded-full bg-stone-900 px-5 text-white" to="/items">Открыть меню</Link>
    </section>}
  </main>
}
