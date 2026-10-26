import { useEffect, type RefObject } from 'react'
import { prefersReducedMotion } from '../lib/motion'

// Swipe carousel depth: the centred card faces you, its neighbours turn away and shrink.
// Only runs while the container actually scrolls sideways (phones).
export function useCoverflow(track: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = track.current
    if (!el || prefersReducedMotion()) return
    let raf = 0
    const update = () => {
      raf = 0
      const items = Array.from(el.children) as HTMLElement[]
      if (el.scrollWidth <= el.clientWidth + 1) {
        items.forEach((c) => (c.style.transform = c.style.opacity = ''))
        return
      }
      const mid = el.scrollLeft + el.clientWidth / 2
      for (const c of items) {
        const d = Math.max(-1.5, Math.min(1.5, (c.offsetLeft + c.offsetWidth / 2 - mid) / c.offsetWidth))
        c.style.transform = `perspective(900px) rotateY(${d * -22}deg) scale(${1 - Math.abs(d) * 0.12})`
        c.style.opacity = String(1 - Math.min(1, Math.abs(d)) * 0.35)
      }
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    el.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [track])
}
