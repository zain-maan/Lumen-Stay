import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-lagoon grain relative text-sand/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl text-sand">
            Lumen<span className="text-glow">.</span>Stay
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Fourteen villas on the limestone cliffs of Uluwatu, Bali. Built from local stone and teak, run by a team
            from the villages around us.
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow !text-glow">Visit</p>
          <p className="mt-4 leading-relaxed">
            Jl. Pantai Suluban 88
            <br />
            Pecatu, Uluwatu
            <br />
            Bali 80361, Indonesia
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow !text-glow">Explore</p>
          <ul className="mt-4 space-y-2">
            <li><Link className="hover:text-white" to="/rooms">Villas & suites</Link></li>
            <li><Link className="hover:text-white" to="/experiences">Experiences</Link></li>
            <li><Link className="hover:text-white" to="/book">Book direct</Link></li>
            <li><a className="hover:text-white" href="mailto:stay@lumenstay.example">stay@lumenstay.example</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-sand/50 sm:px-6">
          © {new Date().getFullYear()} Lumen Stay. A concept project: the resort, prices and bookings are fictional.
        </p>
      </div>
    </footer>
  )
}
