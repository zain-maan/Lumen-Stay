import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { ImageName } from '../data'
import { gsap, introDelay, prefersReducedMotion, SplitText } from '../lib/motion'
import Img from './Img'

type Props = {
  image: ImageName
  eyebrow: string
  title: ReactNode
  text?: ReactNode
  crumbs?: { to: string; label: string }[]
  size?: 'tall' | 'short'
  children?: ReactNode
}

// Photo-led header for inner pages: the image settles from a zoom and drifts on scroll,
// the title rises line by line once the page-transition curtain has lifted.
export default function PageHero({ image, eyebrow, title, text, crumbs = [], size = 'tall', children }: Props) {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const delay = introDelay(0.45)
      gsap.fromTo('[data-ph-img]', { scale: 1.3 }, { scale: 1.08, duration: 2.2, ease: 'expo.out', delay: delay - 0.3 })
      SplitText.create('[data-ph-title]', {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: 1.3, ease: 'power4.out', stagger: 0.1, delay }),
      })
      gsap.from('[data-ph-fade]', { opacity: 0, y: 24, duration: 1, ease: 'power3.out', stagger: 0.1, delay: delay + 0.35 })
      gsap.to('[data-ph-media]', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [image])

  return (
    <section
      ref={root}
      className={`relative flex flex-col overflow-hidden bg-deep text-white ${size === 'tall' ? 'min-h-[78svh]' : 'min-h-[52svh]'}`}
    >
      <div data-ph-media className="absolute inset-0">
        <Img name={image} priority sizes="100vw" data-ph-img className="h-full w-full scale-[1.08] object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-deep/70 via-deep/25 to-deep/90" />
      <div aria-hidden="true" className="animate-sun pointer-events-none absolute -right-[15%] -top-[20%] h-[50vmax] w-[50vmax] rounded-full bg-[radial-gradient(circle,rgba(246,178,94,0.35),transparent_65%)] mix-blend-screen" />
      <div className="grain absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-12 pt-32 sm:px-6 lg:pb-16">
        {crumbs.length > 0 && (
          <nav data-ph-fade aria-label="Breadcrumb" className="mb-6 text-xs text-white/70">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="hover:text-white">Home</Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.to} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <Link to={c.to} className="hover:text-white">{c.label}</Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p data-ph-fade className="eyebrow !text-glow">{eyebrow}</p>
        <h1 data-ph-title className="mt-4 max-w-4xl font-display text-[clamp(2.9rem,7vw,6.5rem)] leading-[0.98]">
          {title}
        </h1>
        {text && (
          <p data-ph-fade className="mt-6 max-w-xl text-base text-white/80 sm:text-lg">
            {text}
          </p>
        )}
        {children && <div data-ph-fade className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
