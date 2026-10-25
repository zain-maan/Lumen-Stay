import { Menu, X } from './icons'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { setScrollLocked } from '../lib/motion'

const LINKS = [
  { to: '/rooms', label: 'Villas' },
  { to: '/experiences', label: 'Experiences' },
  { to: '/#location', label: 'Location' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  // Every page opens on a dark photo hero, so the bar stays transparent until you scroll.
  const overHero = !scrolled && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    setScrollLocked(open)
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        overHero ? 'text-white' : 'bg-sand/90 text-ink shadow-[0_1px_0_#e4dacb] backdrop-blur'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20">
        <Link to="/" className="font-display text-2xl font-semibold tracking-wide" aria-label="Lumen Stay home">
          Lumen<span className="text-glow">.</span>Stay
        </Link>

        <div className="hidden items-center gap-9 text-sm md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-current after:transition-transform ${
                  isActive && !l.to.includes('#') ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/book" className={`btn ${overHero ? 'btn-light' : 'btn-dark'} !py-2.5`}>
            Book your stay
          </Link>
        </div>

        <button
          className="-mr-2 p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-4rem)] bg-sand px-4 pt-8 md:hidden">
          <ul className="space-y-6">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} onClick={() => setOpen(false)} className="font-display text-4xl">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/book" className="btn btn-dark mt-10 w-full">
            Book your stay
          </Link>
        </div>
      )}
    </header>
  )
}
