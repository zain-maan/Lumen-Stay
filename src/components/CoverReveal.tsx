import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { ArrowRight } from './icons'
import Img from './Img'

// A framed photo that opens up to fill the screen as you scroll, while the headline rises.
export default function CoverReveal() {
  const section = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const mobile = window.matchMedia('(max-width: 767px)').matches
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section.current, start: 'top top', end: mobile ? '+=80%' : '+=130%', pin: true, scrub: 0.6 },
      })
      tl.fromTo('[data-cover-frame]', { clipPath: mobile ? 'inset(14% 8% 14% 8% round 28px)' : 'inset(16% 26% 16% 26% round 36px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)' }, 0)
        .fromTo('[data-cover-img]', { scale: 1.35 }, { scale: 1 }, 0)
        .fromTo('[data-cover-shade]', { opacity: 0 }, { opacity: 1 }, 0.35)
        .from('[data-cover-word]', { yPercent: 120, opacity: 0, stagger: 0.06, duration: 0.35 }, 0.45)
        .from('[data-cover-cta]', { y: 30, opacity: 0, duration: 0.25 }, 0.75)
    }, section)
    return () => ctx.revert()
  }, [])

  const words = ['Seventy', 'metres', 'above', 'the', 'Indian', 'Ocean.']
  return (
    <section ref={section} className="relative h-[100svh] overflow-hidden bg-sand">
      <div data-cover-frame className="absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(0 0 0 0)' }}>
        <div data-cover-img className="absolute inset-0">
          <Img name="sunset-pool" sizes="100vw" alt="The infinity pool at sunset" className="h-full w-full object-cover" />
        </div>
        <div data-cover-shade className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/30 to-deep/20" />
      </div>
      <div className="relative flex h-full flex-col items-center justify-end px-4 pb-16 text-center text-white sm:pb-24">
        <h2 className="max-w-4xl font-display text-[clamp(2.8rem,8vw,7rem)] leading-[0.95]">
          {words.map((w, i) => (
            <span key={w + i} className="inline-block overflow-hidden pb-2 align-bottom">
              <span data-cover-word className={`mr-[0.25em] inline-block ${i >= 4 ? 'text-sunset italic' : ''}`}>
                {w}
              </span>
            </span>
          ))}
        </h2>
        <div data-cover-cta>
          <Link to="/rooms/cliff-pavilion" className="btn btn-light mt-8">
            See the Cliff Pavilion <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
