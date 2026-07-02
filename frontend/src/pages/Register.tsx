import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Phone, Zap, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '../api/auth'
import { useAppDispatch } from '../store'
import { setCredentials } from '../store/authSlice'
import Button from '../components/ui/Button'
import Input  from '../components/ui/Input'

const schema = z.object({
  fullName:          z.string().min(2, 'At least 2 characters'),
  email:             z.email('Invalid email'),
  password:          z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Must contain uppercase, lowercase, digit and special char'),
  phone:             z.string().optional(),
  registerAsHelper:  z.boolean(),
})
type Form = z.infer<typeof schema>

export default function Register() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const isHelper = params.get('helper') === 'true'

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { registerAsHelper: isHelper },
  })

  const asHelper = watch('registerAsHelper')

  const onSubmit = async (data: Form) => {
    try {
      const res = await authApi.register(data)
      dispatch(setCredentials(res.data.data))
      toast.success('Welcome to CrowdAid!')
      navigate('/dashboard')
    } catch { /* handled by interceptor */ }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)]">
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center">
            <Zap size={18} fill="white" color="white" />
          </div>
          <span className="text-xl font-bold text-[var(--text)]" style={{ fontFamily: 'Poppins' }}>CrowdAid</span>
        </div>

        <h1 className="text-3xl font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'Poppins' }}>Create account</h1>
        <p className="text-[var(--text-muted)] mb-8">Join the network. Be ready. Be the help.</p>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { value: false, icon: User,  label: 'I need help',   sub: 'Requester' },
            { value: true,  icon: Heart, label: 'I want to help',sub: 'Helper' },
          ].map(opt => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => setValue('registerAsHelper', opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                asHelper === opt.value
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-[var(--border)] hover:border-blue-300'
              }`}
            >
              <opt.icon size={20} className={asHelper === opt.value ? 'text-blue-600' : 'text-[var(--text-muted)]'} />
              <p className="font-medium text-sm text-[var(--text)] mt-1.5">{opt.label}</p>
              <p className="text-xs text-[var(--text-muted)]">{opt.sub}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full name" placeholder="John Doe" icon={<User size={16} />}
            error={errors.fullName?.message} {...register('fullName')} />
          <Input label="Email" type="email" placeholder="you@example.com" icon={<Mail size={16} />}
            error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" placeholder="Min 8 chars, mixed case + symbol"
            icon={<Lock size={16} />} error={errors.password?.message} {...register('password')} />
          <Input label="Phone (optional)" type="tel" placeholder="+91 9999999999"
            icon={<Phone size={16} />} error={errors.phone?.message} {...register('phone')} />
          <Button type="submit" fullWidth loading={isSubmitting} size="lg">
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
