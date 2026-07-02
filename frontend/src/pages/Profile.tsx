import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { User, MapPin, Phone, Shield, Star, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { userApi } from '../api/user'
import { emergencyApi } from '../api/emergency'
import Button from '../components/ui/Button'
import Input  from '../components/ui/Input'
import EmergencyCard from '../components/emergency/EmergencyCard'
import { CardSkeleton } from '../components/ui/Skeleton'
import { useAppSelector } from '../store'

export default function Profile() {
  const qc   = useQueryClient()
  const auth = useAppSelector(s => s.auth.user)

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getMe().then(r => r.data.data),
  })

  const { data: myEmergencies } = useQuery({
    queryKey: ['my-emergencies'],
    queryFn: () => emergencyApi.getMine().then(r => r.data.data),
  })

  interface ProfileForm {
    fullName?: string; phone?: string; address?: string; emergencyContact?: string
  }
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ProfileForm>({
    values: profile ? {
      fullName: profile.fullName, phone: profile.phone,
      address: profile.address,
    } : {},
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => userApi.updateMe(data),
    onSuccess: () => { toast.success('Profile updated!'); qc.invalidateQueries({ queryKey: ['profile'] }) },
  })

  const toggleAvailable = useMutation({
    mutationFn: () => userApi.updateMe({ isAvailable: !profile?.isAvailable } as any),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  })

  if (isLoading) return (
    <div className="max-w-2xl mx-auto space-y-4">
      <CardSkeleton /><CardSkeleton />
    </div>
  )

  const isHelper = auth?.roles.includes('ROLE_HELPER')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile card */}
      <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold">
            {profile?.fullName?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[var(--text)]">{profile?.fullName}</h2>
            <p className="text-sm text-[var(--text-muted)]">{profile?.email}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {profile?.isVerified && (
                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <Shield size={12} /> Verified
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-yellow-500 font-medium">
                <Star size={12} fill="currentColor" /> Trust: {profile?.trustScore}
              </span>
              {auth?.roles.map(r => (
                <span key={r} className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                  {r.replace('ROLE_', '')}
                </span>
              ))}
            </div>
          </div>

          {/* Helper availability toggle */}
          {isHelper && (
            <button
              onClick={() => toggleAvailable.mutate()}
              className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              {profile?.isAvailable
                ? <ToggleRight size={28} className="text-green-500" />
                : <ToggleLeft  size={28} className="text-gray-400" />
              }
              <span className="hidden sm:block">{profile?.isAvailable ? 'Available' : 'Offline'}</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Edit form */}
      <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="font-semibold text-[var(--text)] mb-4">Edit Profile</h3>
        <form onSubmit={handleSubmit(d => updateMutation.mutate(d))} className="space-y-4">
          <Input label="Full Name" icon={<User size={16} />} {...register('fullName')} />
          <Input label="Phone" type="tel" icon={<Phone size={16} />} {...register('phone')} />
          <Input label="Address" icon={<MapPin size={16} />} {...register('address')} />
          <Input label="Emergency Contact" type="tel" icon={<Phone size={16} />} {...register('emergencyContact')} />
          <Button type="submit" loading={isSubmitting}>Save Changes</Button>
        </form>
      </motion.div>

      {/* My emergencies */}
      <div>
        <h3 className="font-semibold text-[var(--text)] mb-3">My Requests</h3>
        {myEmergencies?.content.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] card p-6 text-center">No emergency requests yet.</p>
        )}
        <div className="space-y-3">
          {myEmergencies?.content.map((e, i) => <EmergencyCard key={e.id} emergency={e} index={i} />) ?? <CardSkeleton />}
        </div>
      </div>
    </div>
  )
}
