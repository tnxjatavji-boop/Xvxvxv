export type FuturesCategory = 'Crypto' | 'Forex' | 'Indian' | 'Commodities' | 'US Stocks';

export interface FuturesAsset {
  id: string;
  name: string;
  symbol: string;
  tvSymbol: string; // e.g. BINANCE:BTCUSDT, FX:EURUSD, NSE:NIFTY, TVC:GOLD
  category: FuturesCategory;
  price: number;
  change24h: number;
  leverage: number; // 100X leverage
  minMargin: number;
  maxMargin: number;
  takerFeePercent: number; // e.g. 0.05%
  precision: number;
  currencySymbol: string; // '$', '₹', etc.
}

export interface FuturesPosition {
  id: string;
  assetId: string;
  assetName: string;
  assetSymbol: string;
  tvSymbol: string;
  type: 'LONG' | 'SHORT';
  margin: number;       // Margin deposited in ₹
  leverage: number;     // e.g. 100
  positionSize: number; // margin * leverage in ₹
  entryPrice: number;   // Real price at entry
  currentPrice: number; // Live real-time price
  liquidationPrice: number;
  tradingFee: number;   // e.g. 0.05% of position size
  tpPrice?: number;
  slPrice?: number;
  status: 'open' | 'closed' | 'liquidated';
  accountType: 'real' | 'demo';
  createdAt: number;
  closedAt?: number;
  closePrice?: number;
  pnl: number;          // Net profit or loss in ₹
  pnlPercent: number;   // Return on margin %
}

export interface FuturesOrderRequest {
  assetId: string;
  type: 'LONG' | 'SHORT';
  margin: number;
  leverage: number;
  tpPrice?: number;
  slPrice?: number;
}
