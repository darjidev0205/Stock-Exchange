import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardLayout } from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import TradeActions from '../components/ui/TradeActions';
import CandlestickChart from '../components/charts/CandlestickChart';
import QuickTradePanel from '../components/common/QuickTradePanel';
import { fetchStock, fetchHistory } from '../store/slices/stocksSlice';
import { addToWatchlist, removeFromWatchlist, fetchWatchlist } from '../store/slices/portfolioSlice';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';
import { useWebSocket } from '../hooks/useWebSocket';
import api from '../config/api';

const periods = ['1W', '1M', '3M', '1Y'];

export default function StockDetailPage() {
  const { symbol } = useParams();
  const dispatch = useDispatch();
  const stock = useSelector((s) => s.stocks.current);
  const history = useSelector((s) => s.stocks.history);
  const watchlist = useSelector((s) => s.portfolio.watchlist);
  const [period, setPeriod] = useState('1M');
  const [showTrade, setShowTrade] = useState(false);
  const [tradeMode, setTradeMode] = useState('buy');
  const [depth, setDepth] = useState(null);
  const [insight, setInsight] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useWebSocket();

  useEffect(() => {
    dispatch(fetchStock(symbol));
    dispatch(fetchWatchlist());
  }, [dispatch, symbol]);

  useEffect(() => {
    dispatch(fetchHistory({ symbol, period }));
  }, [dispatch, symbol, period]);

  useEffect(() => {
    api.get(`/stocks/${symbol}/depth`).then(({ data }) => setDepth(data));
    api.get(`/ai/insights/${symbol}`).then(({ data }) => setInsight(data));
    api.get(`/ai/predictions/${symbol}`).then(({ data }) => setPrediction(data));
  }, [symbol]);

  const isWatched = watchlist.some((s) => s.symbol === symbol?.toUpperCase());
  const isPositive = (stock?.changePercent || 0) >= 0;

  const toggleWatchlist = () => {
    if (isWatched) dispatch(removeFromWatchlist(symbol));
    else dispatch(addToWatchlist(symbol));
  };

  if (!stock) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-white">{stock.symbol}</h1>
            <button onClick={toggleWatchlist} className="text-gray-500 hover:text-yellow-400 transition-colors p-1">
              <Star size={20} fill={isWatched ? '#facc15' : 'none'} className={isWatched ? 'text-yellow-400' : ''} />
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-0.5 truncate">{stock.name} · {stock.sector}</p>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-2">
            <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{formatCurrency(stock.price)}</p>
            <div className={`flex items-center gap-1 text-sm sm:text-base ${isPositive ? 'profit' : 'loss'}`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="font-medium tabular-nums">{formatCurrency(stock.change)} ({formatPercent(stock.changePercent)})</span>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="flex flex-wrap gap-2 mb-4">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${period === p ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'text-gray-500 hover:bg-white/5'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <CandlestickChart data={history} height={400} />
          <div className="mt-5 pt-5 border-t border-white/10">
            <TradeActions
              variant="glass"
              size="md"
              onBuy={() => { setTradeMode('buy'); setShowTrade(true); }}
              onSell={() => { setTradeMode('sell'); setShowTrade(true); }}
            />
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <h3 className="font-semibold text-white mb-4">Company Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Market Cap</span><span className="text-white">{stock.marketCap}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Volume</span><span className="text-white">{formatNumber(stock.volume)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Sector</span><span className="text-white">{stock.sector}</span></div>
              <p className="text-gray-400 text-xs mt-4 leading-relaxed">{stock.description}</p>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-white mb-4">Market Depth</h3>
            {depth && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-emerald-400 font-medium mb-2">Bids</p>
                  {depth.bids.slice(0, 5).map((b, i) => (
                    <div key={i} className="flex justify-between py-1"><span className="text-emerald-400">{formatCurrency(b.price)}</span><span className="text-gray-500">{b.quantity}</span></div>
                  ))}
                </div>
                <div>
                  <p className="text-red-400 font-medium mb-2">Asks</p>
                  {depth.asks.slice(0, 5).map((a, i) => (
                    <div key={i} className="flex justify-between py-1"><span className="text-red-400">{formatCurrency(a.price)}</span><span className="text-gray-500">{a.quantity}</span></div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card>
            <h3 className="font-semibold text-white mb-4">AI Insight</h3>
            {insight && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${insight.sentiment === 'bullish' ? 'bg-emerald-500/20 text-emerald-400' : insight.sentiment === 'bearish' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {insight.recommendation}
                  </span>
                  <span className="text-xs text-gray-500">Risk: {insight.riskLevel}</span>
                </div>
                <p className="text-sm text-gray-300">{insight.insight}</p>
                <p className="text-xs text-gray-500 italic">{insight.beginnerExplanation}</p>
              </div>
            )}
          </Card>
        </div>

        {prediction && (
          <Card>
            <h3 className="font-semibold text-white mb-4">AI Price Prediction (7-Day)</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {prediction.predictions.map((p) => (
                <div key={p.day} className="text-center p-3 rounded-xl bg-white/5">
                  <p className="text-xs text-gray-500">Day {p.day}</p>
                  <p className="text-sm font-semibold text-white mt-1">{formatCurrency(p.predicted)}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">{prediction.disclaimer}</p>
          </Card>
        )}
      </div>

      {showTrade && <QuickTradePanel stock={stock} initialMode={tradeMode} onClose={() => setShowTrade(false)} />}
    </DashboardLayout>
  );
}
