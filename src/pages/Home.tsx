import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BookingBar from '../components/BookingBar'
import Gallery from '../components/Gallery'
import { ArrowRight, Star } from '../components/icons'
import CoverReveal from '../components/CoverReveal'
import HeroWater from '../components/HeroWater'
import Img from '../components/Img'
import Marquee from '../components/Marquee'
import MoodPicker from '../components/MoodPicker'
import RoomTour from '../components/RoomTour'
import Testimonials from '../components/Testimonials'
import { EXPERIENCES, LOCATION } from '../data'
import { useCoverflow } from '../hooks/useCoverflow'
import { useReveal } from '../hooks/useReveal'
import { gsap, introDelay, prefersReducedMotion } from '../lib/motion'

const LocationMap = lazy(() => import('../components/LocationMap'))

const STATS = [
  { value: '14', label: 'Private villas' },
  { value: '70', suffix: ' m', label: 'Above the Indian Ocean' },
  { value: '4.9', label: 'Average guest rating' },
  { value: '35', suffix: ' min', label: 'From Bali airport' },
]

export default function Home() {
  const root = useRef<HTMLDivElement>(null)
  const expTrack = useRef<HTMLDivElement>(null)
  useCoverflow(expTrack)
  const hero = useRef<HTMLElement>(null)
  const { hash } = useLocation()
  useReveal(root)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: introDelay(0.1) })
      tl.fromTo('[data-hero-img]', { scale: 1.25 }, { scale: 1.05, duration: 2.6, ease: 'expo.out' }, 0)
        .from('[data-hero-line]', { yPercent: 115, rotate: 3, duration: 1.4, ease: 'power4.out', stagger: 0.14 }, 0.15)
        .from('[data-hero-fade]', { opacity: 0, y: 30, duration: 1.1, ease: 'power3.out', stagger: 0.12 }, 0.6)
        .from('[data-hero-card]', { opacity: 0, x: 40, duration: 1.1, ease: 'power3.out' }, 1)

      // Image drifts down and the copy fades as the hero scrolls away.
      gsap.to('[data-hero-media]', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: hero.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-hero-copy]', {
        yPercent: -15,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: hero.current, start: '30% top', end: 'bottom top', scrub: true },
      })

      // Gentle pointer parallax on the photo (desktop).
      if (window.matchMedia('(pointer: fine)').matches) {
        const xTo = gsap.quickTo('[data-hero-img]', 'xPercent', { duration: 1.2, ease: 'power3' })
        const yTo = gsap.quickTo('[data-hero-img]', 'yPercent', { duration: 1.2, ease: 'power3' })
        const onMove = (e: PointerEvent) => {
          xTo((e.clientX / window.innerWidth - 0.5) * -2.5)
          yTo((e.clientY / window.innerHeight - 0.5) * -2.5)
        }
        hero.current!.addEventListener('pointermove', onMove)
        return () => hero.current?.removeEventListener('pointermove', onMove)
      }
    }, hero)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!hash) return
    const t = window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 150)
    return () => window.clearTimeout(t)
  }, [hash])

  return (
    <div ref={root}>
      {/* Hero */}
      <section ref={hero} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-deep text-white">
        <div data-hero-media className="absolute inset-0">
          {/* The photo paints first; the WebGL water fades in over it once ready. */}
          <div data-hero-img className="absolute inset-0 scale-105">
            <Img name="hero" priority sizes="100vw" alt="Infinity pool on the cliffs of Uluwatu overlooking the ocean" className="h-full w-full object-cover" />
            <HeroWater />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-deep/60 via-deep/10 to-deep/85" />
        <div aria-hidden="true" className="animate-sun pointer-events-none absolute -left-[10%] top-[5%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(246,178,94,0.55),rgba(224,98,47,0.15)_45%,transparent_70%)] mix-blend-screen" />
        <div className="grain absolute inset-0" />

        <div data-hero-copy className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-24 pt-28 sm:px-6 lg:pb-14">
          <p data-hero-fade className="eyebrow !text-glow">Boutique retreat · Uluwatu, Bali</p>
          <h1 className="mt-5 font-display text-[clamp(3.2rem,9.5vw,8.5rem)] font-medium leading-[0.92]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero-line className="block origin-bottom-left">Where the cliffs</span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span data-hero-line className="text-sunset block origin-bottom-left pr-2 italic">meet the light.</span>
            </span>
          </h1>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <p data-hero-fade className="max-w-lg text-base text-white/85 sm:text-lg">
              Fourteen private villas seventy metres above the Indian Ocean. Book direct in two minutes.
            </p>
            <div data-hero-card className="hidden items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md lg:flex">
              <p className="font-display text-4xl text-glow">4.9</p>
              <div>
                <p className="flex gap-0.5 text-glow">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </p>
                <p className="mt-1 text-xs text-white/75">1,240 guest reviews</p>
              </div>
            </div>
          </div>
          <div data-hero-fade className="mt-10 w-full lg:max-w-4xl">
            <BookingBar />
          </div>
        </div>

        <a href="#intro" className="absolute bottom-8 right-8 hidden flex-col items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-white/70 lg:flex" aria-label="Scroll to content">
          <span className="[writing-mode:vertical-rl]">Scroll</span>
          <span className="relative h-14 w-px overflow-hidden bg-white/25">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-glow" />
          </span>
          <style>{'@keyframes scrollcue { from { transform: translateY(-100%) } to { transform: translateY(200%) } }'}</style>
        </a>
      </section>

      {/* Intro */}
      <section id="intro" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <h2 data-split className="font-display text-4xl leading-[1.12] sm:text-5xl lg:text-[3.6rem]">
            A small hotel with a <em className="text-sunset">big view</em>, built from local stone and run by people who grew up on these cliffs.
          </h2>
          <div data-reveal="0.2" className="self-end text-stone">
            <p className="leading-relaxed">
              Lumen Stay opened in 2019 on a quiet stretch of the Bukit peninsula. There are no lobbies or queues, just
              fourteen villas, a cliffside spa and a kitchen that cooks with what the island grows.
            </p>
            <Link to="/rooms" className="group mt-6 inline-flex items-center gap-2 font-medium text-ink">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                Meet the villas
              </span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        <dl className="mt-20 grid grid-cols-2 gap-8 border-t border-line pt-10 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} data-reveal={i * 0.08} data-card={i * 0.08} className="flex flex-col-reverse">
              <dt className="mt-1 text-sm text-stone">{s.label}</dt>
              <dd className="font-display text-5xl sm:text-6xl">
                <span data-count={s.value}>{s.value}</span>
                <span className="text-sunset text-3xl">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Marquee />

      <RoomTour />

      <MoodPicker />

      <CoverReveal />

      {/* Experiences */}
      <section className="bg-shell py-24 lg:py-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="eyebrow" data-reveal>Beyond the villa</p>
              <h2 data-split className="mt-4 font-display text-5xl leading-tight sm:text-6xl">Days worth getting up for.</h2>
            </div>
            <Link to="/experiences" className="btn btn-ghost" data-reveal data-magnetic>
              All experiences <ArrowRight size={16} />
            </Link>
          </div>
          {/* Phones: a swipe carousel with depth. Larger screens: a staggered grid. */}
          <div
            ref={expTrack}
            className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[11%] pb-6 pt-2 sm:mx-0 sm:mt-14 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:p-0 lg:grid-cols-4"
          >
            {EXPERIENCES.map((e, i) => (
              <Link
                to="/experiences"
                key={e.id}
                className={`group block w-[78%] shrink-0 snap-center will-change-transform sm:w-auto ${i % 2 ? 'lg:mt-16' : ''}`}
                data-cursor="Explore"
              >
                <div className="relative overflow-hidden rounded-2xl" data-reveal-img={i * 0.1} data-skew>
                  <Img
                    name={e.image}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/40 to-transparent transition-opacity duration-500 sm:from-deep/80 sm:via-transparent sm:opacity-80 sm:group-hover:opacity-100" />
                  <span className="absolute left-4 top-4 animate-float rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink shadow-lg" style={{ animationDelay: `${i * -1.3}s` }}>
                    {e.price}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="font-display text-3xl leading-tight">{e.title}</h3>
                    <p className="mt-2 max-h-24 overflow-hidden text-sm text-white/80 transition-all duration-500 sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-24 sm:group-hover:opacity-100">
                      {e.text}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <p className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-stone sm:hidden">
            Swipe <ArrowRight size={14} className="animate-pulse" />
          </p>
        </div>
      </section>

      <Gallery />

      <Testimonials />

      {/* Location */}
      <section id="location" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow" data-reveal>Getting here</p>
            <h2 data-split className="mt-4 font-display text-5xl leading-tight">On the edge of the Bukit peninsula.</h2>
            <p className="mt-4 text-stone" data-reveal="0.1">
              Far enough from the crowds to hear the waves, close enough to Bali's best surf breaks and temples.
            </p>
            <ul className="mt-8 divide-y divide-line border-y border-line" data-reveal="0.2">
              {LOCATION.places.map((p) => (
                <li key={p.name} className="flex justify-between py-3 text-sm">
                  <span>{p.name}</span>
                  <span className="text-stone">{p.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal-img className="min-h-96 overflow-hidden rounded-2xl">
            <Suspense fallback={<div className="h-full min-h-96 animate-pulse rounded-2xl bg-shell" />}>
              <LocationMap />
            </Suspense>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-x-0 -bottom-[15%] -top-[15%]" data-speed="0.1">
          <Img name="cabanas" sizes="100vw" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/50 to-deep/30" />
        <div className="relative mx-auto max-w-3xl px-4 py-32 text-center sm:px-6 lg:py-48">
          <p className="eyebrow justify-center !text-glow" data-reveal>Book direct</p>
          <h2 data-split className="mt-5 font-display text-5xl leading-[1.05] sm:text-7xl">
            Your villa is <em className="text-sunset">waiting.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-white/80" data-reveal="0.15">
            Our best rate, free airport pickup on stays of five nights or more, and free cancellation up to 7 days before.
          </p>
          <div data-reveal="0.3">
            <Link to="/book" className="btn btn-clay mt-10 !px-9 !py-4 text-base" data-magnetic>
              Check availability <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
