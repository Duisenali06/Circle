import { Link } from 'react-router-dom'
import CoffeeCard from '../ui/CoffeeCard.jsx'
import { useFavorites } from '../favorites/FavoritesContext.jsx'

export default function Favorites() {
  const { favorites, loading, error, retry } = useFavorites()
  if (error) return <main className="mx-auto max-w-2xl p-8 text-center" role="alert"><p>{error}</p><button className="mt-4 underline" onClick={retry}>Retry</button></main>
  if (loading) return <main className="p-12 text-center" role="status">Загружаем избранное…</main>
  return <main className="min-h-[70vh] px-5 py-12 md:px-10 lg:px-16">
    <div className="mx-auto max-w-7xl">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-900">Steppe Coffee</p>
      <h1 className="text-4xl font-semibold text-stone-900">Избранное</h1>
      <p className="mb-8 mt-3 text-stone-600">Ваши любимые кофейные напитки сохранены на этом устройстве.</p>
      {favorites.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favorites.map((item) => <CoffeeCard key={item.id} item={item} />)}
      </div> : <section className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-lg text-stone-700">Пока здесь пусто. Нажмите ♡ на карточке кофе, чтобы сохранить его.</p>
        <Link className="mt-5 inline-flex min-h-11 items-center rounded-full bg-stone-900 px-5 text-white" to="/items">Перейти в меню</Link>
      </section>}
    </div>
  </main>
}
