import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TESTIMONIALS } from '../data'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { ArrowLeft, ArrowRight, Star } from './icons'

const INTERVAL = 6000

// One large quote at a time, rotating on its own, with a progress line per review.
export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const quote = useRef<HTMLQuoteElement>(null)
  const t = TESTIMONIALS[index]

  useEffect(() => {
    if (paused || prefersReducedMotion()) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), INTERVAL)
    return () => window.clearTimeout(id)
  }, [index, paused])

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !quote.current) return
    gsap.fromTo(
      quote.current.querySelectorAll('span'),
      { yPercent: 60, opacity: 0, filter: 'blur(6px)' },
      { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.015, ease: 'power3.out' },
    )
  }, [index])

  const go = (d: number) => setIndex((i) => (i + d + TESTIMONIALS.length) % TESTIMONIALS.length)

  return (
    <section
      className="bg-lagoon grain relative overflow-hidden py-24 text-sand lg:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Guest reviews"
    >
      <span aria-hidden="true" className="pointer-events-none absolute -top-10 left-4 font-display text-[16rem] leading-none text-white/5 sm:left-10 sm:text-[22rem]">
        “
      </span>
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center gap-1 text-glow" data-reveal>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={18} fill="currentColor" />
          ))}
          <span className="ml-3 text-sm text-sand/70">
            <span data-count="4.9">4.9</span> from 1,240 guest reviews
          </span>
        </div>

        <figure className="mt-10 min-h-[15rem] sm:min-h-[13rem]" aria-live="polite">
          <blockquote ref={quote} className="font-display text-3xl leading-snug sm:text-5xl sm:leading-[1.15]">
            “
            {t.quote.split(' ').map((w, i) => (
              <span key={`${index}-${i}`} className="inline-block whitespace-pre">
                {w}{' '}
              </span>
            ))}
            ”
          </blockquote>
          <figcaption className="mt-8 text-sm text-sand/70">
            <span className="font-semibold text-sand">{t.name}</span> · {t.from}
          </figcaption>
        </figure>

        <div className="mt-12 flex items-center gap-6">
          <div className="flex flex-1 gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)} className="h-6 flex-1" aria-label={`Show review ${i + 1}`} aria-current={i === index}>
                <span className="block h-0.5 overflow-hidden bg-white/20">
                  <span
                    key={`${index}-${paused}`}
                    className={`bg-sunset block h-full origin-left ${i < index ? 'scale-x-100' : 'scale-x-0'}`}
                    style={
                      i === index
                        ? { animation: paused ? 'none' : `grow ${INTERVAL}ms linear forwards`, transform: paused ? 'scaleX(1)' : undefined }
                        : undefined
                    }
                  />
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => go(-1)} className="btn btn-ghost !p-3" aria-label="Previous review" data-magnetic>
              <ArrowLeft size={18} />
            </button>
            <button onClick={() => go(1)} className="btn btn-ghost !p-3" aria-label="Next review" data-magnetic>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <style>{'@keyframes grow { from { transform: scaleX(0) } to { transform: scaleX(1) } }'}</style>
    </section>
  )
}
