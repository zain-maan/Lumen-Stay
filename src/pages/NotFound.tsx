import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'

export default function NotFound() {
  return (
    <PageHero
      image="beach"
      eyebrow="404"
      title={<>This path leads <em className="text-sunset">to the sea.</em></>}
      text="The page you were looking for does not exist, but the view from here is still lovely."
    >
      <Link to="/" className="btn btn-light">
        Back to the resort
      </Link>
    </PageHero>
  )
}
