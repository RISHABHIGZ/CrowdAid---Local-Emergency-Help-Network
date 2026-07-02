import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, AlertTriangle, Map, Bell, User,
  Users, BarChart3, LogOut, ShieldCheck, Menu, X, Zap
} from 'lucide-react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '../../store'
import { logout } from '../../store/authSlice'

const navItems = [
  { to: '/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/emergencies', label: 'Emergencies',  icon: AlertTriangle },
  { to: '/map',         label: 'Live Map',     icon: Map },
  { to: '/notifications', label: 'Alerts',    icon: Bell },
  { to: '/profile',     label: 'Profile',      icon: User },
]
const adminItems = [
  { to: '/admin',       label: 'Admin Panel',  icon: ShieldCheck },
  { to: '/admin/users', label: 'Users',        icon: Users },
  { to: '/admin/analytics', label: 'Analytics',icon: BarChart3 },
]

interface Props { open: boolean; setOpen: (v: boolean) => void }

export default function Sidebar({ open, setOpen }: Props) {
  const dispatch  = useAppDispatch()
  const navigate  = useNavigate()
  const user      = useAppSelector(s => s.auth.user)
  const isAdmin   = user?.roles.includes('ROLE_ADMIN')

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        className={clsx(
          'fixed top-0 left-0 h-screen z-40 flex flex-col',
          'bg-[var(--primary-dark)] text-white',
          'transition-all duration-300',
          open ? 'w-64' : 'w-0 lg:w-16 overflow-hidden'
        )}
        style={{ minWidth: open ? 256 : undefined }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
            <Zap size={18} fill="white" />
          </div>
          <AnimatePresence>
            {open && (
              <motion.span
                className="font-bold text-lg font-poppins"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                CrowdAid
              </motion.span>
            )}
          </AnimatePresence>
          <button
            className="ml-auto p-1 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden px-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon size={18} className="shrink-0" />
              {open && <span>{label}</span>}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="px-3 pt-4 pb-1">
                {open && <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Admin</p>}
              </div>
              {adminItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to} to={to}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  {open && <span>{label}</span>}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-white/10">
          {open && (
            <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user?.fullName}</p>
                <p className="text-xs text-white/50 truncate">{user?.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut size={18} className="shrink-0" />
            {open && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}
