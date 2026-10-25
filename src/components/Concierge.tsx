import { MessageCircle, Send, X } from './icons'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ROOMS } from '../data'
import { money } from '../lib/booking'

type Msg = { from: 'bot' | 'guest'; text: string; link?: { to: string; label: string } }

const SUGGESTIONS = ['Which villa is best for couples?', 'Do you offer airport pickup?', 'Check-in time?', 'Is breakfast included?']

const cheapest = ROOMS.reduce((a, b) => (a.price < b.price ? a : b))

// Demo concierge: keyword intents with canned answers. In a client build this calls an LLM
// with the resort's FAQ, rates and live availability as context.
const INTENTS: { keys: string[]; reply: () => Msg }[] = [
  {
    keys: ['couple', 'honeymoon', 'romantic', 'anniversary', 'best villa', 'recommend'],
    reply: () => ({
      from: 'bot',
      text: 'For couples we love the Cliff Pavilion: a private plunge pool right on the cliff edge and a sunset cocktail every evening. The Sky Deck is a beautiful, quieter alternative.',
      link: { to: '/rooms/cliff-pavilion', label: 'See the Cliff Pavilion' },
    }),
  },
  {
    keys: ['airport', 'pickup', 'pick up', 'transfer', 'taxi', 'driver'],
    reply: () => ({
      from: 'bot',
      text: 'Yes. A private driver meets you at Ngurah Rai arrivals with cold towels and water. The drive is about 35 minutes and costs $45 each way. You can add it when you book.',
    }),
  },
  {
    keys: ['check-in', 'check in', 'checkin', 'check-out', 'check out', 'checkout', 'arrive', 'time'],
    reply: () => ({
      from: 'bot',
      text: 'Check-in is from 2 pm and check-out is until 12 noon. If your flight lands early, we will hold your bags and you are welcome to use the pool and spa showers.',
    }),
  },
  {
    keys: ['breakfast', 'food', 'restaurant', 'dinner', 'eat', 'vegan', 'halal'],
    reply: () => ({
      from: 'bot',
      text: 'Breakfast is included with every villa, served at the cliff terrace until 11 am. Our kitchen cooks vegan, gluten-free and halal on request. A floating breakfast in your pool is $35 per morning.',
    }),
  },
  {
    keys: ['price', 'cost', 'rate', 'cheap', 'budget', 'how much'],
    reply: () => ({
      from: 'bot',
      text: `Villas start at ${money(cheapest.price)} per night for the ${cheapest.name}, including breakfast. Booking direct on this site is always our best rate.`,
      link: { to: '/rooms', label: 'Compare villas' },
    }),
  },
  {
    keys: ['spa', 'massage', 'yoga', 'wellness'],
    reply: () => ({
      from: 'bot',
      text: 'Our cliffside spa offers Balinese massage, volcanic stone rituals and daily sunrise yoga (free for guests). Treatments start at $90.',
      link: { to: '/experiences', label: 'See experiences' },
    }),
  },
  {
    keys: ['wifi', 'wi-fi', 'internet', 'work', 'laptop'],
    reply: () => ({
      from: 'bot',
      text: 'Fibre Wi-Fi reaches every villa (around 100 Mbps). The Ocean Suite has a desk facing the sea if you need to get some work done.',
    }),
  },
  {
    keys: ['kid', 'child', 'family', 'baby'],
    reply: () => ({
      from: 'bot',
      text: 'Children of all ages are welcome. The Cliff Pavilion sleeps four with a twin loft, and we can add a cot for free.',
    }),
  },
  {
    keys: ['book', 'availability', 'available', 'reserve', 'dates'],
    reply: () => ({
      from: 'bot',
      text: 'You can check live availability and book in about two minutes.',
      link: { to: '/book', label: 'Start booking' },
    }),
  },
  {
    keys: ['cancel', 'refund'],
    reply: () => ({
      from: 'bot',
      text: 'Cancellation is free up to 7 days before arrival. After that, the first night is charged.',
    }),
  },
]

function answer(text: string): Msg {
  const q = text.toLowerCase()
  const hit = INTENTS.find((i) => i.keys.some((k) => q.includes(k)))
  if (hit) return hit.reply()
  return {
    from: 'bot',
    text: "Good question. I'll pass it to our front desk, who reply within an hour on WhatsApp or email. Meanwhile, I can help with villas, prices, transfers, dining or the spa.",
  }
}

export default function Concierge() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'bot', text: 'Selamat datang! I am Ayu, the Lumen Stay concierge. Ask me anything about your stay.' },
  ])
  const list = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function ask(text: string) {
    const clean = text.trim()
    if (!clean || typing) return
    setMessages((m) => [...m, { from: 'guest', text: clean }])
    setInput('')
    setTyping(true)
    window.setTimeout(() => {
      setMessages((m) => [...m, answer(clean)])
      setTyping(false)
    }, 700 + Math.random() * 500)
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    ask(input)
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-sunset fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_12px_30px_-8px_rgba(224,98,47,0.7)] transition-transform hover:scale-110"
        aria-label={open ? 'Close concierge chat' : 'Open concierge chat'}
        aria-expanded={open}
      >
        {open ? <X /> : <MessageCircle />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Concierge chat"
          data-lenis-prevent
          className="fixed inset-x-3 bottom-24 z-50 flex max-h-[70dvh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:inset-x-auto sm:right-5 sm:w-96"
        >
          <div className="bg-lagoon flex items-center gap-3 px-5 py-4 text-sand">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-glow font-display text-lg text-ink">A</span>
            <div>
              <p className="text-sm font-semibold">Ayu, AI concierge</p>
              <p className="text-xs text-sand/60">Replies instantly, day or night</p>
            </div>
          </div>

          <div ref={list} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'guest' ? 'justify-end' : ''}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.from === 'guest' ? 'bg-sunset rounded-br-sm text-white' : 'rounded-bl-sm bg-shell'
                  }`}
                >
                  {m.text}
                  {m.link && (
                    <Link to={m.link.to} onClick={() => setOpen(false)} className="mt-2 block font-medium text-clay-dark underline underline-offset-4">
                      {m.link.label} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex w-16 gap-1 rounded-2xl rounded-bl-sm bg-shell px-4 py-3" aria-label="Ayu is typing">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-stone/60" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </div>
            )}
          </div>

          {messages.length < 3 && (
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => ask(s)} className="rounded-full border border-[#d9cfc1] px-3 py-1.5 text-xs hover:border-ink">
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={submit} className="flex gap-2 border-t border-shell p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about villas, transfers, dining…"
              className="flex-1 rounded-full bg-sand px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-clay"
              aria-label="Your question"
            />
            <button type="submit" className="flex h-10 w-10 items-center justify-center rounded-full bg-clay text-white disabled:opacity-40" disabled={!input.trim() || typing} aria-label="Send">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
