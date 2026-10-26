import { Star } from './icons'

const WORDS = ['Cliffside villas', 'Sunset dinners', 'Balinese spa', 'Hidden beaches', 'Sunrise yoga', 'Private pools']

// An endless band of words. The list is rendered twice and shifted by half its width per loop.
export default function Marquee({ tone = 'sunset' }: { tone?: 'sunset' | 'light' }) {
  const items = [...WORDS, ...WORDS]
  return (
    <div
      data-skew
      className={`relative overflow-hidden py-5 sm:py-7 ${tone === 'sunset' ? 'bg-sunset text-white' : 'bg-shell text-ink'}`}
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max items-center hover:[animation-play-state:paused]">
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 font-display text-3xl italic sm:text-5xl">
            {w}
            <Star size={18} fill="currentColor" className="opacity-70" />
          </span>
        ))}
      </div>
    </div>
  )
}
