import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ROOMS } from '../data'
import { money } from '../lib/booking'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { ArrowRight } from './icons'
import Img from './Img'

// Desktop: the section pins and the villas slide past horizontally as you scroll.
// Mobile and reduced motion: a plain vertical list.
export default function RoomTour() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const el = track.current!
      const distance = () => el.scrollWidth - window.innerWidth
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(progress.current, { scaleX: self.progress }),
        },
      })
      el.querySelectorAll<HTMLElement>('[data-tour-card]').forEach((card) => {
        const img = card.querySelector('img')
        gsap.fromTo(img, { xPercent: -10 }, { xPercent: 10, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, scrub: true } })
        // Cards tilt and settle as they enter from the right.
        gsap.from(card, {
          rotate: 4,
          y: 60,
          opacity: 0.3,
          ease: 'power2.out',
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 95%', end: 'left 55%', scrub: true },
        })
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={section} className="bg-lagoon grain relative overflow-hidden py-20 text-sand lg:flex lg:h-screen lg:items-center lg:py-0">
      <div ref={track} className="relative flex flex-col gap-14 px-4 sm:px-6 lg:w-max lg:flex-row lg:items-center lg:gap-16 lg:pl-[8vw] lg:pr-[8vw]">
        <div className="max-w-md shrink-0 lg:w-[30vw]">
          <p className="eyebrow !text-glow">The villas</p>
          <h2 className="mt-5 font-display text-5xl leading-[1.02] lg:text-7xl">
            Four ways to wake up <em className="text-sunset">above the ocean.</em>
          </h2>
          <p className="mt-6 text-sand/70">Every villa is private, hand-built and faces the light. Keep scrolling to take the tour.</p>
        </div>

        {ROOMS.map((room, i) => (
          <article key={room.id} data-tour-card className="group relative shrink-0 lg:w-[38vw]">
            <span aria-hidden="true" className="pointer-events-none absolute -top-14 right-2 z-10 font-display text-8xl italic text-transparent [-webkit-text-stroke:1px_rgba(246,178,94,0.55)] lg:-top-20 lg:text-[9rem]">
              0{i + 1}
            </span>
            <Link to={`/rooms/${room.id}`} className="block" data-cursor="View">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[5/4]">
                <Img
                  name={room.image}
                  alt={`${room.name} interior`}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="absolute inset-0 h-full w-full scale-[1.25] object-cover transition-[filter] duration-500 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/60 via-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur-md">
                  {room.view} view · up to {room.guests} guests
                </span>
              </div>
              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display text-4xl">{room.name}</h3>
                  <p className="mt-1 text-sm text-sand/60">
                    {room.size} m² · {room.bed}
                  </p>
                </div>
                <p className="shrink-0 text-right text-sm">
                  <span className="text-sand/60">from</span>
                  <br />
                  <span className="text-sunset font-display text-3xl">{money(room.price)}</span>
                  <span className="text-sand/60"> /night</span>
                </p>
              </div>
            </Link>
          </article>
        ))}

        <Link to="/rooms" className="btn btn-ghost shrink-0 self-start lg:self-center" data-magnetic>
          Compare all villas <ArrowRight size={16} />
        </Link>
      </div>

      <div className="absolute inset-x-[8vw] bottom-10 hidden h-px bg-white/15 lg:block">
        <div ref={progress} className="bg-sunset h-full origin-left scale-x-0" />
      </div>
    </section>
  )
}
