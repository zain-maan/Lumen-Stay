import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Calendar from '../components/Calendar'
import { BedDouble, Check, Eye, Maximize, Users } from '../components/icons'
import Img from '../components/Img'
import PageHero from '../components/PageHero'
import { ROOMS } from '../data'
import { useReveal } from '../hooks/useReveal'
import { formatDate, getRoom, money, nightsBetween, quote } from '../lib/booking'
import NotFound from './NotFound'

export default function RoomDetail() {
  const { id } = useParams()
  const room = getRoom(id ?? null)
  const navigate = useNavigate()
  const root = useRef<HTMLDivElement>(null)
  const [checkIn, setCheckIn] = useState<string | null>(null)
  const [checkOut, setCheckOut] = useState<string | null>(null)
  useReveal(root, [id])

  if (!room) return <NotFound />

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0
  const price = quote(room, nights, 2, [])
  const others = ROOMS.filter((r) => r.id !== room.id).slice(0, 3)

  function book() {
    const params = new URLSearchParams({ room: room!.id, step: nights ? '3' : '1' })
    if (checkIn && checkOut) {
      params.set('checkIn', checkIn)
      params.set('checkOut', checkOut)
    }
    navigate(`/book?${params}`)
  }

  return (
    <div ref={root}>
      <PageHero
        key={room.id}
        image={room.image}
        eyebrow={room.tagline}
        title={room.name}
        crumbs={[
          { to: '/rooms', label: 'Villas' },
          { to: `/rooms/${room.id}`, label: room.name },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <p>
            <span className="text-sunset font-display text-4xl">{money(room.price)}</span>
            <span className="text-white/70"> / night</span>
          </p>
          <ul className="flex flex-wrap gap-2 text-sm">
            {[`${room.size} m²`, `Up to ${room.guests} guests`, `${room.view} view`].map((t) => (
              <li key={t} className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">{t}</li>
            ))}
          </ul>
        </div>
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:py-24">
        <div>
          <ul className="grid grid-cols-2 gap-6 border-b border-[#ddd2c3] pb-8 sm:grid-cols-4" data-reveal>
            {[
              { icon: Maximize, label: 'Size', value: `${room.size} m²` },
              { icon: Users, label: 'Sleeps', value: `Up to ${room.guests}` },
              { icon: BedDouble, label: 'Bed', value: room.bed },
              { icon: Eye, label: 'View', value: room.view },
            ].map(({ icon: Icon, label, value }) => (
              <li key={label}>
                <Icon size={18} className="text-clay" />
                <p className="mt-2 text-xs uppercase tracking-widest text-stone">{label}</p>
                <p className="mt-1 font-medium">{value}</p>
              </li>
            ))}
          </ul>

          <p className="mt-8 font-display text-2xl leading-relaxed sm:text-3xl" data-reveal>
            {room.description}
          </p>

          <h2 className="mt-12 eyebrow" data-reveal>In your villa</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2" data-reveal>
            {[...room.amenities, 'Breakfast included', 'Fibre Wi-Fi', 'Daily housekeeping'].map((a) => (
              <li key={a} className="flex items-center gap-3 text-sm">
                <Check size={16} className="text-clay" /> {a}
              </li>
            ))}
          </ul>

          <div className="mt-14 rounded-2xl bg-white p-5 sm:p-8" data-reveal>
            <h2 className="font-display text-3xl">Availability</h2>
            <p className="mt-1 mb-6 text-sm text-stone">Live calendar for this villa. Select your dates to see the total.</p>
            <Calendar
              roomId={room.id}
              checkIn={checkIn}
              checkOut={checkOut}
              onChange={(a, b) => {
                setCheckIn(a)
                setCheckOut(b)
              }}
            />
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-ink p-7 text-sand">
            <p className="text-sm text-sand/60">From</p>
            <p className="font-display text-5xl">
              {money(room.price)}
              <span className="ml-1 font-sans text-base text-sand/60">/ night</span>
            </p>
            <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
              {nights ? (
                <>
                  <p className="flex justify-between">
                    <span className="text-sand/60">Dates</span>
                    <span>{formatDate(checkIn!)} → {formatDate(checkOut!)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-sand/60">{nights} nights × {money(room.price)}</span>
                    <span>{money(price.roomTotal)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-sand/60">Taxes & service</span>
                    <span>{money(price.tax)}</span>
                  </p>
                  <p className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold">
                    <span>Total</span>
                    <span>{money(price.total)}</span>
                  </p>
                </>
              ) : (
                <p className="text-sand/60">Pick your dates in the calendar to see your total.</p>
              )}
            </div>
            <button onClick={book} className="btn btn-clay mt-7 w-full">
              {nights ? 'Continue to booking' : 'Book this villa'}
            </button>
            <p className="mt-3 text-center text-xs text-sand/50">Free cancellation up to 7 days before arrival</p>
          </div>
        </aside>
      </section>

      <section className="bg-shell py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-4xl">Other villas</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {others.map((r) => (
              <Link key={r.id} to={`/rooms/${r.id}`} className="group">
                <div className="overflow-hidden rounded-2xl">
                  <Img name={r.image} alt="" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-3 font-display text-2xl">{r.name}</p>
                <p className="text-sm text-stone">from {money(r.price)} / night</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
