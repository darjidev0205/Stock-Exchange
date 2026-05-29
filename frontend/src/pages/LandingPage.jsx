import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Shield, Zap, BarChart3, Globe, ArrowRight, Sparkles,
  Activity, TrendingUp, TrendingDown, ArrowUpRight, Wallet,
  Calendar, CheckCircle, RefreshCw
} from 'lucide-react';
import Button from '../components/ui/Button';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import HeroChartScene from '../components/hero/HeroChartScene';
import { FloatingNumbers } from '../components/hero/FloatingHUD';

const features = [
  { 
    icon: Brain, 
    title: 'AI-Powered Insights', 
    desc: 'Smart predictive modeling and natural language analysis for every asset in your portfolio.',
    accent: 'from-cyan-500/10 to-blue-500/10 text-cyan-400 border-cyan-500/10'
  },
  { 
    icon: Zap, 
    title: 'Ultra-Low Latency', 
    desc: 'Execute trades in sub-150ms with live pricing streams managed via direct WebSockets.',
    accent: 'from-amber-500/10 to-orange-500/10 text-amber-400 border-amber-500/10'
  },
  { 
    icon: BarChart3, 
    title: 'Advanced Interactive Charts', 
    desc: 'Complete candlestick graphs, dynamic indicators, and predictive price trajectory paths.',
    accent: 'from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/10'
  },
  { 
    icon: Shield, 
    title: 'Institutional Security', 
    desc: 'Bank-grade multi-factor authorization, fully encrypted database layers, and session isolation.',
    accent: 'from-indigo-500/10 to-purple-500/10 text-indigo-400 border-indigo-500/10'
  },
  { 
    icon: Globe, 
    title: 'Global Markets Access', 
    desc: 'Monitor, buy, and sell major equities, index funds, commodities, and currency pairs instantly.',
    accent: 'from-blue-500/10 to-violet-500/10 text-blue-400 border-blue-500/10'
  },
  { 
    icon: Sparkles, 
    title: 'Intelligent Allocation', 
    desc: 'Automated sector rebalancing, dividend tracking, and absolute profit & loss breakdowns.',
    accent: 'from-fuchsia-500/10 to-pink-500/10 text-fuchsia-400 border-fuchsia-500/10'
  },
];

const stats = [
  { value: 50000, suffix: '+', label: 'Active Traders', icon: Globe },
  { value: 2.4, prefix: '$', suffix: 'B', label: 'Daily Trading Volume', decimals: 1, icon: Wallet },
  { value: 99.99, suffix: '%', label: 'System Uptime', decimals: 2, icon: Activity },
  { value: 150, suffix: 'ms', label: 'Average Execution', icon: Zap },
];

const mockTrades = [
  { id: 1, action: 'BUY', asset: 'NVDA', qty: '45', price: '875.28', time: 'Just now' },
  { id: 2, action: 'BUY', asset: 'AAPL', qty: '120', price: '189.84', time: '1s ago' },
  { id: 3, action: 'SELL', asset: 'TSLA', qty: '80', price: '248.50', time: '3s ago' },
  { id: 4, action: 'BUY', asset: 'MSFT', qty: '30', price: '421.90', time: '5s ago' },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('1D');
  const [liveTrades, setLiveTrades] = useState(mockTrades);
  const [currentBtcPrice, setCurrentBtcPrice] = useState(92450.75);

  // Live trading updates simulation
  useEffect(() => {
    const tradeInterval = setInterval(() => {
      const assets = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'COIN', 'NFLX'];
      const prices = { AAPL: 189.84, NVDA: 875.28, TSLA: 248.50, MSFT: 421.90, AMZN: 180.12, COIN: 254.40, NFLX: 612.30 };
      const randomAsset = assets[Math.floor(Math.random() * assets.length)];
      const randomAction = Math.random() > 0.35 ? 'BUY' : 'SELL';
      const randomQty = Math.floor(Math.random() * 150) + 5;
      const basePrice = prices[randomAsset];
      const actualPrice = (basePrice + (Math.random() - 0.5) * (basePrice * 0.01)).toFixed(2);

      const newTrade = {
        id: Date.now(),
        action: randomAction,
        asset: randomAsset,
        qty: randomQty.toString(),
        price: actualPrice,
        time: 'Just now'
      };

      setLiveTrades(prev => [newTrade, ...prev.slice(0, 3)]);
      
      // Update dynamic BTC price
      setCurrentBtcPrice(prev => prev + (Math.random() - 0.49) * 45);
    }, 4500);

    return () => clearInterval(tradeInterval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030712] text-gray-100 overflow-x-hidden fintech-grid">
      
      {/* ── Background Glow Orbits & Lights ── */}
      <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[130px] pointer-events-none animate-slow-pulse z-0" />
      <div className="absolute top-[35%] left-[2%] w-[700px] h-[700px] rounded-full bg-purple-500/3 blur-[150px] pointer-events-none animate-slow-rotate z-0" />
      <div className="absolute bottom-[15%] right-[15%] w-[550px] h-[550px] rounded-full bg-blue-600/4 blur-[130px] pointer-events-none z-0" />
      
      {/* ── Transparent Glass Sticky Navbar ── */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:shadow-cyan-500/20 transition-all duration-300">
              <Brain size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-1">
              NexTrade <span className="text-cyan-400 font-semibold">AI</span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/market" className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200">Markets</Link>
            <Link to="/ai-insights" className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200">AI Insights</Link>
            <Link to="/news" className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200">News Feed</Link>
            <Link to="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200">Terminal</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors duration-200 px-3 py-1.5">
              Login
            </Link>
            <Link to="/register">
              <Button size="sm" className="shadow-cyan-500/10">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section (Split 2-Column Grid) ── */}
      <section className="relative w-full min-h-screen flex items-center pt-24 lg:pt-16 pb-16 z-10">
        
        {/* Cinematic Floating Background Metrics */}
        <FloatingNumbers />

        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Premium Typography & Content */}
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-center text-left">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-6 border border-cyan-500/20 backdrop-blur-md">
                <Sparkles size={13} className="text-cyan-400 animate-pulse" />
                <span>AI-Powered Trading Platform</span>
              </div>

              {/* Bold Modern Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight font-display text-white">
                Trade Smarter with{' '}
                <span className="neon-text">NexTrade AI</span>
              </h1>

              {/* Concise Readable Description */}
              <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
                The next-generation terminal for digital assets and equities. Experience hyper-realistic 3D market depth, live AI analytics, and instant transaction speeds.
              </p>

              {/* Redesigned CTAs */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/register">
                  <Button size="lg" className="flex items-center gap-2 group shadow-lg">
                    Start Trading Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">
                    Sign In to Terminal
                  </Button>
                </Link>
              </div>

              {/* Trusted Industry Row */}
              <div className="pt-8 border-t border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                  POWERING ELITE HIGH-FREQUENCY INVESTORS
                </p>
                <div className="flex items-center gap-6 text-gray-400">
                  <div className="flex items-center gap-1 text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity duration-200">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> Stripe
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity duration-200">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" /> Linear
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity duration-200">
                    <span className="w-2 h-2 rounded-full bg-purple-400" /> Bloomberg
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity duration-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> TradingView
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Realistic Trading Terminal (with nested 3D canvas) */}
          <div className="col-span-12 lg:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="relative w-full"
            >
              
              {/* Floating Portfolio Widget (Top Right) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-3 z-30 glass-card px-4 py-3 flex items-center gap-3 border border-emerald-500/20 backdrop-blur-xl shadow-lg shadow-black/40"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <TrendingUp size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Portfolio Net Worth</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-white font-mono">$124,582.00</span>
                    <span className="text-xs text-emerald-400 font-bold font-mono">+12.4%</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating AI Signal Badge (Bottom Left) */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-8 -left-5 z-30 glass-card px-4 py-3 flex items-center gap-3 border border-cyan-500/20 backdrop-blur-xl shadow-lg shadow-black/40"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Brain size={16} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">AI Signal Stream</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-extrabold text-white font-mono">STRONG BUY</span>
                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1 rounded font-bold font-mono">92%</span>
                  </div>
                </div>
              </motion.div>

              {/* Terminal Frame */}
              <div className="glass-card overflow-hidden border border-white/10 shadow-2xl relative bg-black/45 backdrop-blur-2xl">
                
                {/* Dashboard Tab Bar / Window Controls */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/50" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <span className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <span className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-2">
                      <Activity size={12} className="text-cyan-400 animate-pulse" />
                      <span className="text-xs font-bold text-gray-300 font-mono">BTC / USD TERMINAL</span>
                    </div>
                  </div>

                  {/* Time Intervals Selector */}
                  <div className="flex items-center bg-white/[0.03] p-0.5 rounded-lg border border-white/5">
                    {['1D', '1W', '1M', '1Y', 'ALL'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                          activeTab === tab
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dashboard Meta Details Bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.005]">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Index Value</p>
                      <p className="text-lg font-extrabold text-white font-mono leading-none">
                        ${currentBtcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Change</p>
                      <p className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-0.5 leading-none">
                        <TrendingUp size={11} /> +4.84%
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Volume (24H)</p>
                      <p className="text-xs font-bold text-gray-400 font-mono leading-none">18.42B</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                      BUY
                    </span>
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 rounded">
                      SELL
                    </span>
                  </div>
                </div>

                {/* Contained 3D Candlestick Chart Area */}
                <div className="relative w-full h-[340px] bg-black/20 overflow-hidden">
                  <HeroChartScene />
                </div>

                {/* Live Real-time Activity Ticker (Terminal Footer) */}
                <div className="px-5 py-3.5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-gray-400">
                    <RefreshCw size={12} className="text-cyan-400 animate-spin [animation-duration:12s]" />
                    <span className="text-[10px] tracking-wide uppercase text-gray-500">Live Trade Feeds</span>
                  </div>

                  <div className="w-[70%] overflow-hidden h-5 relative flex items-center">
                    <div className="flex gap-6 whitespace-nowrap absolute right-0 font-mono text-[10px]">
                      <AnimatePresence mode="popLayout">
                        {liveTrades.map((t, idx) => (
                          <motion.span
                            key={t.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 0.75 - idx * 0.2 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="inline-flex items-center gap-1.5"
                          >
                            <span className={t.action === 'BUY' ? 'text-emerald-400' : 'text-red-400 font-medium'}>
                              ● {t.action}
                            </span>
                            <span className="text-white font-bold">{t.asset}</span>
                            <span className="text-gray-400">{t.qty} shares</span>
                            <span className="text-gray-500">${t.price}</span>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>

        {/* Cinematic bottom transition fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#030712] to-transparent z-10 pointer-events-none" />
      </section>

      {/* ── Stats Section (Elegant Horizontal High-Density Cards) ── */}
      <section className="relative py-12 px-6 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8 bg-black/30 border border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/5 group-hover:bg-cyan-500/10 border border-white/5 group-hover:border-cyan-500/10 flex items-center justify-center transition-all duration-300">
                    <StatIcon className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" size={20} />
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight flex items-baseline">
                      <AnimatedCounter 
                        end={stat.value} 
                        prefix={stat.prefix || ''} 
                        suffix={stat.suffix || ''} 
                        decimals={stat.decimals || 0} 
                      />
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5 tracking-wide">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Feature Cards Grid Section ── */}
      <section className="relative py-24 px-6 z-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-semibold mb-4 border border-purple-500/20">
              <Activity size={12} />
              <span>Engineered for Professionals</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight font-display">
              Advanced Tools. Elegant Performance.
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              We design robust data pipelines and present them via visual layers that feel responsive and alive.
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, accent }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="glass-card p-6 border border-white/5 flex flex-col group hover:bg-white/[0.02]"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${accent} border flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105 shadow-inner`}>
                  <Icon size={18} />
                </div>
                
                <h3 className="text-base font-bold text-white mb-2 font-display">{title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed flex-1">{desc}</p>
                
                <div className="mt-4 pt-3 border-t border-white/[0.03] flex items-center justify-end text-[10px] font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <span className="flex items-center gap-1">Read Docs <ArrowUpRight size={12} /></span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Ready to Trade Call To Action Banner ── */}
      <section className="relative py-24 px-6 z-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-10 sm:p-14 text-center relative overflow-hidden bg-gradient-to-br from-black/40 via-cyan-950/[0.06] to-indigo-950/[0.04] border border-cyan-500/10 shadow-lg"
          >
            {/* Fine grid design layer inside CTA banner */}
            <div className="absolute inset-0 fintech-grid opacity-10 pointer-events-none" />
            
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 font-display tracking-tight">
              Ready to Upgrade Your Trading?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
              Create a secure trading account today, experience low-latency WebSocket pricing, and leverage our advanced AI advisor streams.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
              <Link to="/register">
                <Button size="lg" className="shadow-lg">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Explore Docs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Premium Minimal Footer ── */}
      <footer className="border-t border-white/5 py-10 px-6 text-center text-xs text-gray-500 bg-[#02050b] relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p>&copy; 2026 NexTrade AI. All rights reserved. Not financial or investment advice.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors duration-200">Terms of Service</a>
            <a href="#support" className="hover:text-white transition-colors duration-200">System Status</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
