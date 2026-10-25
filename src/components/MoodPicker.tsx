import Img from './Img'
import { ArrowRight } from './icons'
import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { EXPERIENCES, MOODS, ROOMS } from '../data'
import { money } from '../lib/booking'
import { gsap, prefersReducedMotion } from '../lib/motion'

export default function MoodPicker() {
  const [moodId, setMoodId] = useState<string>(MOODS[0].id)
  const result = useRef<HTMLDivElement>(null)
  const mood = MOODS.find((m) => m.id === moodId)!
  const room = ROOMS.find((r) => r.id === mood.room)!
  const picks = EXPERIENCES.filter((e) => (mood.experiences as readonly string[]).includes(e.id))

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !result.current) return
    gsap.fromTo(
      result.current.children,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
    )
  }, [moodId])

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
      <div className="max-w-2xl" data-reveal>
        <p className="eyebrow">Plan your stay</p>
        <h2 className="mt-4 font-display text-5xl leading-tight">What brings you to Bali?</h2>
        <p className="mt-4 text-stone">
          Pick the kind of trip you have in mind and we will suggest a villa and two experiences to go with it.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2" role="radiogroup" aria-label="Trip type" data-reveal>
        {MOODS.map((m) => (
          <button
            key={m.id}
            role="radio"
            aria-checked={m.id === moodId}
            onClick={() => setMoodId(m.id)}
            className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${
              m.id === moodId ? 'border-ink bg-ink text-sand' : 'border-[#d9cfc1] hover:border-ink'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div ref={result} className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr_1fr]" aria-live="polite">
        <Link to={`/rooms/${room.id}`} className="group relative min-h-80 overflow-hidden rounded-2xl text-white">
          <Img
            name={room.image}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-sm text-white/80">{mood.line}</p>
            <p className="mt-2 font-display text-4xl">{room.name}</p>
            <p className="mt-2 flex items-center gap-2 text-sm">
              from {money(room.price)} / night{' '}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </p>
          </div>
        </Link>
        {picks.map((e) => (
          <div key={e.id} className="overflow-hidden rounded-2xl bg-white">
            <Img name={e.image} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-5">
              <p className="font-display text-2xl">{e.title}</p>
              <p className="mt-2 text-sm text-stone">{e.text}</p>
              <p className="mt-3 text-sm font-medium text-clay">{e.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
