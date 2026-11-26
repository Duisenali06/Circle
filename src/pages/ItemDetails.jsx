import { Link } from 'react-router-dom'
import useCoffeeDetails from '../hooks/useCoffeeDetails.js'

export default function ItemDetails() {
  const { item, status, error, retry } = useCoffeeDetails()
  if (status === 'loading' || status === 'idle') return <main className="p-12 text-center" role="status">Загружаем напиток…</main>
  if (status === 'error') return <main className="mx-auto max-w-2xl p-8 text-center" role="alert"><p>{error}</p><button className="mt-4 underline" onClick={retry}>Попробовать снова</button></main>
  if (!item) return <main className="p-12 text-center">Напиток не найден</main>
  return <main className="mx-auto min-h-[70vh] max-w-3xl px-5 py-12">
    <Link className="text-amber-900 underline" to="/items">← К меню</Link>
    <article className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">
      {item.image && <img className="max-h-96 w-full object-cover" src={item.image} alt={item.title} />}
      <div className="p-7"><h1 className="text-3xl font-semibold">{item.title}</h1><p className="mt-2 font-medium text-amber-900">{item.type === 'cold' ? 'Cold drink' : 'Hot drink'} · Price {Number(item.price || 0).toFixed(2)}</p><p className="mt-4 text-stone-600">{item.description}</p>
        {item.ingredients?.length > 0 && <><h2 className="mt-6 font-semibold">Ингредиенты</h2><ul className="mt-2 list-inside list-disc text-stone-600">{item.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul></>}
      </div>
    </article>
  </main>
}
