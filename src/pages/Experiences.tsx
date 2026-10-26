import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Clock } from '../components/icons'
import Img from '../components/Img'
import PageHero from '../components/PageHero'
import { EXPERIENCES } from '../data'
import { useReveal } from '../hooks/useReveal'

const DETAILS: Record<string, { duration: string; when: string }> = {
  spa: { duration: '2 hours', when: 'Daily, 9 am to 9 pm' },
  dining: { duration: '3 hours', when: 'Nightly from 6 pm' },
  temple: { duration: '7 hours', when: 'Leaves at 5 am' },
  beach: { duration: 'Full day', when: 'Daily, on request' },
}

const INCLUDED = [
  { title: 'Sunrise yoga', text: 'On the cliff deck every morning at 6:30.', image: 'infinity-pool' as const },
  { title: 'Jungle pool', text: 'A second, quieter pool in the garden.', image: 'jungle-pool' as const },
  { title: 'Sunset cabanas', text: 'Reserved for guests from 5 pm, with a drink on us.', image: 'cabanas' as const },
]

export default function Experiences() {
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)

  return (
    <div ref={root} className="pb-24">
      <PageHero
        image="temple"
        eyebrow="Experiences"
        title={<>The island, the way <em className="text-sunset">locals show it.</em></>}
        text="Every experience is run by our own team or by families we have known for years. Book any of them with your stay or ask the concierge."
        crumbs={[{ to: '/experiences', label: 'Experiences' }]}
      />

      <div className="mx-auto mt-24 max-w-7xl space-y-24 px-4 sm:px-6 lg:space-y-32">
        {EXPERIENCES.map((e, i) => (
          <article key={e.id} data-card className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <div className={`overflow-hidden rounded-2xl ${i % 2 ? 'lg:order-2' : ''}`} data-reveal-img>
              <Img name={e.image} alt="" className="aspect-[4/3] w-full object-cover" />
            </div>
            <div data-reveal="0.1">
              <p className="eyebrow">0{i + 1}</p>
              <h2 data-split className="mt-3 font-display text-4xl sm:text-6xl">{e.title}</h2>
              <p className="mt-4 max-w-md text-lg text-stone">{e.text}</p>
              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-clay" />
                  <dt className="sr-only">Duration</dt>
                  <dd>{DETAILS[e.id].duration}</dd>
                </div>
                <div>
                  <dt className="sr-only">When</dt>
                  <dd className="text-stone">{DETAILS[e.id].when}</dd>
                </div>
                <div>
                  <dt className="sr-only">Price</dt>
                  <dd className="font-medium text-clay">{e.price}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>

      <section className="mx-auto mt-32 max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-4xl" data-reveal>Included with every stay</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {INCLUDED.map((x, i) => (
            <div key={x.title} data-reveal={i * 0.08} data-card={i * 0.08}>
              <Img name={x.image} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
              <p className="mt-4 font-display text-2xl">{x.title}</p>
              <p className="text-sm text-stone">{x.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center" data-reveal>
          <Link to="/book" className="btn btn-dark">Book your stay</Link>
        </div>
      </section>
    </div>
  )
}
