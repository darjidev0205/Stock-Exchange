import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import PortfolioPieChart from '../components/charts/PortfolioPieChart';
import { fetchPortfolio } from '../store/slices/portfolioSlice';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function PortfolioPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const portfolio = useSelector((s) => s.portfolio.data);

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-gray-500 text-sm">Track your investments and performance</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card glow>
            <p className="text-sm text-gray-500">Net Worth</p>
            <p className="text-3xl font-bold text-white mt-1">{formatCurrency(portfolio?.netWorth || 0)}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Total Invested</p>
            <p className="text-3xl font-bold text-white mt-1">{formatCurrency(portfolio?.totalInvested || 0)}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Total P&L</p>
            <p className={`text-3xl font-bold mt-1 ${(portfolio?.totalPnl || 0) >= 0 ? 'profit' : 'loss'}`}>
              {formatCurrency(portfolio?.totalPnl || 0)} ({formatPercent(portfolio?.totalPnlPercent || 0)})
            </p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h3 className="font-semibold text-white mb-4">Holdings</h3>
            {!portfolio?.holdings?.length ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No holdings yet</p>
                <button onClick={() => navigate('/market')} className="text-cyan-400 text-sm hover:underline">Browse Market →</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-white/5">
                      <th className="text-left py-3 px-2">Stock</th>
                      <th className="text-right py-3 px-2">Qty</th>
                      <th className="text-right py-3 px-2">Avg Price</th>
                      <th className="text-right py-3 px-2">Current</th>
                      <th className="text-right py-3 px-2">Value</th>
                      <th className="text-right py-3 px-2">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.holdings.map((h) => (
                      <tr key={h.symbol} onClick={() => navigate(`/stock/${h.symbol}`)} className="border-b border-white/5 hover:bg-white/5 cursor-pointer">
                        <td className="py-3 px-2">
                          <p className="font-semibold text-white">{h.symbol}</p>
                          <p className="text-xs text-gray-500">{h.name}</p>
                        </td>
                        <td className="text-right py-3 px-2 text-gray-300">{h.quantity}</td>
                        <td className="text-right py-3 px-2 text-gray-300">{formatCurrency(h.avgPrice)}</td>
                        <td className="text-right py-3 px-2 text-white">{formatCurrency(h.currentPrice)}</td>
                        <td className="text-right py-3 px-2 text-white">{formatCurrency(h.value)}</td>
                        <td className={`text-right py-3 px-2 font-medium ${h.pnl >= 0 ? 'profit' : 'loss'}`}>
                          {formatCurrency(h.pnl)} ({formatPercent(h.pnlPercent)})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card>
            <h3 className="font-semibold text-white mb-4">Sector Allocation</h3>
            <PortfolioPieChart data={portfolio?.sectorAllocation || {}} />
            <div className="mt-4 space-y-2">
              {Object.entries(portfolio?.sectorAllocation || {}).map(([sector, value]) => (
                <div key={sector} className="flex justify-between text-xs">
                  <span className="text-gray-400">{sector}</span>
                  <span className="text-white">{formatCurrency(value)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
