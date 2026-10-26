import { GALLERY } from '../data'
import Img from './Img'

// Three columns of photos that drift at different speeds as you scroll (desktop),
// a simple two-column grid on phones.
export default function Gallery() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center" data-reveal>Moments at Lumen</p>
          <h2 data-split className="mt-4 font-display text-5xl leading-[1.05] sm:text-6xl">
            Slow days, <em className="text-sunset">golden</em> evenings.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {GALLERY.map((column, c) => (
            <div
              key={c}
              data-speed={c === 1 ? '-0.08' : '0.08'}
              className={`flex flex-col gap-4 sm:gap-6 ${c === 1 ? 'lg:pt-0' : 'lg:pt-24'} ${c === 2 ? 'hidden lg:flex' : ''}`}
            >
              {column.map((p, i) => (
                <figure key={p.image} className="group relative overflow-hidden rounded-2xl" data-reveal-img={i * 0.1} data-cursor="View" data-skew>
                  <Img
                    name={p.image}
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    className={`w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110 ${
                      (c + i) % 2 ? 'aspect-[4/5]' : 'aspect-[3/4]'
                    }`}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-4 text-sm text-white transition-transform duration-500 group-hover:translate-y-0">
                    {p.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
