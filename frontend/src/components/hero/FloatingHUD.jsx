import { motion } from 'framer-motion';
import { TrendingUp, Brain, Activity } from 'lucide-react';

const tickers = [
  { symbol: 'NVDA', price: '875.28', change: '+1.44%', up: true },
  { symbol: 'AAPL', price: '189.84', change: '+0.66%', up: true },
  { symbol: 'TSLA', price: '248.50', change: '-2.06%', up: false },
];

const metrics = [
  { label: 'AI Signal', value: 'BUY', color: 'text-emerald-400' },
  { label: 'Risk Score', value: '32', color: 'text-cyan-400' },
  { label: 'Volume', value: '58.2M', color: 'text-white' },
];

export default function FloatingHUD() {
  return (
    <div className="hidden lg:flex flex-col gap-4 absolute right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
      {/* Live ticker glass panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="glass-card p-4 w-56 neon-glow border border-cyan-500/20"
      >
        <div className="flex items-center gap-2 mb-3">
          <Activity size={14} className="text-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Live Market</span>
        </div>
        {tickers.map((t, i) => (
          <motion.div
            key={t.symbol}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.15 }}
            className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0"
          >
            <span className="text-sm font-bold text-white">{t.symbol}</span>
            <div className="text-right">
              <span className="text-xs text-gray-300 tabular-nums">${t.price}</span>
              <span className={`text-[10px] ml-2 tabular-nums ${t.up ? 'text-emerald-400' : 'text-red-400'}`}>{t.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* AI analytics panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="glass-card p-4 w-56 border border-emerald-500/15"
      >
        <div className="flex items-center gap-2 mb-3">
          <Brain size={14} className="text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">AI Analytics</span>
        </div>
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between py-1">
            <span className="text-xs text-gray-500">{m.label}</span>
            <span className={`text-sm font-bold ${m.color}`}>{m.value}</span>
          </div>
        ))}
      </motion.div>

      {/* Floating price tag */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="glass-card px-4 py-2 flex items-center gap-2 border border-emerald-500/20 self-end"
      >
        <TrendingUp size={14} className="text-emerald-400" />
        <span className="text-lg font-bold text-white tabular-nums">$124,582</span>
        <span className="text-xs text-emerald-400 font-medium">+12.4%</span>
      </motion.div>
    </div>
  );
}

export function FloatingNumbers() {
  const numbers = ['+2.4%', 'NVDA', '$875', 'AI', '▲', '58M', 'BUY'];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {numbers.map((num, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.4, 0],
            y: [0, -60],
            x: [0, (i % 2 === 0 ? 1 : -1) * 20],
          }}
          transition={{
            duration: 5 + i * 0.8,
            repeat: Infinity,
            delay: i * 1.2,
            ease: 'easeOut',
          }}
          className="absolute text-xs font-mono text-cyan-400/50"
          style={{
            left: `${15 + i * 11}%`,
            top: `${30 + (i % 3) * 18}%`,
          }}
        >
          {num}
        </motion.span>
      ))}
    </div>
  );
}
