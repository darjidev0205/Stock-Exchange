import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/formatters';

export function TradeActions({
  onBuy,
  onSell,
  buyLabel = 'Buy',
  sellLabel = 'Sell',
  className,
  size = 'md',
  variant = 'glass',
}) {
  const sizeClasses = {
    sm: 'min-h-[44px] px-5 py-2.5 text-sm gap-2',
    md: 'min-h-[52px] px-6 py-3 text-sm gap-2',
    lg: 'min-h-[56px] px-8 py-3.5 text-base gap-2.5',
  };

  const base =
    'inline-flex flex-1 items-center justify-center font-semibold rounded-2xl whitespace-nowrap transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e17]';

  const variants = {
    glass: {
      buy: 'glass bg-emerald-500/10 border border-emerald-400/25 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/40 shadow-lg shadow-emerald-500/5 focus-visible:ring-emerald-400/50',
      sell: 'glass bg-rose-500/10 border border-rose-400/25 text-rose-400 hover:bg-rose-500/20 hover:border-rose-400/40 shadow-lg shadow-rose-500/5 focus-visible:ring-rose-400/50',
    },
    solid: {
      buy: 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/25 focus-visible:ring-emerald-400',
      sell: 'bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-500/25 focus-visible:ring-rose-400',
    },
  };

  const styles = variants[variant] || variants.glass;

  return (
    <div className={cn('flex w-full gap-3', className)}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBuy}
        className={cn(base, sizeClasses[size], styles.buy)}
      >
        <TrendingUp size={size === 'lg' ? 20 : 18} strokeWidth={2.5} />
        {buyLabel}
      </motion.button>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSell}
        className={cn(base, sizeClasses[size], styles.sell)}
      >
        <TrendingDown size={size === 'lg' ? 20 : 18} strokeWidth={2.5} />
        {sellLabel}
      </motion.button>
    </div>
  );
}

export default TradeActions;
