// Downloads the site's photos once from Unsplash as resized WebP files into public/images,
// plus a tiny blurred preview of each (src/lqip.json) shown while the real photo loads.
// Usage: node scripts/fetch-images.mjs
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'

const PHOTOS = {
  hero: '1540541338287-41700207dee6',
  'infinity-pool': '1584132967334-10e028bd69f7',
  'jungle-pool': '1520250497591-112f2f40a3f4',
  cabanas: '1571003123894-1f0594d2b5d9',
  'night-pool': '1571896349842-33c89424de2d',
  'sunset-pool': '1600011689032-8b628b8a8747',
  'beach-hut': '1499793983690-e29da59ef1c2',
  beach: '1507525428034-b723cf961d3e',
  spa: '1544161515-4ab6ce6db874',
  dining: '1414235077428-338989a2e8c0',
  temple: '1537996194471-e657df975ab4',
  'garden-villa': '1611892440504-42a792e24d32',
  'ocean-suite': '1602002418082-a4443e081dd1',
  'cliff-pavilion': '1578683010236-d716f9a3f461',
  'sky-deck': '1596394516093-501ba68a0ba6',
}
const WIDTHS = [640, 1280]
const HERO_WIDTHS = [960, 1920]

const outDir = new URL('../public/images/', import.meta.url)
mkdirSync(outDir, { recursive: true })

async function get(url, tries = 6) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(240_000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return Buffer.from(await res.arrayBuffer())
    } catch (err) {
      console.log(`  retry ${i}/${tries} ${url.slice(34, 70)}: ${err.message}`)
      await new Promise((r) => setTimeout(r, 3000 * i))
    }
  }
  throw new Error(`failed: ${url}`)
}

const lqip = {}
for (const [name, id] of Object.entries(PHOTOS)) {
  const base = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&fm=webp`
  for (const w of name === 'hero' ? HERO_WIDTHS : WIDTHS) {
    const file = new URL(`${name}-${w}.webp`, outDir)
    if (existsSync(file)) continue
    writeFileSync(file, await get(`${base}&w=${w}&q=${w > 1000 ? 68 : 72}`))
    console.log(`saved ${name}-${w}.webp`)
  }
  const tiny = await get(`${base}&w=24&q=40&blur=40`)
  lqip[name] = `data:image/webp;base64,${tiny.toString('base64')}`
}
writeFileSync(new URL('../src/lqip.json', import.meta.url), JSON.stringify(lqip, null, 2) + '\n')
console.log('DONE')
