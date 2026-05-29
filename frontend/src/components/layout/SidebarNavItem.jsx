import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/formatters';

export default function SidebarNavItem({ to, icon: Icon, label, onClick, accent = 'cyan', collapsed = false }) {
  const [showTip, setShowTip] = useState(false);

  const accentStyles = {
    cyan: {
      active: 'bg-cyan-500/10 text-cyan-400',
      glow: 'bg-cyan-400 shadow-[0_0_10px_#00d4ff]',
      hover: 'hover:bg-cyan-500/5 hover:text-cyan-300',
    },
    purple: {
      active: 'bg-purple-500/10 text-purple-400',
      glow: 'bg-purple-400 shadow-[0_0_10px_#a855f7]',
      hover: 'hover:bg-purple-500/5 hover:text-purple-300',
    },
  };
  const a = accentStyles[accent] || accentStyles.cyan;

  return (
    <div
      className="relative"
      onMouseEnter={() => collapsed && setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <NavLink
        to={to}
        onClick={onClick}
        title={collapsed ? label : undefined}
        className={({ isActive }) =>
          cn(
            'group relative flex items-center rounded-xl transition-all duration-200 h-12 mx-3',
            collapsed ? 'justify-center px-0' : 'gap-3.5 px-4',
            isActive ? a.active : cn('text-gray-400 font-medium', a.hover)
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.span
                layoutId="sidebar-active-pip"
                className={cn('absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full', a.glow)}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Icon
              size={21}
              strokeWidth={isActive ? 2.2 : 1.8}
              className={cn('shrink-0', !isActive && 'text-gray-500 group-hover:text-inherit')}
            />
            {!collapsed && (
              <span className="text-sm font-semibold tracking-wide truncate whitespace-nowrap">{label}</span>
            )}
          </>
        )}
      </NavLink>

      {collapsed && (
        <div
          className={cn(
            'pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-[100]',
            'px-2.5 py-1.5 rounded-lg glass text-xs font-medium text-white whitespace-nowrap',
            'transition-all duration-150',
            showTip ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}
        >
          {label}
        </div>
      )}
    </div>
  );
}
