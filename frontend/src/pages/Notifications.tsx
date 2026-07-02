import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, CheckCheck, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'
import { notificationApi } from '../api/notifications'
import Button from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import type { NotificationType } from '../types'
import clsx from 'clsx'

const typeIcon: Record<NotificationType, string> = {
  EMERGENCY_NEARBY: '🚨', HELPER_ACCEPTED: '✅', HELPER_ARRIVED: '📍',
  REQUEST_RESOLVED: '🎉', REQUEST_CANCELLED: '❌', RATING_RECEIVED: '⭐',
  SYSTEM_ALERT: '⚠️', ACCOUNT_VERIFIED: '🛡️',
}

export default function Notifications() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getAll().then(r => r.data.data),
  })

  const markAll = useMutation({
    mutationFn: notificationApi.markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const markOne = useMutation({
    mutationFn: (id: number) => notificationApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const notifications = data?.content ?? []
  const unread = notifications.filter(n => !n.isRead).length

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'Poppins' }}>Notifications</h1>
          {unread > 0 && <p className="text-sm text-[var(--text-muted)]">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" icon={<CheckCheck size={14} />} onClick={() => markAll.mutate()} loading={markAll.isPending}>
            Mark all read
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-4 flex gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="card p-12 flex flex-col items-center gap-3 text-center">
          <BellOff size={40} className="text-[var(--text-light)]" />
          <p className="font-medium text-[var(--text-muted)]">All caught up!</p>
          <p className="text-sm text-[var(--text-light)]">No notifications yet.</p>
        </div>
      )}

      <AnimatePresence>
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => !n.isRead && markOne.mutate(n.id)}
              className={clsx(
                'card p-4 flex gap-3 cursor-pointer transition-all',
                !n.isRead && 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center text-xl shrink-0">
                {typeIcon[n.type] ?? '🔔'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={clsx('text-sm font-medium text-[var(--text)]', !n.isRead && 'font-semibold')}>{n.title}</p>
                  {!n.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{n.message}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-[var(--text-light)]">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </span>
                  {n.emergencyId && (
                    <Link
                      to={`/emergencies/${n.emergencyId}`}
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      View <ExternalLink size={11} />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}
