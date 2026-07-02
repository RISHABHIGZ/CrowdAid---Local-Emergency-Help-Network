import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, Users, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react'
import { emergencyApi } from '../api/emergency'
import { analyticsApi } from '../api/analytics'
import { useAppSelector } from '../store'
import KpiCard from '../components/ui/KpiCard'
import EmergencyCard from '../components/emergency/EmergencyCard'
import { CardSkeleton } from '../components/ui/Skeleton'
import Button from '../components/ui/Button'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const PIE_COLORS = ['#3b82f6','#ef4444','#f59e0b','#22c55e','#8b5cf6','#06b6d4','#64748b']

export default function Dashboard() {
  const user = useAppSelector(s => s.auth.user)
  const isAdmin = user?.roles.includes('ROLE_ADMIN')

  const { data: recentData, isLoading: loadingRecent } = useQuery({
    queryKey: ['emergencies', 'recent'],
    queryFn: () => emergencyApi.getAll(0, 6).then(r => r.data.data),
  })

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => analyticsApi.getDashboard().then(r => r.data.data),
    enabled: isAdmin === true,
  })

  const pieData = analytics
    ? Object.entries(analytics.emergenciesByCategory).map(([name, value]) => ({ name, value }))
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'Poppins' }}>
            Welcome back, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Here's what's happening in your area.</p>
        </div>
        <Link to="/emergencies/new">
          <Button icon={<Plus size={16} />}>New Emergency</Button>
        </Link>
      </div>

      {/* KPI Cards */}
      {isAdmin && analytics && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard title="Total Users"   value={analytics.totalUsers.toLocaleString()}        icon={<Users size={20} />}         color="blue" />
          <KpiCard title="Active Emergencies" value={analytics.activeEmergencies}             icon={<AlertTriangle size={20} />} color="red" />
          <KpiCard title="Resolved"      value={analytics.resolvedEmergencies.toLocaleString()} icon={<CheckCircle size={20} />}   color="green" />
          <KpiCard
            title="Avg Response"
            value={analytics.averageResponseTimeSecs ? `${Math.round(analytics.averageResponseTimeSecs)}s` : 'N/A'}
            icon={<Clock size={20} />} color="cyan"
          />
        </div>
      )}

      {/* Charts — admin only */}
      {isAdmin && analytics && (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Activity chart */}
          <div className="card p-5 lg:col-span-2">
            <h3 className="font-semibold text-[var(--text)] mb-4">Emergency Activity (Last 30 days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analytics.dailyActivity}>
                <defs>
                  <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--text-light)" tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-light)" />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#actGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category pie */}
          <div className="card p-5">
            <h3 className="font-semibold text-[var(--text)] mb-4">By Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent emergencies */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[var(--text)]">Recent Emergencies</h2>
          <Link to="/emergencies" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loadingRecent ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          >
            {recentData?.content.map((e, i) => (
              <EmergencyCard key={e.id} emergency={e} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
