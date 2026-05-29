import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { buyStock, sellStock, fetchTransactions } from '../../store/slices/portfolioSlice';
import { formatCurrency } from '../../utils/formatters';
import { useNotify } from '../ui/NotificationBell';

export default function QuickTradePanel({ stock, onClose, initialMode = 'buy' }) {
  const [mode, setMode] = useState(initialMode);
  const [quantity, setQuantity] = useState('');
  const dispatch = useDispatch();
  const { tradeLoading, data: portfolio } = useSelector((s) => s.portfolio);
  const notify = useNotify();

  const qty = parseInt(quantity) || 0;
  const total = qty * (stock?.price || 0);
  const holding = portfolio?.holdings?.find((h) => h.symbol === stock?.symbol);

  const handleTrade = async () => {
    if (qty <= 0) return;
    try {
      if (mode === 'buy') {
        await dispatch(buyStock({ symbol: stock.symbol, quantity: qty })).unwrap();
        notify('Order Executed', `Bought ${qty} shares of ${stock.symbol}`, 'success');
      } else {
        await dispatch(sellStock({ symbol: stock.symbol, quantity: qty })).unwrap();
        notify('Order Executed', `Sold ${qty} shares of ${stock.symbol}`, 'success');
      }
      dispatch(fetchTransactions());
      setQuantity('');
      onClose?.();
    } catch (err) {
      notify('Trade Failed', err.message || 'Insufficient balance or shares', 'error');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-md glass-card p-5 sm:p-6 rounded-t-2xl sm:rounded-2xl neon-glow max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white text-lg">Quick Trade — {stock?.symbol}</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-2 mb-5 p-1 rounded-full bg-white/5">
            <button
              onClick={() => setMode('buy')}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'buy' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp size={16} /> Buy
            </button>
            <button
              onClick={() => setMode('sell')}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'sell' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25' : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingDown size={16} /> Sell
            </button>
          </div>

          <p className="text-2xl font-bold text-white mb-1 tabular-nums">{formatCurrency(stock?.price)}</p>
          {holding && <p className="text-xs text-gray-500 mb-4">You own {holding.quantity} shares</p>}

          <Input
            type="number"
            label="Quantity"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
          />

          <div className="flex justify-between mt-4 mb-5 text-sm">
            <span className="text-gray-500">Estimated Total</span>
            <span className="font-semibold text-white tabular-nums">{formatCurrency(total)}</span>
          </div>

          <Button
            variant={mode === 'buy' ? 'success' : 'danger'}
            className="w-full !rounded-full"
            size="lg"
            loading={tradeLoading}
            onClick={handleTrade}
          >
            {mode === 'buy' ? 'Buy' : 'Sell'} {stock?.symbol}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
