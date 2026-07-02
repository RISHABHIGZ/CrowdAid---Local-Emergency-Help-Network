import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Shield, MapPin, Clock, Users, Star, ChevronRight, ArrowRight, Heart } from 'lucide-react'

const features = [
  { icon: Zap,    title: 'Instant Broadcast',  desc: 'Emergency requests reach verified helpers within seconds via real-time WebSocket.' },
  { icon: Shield, title: 'Trusted Network',    desc: 'Every helper is verified with a dynamic trust score based on ratings and history.' },
  { icon: MapPin, title: 'Location-Aware',     desc: 'Automated radius search finds the nearest available helpers in your area.' },
  { icon: Clock,  title: 'Real-Time Tracking', desc: 'Live map shows helper locations, ETA, and arrival status as it happens.' },
]

const stats = [
  { value: '50K+', label: 'Lives Helped' },
  { value: '98%',  label: 'Response Rate' },
  { value: '<90s', label: 'Avg Response Time' },
  { value: '200+', label: 'Cities Covered' },
]

const categories = [
  { icon: '🩸', label: 'Blood Donation',    color: '#fee2e2' },
  { icon: '🏥', label: 'Medical',           color: '#fef3c7' },
  { icon: '⚠️', label: 'Accidents',         color: '#ffedd5' },
  { icon: '🚗', label: 'Vehicle Breakdown', color: '#dbeafe' },
  { icon: '🐾', label: 'Lost Pet',          color: '#d1fae5' },
  { icon: '🌊', label: 'Disaster Relief',   color: '#ede9fe' },
]

const testimonials = [
  { name: 'Priya S.',  role: 'Volunteer Helper', text: 'CrowdAid notified me instantly when someone nearby needed a blood donor. I got there in 12 minutes.', rating: 5 },
  { name: 'Arjun M.',  role: 'Platform User',    text: 'My car broke down late at night. Within 5 minutes three helpers were already on their way.', rating: 5 },
  { name: 'Meera K.',  role: 'Medical Helper',   text: 'The trust score system makes me feel safe helping strangers. It\'s built on genuine accountability.', rating: 5 },
]

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--bg)] overflow-x-hidden">
      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--bg-card)]/80 backdrop-blur-lg border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center">
              <Zap size={16} fill="white" color="white" />
            </div>
            <span className="font-bold text-lg text-[var(--text)]" style={{ fontFamily: 'Poppins' }}>CrowdAid</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-[var(--text-muted)]">
            <a href="#features" className="hover:text-[var(--text)] transition-colors">Features</a>
            <a href="#how"      className="hover:text-[var(--text)] transition-colors">How it works</a>
            <a href="#stories"  className="hover:text-[var(--text)] transition-colors">Stories</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login"    className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Sign in</Link>
            <Link to="/register" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-[300px] h-[300px] rounded-full bg-red-500/10 blur-[80px] pointer-events-none" />

        <motion.div
          className="max-w-4xl mx-auto text-center relative"
          variants={stagger} initial="hidden" animate="show"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 text-sm font-medium mb-6 border border-red-100 dark:border-red-800">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Real-time emergency network — live now
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold text-[var(--text)] mb-6 leading-tight" style={{ fontFamily: 'Poppins' }}>
            Help arrives<br />
            <span className="gradient-text">in seconds.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
            CrowdAid connects people in emergencies with verified local volunteers instantly.
            Blood, medical, breakdown, disaster — help is always nearby.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Request Help Now <ArrowRight size={18} />
            </Link>
            <Link
              to="/register?helper=true"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--border)] text-[var(--text)] font-semibold rounded-xl hover:bg-[var(--bg-subtle)] transition-all"
            >
              <Heart size={18} className="text-red-500" /> Become a Helper
            </Link>
          </motion.div>
        </motion.div>

        {/* Live indicator card */}
        <motion.div
          className="max-w-sm mx-auto mt-16 card p-4 flex items-center gap-3"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        >
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center pulse-ring">
            <span className="text-lg">🚨</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text)]">Blood needed urgently</p>
            <p className="text-xs text-[var(--text-muted)]">3 helpers responding · 0.8 km away</p>
          </div>
          <span className="text-xs text-green-500 font-medium whitespace-nowrap">Live ●</span>
        </motion.div>
      </section>

      {/* ── Stats ──────────────────────────────────────── */}
      <section className="py-16 px-4 bg-[var(--primary-dark)]">
        <motion.div
          className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
        >
          {stats.map(s => (
            <motion.div key={s.label} variants={fadeUp} className="text-center">
              <p className="text-4xl font-extrabold text-white" style={{ fontFamily: 'Poppins' }}>{s.value}</p>
              <p className="text-sm text-white/60 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Emergency categories ───────────────────────── */}
      <section className="py-20 px-4" id="how">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-[var(--text)]" style={{ fontFamily: 'Poppins' }}>
              Every emergency, covered.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[var(--text-muted)] mt-3 max-w-xl mx-auto">
              One platform handles all types of emergencies with intelligent category routing.
            </motion.p>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {categories.map(c => (
              <motion.div
                key={c.label} variants={fadeUp}
                className="card card-hover p-5 flex items-center gap-3 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl" style={{ background: c.color }}>
                  {c.icon}
                </div>
                <span className="font-medium text-[var(--text)]">{c.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section className="py-20 px-4 bg-[var(--bg-subtle)]" id="features">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)]" style={{ fontFamily: 'Poppins' }}>Built for speed.</h2>
            <p className="text-[var(--text-muted)] mt-3">Every feature is designed to get help there faster.</p>
          </motion.div>
          <motion.div
            className="grid sm:grid-cols-2 gap-5"
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {features.map(f => (
              <motion.div key={f.title} variants={fadeUp} className="card p-6 flex gap-4 items-start">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
                  <f.icon size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)] mb-1">{f.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────── */}
      <section className="py-20 px-4" id="stories">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)]" style={{ fontFamily: 'Poppins' }}>Real stories.</h2>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-3 gap-5"
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {testimonials.map(t => (
              <motion.div key={t.name} variants={fadeUp} className="card p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-1">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-[var(--text)] text-sm">{t.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center card p-12"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)' }}
          initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins' }}>
            Be the help<br />someone needs today.
          </h2>
          <p className="text-white/70 mb-8">Join thousands of volunteers making their communities safer.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl"
          >
            Join CrowdAid <ChevronRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
              <Zap size={12} fill="white" color="white" />
            </div>
            <span className="font-semibold text-[var(--text)]">CrowdAid</span>
            <span>— Local Emergency Help Network</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-[var(--text)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--text)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--text)] transition-colors">Contact</a>
          </div>
          <p>© 2024 CrowdAid. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
