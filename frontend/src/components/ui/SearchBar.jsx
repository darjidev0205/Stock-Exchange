import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { searchStocks, clearSearch } from '../../store/slices/stocksSlice';
import { formatCurrency, cn } from '../../utils/formatters';

export default function SearchBar({ className }) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const results = useSelector((s) => s.stocks.searchResults);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 1) dispatch(searchStocks(query));
      else dispatch(clearSearch());
    }, 300);
    return () => clearTimeout(timer);
  }, [query, dispatch]);

  useEffect(() => {
    if (!expanded) return;

    inputRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') closeSearch();
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [expanded]);

  const closeSearch = () => {
    setExpanded(false);
    setQuery('');
    dispatch(clearSearch());
  };

  const selectStock = (symbol) => {
    navigate(`/stock/${symbol}`);
    closeSearch();
  };

  const showResults = query.length >= 1;

  return (
    <>
      {/* Collapsed — minimal glass icon trigger */}
      <button
        type="button"
        onClick={() => setExpanded(true)}
        aria-label="Search stocks"
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl glass',
          'text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30',
          'transition-all duration-200 shrink-0',
          className
        )}
      >
        <Search size={18} strokeWidth={2} />
      </button>

      {/* Expanded overlay — portal so it sits above everything */}
      {createPortal(
        <AnimatePresence>
          {expanded && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md"
                onClick={closeSearch}
              />

              <motion.div
                initial={{ opacity: 0, y: -16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="fixed inset-x-0 top-0 z-[101] flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none"
              >
                <div
                  ref={panelRef}
                  className="w-full max-w-xl pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="glass-card p-3 sm:p-4 neon-glow shadow-2xl">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 min-w-0">
                        <Search
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                          size={17}
                        />
                        <input
                          ref={inputRef}
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search stocks by symbol or name..."
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30 transition-all"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={closeSearch}
                        aria-label="Close search"
                        className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl glass text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {showResults && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 pt-2 border-t border-white/10 max-h-[50vh] sm:max-h-72 overflow-y-auto">
                            {results.length === 0 ? (
                              <p className="text-sm text-gray-500 text-center py-6">No stocks found</p>
                            ) : (
                              results.map((stock) => (
                                <button
                                  key={stock.symbol}
                                  type="button"
                                  onClick={() => selectStock(stock.symbol)}
                                  className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                                >
                                  <div className="min-w-0">
                                    <span className="font-semibold text-white">{stock.symbol}</span>
                                    <span className="text-xs text-gray-500 ml-2 truncate">{stock.name}</span>
                                  </div>
                                  <span className="text-sm text-gray-300 tabular-nums shrink-0">
                                    {formatCurrency(stock.price)}
                                  </span>
                                </button>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!showResults && (
                      <p className="text-xs text-gray-600 mt-2.5 px-1">
                        Type to search · Press Esc to close
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
