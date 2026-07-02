import { forwardRef, InputHTMLAttributes } from 'react'
import clsx from 'clsx'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, icon, className, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-[var(--text)]">{label}</label>}
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)]',
          'px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-light)]',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all duration-150',
          icon && 'pl-10',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
  </div>
))
Input.displayName = 'Input'
export default Input
