import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Users, AlertTriangle, CheckCircle, TrendingUp, Ban, UserCheck } from 'lucide-react'
import { analyticsApi } from '../api/analytics'
import { userApi } from '../api/user'
import KpiCard from '../components/ui/KpiCard'
import { TableSkeleton } from '../components/ui/Skeleton'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend
} from 'recharts'

const PIE_COLORS = ['#3b82f6','#ef4444','#f59e0b','#22c55e','#8b5cf6','#06b6d4','#64748b']

export default function AdminDashboard() {
  const qc = useQueryClient()

  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => analyticsApi.getDashboard().then(r => r.data.data),
  })

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => userApi.getAllAdmin().then(r => r.data.data),
  })

  const ban   = useMutation({ mutationFn: (id:number) => userApi.banUser(id),   onSuccess: () => { toast.success('User banned');   qc.invalidateQueries({ queryKey: ['admin-users'] }) } })
  const unban = useMutation({ mutationFn: (id:number) => userApi.unbanUser(id), onSuccess: () => { toast.success('User unbanned'); qc.invalidateQueries({ queryKey: ['admin-users'] }) } })

  const pieData = analytics
    ? Object.entries(analytics.emergenciesByCategory).map(([name, value]) => ({ name: name.replace('_', ' '), value }))
    : []

  const resolutionData = analytics ? [
    { name: 'Resolved', value: analytics.resolutionRate, fill: '#22c55e' },
    { name: 'Remaining', value: 100 - analytics.resolutionRate, fill: '#e2e8f0' },
  ] : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'Poppins' }}>Admin Dashboard</h1>
        <p className="text-sm text-[var(--text-muted)]">Full platform overview and controls</p>
      </div>

      {/* KPIs */}
      {analytics && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard title="Total Users"   value={analytics.totalUsers.toLocaleString()} icon={<Users size={20}/>}         color="blue" />
          <KpiCard title="Active Cases"  value={analytics.activeEmergencies}           icon={<AlertTriangle size={20}/>} color="red" />
          <KpiCard title="Resolved"      value={analytics.resolvedEmergencies}         icon={<CheckCircle size={20}/>}   color="green" />
          <KpiCard title="Resolution Rate" value={`${analytics.resolutionRate}%`}      icon={<TrendingUp size={20}/>}    color="cyan" />
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Daily activity bar chart */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-[var(--text)] mb-4">Daily Activity (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics?.dailyActivity ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--text-light)" tickFormatter={v=>v.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--text-light)" />
              <Tooltip contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10, fontSize:12 }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--text)] mb-4">By Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10, fontSize:11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resolution rate radial */}
      {analytics && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="card p-5">
            <h3 className="font-semibold text-[var(--text)] mb-2">Resolution Rate</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={120} height={120}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={resolutionData} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={6} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div>
                <p className="text-4xl font-bold text-[var(--text)]">{analytics.resolutionRate}%</p>
                <p className="text-sm text-[var(--text-muted)]">of emergencies resolved</p>
                {analytics.averageResponseTimeSecs && (
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Avg response: {Math.round(analytics.averageResponseTimeSecs)}s
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Top helpers */}
          <div className="card p-5">
            <h3 className="font-semibold text-[var(--text)] mb-3">Top Helpers</h3>
            <div className="space-y-2">
              {analytics.topHelpers.slice(0,5).map((h, i) => (
                <div key={h.id} className="flex items-center gap-3">
                  <span className="text-lg font-bold text-[var(--text-light)] w-5">#{i+1}</span>
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {h.fullName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text)] truncate">{h.fullName}</p>
                  </div>
                  <span className="text-xs text-yellow-500 font-semibold">★ {h.trustScore}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User management table */}
      <div className="card p-5">
        <h3 className="font-semibold text-[var(--text)] mb-4">User Management</h3>
        {loadingUsers ? <TableSkeleton rows={6} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {['User','Email','Role','Trust','Status','Actions'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {usersData?.content.map(u => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{u.fullName[0]}</div>
                        <span className="font-medium text-[var(--text)]">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-muted)]">{u.email}</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map(r => <span key={r} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">{r.replace('ROLE_','')}</span>)}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-yellow-500 font-medium">★ {u.trustScore}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.isVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {u.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Button size="sm" variant="ghost" icon={<Ban size={13}/>}
                        onClick={() => ban.mutate(u.id)} className="text-red-500 hover:bg-red-50">
                        Ban
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
