import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight } from 'lucide-react';
import { DashboardLayout } from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import StockRow from '../components/ui/StockRow';
import AreaChartComponent from '../components/charts/AreaChartComponent';
import { fetchPortfolio, fetchTransactions, fetchWatchlist } from '../store/slices/portfolioSlice';
import { fetchStocks, fetchTrending } from '../store/slices/stocksSlice';
import { formatCurrency, formatPercent } from '../utils/formatters';
import api from '../config/api';
import { useWebSocket } from '../hooks/useWebSocket';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const portfolio = useSelector((s) => s.portfolio.data);
  const trending = useSelector((s) => s.stocks.trending);
  const transactions = useSelector((s) => s.portfolio.transactions);
  const watchlist = useSelector((s) => s.portfolio.watchlist);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [marketOverview, setMarketOverview] = useState(null);

  useWebSocket();

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchStocks());
    dispatch(fetchTrending());
    dispatch(fetchTransactions());
    dispatch(fetchWatchlist());
    api.get('/ai/market-overview').then(({ data }) => setMarketOverview(data));
    api.get('/ai/portfolio-suggestions').then(({ data }) => setAiSuggestions(data.slice(0, 3)));
  }, [dispatch]);

  const chartData = Array.from({ length: 30 }, (_, i) => ({
    date: i,
    close: (portfolio?.netWorth || 100000) * (0.95 + i * 0.002 + Math.random() * 0.01),
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here's your market overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Portfolio Value</p>
                <p className="text-2xl font-bold text-white mt-1">{formatCurrency(portfolio?.totalValue || 0)}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <TrendingUp className="text-cyan-400" size={20} />
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Daily P&L</p>
                <p className={`text-2xl font-bold mt-1 ${(portfolio?.dailyPnl || 0) >= 0 ? 'profit' : 'loss'}`}>
                  {formatCurrency(portfolio?.dailyPnl || 0)}
                </p>
              </div>
              {(portfolio?.dailyPnl || 0) >= 0 ? <TrendingUp className="text-emerald-400" size={20} /> : <TrendingDown className="text-red-400" size={20} />}
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total P&L</p>
                <p className={`text-2xl font-bold mt-1 ${(portfolio?.totalPnl || 0) >= 0 ? 'profit' : 'loss'}`}>
                  {formatPercent(portfolio?.totalPnlPercent || 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Wallet Balance</p>
                <p className="text-2xl font-bold text-white mt-1">{formatCurrency(portfolio?.walletBalance || 100000)}</p>
              </div>
              <Wallet className="text-cyan-400" size={20} />
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h3 className="font-semibold text-white mb-4">Portfolio Growth</h3>
            <AreaChartComponent data={chartData} height={280} />
          </Card>

          <Card>
            <h3 className="font-semibold text-white mb-4">AI Suggestions</h3>
            <div className="space-y-3">
              {aiSuggestions.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-sm font-medium text-white">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.description}</p>
                </motion.div>
              ))}
              {aiSuggestions.length === 0 && <p className="text-sm text-gray-500">Loading AI insights...</p>}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Trending Stocks</h3>
              <button onClick={() => navigate('/market')} className="text-xs text-cyan-400 flex items-center gap-1 hover:underline">
                View All <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="space-y-1">
              {trending.map((stock) => (
                <StockRow key={stock.symbol} stock={stock} variant="compact" onClick={(s) => navigate(`/stock/${s.symbol}`)} />
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Recent Transactions</h3>
              <button onClick={() => navigate('/transactions')} className="text-xs text-cyan-400 flex items-center gap-1 hover:underline">
                View All <ArrowUpRight size={12} />
              </button>
            </div>
            {transactions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No transactions yet. Start trading!</p>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, 5).map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5">
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${tx.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{tx.type}</span>
                      <span className="text-sm text-white ml-2">{tx.symbol}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white">{formatCurrency(tx.total)}</p>
                      <p className="text-xs text-gray-500">{tx.quantity} shares</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {marketOverview && (
          <Card>
            <h3 className="font-semibold text-white mb-2">Market Overview</h3>
            <p className="text-sm text-gray-400">{marketOverview.summary}</p>
            <div className="flex gap-4 mt-3 text-xs">
              <span className={`px-3 py-1 rounded-full ${marketOverview.marketSentiment === 'bullish' ? 'bg-emerald-500/20 text-emerald-400' : marketOverview.marketSentiment === 'bearish' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {marketOverview.marketSentiment.toUpperCase()}
              </span>
              <span className="text-gray-500">Avg Change: {formatPercent(marketOverview.avgChange)}</span>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}