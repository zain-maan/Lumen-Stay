import { Search } from './icons'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDays, defaultStay, today } from '../lib/booking'

export default function BookingBar() {
  const navigate = useNavigate()
  const initial = defaultStay()
  const [checkIn, setCheckIn] = useState(initial.checkIn)
  const [checkOut, setCheckOut] = useState(initial.checkOut)
  const [guests, setGuests] = useState(2)

  function submit(e: FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests), step: '2' })
    navigate(`/book?${params}`)
  }

  function changeCheckIn(v: string) {
    setCheckIn(v)
    if (v && checkOut <= v) setCheckOut(addDays(v, 1))
  }

  const label = 'block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-stone'
  const input = 'mt-1 w-full bg-transparent text-[0.95rem] font-medium text-ink outline-none'

  return (
    <form
      onSubmit={submit}
      className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-3xl bg-shell text-left shadow-2xl shadow-black/20 md:grid-cols-[1fr_1fr_0.8fr_auto] md:rounded-full"
      aria-label="Check availability"
    >
      <label className="bg-white px-5 py-3 md:px-7 md:py-4">
        <span className={label}>Check in</span>
        <input type="date" required min={today()} value={checkIn} onChange={(e) => changeCheckIn(e.target.value)} className={input} />
      </label>
      <label className="bg-white px-5 py-3 md:px-7 md:py-4">
        <span className={label}>Check out</span>
        <input type="date" required min={addDays(checkIn, 1)} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={input} />
      </label>
      <label className="col-span-2 bg-white px-5 py-3 md:col-span-1 md:px-7 md:py-4">
        <span className={label}>Guests</span>
        <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={input}>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'guest' : 'guests'}
            </option>
          ))}
        </select>
      </label>
      <div className="col-span-2 bg-white p-2 md:col-span-1">
        <button type="submit" className="btn btn-clay h-full w-full md:px-8">
          <Search size={16} /> Check availability
        </button>
      </div>
    </form>
  )
}
