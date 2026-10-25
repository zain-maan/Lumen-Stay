import { ADD_ONS, ROOMS, type Room } from '../data'

export const TAX_RATE = 0.11

// Dates are handled as local "YYYY-MM-DD" strings so they survive URLs and never shift with time zones.
export function toISO(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function fromISO(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(s: string, n: number) {
  const d = fromISO(s)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

export function today() {
  return toISO(new Date())
}

export function defaultStay() {
  const checkIn = addDays(today(), 14)
  return { checkIn, checkOut: addDays(checkIn, 3) }
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const ms = fromISO(checkOut).getTime() - fromISO(checkIn).getTime()
  return Math.max(0, Math.round(ms / 86_400_000))
}

export function formatDate(s: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) {
  return fromISO(s).toLocaleDateString('en-GB', opts)
}

export function isValidISO(s: string | null): s is string {
  return !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(fromISO(s).getTime())
}

// Demo availability: a stable pseudo-random set of booked nights per villa, so the calendar looks real.
function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function isBooked(roomId: string, date: string) {
  if (date < today()) return false
  // Booked nights come in runs of a few days, like real reservations.
  const block = Math.floor(fromISO(date).getTime() / (3 * 86_400_000))
  return hash(`${roomId}:${block}`) % 100 < 22
}

export function isRangeAvailable(roomId: string, checkIn: string, checkOut: string) {
  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) {
    if (isBooked(roomId, d)) return false
  }
  return true
}

export function getRoom(id: string | null): Room | undefined {
  return ROOMS.find((r) => r.id === id)
}

export function quote(room: Room | undefined, nights: number, guests: number, addOnIds: string[]) {
  const roomTotal = room ? room.price * nights : 0
  const addOns = ADD_ONS.filter((a) => addOnIds.includes(a.id)).map((a) => {
    const qty = a.per === 'night' ? nights : a.per === 'guest' ? guests : 1
    return { ...a, qty, total: a.price * qty }
  })
  const addOnTotal = addOns.reduce((s, a) => s + a.total, 0)
  const subtotal = roomTotal + addOnTotal
  const tax = Math.round(subtotal * TAX_RATE)
  return { roomTotal, addOns, addOnTotal, subtotal, tax, total: subtotal + tax }
}

export const money = (n: number) => `$${n.toLocaleString('en-US')}`
