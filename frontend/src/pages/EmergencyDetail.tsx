import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MapPin, Clock, Users, Phone, Zap, CheckCircle, XCircle, Navigation } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import axios from '../api/axios'
import { emergencyApi } from '../api/emergency'
import { useAppSelector } from '../store'
import { UrgencyBadge, StatusBadge } from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { CardSkeleton } from '../components/ui/Skeleton'
import { categoryMeta } from '../utils/emergency'

export default function EmergencyDetail() {
  const { id }    = useParams<{ id: string }>()
  const navigate  = useNavigate()
  const qc        = useQueryClient()
  const user      = useAppSelector(s => s.auth.user)
  const isHelper  = user?.roles.includes('ROLE_HELPER') || user?.roles.includes('ROLE_ADMIN')

  const { data: e, isLoading } = useQuery({
    queryKey: ['emergency', id],
    queryFn: () => emergencyApi.getById(Number(id)).then(r => r.data.data),
    enabled: !!id,
  })

  const accept  = useMutation({ mutationFn: () => axios.post(`/helpers/emergencies/${id}/accept`),  onSuccess: () => { toast.success('You are now helping!'); qc.invalidateQueries({ queryKey: ['emergency', id] }) } })
  const arrive  = useMutation({ mutationFn: () => axios.post(`/helpers/emergencies/${id}/arrived`), onSuccess: () => { toast.success('Arrival confirmed!'); qc.invalidateQueries({ queryKey: ['emergency', id] }) } })
  const resolve = useMutation({ mutationFn: () => emergencyApi.updateStatus(Number(id), 'RESOLVED'), onSuccess: () => { toast.success('Marked as resolved'); qc.invalidateQueries({ queryKey: ['emergency', id] }) } })
  const cancel  = useMutation({ mutationFn: () => emergencyApi.updateStatus(Number(id), 'CANCELLED'), onSuccess: () => { toast.success('Cancelled'); navigate('/emergencies') } })

  if (isLoading) return <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>
  if (!e)        return <div className="text-center py-20 text-[var(--text-muted)]">Emergency not found</div>

  const meta     = categoryMeta[e.category]
  const isOwner  = user?.userId === e.requesterId
  const isActive = e.status === 'PENDING' || e.status === 'ACTIVE'

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header card */}
      <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background: meta.bg }}>
            {meta.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-[var(--text)]">{e.title}</h1>
              <StatusBadge status={e.status} />
            </div>
            <p className="text-[var(--text-muted)] mt-1 leading-relaxed">{e.description}</p>
          </div>
        </div>

        {/* AI Score */}
        {e.aiSeverityScore != null && (
          <div className="mt-4 p-3 rounded-xl bg-[var(--bg-subtle)]">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
                <Zap size={14} className="text-yellow-500" /> AI Severity Score
              </span>
              <span className="font-bold" style={{ color: e.aiSeverityScore > 70 ? '#ef4444' : e.aiSeverityScore > 40 ? '#f59e0b' : '#22c55e' }}>
                {Math.round(e.aiSeverityScore)} / 100
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: e.aiSeverityScore > 70 ? '#ef4444' : e.aiSeverityScore > 40 ? '#f59e0b' : '#22c55e' }}
                initial={{ width: 0 }} animate={{ width: `${e.aiSeverityScore}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Details grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <motion.div className="card p-5 space-y-3" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="font-semibold text-[var(--text)] text-sm uppercase tracking-wide">Details</h3>
          <InfoRow icon={<MapPin size={15} />}    label="Location"   value={e.address ?? `${e.latitude?.toFixed(4)}, ${e.longitude?.toFixed(4)}`} />
          <InfoRow icon={<Clock size={15} />}     label="Posted"     value={formatDistanceToNow(new Date(e.createdAt), { addSuffix: true })} />
          <InfoRow icon={<Users size={15} />}     label="Helpers"    value={`${e.activeHelpers} / ${e.requiredHelpers} responding`} />
          {e.contactNumber && <InfoRow icon={<Phone size={15} />} label="Contact" value={e.contactNumber} />}
          <div className="pt-1 flex flex-wrap gap-2">
            <UrgencyBadge level={e.urgencyLevel} />
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {meta.icon} {meta.label}
            </span>
          </div>
        </motion.div>

        <motion.div className="card p-5 space-y-3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <h3 className="font-semibold text-[var(--text)] text-sm uppercase tracking-wide">Requester</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {e.requesterName?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-[var(--text)]">{e.requesterName}</p>
              <p className="text-xs text-[var(--text-muted)]">Emergency requester</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action buttons */}
      <motion.div className="card p-5 flex flex-wrap gap-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {isHelper && isActive && (
          <>
            <Button icon={<CheckCircle size={16} />} onClick={() => accept.mutate()} loading={accept.isPending}>Accept & Help</Button>
            <Button icon={<Navigation size={16} />} variant="secondary" onClick={() => arrive.mutate()} loading={arrive.isPending}>Mark Arrived</Button>
          </>
        )}
        {(isOwner || user?.roles.includes('ROLE_ADMIN')) && isActive && (
          <>
            <Button icon={<CheckCircle size={16} />} variant="outline" onClick={() => resolve.mutate()} loading={resolve.isPending}>Resolve</Button>
            <Button icon={<XCircle size={16} />} variant="danger" onClick={() => cancel.mutate()} loading={cancel.isPending}>Cancel</Button>
          </>
        )}
        {!isActive && (
          <p className="text-sm text-[var(--text-muted)]">This emergency is {e.status.toLowerCase()}.</p>
        )}
      </motion.div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="text-[var(--text-muted)] mt-0.5 shrink-0">{icon}</span>
      <div>
        <span className="text-[var(--text-muted)] text-xs block">{label}</span>
        <span className="text-[var(--text)] font-medium">{value}</span>
      </div>
    </div>
  )
}
