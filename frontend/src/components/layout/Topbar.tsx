import { Link } from 'react-router-dom'
import { Menu, Sun, Moon, Bell, Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store'
import { toggleTheme } from '../../store/themeSlice'
import { useQuery } from '@tanstack/react-query'
import { notificationApi } from '../../api/notifications'

interface Props { onMenuClick: () => void; sidebarOpen: boolean }

export default function Topbar({ onMenuClick }: Props) {
  const dispatch = useAppDispatch()
  const dark     = useAppSelector(s => s.theme.dark)
  const isAuth   = useAppSelector(s => s.auth.isAuthenticated)

  const { data } = useQuery({
    queryKey: ['unread-count'],
    queryFn: () => notificationApi.getUnread().then(r => r.data.data),
    enabled: isAuth,
    refetchInterval: 30_000,
  })

  return (
    <header className="sticky top-0 z-20 bg-[var(--bg-card)]/80 backdrop-blur-lg border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors text-[var(--text-muted)]"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
          <input
            placeholder="Search emergencies..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text)] placeholder:text-[var(--text-light)]"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors text-[var(--text-muted)]"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        {isAuth && (
          <Link to="/notifications" className="relative p-2 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors text-[var(--text-muted)]">
            <Bell size={18} />
            {(data ?? 0) > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {data! > 9 ? '9+' : data}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  )
}
