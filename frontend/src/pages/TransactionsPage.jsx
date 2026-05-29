import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardLayout } from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import { fetchTransactions } from '../store/slices/portfolioSlice';
import { formatCurrency } from '../utils/formatters';

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const transactions = useSelector((s) => s.portfolio.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-gray-500 text-sm">Your complete trade history</p>
        </div>

        <Card>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No transactions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-white/5">
                    <th className="text-left py-3 px-2">Type</th>
                    <th className="text-left py-3 px-2">Symbol</th>
                    <th className="text-right py-3 px-2">Quantity</th>
                    <th className="text-right py-3 px-2">Price</th>
                    <th className="text-right py-3 px-2">Total</th>
                    <th className="text-right py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={tx.id || i} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${tx.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-medium text-white">{tx.symbol}</td>
                      <td className="text-right py-3 px-2 text-gray-300">{tx.quantity}</td>
                      <td className="text-right py-3 px-2 text-gray-300">{formatCurrency(tx.price)}</td>
                      <td className="text-right py-3 px-2 text-white font-medium">{formatCurrency(tx.total)}</td>
                      <td className="text-right py-3 px-2 text-gray-500 text-xs">
                        {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
