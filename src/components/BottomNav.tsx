import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Newspaper, 
  Headphones, 
  CandlestickChart, 
  ArrowLeftRight, 
  User 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';

export const BottomNav = () => {
  const location = useLocation();
  const { trades, futuresPositions, tradingMode, accountType } = useAppContext();

  const activeBinaryCount = trades.filter(t => (t.accountType || 'real') === accountType && t.status === 'active').length;
  const activeFuturesCount = futuresPositions.filter(p => (p.accountType || 'real') === accountType && p.status === 'open').length;
  const activeCount = tradingMode === 'binary' ? activeBinaryCount : activeFuturesCount;

  const isTradeActive = location.pathname === '/';

  const navTabs = [
    {
      name: 'News',
      label: 'News',
      path: '/news',
      icon: Newspaper,
      isActive: location.pathname === '/news',
      badge: undefined
    },
    {
      name: 'Support',
      label: 'Support',
      path: '/help',
      icon: Headphones,
      isActive: location.pathname === '/help' || location.pathname === '/support',
      badge: undefined
    },
    {
      name: 'Trade',
      label: 'Trade',
      path: '/',
      icon: CandlestickChart,
      isActive: isTradeActive,
      isTrade: true,
      badge: undefined
    },
    {
      name: 'Deals',
      label: 'Deals',
      path: '/deals',
      icon: ArrowLeftRight,
      isActive: location.pathname === '/deals',
      badge: activeCount
    },
    {
      name: 'Profile',
      label: 'Profile',
      path: '/me',
      icon: User,
      isActive: location.pathname === '/me',
      badge: undefined
    }
  ];

  return (
    <nav
      aria-label="Bottom Platform Navigation"
      className="w-full bg-white/98 backdrop-blur-md border-t border-slate-200/70 pb-[max(env(safe-area-inset-bottom,0px),4px)] pt-1 flex items-center justify-center z-50 shrink-0 select-none shadow-[0_-2px_8px_rgba(0,0,0,0.02)] relative overflow-hidden"
    >
      <div className="w-full max-w-lg mx-auto flex items-center justify-between px-2 sm:px-3">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.isActive;

          return (
            <Link
              key={tab.name}
              to={tab.path}
              onClick={() => {
                if (!isActive) triggerHaptic(tab.isTrade ? 'medium' : 'light');
              }}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 cursor-pointer select-none group active:scale-95",
                isActive ? "text-[#0088cc]" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <motion.div
                animate={{ scale: isActive ? (tab.isTrade ? 1.06 : 1.04) : 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="relative flex items-center justify-center"
              >
                <Icon
                  className={cn(
                    tab.isTrade ? "w-[22px] h-[22px]" : "w-[20px] h-[20px]",
                    "transition-all duration-150"
                  )}
                  strokeWidth={isActive ? (tab.isTrade ? 2.3 : 2.2) : 1.9}
                />

                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-black rounded-full min-w-[15px] h-[15px] px-0.5 flex items-center justify-center border-2 border-white leading-none shadow-2xs pointer-events-none">
                    {tab.badge}
                  </span>
                )}
              </motion.div>

              <span
                className={cn(
                  "text-[10px] mt-0.5 tracking-tight leading-none transition-colors",
                  isActive ? "font-bold text-[#0088cc]" : "font-medium text-slate-500 group-hover:text-slate-800"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
