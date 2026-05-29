import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import StockRow from '../components/ui/StockRow';
import { fetchStocks } from '../store/slices/stocksSlice';
import { useWebSocket } from '../hooks/useWebSocket';

export default function MarketPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stocks = useSelector((s) => s.stocks.list);

  useWebSocket();

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full min-w-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Stock Market</h1>
          <p className="text-gray-500 text-sm">Live prices updated in real-time</p>
        </div>

        <Card className="p-0 sm:p-2 overflow-hidden">
          {/* Desktop table header */}
          <div className="hidden md:grid md:grid-cols-[minmax(0,2fr)_minmax(90px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)] md:gap-4 px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider border-b border-white/10 bg-white/[0.02]">
            <span>Stock</span>
            <span className="text-right">Price</span>
            <span className="text-right">Change</span>
            <span className="text-right">Volume</span>
          </div>

          <div className="divide-y divide-white/5 md:divide-y-0">
            {stocks.length === 0 ? (
              <p className="text-center text-gray-500 py-12 text-sm">Loading stocks...</p>
            ) : (
              stocks.map((stock) => (
                <StockRow
                  key={stock.symbol}
                  stock={stock}
                  onClick={(s) => navigate(`/stock/${s.symbol}`)}
                  showVolume
                />
              ))
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
