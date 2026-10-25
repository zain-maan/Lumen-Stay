// Photos live in public/images (see scripts/fetch-images.mjs) and are referenced by name.
export type ImageName =
  | 'hero'
  | 'infinity-pool'
  | 'jungle-pool'
  | 'cabanas'
  | 'night-pool'
  | 'sunset-pool'
  | 'beach-hut'
  | 'beach'
  | 'spa'
  | 'dining'
  | 'temple'
  | 'garden-villa'
  | 'ocean-suite'
  | 'cliff-pavilion'
  | 'sky-deck'

export const GALLERY: { image: ImageName; caption: string }[][] = [
  [
    { image: 'sunset-pool', caption: 'Golden hour at the main pool' },
    { image: 'spa', caption: 'Coconut oil rituals' },
  ],
  [
    { image: 'night-pool', caption: 'The pool after dark' },
    { image: 'beach-hut', caption: 'Bingin beach, ten minutes away' },
    { image: 'dining', caption: 'Dinner on the cliff terrace' },
  ],
  [
    { image: 'jungle-pool', caption: 'The quiet garden pool' },
    { image: 'temple', caption: 'Ulun Danu Beratan at dawn' },
  ],
]

export type Room = {
  id: string
  name: string
  tagline: string
  description: string
  image: ImageName
  price: number
  size: number
  guests: number
  bed: string
  view: 'Ocean' | 'Garden' | 'Cliff'
  amenities: string[]
}

export const ROOMS: Room[] = [
  {
    id: 'garden-villa',
    name: 'Garden Villa',
    tagline: 'Teak, stone and frangipani',
    description:
      'A quiet villa wrapped in tropical garden, with an outdoor rain shower, a sunken daybed and handcrafted teak furniture by Balinese artisans.',
    image: 'garden-villa',
    price: 240,
    size: 48,
    guests: 2,
    bed: 'King bed',
    view: 'Garden',
    amenities: ['Outdoor rain shower', 'Private garden terrace', 'Espresso machine', 'Yoga mat & blocks'],
  },
  {
    id: 'ocean-suite',
    name: 'Ocean Suite',
    tagline: 'Wake up to the Indian Ocean',
    description:
      'Floor-to-ceiling glass doors open onto a deck above the water. Watch surfers at dawn and the sun drop into the sea from your lounger.',
    image: 'ocean-suite',
    price: 380,
    size: 64,
    guests: 3,
    bed: 'King bed + daybed',
    view: 'Ocean',
    amenities: ['Ocean-view deck', 'Freestanding bathtub', 'Minibar on the house', 'Evening turndown'],
  },
  {
    id: 'cliff-pavilion',
    name: 'Cliff Pavilion',
    tagline: 'Seventy metres above the surf',
    description:
      'Our signature pavilion sits right on the cliff edge, with a private plunge pool, a glass-walled bathroom and a living room made for long sunsets.',
    image: 'cliff-pavilion',
    price: 560,
    size: 92,
    guests: 4,
    bed: 'King bed + twin loft',
    view: 'Cliff',
    amenities: ['Private plunge pool', 'Glass-walled bathroom', 'Butler service', 'Sunset cocktail daily'],
  },
  {
    id: 'sky-deck',
    name: 'Sky Deck',
    tagline: 'Sleep under the stars',
    description:
      'An open-air sleeping deck high on the hillside with a retractable canopy. Breakfast is served on your deck as the mist lifts off the valley.',
    image: 'sky-deck',
    price: 420,
    size: 55,
    guests: 2,
    bed: 'Canopy king bed',
    view: 'Garden',
    amenities: ['Retractable canopy', 'Stargazing telescope', 'Deck breakfast', 'Outdoor bathtub'],
  },
]

export type Experience = {
  id: string
  title: string
  text: string
  image: ImageName
  price: string
}

export const EXPERIENCES: Experience[] = [
  {
    id: 'spa',
    title: 'Balinese spa rituals',
    text: 'Two-hour treatments with warm coconut oil, volcanic stones and local herbs in our cliffside spa.',
    image: 'spa',
    price: 'From $90',
  },
  {
    id: 'dining',
    title: 'Sunset tasting menu',
    text: 'Seven courses of modern Indonesian cooking, served on the terrace as the sky turns gold.',
    image: 'dining',
    price: 'From $120',
  },
  {
    id: 'temple',
    title: 'Temples at dawn',
    text: 'A private guide takes you to Ulun Danu Beratan before the crowds, with breakfast by the lake.',
    image: 'temple',
    price: 'From $75',
  },
  {
    id: 'beach',
    title: 'Hidden beach day',
    text: 'We pack a picnic and drive you to Padang Padang and Bingin, with boards for every level.',
    image: 'beach',
    price: 'From $60',
  },
]

export type AddOn = { id: string; name: string; text: string; price: number; per: 'stay' | 'night' | 'guest' }

export const ADD_ONS: AddOn[] = [
  { id: 'transfer', name: 'Airport transfer', text: 'Private car from Ngurah Rai, 35 minutes', price: 45, per: 'stay' },
  { id: 'breakfast', name: 'Floating breakfast', text: 'Served in your pool or on your deck', price: 35, per: 'night' },
  { id: 'spa', name: 'Couples spa ritual', text: 'Two hours, booked for your first evening', price: 180, per: 'stay' },
  { id: 'dinner', name: 'Sunset tasting menu', text: 'Seven courses on the cliff terrace', price: 120, per: 'guest' },
]

export const MOODS = [
  {
    id: 'honeymoon',
    label: 'Honeymoon',
    line: 'Privacy, sunsets and a pool of your own.',
    room: 'cliff-pavilion',
    experiences: ['spa', 'dining'],
  },
  {
    id: 'wellness',
    label: 'Wellness reset',
    line: 'Slow mornings, yoga and long spa afternoons.',
    room: 'garden-villa',
    experiences: ['spa', 'temple'],
  },
  {
    id: 'family',
    label: 'Family escape',
    line: 'Space for everyone and beaches close by.',
    room: 'cliff-pavilion',
    experiences: ['beach', 'temple'],
  },
  {
    id: 'adventure',
    label: 'Surf & explore',
    line: 'Early waves, hidden beaches and open skies.',
    room: 'sky-deck',
    experiences: ['beach', 'temple'],
  },
  {
    id: 'workation',
    label: 'Workation',
    line: 'Fast Wi-Fi, a desk with a view and sea air.',
    room: 'ocean-suite',
    experiences: ['dining', 'beach'],
  },
] as const

export const TESTIMONIALS = [
  {
    quote: 'We booked three nights and stayed seven. The Cliff Pavilion at sunset is something we will never forget.',
    name: 'Amelia & James',
    from: 'London',
  },
  {
    quote: 'The team remembered how I take my coffee by day two. Calm, beautiful and genuinely kind.',
    name: 'Sara Al Mansoori',
    from: 'Dubai',
  },
  {
    quote: 'Booking took two minutes, the airport pickup was waiting, and the floating breakfast is worth the trip.',
    name: 'Daniel Okafor',
    from: 'Toronto',
  },
]

export const LOCATION = {
  resort: { lat: -8.8125, lng: 115.0956, name: 'Lumen Stay, Uluwatu' },
  places: [
    { lat: -8.8291, lng: 115.0849, name: 'Uluwatu Temple', note: '6 min drive' },
    { lat: -8.8106, lng: 115.1028, name: 'Padang Padang Beach', note: '8 min drive' },
    { lat: -8.8048, lng: 115.1134, name: 'Bingin Beach', note: '10 min drive' },
    { lat: -8.7482, lng: 115.1672, name: 'Ngurah Rai Airport', note: '35 min drive' },
  ],
}
