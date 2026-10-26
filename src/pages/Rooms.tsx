import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BedDouble, Maximize, Users } from '../components/icons'
import Img from '../components/Img'
import PageHero from '../components/PageHero'
import { ROOMS } from '../data'
import { useReveal } from '../hooks/useReveal'
import { money } from '../lib/booking'

const VIEWS = ['All', 'Ocean', 'Cliff', 'Garden'] as const
type Sort = 'price-asc' | 'price-desc' | 'size'

export default function Rooms() {
  const root = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<(typeof VIEWS)[number]>('All')
  const [guests, setGuests] = useState(1)
  const [sort, setSort] = useState<Sort>('price-asc')

  const rooms = useMemo(() => {
    const list = ROOMS.filter((r) => (view === 'All' || r.view === view) && r.guests >= guests)
    return list.sort((a, b) => (sort === 'size' ? b.size - a.size : sort === 'price-asc' ? a.price - b.price : b.price - a.price))
  }, [view, guests, sort])

  useReveal(root)

  return (
    <div ref={root}>
      <PageHero
        image="infinity-pool"
        eyebrow="Villas & suites"
        title={<>Choose where you <em className="text-sunset">wake up.</em></>}
        text="Four kinds of villa on the cliff, each private and hand-built. Every stay includes breakfast, sunrise yoga, Wi-Fi and a welcome massage."
        crumbs={[{ to: '/rooms', label: 'Villas' }]}
      >
        <ul className="flex flex-wrap gap-2 text-sm">
          {['From $240 a night', 'Breakfast included', 'Free cancellation'].map((t) => (
            <li key={t} className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">{t}</li>
          ))}
        </ul>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:pt-16">
        <div className="flex flex-wrap items-center gap-3 border-y border-line py-4">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filter by view">
            {VIEWS.map((v) => (
              <button
                key={v}
                role="radio"
                aria-checked={view === v}
                onClick={() => setView(v)}
                className={`rounded-full px-4 py-2 text-sm ${view === v ? 'bg-ink text-sand' : 'hover:bg-shell'}`}
              >
                {v === 'All' ? 'All views' : `${v} view`}
              </button>
            ))}
          </div>
          <div className="ml-auto flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-stone">Guests</span>
              <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="rounded-full border border-[#d9cfc1] bg-white px-3 py-2">
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n}+</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-stone">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-full border border-[#d9cfc1] bg-white px-3 py-2">
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="size">Largest first</option>
              </select>
            </label>
          </div>
        </div>

        <p className="mt-6 text-sm text-stone" aria-live="polite">
          {rooms.length} {rooms.length === 1 ? 'villa' : 'villas'} match
        </p>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          {rooms.map((r) => (
            <article key={r.id} data-card className="group">
              <Link to={`/rooms/${r.id}`}>
                <div className="overflow-hidden rounded-2xl" data-reveal-img data-cursor="View">
                  <Img name={r.image} alt={`${r.name} interior`} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl">{r.name}</h2>
                    <p className="text-sm text-stone">{r.tagline}</p>
                  </div>
                  <p className="shrink-0 text-right">
                    <span className="font-display text-2xl">{money(r.price)}</span>
                    <span className="block text-xs text-stone">per night</span>
                  </p>
                </div>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone">
                  <li className="flex items-center gap-1.5"><Maximize size={15} /> {r.size} m²</li>
                  <li className="flex items-center gap-1.5"><Users size={15} /> Up to {r.guests}</li>
                  <li className="flex items-center gap-1.5"><BedDouble size={15} /> {r.bed}</li>
                </ul>
              </Link>
            </article>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="mt-6 rounded-2xl bg-shell p-10 text-center">
            <p className="font-display text-2xl">No villa fits that filter.</p>
            <button className="btn btn-dark mt-5" onClick={() => { setView('All'); setGuests(1) }}>
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
