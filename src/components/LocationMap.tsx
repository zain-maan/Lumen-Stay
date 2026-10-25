import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { LOCATION } from '../data'

const pin = (main: boolean) => {
  const size = main ? 22 : 14
  const color = main ? '#b8643c' : '#1f4e5a'
  return L.divIcon({
    className: '',
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:999px;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export default function LocationMap() {
  const { resort, places } = LOCATION
  return (
    <MapContainer
      center={[resort.lat + 0.02, resort.lng + 0.035]}
      zoom={12}
      scrollWheelZoom={false}
      className="h-full min-h-96 w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="map-tiles"
      />
      <Marker position={[resort.lat, resort.lng]} icon={pin(true)}>
        <Popup>
          <strong>{resort.name}</strong>
        </Popup>
      </Marker>
      {places.map((p) => (
        <Marker key={p.name} position={[p.lat, p.lng]} icon={pin(false)}>
          <Popup>
            <strong>{p.name}</strong>
            <br />
            {p.note}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
