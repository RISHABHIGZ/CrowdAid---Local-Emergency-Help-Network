import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Zap, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authApi } from '../api/auth'
import { useAppDispatch } from '../store'
import { setCredentials } from '../store/authSlice'

const schema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})
type Form = z.infer<typeof schema>

const highlights = [
  { icon: '🚨', title: 'Instant Alerts',      desc: 'Notified in seconds when someone nearby needs help.' },
  { icon: '🗺️', title: 'Live Map View',       desc: 'See emergencies around you in real-time on a live map.' },
  { icon: '⭐', title: 'Trusted Volunteers',  desc: 'Every helper verified through our dynamic trust scoring.' },
]

export default function Login() {
  const dispatch  = useAppDispatch()
  const navigate  = useNavigate()
  const [showPw, setShowPw] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Form) => {
    try {
      const res = await authApi.login(data)
      dispatch(setCredentials(res.data.data))
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch { /* handled by axios interceptor */ }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>

      {/* ── Left panel ─────────────────────────────────── */}
      <div className="hidden lg:flex" style={{
        width: '45%', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 56px',
        background: 'linear-gradient(150deg,#0f2240 0%,#1d4ed8 60%,#0891b2 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <div style={{ width: 40, height: 40, background: '#ef4444', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} fill="white" color="white" />
          </div>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 22, color: 'white' }}>CrowdAid</span>
        </div>

        {/* Middle copy */}
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 38, color: 'white', lineHeight: 1.2, marginBottom: 16 }}>
            Emergency help,<br />always nearby.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 40, maxWidth: 360 }}>
            Connect with verified volunteers in seconds. Real-time, location-aware, community-powered.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {highlights.map(h => (
              <div key={h.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.12)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {h.icon}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'white', fontSize: 15, margin: '0 0 3px' }}>{h.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: 0 }}>{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', position: 'relative' }}>© 2024 CrowdAid. All rights reserved.</p>
      </div>

      {/* ── Right panel ─────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <motion.div
          style={{ width: '100%', maxWidth: 420 }}
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden" style={{ alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <div style={{ width: 36, height: 36, background: '#ef4444', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} fill="white" color="white" />
            </div>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 18, color: '#0f172a' }}>CrowdAid</span>
          </div>

          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 32, color: '#0f172a', margin: '0 0 8px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 36 }}>
            Sign in to your account. Every second counts.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  style={{
                    width: '100%', padding: '12px 14px 12px 42px', fontSize: 15,
                    border: `1.5px solid ${errors.email ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: 12, background: 'white', color: '#0f172a',
                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.email ? '#ef4444' : '#e5e7eb'}
                />
              </div>
              {errors.email && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 5 }}>⚠ {errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Password</label>
                <a href="#" style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  style={{
                    width: '100%', padding: '12px 44px 12px 42px', fontSize: 15,
                    border: `1.5px solid ${errors.password ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: 12, background: 'white', color: '#0f172a',
                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={e => e.currentTarget.style.borderColor = errors.password ? '#ef4444' : '#e5e7eb'}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
                  {showPw ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 5 }}>⚠ {errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%', padding: '14px', fontSize: 15, fontWeight: 700,
                background: isSubmitting ? '#93c5fd' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                color: 'white', border: 'none', borderRadius: 12, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(37,99,235,0.35)', transition: 'transform 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              {isSubmitting
                ? <><svg style={{ animation: 'spin 1s linear infinite', width: 18, height: 18 }} fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/><path fill="white" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/></svg> Signing in...</>
                : <>Sign in <ArrowRight size={17}/></>
              }
            </button>
          </form>

          {/* Demo box */}
          <div style={{ marginTop: 20, padding: '14px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12 }}>
            <p style={{ fontSize: 13, color: '#1d4ed8', margin: 0, fontWeight: 600 }}>🔑 Demo credentials</p>
            <p style={{ fontSize: 12, color: '#3b82f6', margin: '4px 0 0' }}>admin@crowdaid.com &nbsp;·&nbsp; Admin@123</p>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            <span style={{ fontSize: 13, color: '#9ca3af' }}>New to CrowdAid?</span>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          </div>

          <Link to="/register" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '13px', fontSize: 15, fontWeight: 600,
            background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 12,
            color: '#374151', textDecoration: 'none', transition: 'border-color 0.2s',
            boxSizing: 'border-box',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#93c5fd'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
          >
            Create a free account
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
