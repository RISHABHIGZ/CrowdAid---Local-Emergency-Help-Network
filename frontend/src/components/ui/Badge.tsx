import clsx from 'clsx'

type Color = 'blue' | 'cyan' | 'red' | 'green' | 'yellow' | 'gray' | 'purple'

const colors: Record<Color, string> = {
  blue:   'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  cyan:   'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  red:    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  green:  'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  gray:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
}

export function Badge({ label, color = 'gray', dot }: { label: string; color?: Color; dot?: boolean }) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium', colors[color])}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', `bg-current`)} />}
      {label}
    </span>
  )
}

export function UrgencyBadge({ level }: { level: string }) {
  const map: Record<string, { color: Color; label: string }> = {
    CRITICAL: { color: 'red',    label: '🔴 Critical' },
    HIGH:     { color: 'yellow', label: '🟠 High' },
    MEDIUM:   { color: 'blue',   label: '🔵 Medium' },
    LOW:      { color: 'green',  label: '🟢 Low' },
  }
  const cfg = map[level] ?? { color: 'gray', label: level }
  return <Badge label={cfg.label} color={cfg.color} />
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: Color }> = {
    PENDING:   { color: 'yellow' },
    ACTIVE:    { color: 'red' },
    RESOLVED:  { color: 'green' },
    CANCELLED: { color: 'gray' },
  }
  const cfg = map[status] ?? { color: 'gray' }
  return <Badge label={status} color={cfg.color} dot />
}
