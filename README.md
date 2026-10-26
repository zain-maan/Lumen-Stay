# Lumen Stay: boutique resort website with direct booking

A multi-page website for a fictional 14-villa cliffside resort in Uluwatu, Bali, built to turn visitors into **direct bookings** instead of sending them to Booking.com.

**Live demo:** _add your Vercel link here_

![Lumen Stay home page](docs/screenshot-home.png)

## The problem

Small hotels lose 15 to 25% of every booking to OTAs because their own websites look dated and make booking hard. Lumen Stay shows what a boutique hotel site should be: it feels as premium as the property, and a guest can go from the homepage to a confirmed booking in under two minutes.

## Features

- **Instant availability search** in the hero: dates and guests go straight into the booking flow.
- **Scroll-driven villa tour**: the section pins and villas glide past horizontally (GSAP ScrollTrigger), with a vertical fallback on mobile.
- **Trip planner**: pick Honeymoon, Wellness, Family, Surf or Workation and the site recommends a villa and experiences.
- **Live availability calendar** on every villa page, with booked nights blocked and a running price total.
- **4-step booking flow**: dates → villa → extras → guest details, with a live price summary, taxes, validation and a confirmation screen. All choices live in the URL, so a half-finished booking survives a refresh or can be shared.
- **AI concierge chat** that answers questions on villas, transfers, dining, prices and policies (demo intents; designed to plug into an LLM).
- **Interactive map** (Leaflet) with the resort and nearby beaches, temple and airport.
- **3D ocean hero**: the hero photo becomes a WebGL water surface (Three.js shader) with a sea swell, ripples that follow the pointer and raindrops on phones. It loads after the page, pauses when off screen and falls back to the plain photo.
- **Cover reveal**: a pinned section where a framed photo of the cliff pool opens to fill the screen as you scroll.
- **Motion design**: branded intro with a loading counter, curtain page transitions, headings that rise line by line (GSAP SplitText), curtain-wipe photo reveals, parallax gallery columns, counting stats, an endless marquee, cards that lean with scroll speed, magnetic buttons and a custom cursor.
- **Fast photos**: every photo is a locally hosted AVIF with a WebP fallback in up to three sizes with `srcset`, and a tiny blurred preview shows instantly while it loads. The hero is preloaded, the intro waits for it, and inner pages and three.js are code-split. `node scripts/fetch-images.mjs` downloads the photos and `python scripts/optimize-images.py` (Pillow) re-encodes them.
- Filters and sorting on the villas page, smooth scrolling (Lenis), reduced-motion support, keyboard and screen-reader friendly, fully responsive.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · GSAP (ScrollTrigger, SplitText) · Three.js · Lenis · React Router · Leaflet · Vercel

## Run locally

```bash
npm install
npm run dev
```

Build for production with `npm run build`. The `vercel.json` rewrite makes client-side routes work on Vercel.

## Notes

The resort, prices, reviews and availability are fictional. Availability is generated deterministically per villa so the calendar looks realistic without a backend. Photos are from Unsplash.
