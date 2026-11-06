import React, { memo } from 'react';
import { CandlestickChart } from './CandlestickChart';
import { Trade, useAppContext } from '../context/AppContext';

interface TradingViewChartProps {
  tvSymbol?: string;
  assetId?: string;
  theme?: 'dark' | 'light';
  interval?: string;
  activeTrades?: Trade[];
  onTradeSignal?: (direction: 'CALL' | 'PUT') => void;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = memo(({
  tvSymbol,
  assetId,
  theme = 'dark',
  interval = '1m',
  activeTrades = [],
  onTradeSignal,
}) => {
  const { currentAsset, assets } = useAppContext();

  const resolvedAssetId = React.useMemo(() => {
    if (assetId) return assetId;
    if (tvSymbol) {
      const clean = tvSymbol.split(':').pop() || 'BTCUSDT';
      const found = assets.find(
        a => a.exchangeSymbol.toUpperCase() === clean.toUpperCase() || a.symbol.replace('/', '').toUpperCase() === clean.toUpperCase()
      );
      if (found) return found.id;
    }
    return currentAsset.id;
  }, [assetId, tvSymbol, assets, currentAsset]);

  const targetAsset = assets.find(a => a.id === resolvedAssetId) || currentAsset;

  const resolvedTimeframe = React.useMemo(() => {
    if (!interval) return '1m';
    if (interval.endsWith('s') || interval.endsWith('m') || interval.endsWith('h') || interval.endsWith('d')) {
      return interval;
    }
    const num = parseInt(interval, 10);
    if (!isNaN(num)) {
      if (num >= 60) return `${Math.floor(num / 60)}h`;
      return `${num}m`;
    }
    return '1m';
  }, [interval]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 flex flex-col select-none min-w-0 max-w-full">
      <CandlestickChart
        assetId={targetAsset.id}
        assetSymbol={targetAsset.symbol}
        assetName={targetAsset.name}
        currentPrice={targetAsset.price}
        timeFrame={resolvedTimeframe}
        chartType="candle"
        activeTrades={activeTrades}
      />
    </div>
  );
});
