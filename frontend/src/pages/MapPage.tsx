import { useQuery } from '@tanstack/react-query'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { renderToString } from 'react-dom/server'
import { emergencyApi } from '../api/emergency'
import { StatusBadge, UrgencyBadge } from '../components/ui/Badge'
import { formatDistanceToNow } from 'date-fns'
import { categoryMeta, urgencyColor } from '../utils/emergency'
import { Link } from 'react-router-dom'

function EmojiIcon(emoji: string, color: string) {
  return divIcon({
    html: renderToString(
      <div style={{
        background: color, width: 36, height: 36, borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        border: '2px solid white'
      }}>
        <span style={{ transform: 'rotate(45deg)', fontSize: 16 }}>{emoji}</span>
      </div>
    ),
    iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
    className: '',
  })
}

export default function MapPage() {
  const { data } = useQuery({
    queryKey: ['emergencies', 'map'],
    queryFn: () => emergencyApi.getAll(0, 50).then(r => r.data.data),
    refetchInterval: 15_000,
  })

  const emergencies = data?.content ?? []
  const active = emergencies.filter(e => e.status === 'ACTIVE' || e.status === 'PENDING')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'Poppins' }}>Live Map</h1>
          <p className="text-sm text-[var(--text-muted)]">{active.length} active emergencies</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Auto-refreshes every 15s
        </div>
      </div>

      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {emergencies.map(e => {
            if (!e.latitude || !e.longitude) return null
            const meta  = categoryMeta[e.category]
            const color = urgencyColor[e.urgencyLevel] ?? '#3b82f6'

            return (
              <Marker
                key={e.id}
                position={[e.latitude, e.longitude]}
                icon={EmojiIcon(meta.icon, color)}
              >
                <Popup maxWidth={280}>
                  <div className="p-1 space-y-2 min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{meta.icon}</span>
                      <div>
                        <p className="font-semibold text-sm">{e.title}</p>
                        <p className="text-xs text-gray-500">{meta.label}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{e.description}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      <StatusBadge status={e.status} />
                      <UrgencyBadge level={e.urgencyLevel} />
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-between">
                      <span>{formatDistanceToNow(new Date(e.createdAt), { addSuffix: true })}</span>
                      <span>{e.activeHelpers}/{e.requiredHelpers} helpers</span>
                    </div>
                    <Link
                      to={`/emergencies/${e.id}`}
                      className="block text-center text-xs bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            )
          })}

          {/* Heatmap-style circles for density */}
          {active.map(e => (
            e.latitude && e.longitude && (
              <CircleMarker
                key={`hm-${e.id}`}
                center={[e.latitude, e.longitude]}
                radius={30}
                pathOptions={{ color: urgencyColor[e.urgencyLevel], fillColor: urgencyColor[e.urgencyLevel], fillOpacity: 0.08, weight: 0 }}
              />
            )
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
