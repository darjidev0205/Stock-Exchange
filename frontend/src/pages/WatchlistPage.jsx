import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import StockRow from '../components/ui/StockRow';
import { fetchWatchlist } from '../store/slices/portfolioSlice';
import { useWebSocket } from '../hooks/useWebSocket';

export default function WatchlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const watchlist = useSelector((s) => s.portfolio.watchlist);

  useWebSocket();

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Watchlist</h1>
          <p className="text-gray-500 text-sm">Your bookmarked stocks</p>
        </div>

        <Card>
          {watchlist.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No stocks in your watchlist</p>
              <button onClick={() => navigate('/market')} className="text-cyan-400 text-sm hover:underline">Browse Market →</button>
            </div>
          ) : (
            watchlist.map((stock) => (
              <StockRow key={stock.symbol} stock={stock} variant="compact" onClick={(s) => navigate(`/stock/${s.symbol}`)} />
            ))
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
