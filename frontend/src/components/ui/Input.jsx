import { cn } from '../../utils/formatters';

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-400">{label}</label>}
      <input
        className={cn(
          'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all',
          error && 'border-red-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
