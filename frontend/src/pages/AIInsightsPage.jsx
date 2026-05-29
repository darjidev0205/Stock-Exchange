import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { DashboardLayout } from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import api from '../config/api';
import { formatPercent } from '../utils/formatters';

export default function AIInsightsPage() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    api.get('/ai/market-overview').then(({ data }) => setOverview(data));
    api.get('/ai/portfolio-suggestions').then(({ data }) => setSuggestions(data));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="text-cyan-400" size={28} /> AI Insights
          </h1>
          <p className="text-gray-500 text-sm">AI-powered market analysis and portfolio recommendations</p>
        </div>

        {overview && (
          <Card glow>
            <h3 className="font-semibold text-white mb-2">Market Sentiment</h3>
            <p className="text-gray-300 mb-4">{overview.summary}</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-1"><TrendingUp size={14} /> Top Gainers</h4>
                {overview.gainers.map((s) => (
                  <div key={s.symbol} onClick={() => navigate(`/stock/${s.symbol}`)} className="flex justify-between py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer">
                    <span className="text-white font-medium">{s.symbol}</span>
                    <span className="profit">{formatPercent(s.changePercent)}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-1"><TrendingDown size={14} /> Top Losers</h4>
                {overview.losers.map((s) => (
                  <div key={s.symbol} onClick={() => navigate(`/stock/${s.symbol}`)} className="flex justify-between py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer">
                    <span className="text-white font-medium">{s.symbol}</span>
                    <span className="loss">{formatPercent(s.changePercent)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {suggestions.map((s, i) => (
            <Card key={i}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  s.priority === 'high' ? 'bg-red-500/10' : s.priority === 'medium' ? 'bg-yellow-500/10' : 'bg-cyan-500/10'
                }`}>
                  <AlertTriangle size={16} className={
                    s.priority === 'high' ? 'text-red-400' : s.priority === 'medium' ? 'text-yellow-400' : 'text-cyan-400'
                  } />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{s.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{s.type}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{s.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
