import { formatCurrency, formatPercent, cn } from '../../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StockRow({ stock, onClick, showVolume = false, variant = 'table' }) {
  const isPositive = stock.changePercent >= 0;

  if (variant === 'compact') {
    return (
      <div
        onClick={() => onClick?.(stock)}
        className="flex items-center justify-between gap-3 py-3 px-4 rounded-xl transition-all cursor-pointer hover:bg-white/5 group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-xs font-bold text-cyan-400">
            {stock.symbol.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">{stock.symbol}</p>
            <p className="text-xs text-gray-500 truncate">{stock.name}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-semibold text-white">{formatCurrency(stock.price)}</p>
          <div className={cn('flex items-center gap-1 text-xs font-medium justify-end', isPositive ? 'profit' : 'loss')}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {formatPercent(stock.changePercent)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile card layout */}
      <div
        onClick={() => onClick?.(stock)}
        className="md:hidden flex items-center justify-between gap-3 py-3 px-4 rounded-xl transition-all cursor-pointer hover:bg-white/5 border-b border-white/5 last:border-0 group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-xs font-bold text-cyan-400">
            {stock.symbol.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white group-hover:text-cyan-400">{stock.symbol}</p>
            <p className="text-xs text-gray-500 truncate">{stock.name}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-semibold text-white tabular-nums">{formatCurrency(stock.price)}</p>
          <p className={cn('text-xs font-medium tabular-nums', isPositive ? 'profit' : 'loss')}>
            {formatPercent(stock.changePercent)}
          </p>
          {showVolume && (
            <p className="text-[11px] text-gray-500 tabular-nums">{(stock.volume / 1e6).toFixed(1)}M vol</p>
          )}
        </div>
      </div>

      {/* Desktop table row — columns align with MarketPage header */}
      <div
        onClick={() => onClick?.(stock)}
        className="hidden md:grid md:grid-cols-[minmax(0,2fr)_minmax(90px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)] md:items-center md:gap-4 py-3.5 px-4 rounded-xl transition-all cursor-pointer hover:bg-white/5 group border-b border-white/5 last:border-0"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-[10px] font-bold text-cyan-400">
            {stock.symbol.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">{stock.symbol}</p>
            <p className="text-xs text-gray-500 truncate">{stock.name}</p>
          </div>
        </div>
        <p className="text-right font-semibold text-white tabular-nums">{formatCurrency(stock.price)}</p>
        <p className={cn('text-right font-medium tabular-nums flex items-center justify-end gap-1', isPositive ? 'profit' : 'loss')}>
          {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {formatPercent(stock.changePercent)}
        </p>
        <p className="text-right text-sm text-gray-400 tabular-nums">
          {showVolume ? `${(stock.volume / 1e6).toFixed(1)}M` : '—'}
        </p>
      </div>
    </>
  );
}
