/**
 * TradeXora Centralized Asset Registry
 * Maps all 187 assets to their respective IDs, symbols, display names, categories,
 * local SVG/WebP icon file paths, and market data identifiers.
 */

export interface MasterAssetEntry {
  id: string;
  name: string;
  symbol: string;
  category: "Currencies" | "Crypto" | "Stocks" | "Commodities" | "Indices";
  subCategory?: string;
  iconPath: string;
  marketDataId: string;
  profitMargin: number;
  basePrice: number;
  change: number;
  isMetal?: boolean;
  isAvailable: boolean;
}

import { BINARY_ASSET_REGISTRY } from './data/binaryAssetRegistry';

export const getAssetIconPath = (symbol: string, category: string): string => {
  const sym = (symbol || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (category === 'Crypto') {
    return `https://assets.coincap.io/assets/icons/${sym.toLowerCase()}@2x.png`;
  }
  if (category === 'Currencies') {
    const base = sym.slice(0, 3).toLowerCase();
    return `https://flagcdn.com/w160/${base === 'usd' ? 'us' : base === 'eur' ? 'eu' : base === 'gbp' ? 'gb' : base === 'jpy' ? 'jp' : base === 'aud' ? 'au' : base === 'cad' ? 'ca' : base === 'chf' ? 'ch' : base === 'nzd' ? 'nz' : base === 'inr' ? 'in' : 'us'}.png`;
  }
  if (category === 'Stocks') {
    if (sym === 'KO') return 'https://s3-symbol-logo.tradingview.com/coca-cola--big.svg';
    if (sym === 'AAPL') return 'https://s3-symbol-logo.tradingview.com/apple--big.svg';
    if (sym === 'MSFT') return 'https://s3-symbol-logo.tradingview.com/microsoft--big.svg';
    if (sym === 'AMZN') return 'https://s3-symbol-logo.tradingview.com/amazon--big.svg';
    if (sym === 'GOOGL' || sym === 'GOOG') return 'https://s3-symbol-logo.tradingview.com/alphabet--big.svg';
    if (sym === 'TSLA') return 'https://s3-symbol-logo.tradingview.com/tesla--big.svg';
    if (sym === 'NFLX') return 'https://s3-symbol-logo.tradingview.com/netflix--big.svg';
    if (sym === 'NVDA') return 'https://s3-symbol-logo.tradingview.com/nvidia--big.svg';
    if (sym === 'AMD') return 'https://s3-symbol-logo.tradingview.com/advanced-micro-devices--big.svg';
    if (sym === 'BABA') return 'https://s3-symbol-logo.tradingview.com/alibaba--big.svg';
    if (sym === 'PYPL') return 'https://s3-symbol-logo.tradingview.com/paypal--big.svg';
    if (sym === 'META') return 'https://s3-symbol-logo.tradingview.com/meta-platforms--big.svg';
    return `https://logo.clearbit.com/${sym.toLowerCase()}.com?size=128`;
  }
  if (category === 'Commodities') {
    if (sym.includes('GOLD') || sym === 'XAU' || sym === 'XAUEUR') return 'https://s3-symbol-logo.tradingview.com/metal/gold--600.png';
    if (sym.includes('SILV') || sym === 'XAG' || sym === 'XAGEUR') return 'https://s3-symbol-logo.tradingview.com/metal/silver--600.png';
    if (sym.includes('PLAT') || sym === 'XPT') return 'https://s3-symbol-logo.tradingview.com/metal/platinum--600.png';
    if (sym.includes('PALL') || sym === 'XPD') return 'https://s3-symbol-logo.tradingview.com/metal/palladium--600.png';
    if (sym.includes('NICK') || sym === 'NIC') return 'https://s3-symbol-logo.tradingview.com/metal/nickel--600.png';
    if (sym.includes('COPP') || sym === 'HG') return 'https://s3-symbol-logo.tradingview.com/metal/copper--600.png';
    if (sym.includes('ALUM') || sym === 'ALU') return 'https://s3-symbol-logo.tradingview.com/metal/aluminum--600.png';
    if (sym.includes('ZINC') || sym === 'ZNC') return 'https://s3-symbol-logo.tradingview.com/metal/zinc--600.png';
    if (sym.includes('LEAD') || sym === 'LED' || sym === 'PB') return 'https://s3-symbol-logo.tradingview.com/metal/lead--600.png';
    if (sym.includes('TIN') || sym === 'SN') return 'https://s3-symbol-logo.tradingview.com/metal/tin--600.png';
    if (sym.includes('BRENT')) return 'https://s3-symbol-logo.tradingview.com/crude-oil--big.svg';
    if (sym.includes('WTI') || sym.includes('OIL') || sym.includes('CRUDE')) return 'https://s3-symbol-logo.tradingview.com/crude-oil--big.svg';
    if (sym.includes('GAS') || sym === 'NG') return 'https://s3-symbol-logo.tradingview.com/natural-gas--big.svg';
    if (sym.includes('WHEAT')) return 'https://s3-symbol-logo.tradingview.com/wheat--big.svg';
    if (sym.includes('COFFEE')) return 'https://s3-symbol-logo.tradingview.com/coffee--big.svg';
    if (sym.includes('COCOA')) return 'https://s3-symbol-logo.tradingview.com/cocoa--big.svg';
    if (sym.includes('SUGAR')) return 'https://s3-symbol-logo.tradingview.com/sugar--big.svg';
    if (sym.includes('CORN')) return 'https://s3-symbol-logo.tradingview.com/corn--big.svg';
    if (sym.includes('COTTON')) return 'https://s3-symbol-logo.tradingview.com/cotton--big.svg';
    return 'https://s3-symbol-logo.tradingview.com/metal/gold--600.png';
  }
  if (category === 'Indices') {
    return `https://logo.clearbit.com/${sym.toLowerCase()}.com?size=128`;
  }
  return `https://logo.clearbit.com/tradexora.com?size=128`;
};

export const MASTER_ASSET_REGISTRY: MasterAssetEntry[] = BINARY_ASSET_REGISTRY.map((item, index) => {
  const isMetal = item.isMetal || ['XAU', 'XAG', 'XPT', 'XPD', 'HG', 'ALU', 'ZNC', 'NIC'].includes(item.symbol.toUpperCase());
  return {
    id: item.id || String(index + 1),
    name: item.name,
    symbol: item.symbol,
    category: item.category,
    subCategory: isMetal ? 'Metals' : item.category,
    iconPath: getAssetIconPath(item.symbol, item.category),
    marketDataId: item.symbol.toLowerCase(),
    profitMargin: item.profitMargin ?? 0.88,
    basePrice: item.price ?? 100,
    change: item.change ?? 0,
    isMetal,
    isAvailable: true,
  };
});

export const TOTAL_MASTER_ASSETS = MASTER_ASSET_REGISTRY.length;

export const findAssetBySymbolOrId = (query: string): MasterAssetEntry | undefined => {
  const q = query.toLowerCase().trim();
  return MASTER_ASSET_REGISTRY.find(a => a.id.toLowerCase() === q || a.symbol.toLowerCase() === q || a.name.toLowerCase() === q);
};
