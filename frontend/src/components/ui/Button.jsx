import { motion } from 'framer-motion';
import { cn } from '../../utils/formatters';

const variants = {
  primary: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white font-medium shadow-md shadow-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/20 border border-cyan-400/20 hover:from-cyan-400 hover:to-indigo-500',
  secondary: 'bg-white/[0.02] text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20 border border-white/5 backdrop-blur-md',
  danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500 shadow-md shadow-rose-500/10',
  success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-400 hover:to-green-500 shadow-md shadow-emerald-500/10',
  ghost: 'text-gray-400 hover:text-white hover:bg-white/[0.04]',
};

const sizes = {
  sm: 'min-h-[36px] px-4 py-1.5 text-xs rounded-lg',
  md: 'min-h-[44px] px-6 py-2.5 text-sm rounded-xl',
  lg: 'min-h-[50px] px-8 py-3 text-sm rounded-xl font-medium tracking-wide',
};

export default function Button({ children, variant = 'primary', size = 'md', className, loading, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
        'whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
