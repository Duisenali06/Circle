import { Link } from 'react-router-dom'
import { useFavorites } from '../favorites/FavoritesContext.jsx'

export default function CoffeeCard({ item }) {
  const ingredients = Array.isArray(item.ingredients) ? item.ingredients : []
  const { isFavorite, toggleFavorite, changeQuantity, loading } = useFavorites()
  const favorite = isFavorite(item.id)

  return (
    <article className="overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {item.image ? (
        <img className="h-52 w-full object-cover" src={item.image} alt={item.title} loading="lazy" />
      ) : (
        <div className="flex h-52 items-center justify-center bg-amber-100 text-6xl" aria-hidden="true">☕</div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-semibold text-stone-900">{item.title}</h2>
          <button type="button" disabled={loading} onClick={() => toggleFavorite(item)} aria-label={favorite ? `Убрать ${item.title} из избранного` : `Добавить ${item.title} в избранное`} aria-pressed={favorite} className="min-h-11 min-w-11 rounded-full bg-stone-100 text-xl text-rose-700 hover:bg-rose-100 disabled:opacity-50">{favorite ? '♥' : '♡'}</button>
          <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
            {ingredients.length} {ingredients.length === 1 ? 'ингредиент' : 'ингредиента'}
          </span>
        </div>
        <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-stone-600">
          {item.description || 'Описание пока не добавлено.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ingredients.map((ingredient) => (
            <span key={`${item.id}-${ingredient}`} className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700">
              {ingredient}
            </span>
          ))}
        </div>
        <Link
          className="mt-5 inline-flex text-sm font-semibold text-amber-900 underline-offset-4 hover:underline"
          to={`/items/${item.id}`}
        >
          Открыть в меню <span className="ml-1" aria-hidden="true">→</span>
        </Link>
        <button type="button" disabled={loading} onClick={() => changeQuantity(item, 1)} className="ml-4 rounded-full bg-amber-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">В корзину</button>
      </div>
    </article>
  )
}
