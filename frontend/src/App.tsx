import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './store'

import Landing        from './pages/Landing'
import Login          from './pages/Login'
import Register       from './pages/Register'
import Dashboard      from './pages/Dashboard'
import Emergencies    from './pages/Emergencies'
import EmergencyDetail from './pages/EmergencyDetail'
import NewEmergency   from './pages/NewEmergency'
import MapPage        from './pages/MapPage'
import Profile        from './pages/Profile'
import Notifications  from './pages/Notifications'
import AdminDashboard from './pages/AdminDashboard'
import AppLayout      from './components/layout/AppLayout'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuth = useAppSelector(s => s.auth.isAuthenticated)
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const user = useAppSelector(s => s.auth.user)
  const ok   = user?.roles.includes('ROLE_ADMIN')
  return ok ? <>{children}</> : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"        element={<Landing />} />
      <Route path="/login"   element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected app shell */}
      <Route path="/" element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route path="dashboard"       element={<Dashboard />} />
        <Route path="emergencies"     element={<Emergencies />} />
        <Route path="emergencies/new" element={<NewEmergency />} />
        <Route path="emergencies/:id" element={<EmergencyDetail />} />
        <Route path="map"             element={<MapPage />} />
        <Route path="profile"         element={<Profile />} />
        <Route path="notifications"   element={<Notifications />} />

        {/* Admin */}
        <Route path="admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="admin/users"     element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="admin/analytics" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
