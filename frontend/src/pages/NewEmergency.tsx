import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Phone, AlertTriangle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { emergencyApi } from '../api/emergency'
import type { EmergencyCategory, UrgencyLevel } from '../types'
import Button from '../components/ui/Button'
import Input  from '../components/ui/Input'
import { categoryMeta } from '../utils/emergency'

const schema = z.object({
  title:           z.string().min(5).max(200),
  description:     z.string().min(10).max(2000),
  category:        z.string().min(1, 'Select a category'),
  urgencyLevel:    z.string().min(1, 'Select urgency'),
  latitude:        z.number(),
  longitude:       z.number(),
  address:         z.string().optional(),
  contactNumber:   z.string().optional(),
  requiredHelpers: z.number().min(1).max(50),
})
type Form = z.infer<typeof schema>

const urgencyOptions: { value: UrgencyLevel; label: string; color: string }[] = [
  { value: 'LOW',      label: '🟢 Low',      color: 'border-green-400 bg-green-50' },
  { value: 'MEDIUM',   label: '🔵 Medium',   color: 'border-blue-400 bg-blue-50' },
  { value: 'HIGH',     label: '🟠 High',     color: 'border-yellow-400 bg-yellow-50' },
  { value: 'CRITICAL', label: '🔴 Critical', color: 'border-red-400 bg-red-50' },
]

export default function NewEmergency() {
  const navigate   = useNavigate()
  const [locating, setLocating] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { requiredHelpers: 1, latitude: 0, longitude: 0 },
  })

  const category     = watch('category')
  const urgencyLevel = watch('urgencyLevel')

  const getLocation = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setValue('latitude',  pos.coords.latitude)
        setValue('longitude', pos.coords.longitude)
        toast.success('Location captured')
        setLocating(false)
      },
      () => { toast.error('Could not get location'); setLocating(false) }
    )
  }

  const onSubmit = async (data: Form) => {
    try {
      const res = await emergencyApi.create({
        ...data,
        category:     data.category as EmergencyCategory,
        urgencyLevel: data.urgencyLevel as UrgencyLevel,
      })
      toast.success('Emergency request posted!')
      navigate(`/emergencies/${res.data.data.id}`)
    } catch { /* handled */ }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'Poppins' }}>
          🚨 Request Emergency Help
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Nearby verified helpers will be notified instantly.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-[var(--text)] block mb-2">Emergency Type *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.keys(categoryMeta) as EmergencyCategory[]).map(cat => (
              <motion.button
                key={cat} type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setValue('category', cat)}
                className={`p-3 rounded-xl border-2 flex items-center gap-2 text-left transition-all ${
                  category === cat
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-[var(--border)] hover:border-blue-300'
                }`}
              >
                <span className="text-xl">{categoryMeta[cat].icon}</span>
                <span className="text-xs font-medium text-[var(--text)]">{categoryMeta[cat].label}</span>
              </motion.button>
            ))}
          </div>
          {errors.category && <p className="text-xs text-red-500 mt-1">⚠ {errors.category.message}</p>}
        </div>

        {/* Title & Description */}
        <Input label="Title *" placeholder="Brief description of the emergency" error={errors.title?.message} {...register('title')} />
        <div>
          <label className="text-sm font-medium text-[var(--text)] block mb-1.5">Description *</label>
          <textarea
            rows={4}
            placeholder="Provide more details — this helps our AI assess urgency and notify the right helpers..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-light)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            {...register('description')}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">⚠ {errors.description.message}</p>}
        </div>

        {/* Urgency */}
        <div>
          <label className="text-sm font-medium text-[var(--text)] block mb-2">Urgency Level *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {urgencyOptions.map(opt => (
              <button
                key={opt.value} type="button"
                onClick={() => setValue('urgencyLevel', opt.value)}
                className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  urgencyLevel === opt.value ? opt.color + ' dark:opacity-90' : 'border-[var(--border)]'
                }`}
              >{opt.label}</button>
            ))}
          </div>
          {errors.urgencyLevel && <p className="text-xs text-red-500 mt-1">⚠ {errors.urgencyLevel.message}</p>}
        </div>

        {/* Location */}
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
              <MapPin size={16} /> Location *
            </label>
            <Button type="button" variant="outline" size="sm" onClick={getLocation} loading={locating}
              icon={locating ? <Loader size={14} /> : <MapPin size={14} />}>
              Use my location
            </Button>
          </div>
          <Input placeholder="Street address or landmark" {...register('address')} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Latitude</label>
              <input readOnly className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--text-muted)]"
                value={watch('latitude')} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Longitude</label>
              <input readOnly className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2 text-sm text-[var(--text-muted)]"
                value={watch('longitude')} />
            </div>
          </div>
        </div>

        {/* Contact & helpers */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="Contact Number" type="tel" placeholder="+91 9999999999"
            icon={<Phone size={16} />} {...register('contactNumber')} />
          <div>
            <label className="text-sm font-medium text-[var(--text)] block mb-1.5">
              <Users size={14} className="inline mr-1" /> Helpers Needed
            </label>
            <input type="number" min={1} max={50}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('requiredHelpers', { valueAsNumber: true })} />
          </div>
        </div>

        {/* AI info banner */}
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex gap-3">
          <AlertTriangle size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>AI Urgency Analysis:</strong> Our system will automatically assess severity from your description and prioritise notification to the best-matched helpers.
          </p>
        </div>

        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          🚨 Post Emergency Request
        </Button>
      </form>
    </div>
  )
}

function Users({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}
