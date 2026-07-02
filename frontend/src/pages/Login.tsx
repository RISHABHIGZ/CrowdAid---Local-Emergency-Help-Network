import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '../api/auth'
import { useAppDispatch } from '../store'
import { setCredentials } from '../store/authSlice'
import Button from '../components/ui/Button'
import Input  from '../components/ui/Input'

const schema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})
type Form = z.infer<typeof schema>

export default function Login() {
  const dispatch  = useAppDispatch()
  const navigate  = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Form) => {
    try {
      const res = await authApi.login(data)
      dispatch(setCredentials(res.data.data))
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch {
      // Error handled by axios interceptor
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12"
           style={{ background: 'linear-gradient(135deg, #0f2240 0%, #1d4ed8 100%)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center">
            <Zap size={18} fill="white" color="white" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins' }}>CrowdAid</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins' }}>
            Emergency help,<br />always nearby.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            Connect with verified volunteers in seconds. Real-time, location-aware, community-powered.
          </p>
          <div className="mt-8 space-y-3">
            {['50,000+ emergencies handled', '98% response rate', 'Average 90 second response'].map(t => (
              <div key={t} className="flex items-center gap-3 text-white/80 text-sm">
                <div className="w-5 h-5 bg-cyan-400/20 rounded-full flex items-center justify-center">✓</div>
                {t}
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/30 text-sm">© 2024 CrowdAid</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--bg)]">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center">
              <Zap size={16} fill="white" color="white" />
            </div>
            <span className="text-lg font-bold text-[var(--text)]">CrowdAid</span>
          </div>

          <h1 className="text-3xl font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'Poppins' }}>Sign in</h1>
          <p className="text-[var(--text-muted)] mb-8">Good to have you back. Every second counts.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" fullWidth loading={isSubmitting} size="lg" className="mt-2">
              Sign in
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-300">
            <strong>Demo:</strong> admin@crowdaid.com / Admin@123
          </div>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            No account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">Join CrowdAid</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
