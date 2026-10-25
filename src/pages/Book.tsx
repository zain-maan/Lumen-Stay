import { useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Calendar from '../components/Calendar'
import { Check, CheckCircle2, Minus, Plus } from '../components/icons'
import Img from '../components/Img'
import PageHero from '../components/PageHero'
import { ADD_ONS, ROOMS } from '../data'
import {
  formatDate,
  getRoom,
  isRangeAvailable,
  isValidISO,
  money,
  nightsBetween,
  quote,
  today,
} from '../lib/booking'
import { scrollToElement, scrollToTop } from '../lib/motion'

const STEPS = ['Dates', 'Villa', 'Extras', 'Details']

type Guest = { name: string; email: string; phone: string; country: string; requests: string }

export default function Book() {
  const [params, setParams] = useSearchParams()
  const [guest, setGuest] = useState<Guest>({ name: '', email: '', phone: '', country: '', requests: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof Guest, string>>>({})
  const [confirmed, setConfirmed] = useState<string | null>(null)

  // All booking choices live in the URL so a stay can be shared or resumed after a refresh.
  const rawIn = params.get('checkIn')
  const rawOut = params.get('checkOut')
  const checkIn = isValidISO(rawIn) && rawIn >= today() ? rawIn : null
  const checkOut = checkIn && isValidISO(rawOut) && rawOut > checkIn ? rawOut : null
  const guests = Math.min(4, Math.max(1, Number(params.get('guests')) || 2))
  const room = getRoom(params.get('room'))
  const addOnIds = (params.get('addons') ?? '').split(',').filter((id) => ADD_ONS.some((a) => a.id === id))
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0

  const roomFits = !!room && !!checkIn && !!checkOut && room.guests >= guests && isRangeAvailable(room.id, checkIn, checkOut)
  const maxStep = !nights ? 1 : !roomFits ? 2 : 4
  const step = Math.min(maxStep, Math.max(1, Number(params.get('step')) || 1))
  const price = quote(room, nights, guests, addOnIds)

  function update(next: Record<string, string | null>) {
    const p = new URLSearchParams(params)
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === '') p.delete(k)
      else p.set(k, v)
    }
    setParams(p, { replace: true })
  }

  function goTo(n: number) {
    update({ step: String(n) })
    scrollToElement('#booking')
  }

  const roomOptions = useMemo(
    () =>
      ROOMS.map((r) => ({
        room: r,
        tooSmall: r.guests < guests,
        unavailable: !!checkIn && !!checkOut && !isRangeAvailable(r.id, checkIn, checkOut),
      })),
    [guests, checkIn, checkOut],
  )

  function toggleAddOn(id: string) {
    const next = addOnIds.includes(id) ? addOnIds.filter((a) => a !== id) : [...addOnIds, id]
    update({ addons: next.join(',') })
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    const errs: typeof errors = {}
    if (guest.name.trim().length < 2) errs.name = 'Please enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(guest.email)) errs.email = 'Please enter a valid email address.'
    if (guest.phone.replace(/\D/g, '').length < 7) errs.phone = 'Please enter a phone number with country code.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setConfirmed(`LS-${Math.random().toString(36).slice(2, 7).toUpperCase()}`)
    scrollToTop()
  }

  if (confirmed && room && checkIn && checkOut) {
    return (
      <div>
        <PageHero
          image={room.image}
          size="short"
          eyebrow="Booking confirmed"
          title={<>Terima kasih, <em className="text-sunset">{guest.name.split(' ')[0]}.</em></>}
          text={
            <>
              Your {room.name} is reserved. A confirmation has been sent to <strong>{guest.email}</strong>.
            </>
          }
        />
        <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
          <CheckCircle2 size={56} className="mx-auto text-clay" />
          <dl className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-2xl bg-shell text-left">
            {[
              ['Reference', confirmed],
              ['Villa', room.name],
              ['Check in', formatDate(checkIn, { weekday: 'short', day: 'numeric', month: 'short' })],
              ['Check out', formatDate(checkOut, { weekday: 'short', day: 'numeric', month: 'short' })],
              ['Guests', String(guests)],
              ['Total', money(price.total)],
            ].map(([k, v]) => (
              <div key={k} className="bg-white p-4">
                <dt className="text-xs uppercase tracking-widest text-stone">{k}</dt>
                <dd className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-xs text-stone">This is a demo booking. No payment was taken and no email was sent.</p>
          <Link to="/" className="btn btn-dark mt-8">Back to home</Link>
        </section>
      </div>
    )
  }

  return (
    <div>
      <PageHero
        image="sunset-pool"
        size="short"
        eyebrow="Book direct"
        title={<>Book your <em className="text-sunset">stay.</em></>}
        text="Our best rate, live availability and instant confirmation. It takes about two minutes."
        crumbs={[{ to: '/book', label: 'Book' }]}
      />

      <div id="booking" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-24 pt-12 sm:px-6 lg:pt-16">
        <ol className="mt-8 grid grid-cols-4 gap-2" aria-label="Booking steps">
          {STEPS.map((label, i) => {
            const n = i + 1
            const done = n < step
            const reachable = n <= maxStep
            return (
              <li key={label}>
                <button
                  onClick={() => reachable && goTo(n)}
                  disabled={!reachable}
                  aria-current={n === step ? 'step' : undefined}
                  className="w-full text-left disabled:cursor-not-allowed"
                >
                  <span className={`block h-1 rounded-full ${n <= step ? 'bg-clay' : 'bg-shell'}`} />
                  <span className={`mt-2 flex items-center gap-1.5 text-xs sm:text-sm ${n === step ? 'font-semibold' : 'text-stone'}`}>
                    {done ? <Check size={14} className="text-clay" /> : <span className="hidden sm:inline">{n}.</span>}
                    {label}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            {step === 1 && (
              <section aria-labelledby="s1">
                <h2 id="s1" className="font-display text-3xl">When are you coming?</h2>
                <div className="mt-6 rounded-2xl bg-white p-5 sm:p-8">
                  <Calendar
                    roomId={room?.id}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onChange={(a, b) => update({ checkIn: a, checkOut: b })}
                  />
                </div>
                <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-5 sm:px-8">
                  <div>
                    <p className="font-medium">Guests</p>
                    <p className="text-sm text-stone">Adults and children over 4</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => update({ guests: String(guests - 1) })}
                      disabled={guests <= 1}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9cfc1] disabled:opacity-30"
                      aria-label="Fewer guests"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-4 text-center text-lg font-medium" aria-live="polite">{guests}</span>
                    <button
                      onClick={() => update({ guests: String(guests + 1) })}
                      disabled={guests >= 4}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9cfc1] disabled:opacity-30"
                      aria-label="More guests"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button className="btn btn-dark" disabled={!nights} onClick={() => goTo(2)}>
                    {nights ? `Continue with ${nights} ${nights === 1 ? 'night' : 'nights'}` : 'Select your dates'}
                  </button>
                </div>
              </section>
            )}

            {step === 2 && (
              <section aria-labelledby="s2">
                <h2 id="s2" className="font-display text-3xl">Choose your villa</h2>
                <p className="mt-2 text-sm text-stone">
                  Showing availability for {formatDate(checkIn!)} to {formatDate(checkOut!)}, {guests} {guests === 1 ? 'guest' : 'guests'}.
                </p>
                <div className="mt-6 space-y-4">
                  {roomOptions.map(({ room: r, tooSmall, unavailable }) => {
                    const blocked = tooSmall || unavailable
                    const selected = room?.id === r.id && !blocked
                    return (
                      <button
                        key={r.id}
                        disabled={blocked}
                        onClick={() => update({ room: r.id })}
                        aria-pressed={selected}
                        className={`flex w-full flex-col overflow-hidden rounded-2xl bg-white text-left ring-2 transition sm:flex-row ${
                          selected ? 'ring-clay' : 'ring-transparent hover:ring-[#d9cfc1]'
                        } ${blocked ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <Img name={r.image} alt="" className="h-44 w-full object-cover sm:h-auto sm:w-56" />
                        <div className="flex flex-1 flex-col justify-between gap-3 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-display text-2xl">{r.name}</p>
                              <p className="text-sm text-stone">{r.size} m² · {r.bed} · up to {r.guests} guests</p>
                            </div>
                            {selected && <CheckCircle2 className="shrink-0 text-clay" />}
                          </div>
                          <div className="flex flex-wrap items-end justify-between gap-2">
                            <p className="text-sm font-medium text-clay-dark">
                              {unavailable ? 'Booked for these dates' : tooSmall ? `Sleeps up to ${r.guests}` : 'Available'}
                            </p>
                            <p>
                              <span className="font-display text-2xl">{money(r.price * nights)}</span>
                              <span className="text-sm text-stone"> for {nights} nights</span>
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {roomOptions.every((o) => o.tooSmall || o.unavailable) && (
                  <p className="mt-6 rounded-xl bg-clay/10 p-4 text-sm text-clay-dark">
                    Every villa is booked for those dates. Try moving your stay by a few days.
                  </p>
                )}
                <div className="mt-8 flex justify-between">
                  <button className="btn btn-ghost" onClick={() => goTo(1)}>Back</button>
                  <button className="btn btn-dark" disabled={!roomFits} onClick={() => goTo(3)}>Continue</button>
                </div>
              </section>
            )}

            {step === 3 && (
              <section aria-labelledby="s3">
                <h2 id="s3" className="font-display text-3xl">Make it yours</h2>
                <p className="mt-2 text-sm text-stone">Optional extras, arranged before you arrive.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {ADD_ONS.map((a) => {
                    const on = addOnIds.includes(a.id)
                    const unit = a.per === 'night' ? '/ night' : a.per === 'guest' ? '/ guest' : 'per stay'
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggleAddOn(a.id)}
                        aria-pressed={on}
                        className={`flex flex-col rounded-2xl bg-white p-5 text-left ring-2 transition ${on ? 'ring-clay' : 'ring-transparent hover:ring-[#d9cfc1]'}`}
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className="font-medium">{a.name}</span>
                          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${on ? 'border-clay bg-clay text-white' : 'border-[#d9cfc1]'}`}>
                            {on && <Check size={14} />}
                          </span>
                        </span>
                        <span className="mt-1 text-sm text-stone">{a.text}</span>
                        <span className="mt-4 text-sm font-medium">
                          {money(a.price)} <span className="font-normal text-stone">{unit}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div className="mt-8 flex justify-between">
                  <button className="btn btn-ghost" onClick={() => goTo(2)}>Back</button>
                  <button className="btn btn-dark" onClick={() => goTo(4)}>Continue</button>
                </div>
              </section>
            )}

            {step === 4 && (
              <section aria-labelledby="s4">
                <h2 id="s4" className="font-display text-3xl">Your details</h2>
                <form onSubmit={submit} noValidate className="mt-6 grid gap-5 rounded-2xl bg-white p-5 sm:grid-cols-2 sm:p-8">
                  {(
                    [
                      { key: 'name', label: 'Full name', type: 'text', auto: 'name', span: true },
                      { key: 'email', label: 'Email', type: 'email', auto: 'email' },
                      { key: 'phone', label: 'Phone / WhatsApp', type: 'tel', auto: 'tel' },
                      { key: 'country', label: 'Country (optional)', type: 'text', auto: 'country-name', span: true },
                    ] as const
                  ).map((f) => (
                    <label key={f.key} className={'span' in f ? 'sm:col-span-2' : ''}>
                      <span className="mb-1.5 block text-sm font-medium">{f.label}</span>
                      <input
                        type={f.type}
                        autoComplete={f.auto}
                        value={guest[f.key]}
                        onChange={(e) => setGuest({ ...guest, [f.key]: e.target.value })}
                        aria-invalid={!!errors[f.key]}
                        aria-describedby={errors[f.key] ? `${f.key}-err` : undefined}
                        className="field"
                      />
                      {errors[f.key] && (
                        <span id={`${f.key}-err`} className="mt-1 block text-sm text-clay-dark">{errors[f.key]}</span>
                      )}
                    </label>
                  ))}
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-medium">Special requests (optional)</span>
                    <textarea
                      rows={3}
                      value={guest.requests}
                      onChange={(e) => setGuest({ ...guest, requests: e.target.value })}
                      placeholder="Celebrating something? Arriving late? Dietary needs?"
                      className="field resize-none"
                    />
                  </label>
                  <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-between">
                    <button type="button" className="btn btn-ghost" onClick={() => goTo(3)}>Back</button>
                    <button type="submit" className="btn btn-clay">Confirm booking · {money(price.total)}</button>
                  </div>
                  <p className="text-xs text-stone sm:col-span-2">Demo site: no payment is taken and no details are stored.</p>
                </form>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Booking summary">
            <div className="overflow-hidden rounded-2xl bg-white">
              {room && <Img name={room.image} alt="" className="h-40 w-full object-cover" />}
              <div className="p-6">
                <p className="eyebrow">Your stay</p>
                <p className="mt-2 font-display text-3xl">{room?.name ?? 'Villa not chosen yet'}</p>
                <p className="mt-1 text-sm text-stone">
                  {checkIn ? formatDate(checkIn, { weekday: 'short', day: 'numeric', month: 'short' }) : 'Check in'} →{' '}
                  {checkOut ? formatDate(checkOut, { weekday: 'short', day: 'numeric', month: 'short' }) : 'Check out'} · {guests}{' '}
                  {guests === 1 ? 'guest' : 'guests'}
                </p>
                <dl className="mt-6 space-y-2 border-t border-shell pt-5 text-sm">
                  {room && nights > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-stone">{nights} nights × {money(room.price)}</dt>
                      <dd>{money(price.roomTotal)}</dd>
                    </div>
                  )}
                  {price.addOns.map((a) => (
                    <div key={a.id} className="flex justify-between">
                      <dt className="text-stone">{a.name}{a.qty > 1 ? ` × ${a.qty}` : ''}</dt>
                      <dd>{money(a.total)}</dd>
                    </div>
                  ))}
                  {price.subtotal > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-stone">Taxes & service (11%)</dt>
                      <dd>{money(price.tax)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-shell pt-3 text-base font-semibold">
                    <dt>Total</dt>
                    <dd>{money(price.total)}</dd>
                  </div>
                </dl>
                <ul className="mt-6 space-y-1.5 text-xs text-stone">
                  <li className="flex items-center gap-2"><Check size={13} className="text-clay" /> Breakfast included</li>
                  <li className="flex items-center gap-2"><Check size={13} className="text-clay" /> Free cancellation up to 7 days before</li>
                  <li className="flex items-center gap-2"><Check size={13} className="text-clay" /> Best rate when you book direct</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
