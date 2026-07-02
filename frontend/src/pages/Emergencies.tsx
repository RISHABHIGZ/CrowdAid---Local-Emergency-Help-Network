import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Filter } from 'lucide-react'
import { emergencyApi } from '../api/emergency'
import type { EmergencyStatus, EmergencyCategory } from '../types'
import EmergencyCard from '../components/emergency/EmergencyCard'
import { CardSkeleton } from '../components/ui/Skeleton'
import Button from '../components/ui/Button'
import { categoryMeta } from '../utils/emergency'

const statuses: EmergencyStatus[] = ['PENDING','ACTIVE','RESOLVED','CANCELLED']
const cats = Object.keys(categoryMeta) as EmergencyCategory[]

export default function Emergencies() {
  const [page, setPage]   = useState(0)
  const [status, setStatus] = useState<EmergencyStatus | ''>('')
  const [, setCategory]   = useState<EmergencyCategory | ''>('')

  const { data, isLoading } = useQuery({
    queryKey: ['emergencies', page, status],
    queryFn: () => status
      ? emergencyApi.getByStatus(status, page).then(r => r.data.data)
      : emergencyApi.getAll(page).then(r => r.data.data),
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'Poppins' }}>Emergencies</h1>
          <p className="text-sm text-[var(--text-muted)]">{data?.totalElements ?? '...'} total requests</p>
        </div>
        <Link to="/emergencies/new">
          <Button icon={<Plus size={16} />}>New Request</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <Filter size={16} className="text-[var(--text-muted)]" />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setStatus(''); setPage(0) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              status === '' ? 'bg-blue-600 text-white' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:bg-[var(--border)]'
            }`}
          >All</button>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(0) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                status === s ? 'bg-blue-600 text-white' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:bg-[var(--border)]'
              }`}
            >{s}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 border-l border-[var(--border)] pl-3">
          {cats.slice(0,4).map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:bg-[var(--border)] transition-all"
            >
              {categoryMeta[c].icon} {categoryMeta[c].label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div
          className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4"
          initial="hidden" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
        >
          {data?.content.map((e, i) => <EmergencyCard key={e.id} emergency={e} index={i} />)}
        </motion.div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={data.first} onClick={() => setPage(p => p - 1)}>← Prev</Button>
          <span className="text-sm text-[var(--text-muted)]">Page {data.number + 1} of {data.totalPages}</span>
          <Button variant="outline" size="sm" disabled={data.last} onClick={() => setPage(p => p + 1)}>Next →</Button>
        </div>
      )}
    </div>
  )
}
