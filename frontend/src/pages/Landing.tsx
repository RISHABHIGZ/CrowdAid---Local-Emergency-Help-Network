import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Shield, MapPin, Clock, Star, ChevronRight, ArrowRight, Heart, Menu, X } from 'lucide-react'
import { useState } from 'react'

const features = [
  { icon: Zap,    title: 'Instant Broadcast',  desc: 'Emergency requests reach verified helpers within seconds via real-time WebSocket notifications.' },
  { icon: Shield, title: 'Trusted Network',    desc: 'Every helper carries a dynamic trust score built from verified history, ratings and response times.' },
  { icon: MapPin, title: 'Location-Aware',     desc: 'Automated radius search using Haversine formula finds the nearest available helpers instantly.' },
  { icon: Clock,  title: 'Real-Time Tracking', desc: 'Live map shows helper locations, ETA and arrival status as the emergency unfolds.' },
]

const stats = [
  { value: '50K+', label: 'Lives Helped' },
  { value: '98%',  label: 'Response Rate' },
  { value: '<90s', label: 'Avg Response Time' },
  { value: '200+', label: 'Cities Covered' },
]

const categories = [
  { icon: '🩸', label: 'Blood Donation',    color: '#fee2e2', text: '#dc2626' },
  { icon: '🏥', label: 'Medical',           color: '#fef3c7', text: '#d97706' },
  { icon: '⚠️', label: 'Accidents',         color: '#ffedd5', text: '#ea580c' },
  { icon: '🚗', label: 'Vehicle Breakdown', color: '#dbeafe', text: '#2563eb' },
  { icon: '🐾', label: 'Lost Pet',          color: '#d1fae5', text: '#059669' },
  { icon: '🌊', label: 'Disaster Relief',   color: '#ede9fe', text: '#7c3aed' },
]

const testimonials = [
  { name: 'Priya S.',  role: 'Volunteer Helper', avatar: 'P', text: 'CrowdAid notified me instantly when someone nearby needed a blood donor. I got there in 12 minutes.', rating: 5 },
  { name: 'Arjun M.',  role: 'Platform User',    avatar: 'A', text: 'My car broke down late at night. Within 5 minutes three helpers were already on their way.', rating: 5 },
  { name: 'Meera K.',  role: 'Medical Helper',   avatar: 'M', text: "The trust score system makes me feel safe helping strangers. It's built on genuine accountability.", rating: 5 },
]

const fadeUp   = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55 } } }
const stagger  = { show: { transition: { staggerChildren: 0.1 } } }

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ════════════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: '#ef4444', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={17} fill="white" color="white" />
            </div>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 18, color: '#0f172a' }}>CrowdAid</span>
          </div>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden md:flex">
            {['Features', 'How it works', 'Stories'].map((item, i) => (
              <a key={item} href={['#features','#how','#stories'][i]}
                style={{ fontSize: 14, fontWeight: 500, color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0f172a')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
              >{item}</a>
            ))}
          </div>

          {/* Auth buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/login" style={{
              padding: '8px 18px', fontSize: 14, fontWeight: 600, color: '#374151',
              textDecoration: 'none', borderRadius: 10, transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >Sign in</Link>
            <Link to="/register" style={{
              padding: '9px 20px', fontSize: 14, fontWeight: 600, color: 'white',
              background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', borderRadius: 10,
              textDecoration: 'none', boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.35)' }}
            >Get started</Link>
            {/* Mobile burger */}
            <button className="md:hidden" onClick={() => setMobileOpen(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#374151' }}>
              {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: 'white', borderTop: '1px solid #e2e8f0', padding: '12px 24px 20px' }}>
            {[['Features','#features'],['How it works','#how'],['Stories','#stories']].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '10px 0', fontSize: 15, fontWeight: 500, color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f1f5f9' }}>
                {label}
              </a>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <Link to="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#374151', textDecoration: 'none' }}>Sign in</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#2563eb', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'white', textDecoration: 'none' }}>Get started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════ */}
      <section style={{ paddingTop: 120, paddingBottom: 80, overflow: 'hidden', position: 'relative' }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(37,99,235,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 120, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(239,68,68,0.10) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <motion.div
          style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}
          variants={stagger} initial="hidden" animate="show"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999,
              background: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', fontSize: 13, fontWeight: 600,
            }}>
              <span style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              Real-time emergency network — live now
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 800,
            fontSize: 'clamp(42px, 8vw, 76px)',
            lineHeight: 1.1, marginBottom: 24, color: '#0f172a',
          }}>
            Help arrives<br />
            <span style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              in seconds.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={fadeUp} style={{
            fontSize: 18, color: '#64748b', maxWidth: 540, margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            CrowdAid connects people in emergencies with verified local volunteers instantly.
            Blood, medical, breakdown, disaster — help is always nearby.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
              color: 'white', fontWeight: 700, fontSize: 15, borderRadius: 12,
              textDecoration: 'none', boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(37,99,235,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.35)' }}
            >
              Request Help Now <ArrowRight size={18} />
            </Link>
            <Link to="/register?helper=true" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', background: 'white', border: '1.5px solid #e2e8f0',
              color: '#374151', fontWeight: 700, fontSize: 15, borderRadius: 12,
              textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <Heart size={17} color="#ef4444" /> Become a Helper
            </Link>
          </motion.div>
        </motion.div>

        {/* Live notification card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            maxWidth: 360, margin: '56px auto 0', padding: '16px 20px',
            background: 'white', borderRadius: 16, border: '1px solid #e2e8f0',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          <div style={{ width: 44, height: 44, background: '#fef2f2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
            🚨
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>Blood needed urgently</p>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>3 helpers responding · 0.8 km away</p>
          </div>
          <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
            Live
          </span>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════
          STATS
      ════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg,#0f2240,#1e3a5f)', padding: '64px 24px' }}>
        <motion.div
          style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 32, textAlign: 'center' }}
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
        >
          {stats.map(s => (
            <motion.div key={s.label} variants={fadeUp}>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 44, fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 8 }}>{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════
          CATEGORIES
      ════════════════════════════════════════════════ */}
      <section id="how" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div style={{ textAlign: 'center', marginBottom: 56 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(28px,5vw,42px)', fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
              Every emergency, covered.
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
              One platform handles all types of emergencies with intelligent category routing.
            </p>
          </motion.div>

          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {categories.map(c => (
              <motion.div key={c.label} variants={fadeUp}
                style={{
                  background: 'white', border: '1px solid #e2e8f0', borderRadius: 16,
                  padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
                  cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, background: c.color, flexShrink: 0 }}>
                  {c.icon}
                </div>
                <span style={{ fontWeight: 600, fontSize: 15, color: '#1e293b' }}>{c.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════ */}
      <section id="features" style={{ background: '#f8fafc', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div style={{ textAlign: 'center', marginBottom: 56 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(28px,5vw,42px)', fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Built for speed.</h2>
            <p style={{ fontSize: 16, color: '#64748b' }}>Every feature is designed to get help there faster.</p>
          </motion.div>

          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {features.map(f => (
              <motion.div key={f.title} variants={fadeUp}
                style={{
                  background: 'white', border: '1px solid #e2e8f0', borderRadius: 20,
                  padding: '28px', display: 'flex', gap: 20, alignItems: 'flex-start',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                  <f.icon size={24} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════ */}
      <section id="stories" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div style={{ textAlign: 'center', marginBottom: 56 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(28px,5vw,42px)', fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Real stories.</h2>
            <p style={{ fontSize: 16, color: '#64748b' }}>From real people whose lives were changed.</p>
          </motion.div>

          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {testimonials.map(t => (
              <motion.div key={t.name} variants={fadeUp}
                style={{
                  background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: '28px',
                  display: 'flex', flexDirection: 'column', gap: 16,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, flex: 1, margin: 0 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════════════ */}
      <section style={{ padding: '40px 24px 96px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          style={{
            maxWidth: 860, margin: '0 auto',
            background: 'linear-gradient(135deg,#0f2240 0%,#1d4ed8 100%)',
            borderRadius: 28, padding: '72px 48px', textAlign: 'center',
            boxShadow: '0 24px 64px rgba(29,78,216,0.35)',
          }}
        >
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, color: 'white', marginBottom: 16, lineHeight: 1.2 }}>
            Be the help<br />someone needs today.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', marginBottom: 36 }}>
            Join thousands of volunteers making their communities safer.
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 36px', background: 'white', color: '#1d4ed8',
            fontWeight: 700, fontSize: 16, borderRadius: 14, textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            Join CrowdAid <ChevronRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: '#ef4444', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} fill="white" color="white" />
            </div>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>CrowdAid</span>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>— Local Emergency Help Network</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: 14, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#374151'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >{l}</a>
            ))}
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>© 2024 CrowdAid. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
