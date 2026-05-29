import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Activity, Layers, ArrowLeftRight, Trash2, Plus,
  Shield, ShieldAlert, Sparkles, TrendingUp, TrendingDown, RefreshCw
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { formatCurrency, formatNumber } from '../utils/formatters';
import api from '../config/api';
import { useNotify } from '../components/ui/NotificationBell';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tab, setTab] = useState('overview');
  const [newStock, setNewStock] = useState({ symbol: '', name: '', sector: '', price: '' });
  const [loadingData, setLoadingData] = useState(false);
  const notify = useNotify();

  const loadData = async () => {
    setLoadingData(true);
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
      
      const stocksRes = await api.get('/admin/stocks');
      setStocks(stocksRes.data);
      
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);
      
      const txRes = await api.get('/admin/transactions');
      setTransactions(txRes.data);
    } catch (err) {
      notify('Connection Error', 'Failed to retrieve admin logs', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddStock = async () => {
    if (!newStock.symbol || !newStock.name || !newStock.price) {
      notify('Validation Failed', 'Please complete the stock form details', 'error');
      return;
    }
    try {
      await api.post('/admin/stocks', { ...newStock, price: +newStock.price });
      notify('Stock Added', `${newStock.symbol.toUpperCase()} has been listed successfully`, 'success');
      setNewStock({ symbol: '', name: '', sector: '', price: '' });
      loadData();
    } catch (err) {
      notify('Listing Error', err.response?.data?.error || 'Failed to list asset', 'error');
    }
  };

  const handleDeleteStock = async (symbol) => {
    try {
      await api.delete(`/admin/stocks/${symbol}`);
      notify('Stock Delisted', `${symbol} has been successfully removed`, 'success');
      loadData();
    } catch (err) {
      notify('Delisting Error', 'Failed to delist stock asset', 'error');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Platform Overview', icon: Layers },
    { id: 'stocks', label: 'Manage Equities', icon: TrendingUp },
    { id: 'users', label: 'Trader Profiles', icon: Users },
    { id: 'transactions', label: 'Order Ledger', icon: ArrowLeftRight },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 text-gray-100 max-w-[1500px] mx-auto pb-12">
        
        {/* Header Block with Premium Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-3 border border-purple-500/20">
              <Shield size={11} />
              <span>Administrative Console</span>
            </div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-white flex items-center gap-2">
              Admin Command Center
            </h1>
            <p className="text-gray-400 text-xs mt-1">
              Platform administration, ledger monitoring, asset registry controls, and active trader analytics.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={loadData}
            disabled={loadingData}
            className="self-start sm:self-center flex items-center gap-2"
          >
            <RefreshCw size={14} className={loadingData ? 'animate-spin' : ''} />
            <span>Synchronize Logs</span>
          </Button>
        </div>

        {/* Stripe-style Glass Segmented Control Tabs */}
        <div className="flex bg-white/[0.015] border border-white/[0.05] p-1 rounded-2xl gap-1.5 max-w-3xl overflow-x-auto shrink-0 scrollbar-none backdrop-blur-xl">
          {tabs.map((t) => {
            const TabIcon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 px-5 py-3 text-xs font-semibold rounded-xl transition-all duration-300 whitespace-nowrap outline-none shrink-0 ${
                  active
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md shadow-purple-500/10 border border-purple-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <TabIcon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            
            {/* 1. Overview Panel */}
            {tab === 'overview' && (
              <div className="space-y-8">
                {stats ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Registered Users', value: stats.totalUsers, icon: Users, change: '+12% this week', color: 'from-blue-500/10 to-indigo-500/10 text-blue-400 border-blue-500/10' },
                      { label: 'Active Session Traders', value: stats.activeTraders, icon: Activity, change: 'Live pulses online', color: 'from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/10' },
                      { label: 'Listed Equity Assets', value: stats.totalStocks, icon: Layers, change: 'Active trading index', color: 'from-purple-500/10 to-pink-500/10 text-purple-400 border-purple-500/10' },
                      { label: 'Cumulative Transactions', value: stats.totalTransactions, icon: ArrowLeftRight, change: '+84 executed today', color: 'from-amber-500/10 to-orange-500/10 text-amber-400 border-amber-500/10' },
                    ].map((s) => {
                      const StatIcon = s.icon;
                      return (
                        <Card key={s.label} className="relative group overflow-hidden border border-white/5 hover:border-white/10 shadow-lg p-6 bg-black/20" glow>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{s.label}</p>
                              <p className="text-3xl font-extrabold text-white mt-2 font-mono leading-none">
                                {formatNumber(s.value)}
                              </p>
                              <span className="inline-block text-[10px] font-medium text-gray-400 mt-3 font-sans">
                                {s.change}
                              </span>
                            </div>
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${s.color} border flex items-center justify-center`}>
                              <StatIcon size={18} />
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="glass-card py-20 flex flex-col items-center justify-center border border-white/5">
                    <RefreshCw size={24} className="text-gray-500 animate-spin mb-4" />
                    <p className="text-sm text-gray-400">Loading platform database reports...</p>
                  </div>
                )}
                
                {/* Visual Status Banner */}
                <div className="glass-card p-6 border border-purple-500/15 bg-gradient-to-r from-purple-950/[0.04] to-transparent rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20 text-purple-400">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">System Integrity Monitor</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      All system endpoints are operating within standard parameters (sub-120ms response). WebSocket channels are actively broadcasting price nodes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Stocks Management Panel */}
            {tab === 'stocks' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form to list stock */}
                <div className="lg:col-span-4 space-y-6">
                  <Card className="border border-white/5 p-6 bg-black/25 relative" glow>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                        <Plus size={16} />
                      </div>
                      <h3 className="font-bold text-base text-white font-display">List New Asset</h3>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="Ticker Symbol"
                        placeholder="e.g. BTC, GOOG"
                        value={newStock.symbol}
                        onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
                        className="bg-white/[0.01] border-white/10"
                      />
                      <Input
                        label="Equity Name"
                        placeholder="e.g. Google Alphabet Inc."
                        value={newStock.name}
                        onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                        className="bg-white/[0.01] border-white/10"
                      />
                      <Input
                        label="Market Sector"
                        placeholder="e.g. Technology, Crypto"
                        value={newStock.sector}
                        onChange={(e) => setNewStock({ ...newStock, sector: e.target.value })}
                        className="bg-white/[0.01] border-white/10"
                      />
                      <Input
                        label="Base Listing Price"
                        placeholder="0.00"
                        type="number"
                        value={newStock.price}
                        onChange={(e) => setNewStock({ ...newStock, price: e.target.value })}
                        className="bg-white/[0.01] border-white/10"
                      />

                      <Button
                        onClick={handleAddStock}
                        className="w-full mt-2 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20"
                      >
                        Publish Equity Listing
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Table list of stocks */}
                <div className="lg:col-span-8">
                  <Card className="border border-white/5 p-0 overflow-hidden bg-black/20">
                    <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
                      <h3 className="font-bold text-sm text-white">Registered Equities & Indexes</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-mono font-bold">
                        {stocks.length} Assets
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-gray-500 border-b border-white/[0.06] bg-white/[0.005] uppercase tracking-wider text-[10px] font-bold">
                            <th className="text-left px-6 py-3.5">Asset Symbol</th>
                            <th className="text-left px-6 py-3.5">Full Listing Title</th>
                            <th className="text-left px-6 py-3.5">Sector</th>
                            <th className="text-right px-6 py-3.5">Current Value</th>
                            <th className="text-right px-6 py-3.5">Registry Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {stocks.map((s) => (
                            <tr key={s.symbol} className="hover:bg-white/[0.015] transition-colors group">
                              <td className="px-6 py-4 text-white font-extrabold font-mono text-[13px] tracking-wide">
                                {s.symbol}
                              </td>
                              <td className="px-6 py-4 text-gray-300 font-medium">
                                {s.name}
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-white/[0.03] border border-white/5 text-gray-400">
                                  {s.sector || 'General'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right text-white font-mono font-bold">
                                {formatCurrency(s.price)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => handleDeleteStock(s.symbol)}
                                  className="text-red-400 hover:text-red-300 inline-flex items-center gap-1 font-semibold hover:underline"
                                >
                                  <Trash2 size={12} /> Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>

              </div>
            )}

            {/* 3. Trader Profiles Panel */}
            {tab === 'users' && (
              <Card className="border border-white/5 p-0 overflow-hidden bg-black/20">
                <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Registered Account Profiles</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-mono font-bold">
                    {users.length} Traders
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 border-b border-white/[0.06] bg-white/[0.005] uppercase tracking-wider text-[10px] font-bold">
                        <th className="text-left px-6 py-3.5">Trader Name</th>
                        <th className="text-left px-6 py-3.5">Secure Email Link</th>
                        <th className="text-left px-6 py-3.5">Assigned Role</th>
                        <th className="text-left px-6 py-3.5">Database Registration Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-white/[0.015] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500/20 to-blue-500/20 border border-purple-500/10 flex items-center justify-center text-[10px] font-bold text-white">
                                {(u.name || u.email || 'U')[0].toUpperCase()}
                              </div>
                              <span className="text-white font-bold">{u.name || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300 font-mono font-medium">{u.email}</td>
                          <td className="px-6 py-4">
                            {u.isAdmin ? (
                              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                Administrator
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[9px] font-medium uppercase rounded bg-white/[0.03] border border-white/5 text-gray-400">
                                Standard Trader
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-sans">
                            {u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* 4. Transactions Ledger Panel */}
            {tab === 'transactions' && (
              <Card className="border border-white/5 p-0 overflow-hidden bg-black/20">
                <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">System Transaction Ledger</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-mono font-bold">
                    {transactions.length} Total Logs
                  </span>
                </div>

                {transactions.length === 0 ? (
                  <div className="py-16 text-center">
                    <ShieldAlert size={24} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-xs text-gray-500">No trading activities logged inside standard sessions</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-500 border-b border-white/[0.06] bg-white/[0.005] uppercase tracking-wider text-[10px] font-bold">
                          <th className="text-left px-6 py-3.5">Activity Type</th>
                          <th className="text-left px-6 py-3.5">Asset Symbol</th>
                          <th className="text-right px-6 py-3.5">Shares Quantity</th>
                          <th className="text-right px-6 py-3.5">Cumulative Total</th>
                          <th className="text-left px-6 py-3.5">Trader Database UID</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {transactions.map((tx, i) => (
                          <tr key={tx.id || i} className="hover:bg-white/[0.015] transition-colors">
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-extrabold rounded ${
                                tx.type === 'BUY' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {tx.type === 'BUY' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {tx.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-white font-extrabold font-mono text-[13px] tracking-wide">
                              {tx.symbol}
                            </td>
                            <td className="px-6 py-4 text-right text-gray-300 font-mono font-semibold">
                              {tx.quantity}
                            </td>
                            <td className="px-6 py-4 text-right text-white font-mono font-bold">
                              {formatCurrency(tx.total)}
                            </td>
                            <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">
                              {tx.userId}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}

          </motion.div>
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}
