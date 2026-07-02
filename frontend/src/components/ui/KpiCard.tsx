import { motion } from 'framer-motion'
import clsx from 'clsx'

interface Props {
  title: string
  value: string | number
  icon: React.ReactNode
  change?: string
  positive?: boolean
  color?: 'blue' | 'cyan' | 'red' | 'green'
}

const colorMap = {
  blue:  { bg: 'bg-blue-50 dark:bg-blue-900/20',  icon: 'bg-blue-600',  text: 'text-blue-600' },
  cyan:  { bg: 'bg-cyan-50 dark:bg-cyan-900/20',   icon: 'bg-cyan-500',  text: 'text-cyan-600' },
  red:   { bg: 'bg-red-50 dark:bg-red-900/20',     icon: 'bg-red-500',   text: 'text-red-600'  },
  green: { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'bg-green-500', text: 'text-green-600'},
}

export default function KpiCard({ title, value, icon, change, positive, color = 'blue' }: Props) {
  const c = colorMap[color]
  return (
    <motion.div
      className="card card-hover p-5 flex items-center gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0', c.icon)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-[var(--text)] mt-0.5">{value}</p>
        {change && (
          <p className={clsx('text-xs mt-0.5 font-medium', positive ? 'text-green-500' : 'text-red-500')}>
            {positive ? '▲' : '▼'} {change}
          </p>
        )}
      </div>
    </motion.div>
  )
}
