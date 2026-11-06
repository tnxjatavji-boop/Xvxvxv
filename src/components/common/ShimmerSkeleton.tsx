import React from 'react';

interface ShimmerSkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: string;
  dark?: boolean;
}

export const ShimmerSkeleton: React.FC<ShimmerSkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = 'rounded-md',
  dark = false,
}) => {
  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;

  return (
    <div
      className={`shimmer-wave ${dark ? 'bg-slate-800/80 shimmer-wave-dark' : 'bg-slate-200/80'} ${rounded} ${className}`}
      style={style}
    />
  );
};

// -------------------------------------------------------------
// CHART SKELETON (Displays during chart loading / asset switch)
// -------------------------------------------------------------
export const ChartSkeleton: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  return (
    <div className={`w-full h-full relative overflow-hidden flex flex-col select-none ${
      isDark ? 'bg-[#0b1118]' : 'bg-slate-50'
    }`}>
      {/* Top Header Mock */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <ShimmerSkeleton width={32} height={32} rounded="rounded-full" dark={isDark} />
          <div className="space-y-1">
            <ShimmerSkeleton width={90} height={12} dark={isDark} />
            <ShimmerSkeleton width={50} height={9} dark={isDark} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShimmerSkeleton width={48} height={20} rounded="rounded-lg" dark={isDark} />
          <ShimmerSkeleton width={65} height={20} rounded="rounded-lg" dark={isDark} />
        </div>
      </div>

      {/* Main Chart Canvas Simulator with Shimmering Grid & Candles */}
      <div className="flex-1 relative p-4 flex items-end justify-between gap-2 overflow-hidden">
        {/* Background Grid Lines Mock */}
        <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 opacity-40 pointer-events-none">
          <div className="w-full border-b border-dashed border-gray-300 dark:border-slate-700" />
          <div className="w-full border-b border-dashed border-gray-300 dark:border-slate-700" />
          <div className="w-full border-b border-dashed border-gray-300 dark:border-slate-700" />
          <div className="w-full border-b border-dashed border-gray-300 dark:border-slate-700" />
        </div>

        {/* Mock Candle Sticks with Shimmer */}
        {[
          { h: '45%', col: '#00b067' },
          { h: '55%', col: '#00b067' },
          { h: '35%', col: '#ff3b30' },
          { h: '60%', col: '#00b067' },
          { h: '70%', col: '#00b067' },
          { h: '50%', col: '#ff3b30' },
          { h: '65%', col: '#00b067' },
          { h: '40%', col: '#ff3b30' },
          { h: '75%', col: '#00b067' },
          { h: '85%', col: '#00b067' },
          { h: '65%', col: '#ff3b30' },
          { h: '80%', col: '#00b067' },
          { h: '90%', col: '#00b067' },
          { h: '70%', col: '#ff3b30' },
          { h: '85%', col: '#00b067' },
        ].map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative z-10">
            {/* Upper Wick */}
            <div className={`w-[1px] h-3 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
            {/* Candle Body */}
            <div
              className="w-full max-w-[14px] rounded-xs shimmer-wave"
              style={{
                height: item.h,
                backgroundColor: isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(203, 213, 225, 0.8)',
              }}
            />
            {/* Lower Wick */}
            <div className={`w-[1px] h-2.5 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
          </div>
        ))}

        {/* Right Price Scale Mock */}
        <div className="w-14 h-full border-l border-gray-100/60 dark:border-slate-800/60 flex flex-col justify-between py-4 pl-2 shrink-0">
          <ShimmerSkeleton width={42} height={10} dark={isDark} />
          <ShimmerSkeleton width={42} height={10} dark={isDark} />
          <ShimmerSkeleton width={42} height={10} dark={isDark} />
          <ShimmerSkeleton width={42} height={10} dark={isDark} />
        </div>
      </div>

      {/* Floating Pulse Status Indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-full shadow-lg border border-gray-200/80 dark:border-slate-700">
        <span className="w-2 h-2 rounded-full bg-[#0088cc] animate-ping" />
        <span className="text-[11px] font-black tracking-wider uppercase text-gray-700 dark:text-gray-200">
          Syncing Live Feed
        </span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// ASSET LIST SKELETON (Displays during search or category fetch)
// -------------------------------------------------------------
export const AssetListSkeleton: React.FC<{ rows?: number }> = ({ rows = 8 }) => {
  return (
    <div className="w-full divide-y divide-gray-100 select-none">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[minmax(0,1.9fr)_minmax(72px,1fr)_minmax(56px,0.8fr)_36px] items-center gap-2 px-3.5 sm:px-4 py-3"
        >
          {/* Asset Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <ShimmerSkeleton width={36} height={36} rounded="rounded-full" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <ShimmerSkeleton width="75%" height={12} rounded="rounded" />
              <ShimmerSkeleton width="45%" height={9} rounded="rounded" />
            </div>
          </div>

          {/* Live Price */}
          <div className="flex flex-col items-end gap-1">
            <ShimmerSkeleton width={58} height={12} rounded="rounded" />
            <ShimmerSkeleton width={36} height={9} rounded="rounded" />
          </div>

          {/* Profit % / Leverage */}
          <div className="flex justify-center">
            <ShimmerSkeleton width={46} height={22} rounded="rounded-md" />
          </div>

          {/* Fav / Action */}
          <div className="flex justify-end">
            <ShimmerSkeleton width={18} height={18} rounded="rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

// -------------------------------------------------------------
// DEALS LIST SKELETON (Displays in Deals Screen during tab sync)
// -------------------------------------------------------------
export const DealsListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="w-full divide-y divide-gray-100 select-none p-2 space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-3.5 rounded-xl border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShimmerSkeleton width={30} height={30} rounded="rounded-full" />
              <div className="space-y-1">
                <ShimmerSkeleton width={80} height={12} rounded="rounded" />
                <ShimmerSkeleton width={50} height={9} rounded="rounded" />
              </div>
            </div>
            <ShimmerSkeleton width={60} height={18} rounded="rounded-lg" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-50">
            <ShimmerSkeleton height={10} rounded="rounded" />
            <ShimmerSkeleton height={10} rounded="rounded" />
            <ShimmerSkeleton height={10} rounded="rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

// -------------------------------------------------------------
// PAGE TRANSITION SKELETON (Full-screen perceived performance)
// -------------------------------------------------------------
export const PageTransitionSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col bg-slate-50 overflow-hidden select-none">
      {/* Top Header Mock */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShimmerSkeleton width={32} height={32} rounded="rounded-full" />
          <ShimmerSkeleton width={110} height={16} rounded="rounded" />
        </div>
        <ShimmerSkeleton width={28} height={28} rounded="rounded-full" />
      </div>

      {/* Hero Card / Metric Banner Mock */}
      <div className="p-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-2xs space-y-3">
          <div className="flex justify-between items-center">
            <ShimmerSkeleton width={90} height={12} rounded="rounded" />
            <ShimmerSkeleton width={50} height={16} rounded="rounded-full" />
          </div>
          <ShimmerSkeleton width={140} height={26} rounded="rounded" />
          <div className="grid grid-cols-2 gap-2 pt-2">
            <ShimmerSkeleton height={36} rounded="rounded-xl" />
            <ShimmerSkeleton height={36} rounded="rounded-xl" />
          </div>
        </div>
      </div>

      {/* Rows Mock */}
      <div className="flex-1 px-4 space-y-2.5 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShimmerSkeleton width={32} height={32} rounded="rounded-xl" />
              <div className="space-y-1">
                <ShimmerSkeleton width={95} height={12} rounded="rounded" />
                <ShimmerSkeleton width={60} height={9} rounded="rounded" />
              </div>
            </div>
            <ShimmerSkeleton width={50} height={14} rounded="rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
