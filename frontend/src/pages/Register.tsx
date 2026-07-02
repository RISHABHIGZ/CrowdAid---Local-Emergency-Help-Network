import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Phone, Zap, Eye, EyeOff, Heart, ArrowRight, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authApi } from '../api/auth'
import { useAppDispatch } from '../store'
import { setCredentials } from '../store/authSlice'

const schema = z.object({
  fullName:         z.string().min(2, 'At least 2 characters required'),
  email:            z.email('Invalid email address'),
  password:         z.string()
    .min(8, 'At least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Must include uppercase, lowercase, digit & symbol'),
  phone:            z.string().optional(),
  registerAsHelper: z.boolean(),
})
type Form = z.infer<typeof schema>

const helperPerks = [
  'Get notified of nearby emergencies instantly',
  'Build your community trust score',
  'Track your impact and response history',
]
const userPerks = [
  'Request help from verified local volunteers',
  'Real-time updates on helper status',
  'Rate and review after every interaction',
]

export default function Register() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [showPw, setShowPw] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { registerAsHelper: params.get('helper') === 'true' },
  })

  const asHelper  = watch('registerAsHelper')
  const perks     = asHelper ? helperPerks : userPerks

  const onSubmit = async (data: Form) => {
    try {
      const res = await authApi.register(data)
      dispatch(setCredentials(res.data.data))
      toast.success('Welcome to CrowdAid! 🎉')
      navigate('/dashboard')
    } catch { /* handled by axios interceptor */ }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>

      {/* ── Left panel ─────────────────────────────────── */}
      <div className="hidden lg:flex" style={{
        width: '42%', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 56px',
        background: asHelper
          ? 'linear-gradient(150deg,#064e3b,#059669,#0891b2)'
          : 'linear-gradient(150deg,#1e1b4b,#4338ca,#2563eb)',
        position: 'relative', overflow: 'hidden', transition: 'background 0.6s',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <div style={{ width: 40, height: 40, background: '#ef4444', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} fill="white" color="white" />
          </div>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 22, color: 'white' }}>CrowdAid</span>
        </div>

        {/* Copy */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(255,255,255,0.15)', borderRadius: 999, marginBottom: 20 }}>
            {asHelper ? <Heart size={14} color="white"/> : <User size={14} color="white"/>}
            <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>{asHelper ? 'Joining as Helper' : 'Joining as User'}</span>
          </div>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 36, color: 'white', lineHeight: 1.2, marginBottom: 16 }}>
            {asHelper ? 'Make a real\ndifference.' : 'Help is just\nmoments away.'}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 36 }}>
            {asHelper
              ? 'Join our network of trusted volunteers and be there when it matters most.'
              : 'Get access to verified local volunteers ready to help in any emergency.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {perks.map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle size={18} color="rgba(255,255,255,0.8)" />
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', position: 'relative' }}>© 2024 CrowdAid</p>
      </div>

      {/* ── Right panel ─────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>
        <motion.div
          style={{ width: '100%', maxWidth: 440 }}
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden" style={{ alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 36, height: 36, background: '#ef4444', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} fill="white" color="white" />
            </div>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 18, color: '#0f172a' }}>CrowdAid</span>
          </div>

          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 30, color: '#0f172a', margin: '0 0 6px' }}>
            Create your account
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 28 }}>Join the network. Be ready. Be the help.</p>

          {/* Role toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
            {[
              { value: false, icon: User,  label: 'I need help',    sub: 'Requester', color: '#2563eb' },
              { value: true,  icon: Heart, label: 'I want to help', sub: 'Helper',    color: '#059669' },
            ].map(opt => (
              <button
                key={String(opt.value)} type="button"
                onClick={() => setValue('registerAsHelper', opt.value)}
                style={{
                  padding: '16px 14px', borderRadius: 14, textAlign: 'left', cursor: 'pointer',
                  border: `2px solid ${asHelper === opt.value ? opt.color : '#e5e7eb'}`,
                  background: asHelper === opt.value ? (opt.value ? '#f0fdf4' : '#eff6ff') : 'white',
                  transition: 'all 0.2s',
                }}
              >
                <opt.icon size={20} color={asHelper === opt.value ? opt.color : '#9ca3af'} />
                <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', margin: '10px 0 2px' }}>{opt.label}</p>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{opt.sub}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Full name */}
            <FieldInput
              label="Full name" placeholder="John Doe" icon={<User size={15}/>}
              error={errors.fullName?.message} type="text"
              reg={register('fullName')}
            />

            {/* Email */}
            <FieldInput
              label="Email address" placeholder="you@example.com" icon={<Mail size={15}/>}
              error={errors.email?.message} type="email"
              reg={register('email')}
            />

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min 8 chars · Upper · Lower · Symbol"
                  {...register('password')}
                  style={{
                    width: '100%', padding: '12px 44px 12px 40px', fontSize: 14,
                    border: `1.5px solid ${errors.password ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: 12, background: 'white', color: '#0f172a',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.password ? '#ef4444' : '#e5e7eb'}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 5 }}>⚠ {errors.password.message}</p>}
            </div>

            {/* Phone */}
            <FieldInput
              label="Phone number (optional)" placeholder="+91 9999999999" icon={<Phone size={15}/>}
              error={errors.phone?.message} type="tel"
              reg={register('phone')}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%', padding: '14px', fontSize: 15, fontWeight: 700,
                background: asHelper
                  ? (isSubmitting ? '#6ee7b7' : 'linear-gradient(135deg,#059669,#0d9488)')
                  : (isSubmitting ? '#93c5fd' : 'linear-gradient(135deg,#2563eb,#1d4ed8)'),
                color: 'white', border: 'none', borderRadius: 12,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: asHelper ? '0 4px 16px rgba(5,150,105,0.35)' : '0 4px 16px rgba(37,99,235,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4,
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              {isSubmitting
                ? <><svg style={{ animation: 'spin 1s linear infinite', width: 18, height: 18 }} fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/><path fill="white" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/></svg> Creating account...</>
                : <>Create account <ArrowRight size={17}/></>
              }
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', marginTop: 24 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

/* ── Reusable field ────────────────────────────────────── */
function FieldInput({ label, placeholder, icon, error, type, reg }: {
  label: string; placeholder: string; icon: React.ReactNode
  error?: string; type: string; reg: object
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>{icon}</span>
        <input
          type={type} placeholder={placeholder}
          {...(reg as any)}
          style={{
            width: '100%', padding: '12px 14px 12px 40px', fontSize: 14,
            border: `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`,
            borderRadius: 12, background: 'white', color: '#0f172a',
            outline: 'none', boxSizing: 'border-box',
          }}
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.style.borderColor = '#3b82f6'}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.style.borderColor = error ? '#ef4444' : '#e5e7eb'}
        />
      </div>
      {error && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 5 }}>⚠ {error}</p>}
    </div>
  )
}
