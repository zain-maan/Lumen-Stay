import { ChevronLeft, ChevronRight } from './icons'
import { useMemo, useState } from 'react'
import { fromISO, isBooked, isRangeAvailable, toISO, today } from '../lib/booking'

type Props = {
  roomId?: string
  checkIn: string | null
  checkOut: string | null
  onChange: (checkIn: string | null, checkOut: string | null) => void
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function monthDays(year: number, month: number) {
  const first = new Date(year, month, 1)
  const lead = (first.getDay() + 6) % 7 // Monday-first grid
  const count = new Date(year, month + 1, 0).getDate()
  const cells: (string | null)[] = Array(lead).fill(null)
  for (let d = 1; d <= count; d++) cells.push(toISO(new Date(year, month, d)))
  return cells
}

export default function Calendar({ roomId, checkIn, checkOut, onChange }: Props) {
  const start = fromISO(checkIn ?? today())
  const [offset, setOffset] = useState(() => {
    const now = new Date()
    return (start.getFullYear() - now.getFullYear()) * 12 + start.getMonth() - now.getMonth()
  })
  const [hover, setHover] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const now = today()

  const months = useMemo(() => {
    const base = new Date()
    return [0, 1].map((i) => {
      const d = new Date(base.getFullYear(), base.getMonth() + offset + i, 1)
      return { year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) }
    })
  }, [offset])

  const booked = (d: string) => (roomId ? isBooked(roomId, d) : false)
  const choosingCheckout = !!checkIn && !checkOut

  function pick(d: string) {
    setNotice('')
    if (choosingCheckout && d > checkIn!) {
      if (!roomId || isRangeAvailable(roomId, checkIn!, d)) return onChange(checkIn, d)
      setNotice('Some nights in that range are already booked. Pick a shorter stay or another date.')
      return
    }
    if (booked(d)) return
    onChange(d, null)
  }

  const rangeEnd = checkOut ?? (choosingCheckout && hover && hover > checkIn! ? hover : null)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
          disabled={offset === 0}
          className="rounded-full p-2 hover:bg-shell disabled:opacity-30"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <p className="text-sm text-stone" aria-live="polite">
          {choosingCheckout ? 'Now choose your check-out date' : 'Choose your check-in date'}
        </p>
        <button
          type="button"
          onClick={() => setOffset((o) => Math.min(11, o + 1))}
          className="rounded-full p-2 hover:bg-shell"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {months.map((m, i) => (
          <div key={m.label} className={i === 1 ? 'hidden sm:block' : ''}>
            <p className="mb-3 text-center font-display text-xl">{m.label}</p>
            <div className="grid grid-cols-7 text-center text-[0.7rem] font-medium uppercase tracking-wider text-stone">
              {WEEKDAYS.map((w) => (
                <span key={w} className="pb-2">{w}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1" onMouseLeave={() => setHover(null)}>
              {monthDays(m.year, m.month).map((d, idx) => {
                if (!d) return <span key={`e${idx}`} />
                const past = d < now
                const isBookedNight = booked(d)
                // A booked night can still be a check-out day, since that night is not stayed.
                const canCheckout = choosingCheckout && d > checkIn! && !past
                const disabled = past || (isBookedNight && !canCheckout)
                const isStart = d === checkIn
                const isEnd = d === rangeEnd
                const inRange = !!checkIn && !!rangeEnd && d > checkIn && d < rangeEnd
                return (
                  <button
                    key={d}
                    type="button"
                    disabled={disabled}
                    onClick={() => pick(d)}
                    onMouseEnter={() => setHover(d)}
                    aria-label={`${fromISO(d).toDateString()}${isBookedNight ? ', booked' : ''}`}
                    aria-pressed={isStart || isEnd}
                    className={`relative mx-auto flex h-10 w-full items-center justify-center text-sm transition-colors
                      ${inRange ? 'bg-glow/30' : ''}
                      ${isStart && rangeEnd ? 'rounded-l-full bg-glow/30' : ''}
                      ${isEnd ? 'rounded-r-full bg-glow/30' : ''}
                      ${disabled ? 'cursor-not-allowed text-stone/40' : 'hover:font-semibold'}
                      ${isBookedNight && !past ? 'line-through decoration-stone/50' : ''}`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isStart || isEnd ? 'bg-ink text-sand' : ''
                      } ${d === now && !isStart ? 'ring-1 ring-clay' : ''}`}
                    >
                      {fromISO(d).getDate()}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone">
        {roomId && (
          <span className="flex items-center gap-2">
            <span className="line-through">14</span> Booked
          </span>
        )}
        <span className="flex items-center gap-2">
          <span className="h-3 w-6 rounded-full bg-glow/40" /> Your stay
        </span>
        {(checkIn || checkOut) && (
          <button type="button" className="ml-auto underline underline-offset-4" onClick={() => onChange(null, null)}>
            Clear dates
          </button>
        )}
      </div>
      {notice && (
        <p className="mt-3 rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay-dark" role="alert">
          {notice}
        </p>
      )}
    </div>
  )
}
