import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Users, Zap } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Emergency } from '../../types'
import { UrgencyBadge, StatusBadge } from '../ui/Badge'
import { categoryMeta } from '../../utils/emergency'

interface Props { emergency: Emergency; index?: number }

export default function EmergencyCard({ emergency, index = 0 }: Props) {
  const meta = categoryMeta[emergency.category]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/emergencies/${emergency.id}`} className="block">
        <div className="card card-hover p-5 cursor-pointer group">
          {/* Top row */}
          <div className="flex items-start gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: meta.bg }}
            >
              {meta.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <h3 className="font-semibold text-[var(--text)] group-hover:text-blue-600 transition-colors truncate">
                  {emergency.title}
                </h3>
                <StatusBadge status={emergency.status} />
              </div>
              <p className="text-sm text-[var(--text-muted)] truncate-2 mt-0.5">{emergency.description}</p>
            </div>
          </div>

          {/* AI score bar */}
          {emergency.aiSeverityScore != null && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
                <span className="flex items-center gap-1"><Zap size={11} /> AI Severity</span>
                <span>{Math.round(emergency.aiSeverityScore)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: emergency.aiSeverityScore > 70 ? '#ef4444' : emergency.aiSeverityScore > 40 ? '#f59e0b' : '#22c55e' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${emergency.aiSeverityScore}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.05 + 0.2 }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-3 flex items-center gap-4 flex-wrap">
            <UrgencyBadge level={emergency.urgencyLevel} />
            {emergency.address && (
              <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <MapPin size={12} /> {emergency.address}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Users size={12} /> {emergency.activeHelpers}/{emergency.requiredHelpers} helpers
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--text-light)] ml-auto">
              <Clock size={12} /> {formatDistanceToNow(new Date(emergency.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
