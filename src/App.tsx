import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Concierge from './components/Concierge'
import Cursor from './components/Cursor'
import Curtain from './components/Curtain'
import Footer from './components/Footer'
import Nav from './components/Nav'
import ScrollProgress from './components/ScrollProgress'
import { ScrollTrigger, scrollToTop, startSmoothScroll } from './lib/motion'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// Inner pages load on demand so the home page arrives faster.
const Book = lazy(() => import('./pages/Book'))
const Experiences = lazy(() => import('./pages/Experiences'))
const RoomDetail = lazy(() => import('./pages/RoomDetail'))
const Rooms = lazy(() => import('./pages/Rooms'))

export default function App() {
  const { pathname } = useLocation()

  useEffect(() => startSmoothScroll(), [])

  useLayoutEffect(() => {
    scrollToTop()
    // Let the new page render before ScrollTrigger measures it.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 btn btn-dark">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetail />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/book" element={<Book />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Concierge />
      <ScrollProgress />
      <Curtain />
      <Cursor />
    </>
  )
}
