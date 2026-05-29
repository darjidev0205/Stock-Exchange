import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import api from '../../config/api';
import { formatCurrency, formatPercent, cn } from '../../utils/formatters';

export default function MiniTicker() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    api.get('/stocks/trending').then(({ data }) => setStocks(data.slice(0, 8))).catch(() => {});
    const interval = setInterval(() => {
      api.get('/stocks/trending').then(({ data }) => setStocks(data.slice(0, 8))).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stocks.length) return null;

  const items = [...stocks, ...stocks];

  return (
    <div className="relative overflow-hidden border-b border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-4 py-1.5">
        <span className="shrink-0 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          >
            {items.map((s, i) => {
              const up = s.changePercent >= 0;
              return (
                <span key={`${s.symbol}-${i}`} className="inline-flex items-center gap-2 text-xs">
                  <span className="font-semibold text-gray-300">{s.symbol}</span>
                  <span className="text-gray-400 tabular-nums">{formatCurrency(s.price)}</span>
                  <span className={cn('inline-flex items-center gap-0.5 tabular-nums', up ? 'text-emerald-400' : 'text-red-400')}>
                    {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {formatPercent(s.changePercent)}
                  </span>
                </span>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
