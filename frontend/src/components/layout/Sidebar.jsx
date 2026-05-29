import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Briefcase, TrendingUp, Star, Newspaper,
  Brain, ArrowLeftRight, Settings, Shield, LogOut, Menu, X,
  Sun, Moon, ChevronLeft, ChevronRight, Bot, Radio,
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';
import SidebarNavItem from './SidebarNavItem';
import SearchBar from '../ui/SearchBar';
import NotificationBell from '../ui/NotificationBell';
import MiniTicker from './MiniTicker';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/portfolio', icon: Briefcase, label: 'Portfolio' },
  { to: '/market', icon: TrendingUp, label: 'Market' },
  { to: '/watchlist', icon: Star, label: 'Watchlist' },
  { to: '/news', icon: Newspaper, label: 'News' },
  { to: '/ai-insights', icon: Brain, label: 'AI Insights' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

function SidebarAction({ collapsed, icon: Icon, label, onClick, danger }) {
  const [tip, setTip] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => collapsed && setTip(true)} onMouseLeave={() => setTip(false)}>
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center w-full h-12 rounded-xl transition-all mx-3 ${
          collapsed ? 'justify-center max-w-[calc(100%-24px)]' : 'gap-3.5 px-4'
        } ${danger ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
      >
        <Icon size={20} className="shrink-0" />
        {!collapsed && <span className="text-sm font-semibold tracking-wide">{label}</span>}
      </button>
      {collapsed && (
        <div className={`pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-[100] px-2.5 py-1.5 rounded-lg glass text-xs font-medium text-white whitespace-nowrap transition-all duration-150 ${tip ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {label}
        </div>
      )}
    </div>
  );
}

function SidebarContent({ forceExpanded = false, onNavigate }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const theme = useSelector((s) => s.theme.mode);
  const { collapsed, toggleCollapsed } = useSidebar();
  const isCollapsed = forceExpanded ? false : collapsed;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    onNavigate?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center h-14 shrink-0 border-b border-white/[0.06] px-3 gap-1">
        <NavLink to="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/20 flex items-center justify-center">
            <TrendingUp size={18} className="text-cyan-400" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 overflow-hidden"
              >
                <p className="text-sm font-bold neon-text leading-tight truncate">NexTrade AI</p>
                <p className="text-[10px] text-gray-500 truncate">Trading Platform</p>
              </motion.div>
            )}
          </AnimatePresence>
        </NavLink>
        {!forceExpanded && (
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex w-7 h-7 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-white/5 transition-all"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* Market status */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-2">
              <Radio size={12} className="text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium text-emerald-400">Markets Open</span>
              <span className="text-[10px] text-gray-600 ml-auto tabular-nums">NY · Live</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Quick Action */}
      <div className="px-3 mt-3">
        <NavLink
          to="/ai-insights"
          onClick={onNavigate}
          title={isCollapsed ? 'AI Assistant' : undefined}
          className={({ isActive }) =>
            `flex items-center rounded-xl h-12 transition-all duration-200 mx-0 ${
              isCollapsed ? 'justify-center' : 'gap-3.5 px-4'
            } ${
              isActive
                ? 'bg-gradient-to-r from-cyan-500/15 to-blue-600/10 text-cyan-400 border border-cyan-500/20'
                : 'bg-white/[0.03] text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5 border border-white/[0.04]'
            }`
          }
        >
          <Bot size={20} className="shrink-0" />
          {!isCollapsed && <span className="text-sm font-semibold tracking-wide">AI Assistant</span>}
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-0.5">
        {!isCollapsed && (
          <p className="px-5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-600">Menu</p>
        )}
        {navItems.map((item) => (
          <SidebarNavItem key={item.to} {...item} collapsed={isCollapsed} onClick={onNavigate} />
        ))}
        {user?.isAdmin && (
          <SidebarNavItem to="/admin" icon={Shield} label="Admin" accent="purple" collapsed={isCollapsed} onClick={onNavigate} />
        )}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/[0.06] p-2 space-y-0.5">
        {!isCollapsed && user && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1 rounded-xl bg-white/[0.02] mx-2">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
              {(user.name || user.email || 'U')[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user.name || 'Trader'}</p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <SidebarAction
          collapsed={isCollapsed}
          icon={theme === 'dark' ? Sun : Moon}
          label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          onClick={() => dispatch(toggleTheme())}
        />
        <SidebarAction
          collapsed={isCollapsed}
          icon={LogOut}
          label="Logout"
          onClick={handleLogout}
          danger
        />
      </div>
    </div>
  );
}

function DesktopSidebar() {
  const { width } = useSidebar();

  return (
    <motion.aside
      initial={false}
      animate={{ width }}
      transition={{ type: 'spring', stiffness: 400, damping: 35, mass: 0.8 }}
      className="hidden lg:flex flex-col shrink-0 h-screen sticky top-0 z-40 overflow-hidden
        bg-[#0a0e14]/85 backdrop-blur-2xl border-r border-white/[0.06]
        shadow-[4px_0_24px_rgba(0,0,0,0.2)]"
    >
      <SidebarContent />
    </motion.aside>
  );
}

function MobileSidebar() {
  const { mobileOpen, closeMobile } = useSidebar();

  return (
    <AnimatePresence>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeMobile}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="absolute left-0 top-0 h-full w-[260px] bg-[#0a0e14]/95 backdrop-blur-2xl border-r border-white/[0.06] shadow-2xl"
          >
            <button
              onClick={closeMobile}
              className="absolute top-3.5 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            >
              <X size={18} />
            </button>
            <SidebarContent forceExpanded onNavigate={closeMobile} />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

export function MobileMenuButton() {
  const { openMobile } = useSidebar();
  return (
    <button
      type="button"
      onClick={openMobile}
      className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl glass text-gray-400 hover:text-white transition-colors shrink-0"
      aria-label="Open menu"
    >
      <Menu size={20} />
    </button>
  );
}

export function TopBar() {
  const user = useSelector((s) => s.auth.user);

  return (
    <header className="sticky top-0 z-30 shrink-0 bg-[#0a0e14]/60 backdrop-blur-xl border-b border-white/[0.06]">
      <MiniTicker />
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 h-14 min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <MobileMenuButton />
          <div className="hidden sm:block min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              Welcome back, {user?.name?.split(' ')[0] || 'Trader'}
            </p>
            <p className="text-[11px] text-gray-500 truncate">Your portfolio is updating live</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <SearchBar />
          <NotificationBell />
          <div className="hidden md:flex items-center pl-2 border-l border-white/[0.06]">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold">
              {(user?.name || user?.email || 'U')[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#060910] overflow-x-hidden">
        <DesktopSidebar />
        <MobileSidebar />
        <div className="flex-1 flex flex-col min-w-0 w-full transition-[margin] duration-300">
          <TopBar />
          <main className="flex-1 p-4 sm:p-5 lg:p-6 w-full min-w-0">
            <div className="w-full max-w-[1600px] mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DesktopSidebar;
