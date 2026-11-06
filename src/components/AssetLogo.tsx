import React from 'react';
import { matchRealAssetImage, RealAssetImageConfig, getLockedImage, lockImage } from '../utils/assetImages';
import {
  DualFlagBadge,
  USFlag,
  CanadaFlag,
  SwissFlag,
  EUFlag,
  JapanFlag,
  UKFlag,
  GermanyFlag,
  FranceFlag,
  HKFlag,
  BrazilFlag,
  renderCountryFlag
} from './CountryFlags';

interface AssetLogoProps {
  symbol: string;
  name?: string;
  className?: string;
  size?: number;
}

// Clean borderless transparent badge for assets (Zero background)
interface PremiumBadgeProps {
  size: number;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  bgColor?: string;
  rounded?: string;
  border?: string;
  children: React.ReactNode;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = React.memo(({
  size,
  className = '',
  gradientFrom,
  gradientTo,
  bgColor,
  rounded = 'rounded-full',
  border,
  children
}) => {
  const hasBg = Boolean(gradientFrom || bgColor);
  const backgroundStyle = gradientFrom && gradientTo
    ? `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
    : (bgColor || 'transparent');

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none overflow-hidden ${hasBg ? rounded : ''} ${border ? `border ${border}` : ''} ${className}`}
      style={{
        width: size,
        height: size,
        background: backgroundStyle,
      }}
    >
      <div className={`flex items-center justify-center w-full h-full relative z-10 ${hasBg ? 'p-1' : ''}`}>
        {children}
      </div>
    </div>
  );
});

interface CustomLogoConfig {
  web: string;
  secondary?: string;
  local: string;
  bg: string;
  fit?: 'contain' | 'cover';
}

// Dedicated Custom Icon Badge for user-specified high-fidelity asset logos (Zero Background)
interface CustomIconBadgeProps {
  size: number;
  config: CustomLogoConfig;
  alt: string;
  className?: string;
}

// Clean standard ticker text fallback for when network image fails
const renderFallbackLogo = (symOrAlt: string, size: number = 36) => {
  const s = (symOrAlt || '').toUpperCase().trim();
  const fontSize = Math.max(9, Math.min(13, Math.floor(size * 0.28)));
  return (
    <div
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white font-black font-mono shadow-xs select-none shrink-0"
      style={{
        width: size,
        height: size,
        fontSize,
      }}
    >
      {s.slice(0, 4)}
    </div>
  );
};

// In-memory persistent cache for loaded and failed image URLs to eliminate flickering during rapid re-renders
const MEMORY_SUCCESS_URLS = new Set<string>();
const MEMORY_FAILED_URLS = new Set<string>();

const CustomIconBadge: React.FC<CustomIconBadgeProps> = React.memo(({
  size,
  config,
  alt,
  className = '',
}) => {
  const [src, setSrc] = React.useState(config.web);
  const [failed, setFailed] = React.useState(() => MEMORY_FAILED_URLS.has(config.web) && (!config.secondary || MEMORY_FAILED_URLS.has(config.secondary)));
  const [loaded, setLoaded] = React.useState(() => MEMORY_SUCCESS_URLS.has(config.web));

  React.useEffect(() => {
    if (MEMORY_SUCCESS_URLS.has(config.web)) {
      setSrc(config.web);
      setLoaded(true);
      setFailed(false);
      return;
    }
    setSrc(config.web);
    setFailed(false);
  }, [config.web, config.secondary, config.local]);

  const handleError = () => {
    MEMORY_FAILED_URLS.add(src);
    if (src === config.web && config.secondary && config.secondary !== config.web && !MEMORY_FAILED_URLS.has(config.secondary)) {
      setSrc(config.secondary);
    } else if (src !== config.local && config.local && !MEMORY_FAILED_URLS.has(config.local)) {
      setSrc(config.local);
    } else {
      setFailed(true);
    }
  };

  const handleLoad = () => {
    MEMORY_SUCCESS_URLS.add(src);
    setLoaded(true);
  };

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none overflow-hidden aspect-square bg-transparent ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: 'transparent',
      }}
    >
      {!loaded && !failed && (
        <div className="absolute inset-0 bg-transparent animate-pulse" />
      )}
      {!failed ? (
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          className={`w-full h-full object-${config.fit || 'contain'} shrink-0 transition-opacity duration-150 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        renderFallbackLogo(alt, size)
      )}
    </div>
  );
});

// Real Asset Badge for Global Search dataset (Google, ITC, Apple, etc.)
interface RealAssetBadgeProps {
  size: number;
  config: RealAssetImageConfig;
  symbol: string;
  className?: string;
}

const RealAssetBadge: React.FC<RealAssetBadgeProps> = React.memo(({
  size,
  config,
  symbol,
  className = ''
}) => {
  const initialSrc = getLockedImage(symbol, config.primary);
  const [src, setSrc] = React.useState(initialSrc);
  const [failed, setFailed] = React.useState(() => MEMORY_FAILED_URLS.has(initialSrc) && (!config.fallback || MEMORY_FAILED_URLS.has(config.fallback)));
  const [loaded, setLoaded] = React.useState(() => MEMORY_SUCCESS_URLS.has(initialSrc));

  React.useEffect(() => {
    const locked = getLockedImage(symbol, config.primary);
    if (MEMORY_SUCCESS_URLS.has(locked)) {
      setSrc(locked);
      setLoaded(true);
      setFailed(false);
      return;
    }
    setSrc(locked);
    setFailed(false);
  }, [symbol, config.primary, config.fallback]);

  const handleLoad = () => {
    MEMORY_SUCCESS_URLS.add(src);
    setLoaded(true);
    lockImage(symbol, src);
  };

  const handleError = () => {
    MEMORY_FAILED_URLS.add(src);
    if (src !== config.fallback && config.fallback && !MEMORY_FAILED_URLS.has(config.fallback)) {
      setSrc(config.fallback);
      lockImage(symbol, config.fallback);
    } else {
      setFailed(true);
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none overflow-hidden aspect-square bg-transparent ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: 'transparent',
      }}
    >
      {!loaded && !failed && (
        <div className="absolute inset-0 bg-transparent animate-pulse" />
      )}
      {!failed ? (
        <img
          src={src}
          alt={symbol}
          width={size}
          height={size}
          className={`w-full h-full object-${config.fit || 'contain'} shrink-0 transition-opacity duration-150 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        renderFallbackLogo(symbol, size)
      )}
    </div>
  );
});

// High-definition web-loaded CDN asset icons with local and vector fallbacks
const CUSTOM_ASSET_LOGOS: Record<string, CustomLogoConfig> = {
  // 1. Bitcoin
  'BTC': {
    web: 'https://assets.coincap.io/assets/icons/btc@2x.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCBTC.svg',
    local: '/assets/logos/btc.png',
    bg: '#F7931A',
    fit: 'contain',
  },
  // 2. Binance
  'BNB': {
    web: 'https://assets.coincap.io/assets/icons/bnb@2x.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCBNB.svg',
    local: '/assets/logos/bnb.jpeg',
    bg: '#F3BA2F',
    fit: 'contain',
  },
  // 3. AMD
  'AMD': {
    web: 'https://s3-symbol-logo.tradingview.com/advanced-micro-devices--big.svg',
    secondary: 'https://logo.clearbit.com/amd.com?size=128',
    local: '/assets/logos/amd.png',
    bg: '#000000',
    fit: 'contain',
  },
  // 4. Meta
  'META': {
    web: 'https://s3-symbol-logo.tradingview.com/meta-platforms--big.svg',
    secondary: 'https://logo.clearbit.com/meta.com?size=128',
    local: '/assets/logos/meta.jpeg',
    bg: '#FFFFFF',
    fit: 'contain',
  },
  // 5. PayPal
  'PYPL': {
    web: 'https://s3-symbol-logo.tradingview.com/paypal--big.svg',
    secondary: 'https://logo.clearbit.com/paypal.com?size=128',
    local: '/assets/logos/pypl.png',
    bg: '#FFFFFF',
    fit: 'contain',
  },
  // 6. TRX Coin / TRON
  'TRX': {
    web: 'https://assets.coincap.io/assets/icons/trx@2x.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCTRX.svg',
    local: '/assets/logos/trx.jpeg',
    bg: '#EF0027',
    fit: 'contain',
  },
  // 7. Ton coin / Toncoin
  'TON': {
    web: 'https://assets.coincap.io/assets/icons/ton@2x.png',
    secondary: '/assets/logos/ton.jpeg',
    local: '/assets/logos/ton.jpeg',
    bg: '#0098EA',
    fit: 'contain',
  },
  // 8. Pepe coin
  'PEPE': {
    web: 'https://assets.coincap.io/assets/icons/pepe@2x.png',
    secondary: '/assets/logos/pepe.jpeg',
    local: '/assets/logos/pepe.jpeg',
    bg: '#4B8F3D',
    fit: 'contain',
  },
  // 9. Alibaba
  'BABA': {
    web: 'https://s3-symbol-logo.tradingview.com/alibaba--big.svg',
    secondary: 'https://logo.clearbit.com/alibabagroup.com?size=128',
    local: '/assets/logos/baba.png',
    bg: '#FFFFFF',
    fit: 'contain',
  },
  // 10. Coca Cola
  'KO': {
    web: 'https://s3-symbol-logo.tradingview.com/coca-cola--big.svg',
    secondary: 'https://logo.clearbit.com/coca-cola.com?size=128',
    local: '/assets/logos/ko.png',
    bg: '#FFFFFF',
    fit: 'contain',
  },
  // 11. Nvidia
  'NVDA': {
    web: 'https://s3-symbol-logo.tradingview.com/nvidia--big.svg',
    secondary: 'https://logo.clearbit.com/nvidia.com?size=128',
    local: '/assets/logos/nvda.png',
    bg: '#77B900',
    fit: 'contain',
  },
  // 12. Avalanche
  'AVAX': {
    web: 'https://assets.coincap.io/assets/icons/avax@2x.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCAVAX.svg',
    local: '/assets/logos/avax.jpeg',
    bg: '#E84142',
    fit: 'contain',
  },
  // 13. Apple
  'AAPL': {
    web: 'https://s3-symbol-logo.tradingview.com/apple--big.svg',
    secondary: 'https://logo.clearbit.com/apple.com?size=128',
    local: '/assets/logos/aapl.png',
    bg: '#FFFFFF',
    fit: 'contain',
  },
  // 14. Microsoft
  'MSFT': {
    web: 'https://s3-symbol-logo.tradingview.com/microsoft--big.svg',
    secondary: 'https://logo.clearbit.com/microsoft.com?size=128',
    local: '/assets/logos/msft.png',
    bg: '#FFFFFF',
    fit: 'contain',
  },
  // 15. Alphabet / Google
  'GOOGL': {
    web: 'https://s3-symbol-logo.tradingview.com/alphabet--big.svg',
    secondary: 'https://logo.clearbit.com/google.com?size=128',
    local: '/assets/logos/googl.png',
    bg: '#FFFFFF',
    fit: 'contain',
  },
  // 16. Amazon
  'AMZN': {
    web: 'https://s3-symbol-logo.tradingview.com/amazon--big.svg',
    secondary: 'https://logo.clearbit.com/amazon.com?size=128',
    local: '/assets/logos/amzn.png',
    bg: '#FFFFFF',
    fit: 'contain',
  },
  // 17. Tesla
  'TSLA': {
    web: 'https://s3-symbol-logo.tradingview.com/tesla--big.svg',
    secondary: 'https://logo.clearbit.com/tesla.com?size=128',
    local: '/assets/logos/tsla.png',
    bg: '#FFFFFF',
    fit: 'contain',
  },
  // 18. Netflix
  'NFLX': {
    web: 'https://s3-symbol-logo.tradingview.com/netflix--big.svg',
    secondary: 'https://logo.clearbit.com/netflix.com?size=128',
    local: '/assets/logos/nflx.png',
    bg: '#000000',
    fit: 'contain',
  },
  // 19. Ethereum
  'ETH': {
    web: 'https://assets.coincap.io/assets/icons/eth@2x.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCETH.svg',
    local: '/assets/logos/eth.png',
    bg: '#627EEA',
    fit: 'contain',
  },
  // 20. Solana
  'SOL': {
    web: 'https://assets.coincap.io/assets/icons/sol@2x.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCSOL.svg',
    local: '/assets/logos/sol.png',
    bg: '#000000',
    fit: 'contain',
  },
  // 21. Ripple
  'XRP': {
    web: 'https://assets.coincap.io/assets/icons/xrp@2x.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCXRP.svg',
    local: '/assets/logos/xrp.png',
    bg: '#23292F',
    fit: 'contain',
  },
  // 22. Dogecoin
  'DOGE': {
    web: 'https://assets.coincap.io/assets/icons/doge@2x.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/crypto/XTVCDOGE.svg',
    local: '/assets/logos/doge.png',
    bg: '#C2A633',
    fit: 'contain',
  },
};

const matchCustomLogo = (s: string, n: string) => {
  if (s === 'BTC' || s.startsWith('BTC') || n.includes('bitcoin')) return CUSTOM_ASSET_LOGOS['BTC'];
  if (s === 'ETH' || s.startsWith('ETH') || n.includes('ethereum')) return CUSTOM_ASSET_LOGOS['ETH'];
  if (s === 'SOL' || s.startsWith('SOL') || n.includes('solana')) return CUSTOM_ASSET_LOGOS['SOL'];
  if (s === 'XRP' || s.startsWith('XRP') || n.includes('ripple')) return CUSTOM_ASSET_LOGOS['XRP'];
  if (s === 'DOGE' || s.startsWith('DOGE') || n.includes('doge')) return CUSTOM_ASSET_LOGOS['DOGE'];
  if (s === 'BNB' || s.startsWith('BNB') || n.includes('binance')) return CUSTOM_ASSET_LOGOS['BNB'];
  if (s === 'AMD' || n.includes('amd')) return CUSTOM_ASSET_LOGOS['AMD'];
  if (s === 'META' || n.includes('meta') || n.includes('facebook')) return CUSTOM_ASSET_LOGOS['META'];
  if (s === 'PYPL' || s === 'PAYPAL' || n.includes('paypal')) return CUSTOM_ASSET_LOGOS['PYPL'];
  if (s === 'TRX' || n.includes('tron') || n.includes('trx')) return CUSTOM_ASSET_LOGOS['TRX'];
  if (s === 'TON' || n.includes('toncoin') || n.includes('ton')) return CUSTOM_ASSET_LOGOS['TON'];
  if (s === 'PEPE' || n.includes('pepe')) return CUSTOM_ASSET_LOGOS['PEPE'];
  if (s === 'BABA' || n.includes('alibaba')) return CUSTOM_ASSET_LOGOS['BABA'];
  if (s === 'KO' || n.includes('coca') || n.includes('coke')) return CUSTOM_ASSET_LOGOS['KO'];
  if (s === 'NVDA' || n.includes('nvidia')) return CUSTOM_ASSET_LOGOS['NVDA'];
  if (s === 'AVAX' || s.startsWith('AVAX') || n.includes('avalanche')) return CUSTOM_ASSET_LOGOS['AVAX'];
  if (s === 'AAPL' || n.includes('apple')) return CUSTOM_ASSET_LOGOS['AAPL'];
  if (s === 'MSFT' || n.includes('microsoft')) return CUSTOM_ASSET_LOGOS['MSFT'];
  if (s === 'GOOGL' || s === 'GOOG' || n.includes('google') || n.includes('alphabet')) return CUSTOM_ASSET_LOGOS['GOOGL'];
  if (s === 'AMZN' || n.includes('amazon')) return CUSTOM_ASSET_LOGOS['AMZN'];
  if (s === 'TSLA' || n.includes('tesla')) return CUSTOM_ASSET_LOGOS['TSLA'];
  if (s === 'NFLX' || n.includes('netflix')) return CUSTOM_ASSET_LOGOS['NFLX'];
  return null;
};

// Set of recognized fiat currencies for Forex pairs
const KNOWN_CURRENCIES = new Set([
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'CHF', 'AUD', 'NZD',
  'INR', 'BRL', 'MXN', 'THB', 'NOK', 'SGD', 'CNY', 'HKD', 'ZAR', 'TRY', 'SEK'
]);

// Helper to extract base and quote currencies for Forex Dual Flags
const extractForexCurrencies = (symbol: string, name: string): { base: string; quote: string } | null => {
  // Check if name has slash, e.g. "EUR/USD", "USD/CAD (OTC)", "AUD/CAD"
  if (name.includes('/')) {
    const parts = name.split('/');
    if (parts.length >= 2) {
      const base = parts[0].replace(/[^A-Za-z]/g, '').toUpperCase().slice(-3);
      const quote = parts[1].replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3);
      if (base.length === 3 && quote.length === 3 && (KNOWN_CURRENCIES.has(base) || KNOWN_CURRENCIES.has(quote))) {
        return { base, quote };
      }
    }
  }

  // Check if symbol has slash, e.g. "EUR/USD"
  if (symbol.includes('/')) {
    const parts = symbol.split('/');
    if (parts.length >= 2) {
      const base = parts[0].replace(/[^A-Za-z]/g, '').toUpperCase().slice(-3);
      const quote = parts[1].replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3);
      if (base.length === 3 && quote.length === 3) {
        return { base, quote };
      }
    }
  }

  // Check 6-char clean symbol, e.g. "EURUSD", "USDCAD", "USDCHF"
  const cleanSym = symbol.replace(/[^A-Za-z]/g, '').toUpperCase();
  if (cleanSym.length === 6) {
    const base = cleanSym.substring(0, 3);
    const quote = cleanSym.substring(3, 6);
    if (KNOWN_CURRENCIES.has(base) && KNOWN_CURRENCIES.has(quote)) {
      return { base, quote };
    }
  }

  return null;
};

// ==========================================
// AUTHENTIC TRADING PLATFORM COMMODITY & BULLION ICONS (Web-Loaded from TradingView Official S3 CDN)
// ==========================================
export const COMMODITY_WEB_LOGOS: Record<string, { web: string; secondary: string; bg?: string }> = {
  GOLD: {
    web: 'https://s3-symbol-logo.tradingview.com/metal/gold--600.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/gold.svg',
    bg: '#181A20',
  },
  SILVER: {
    web: 'https://s3-symbol-logo.tradingview.com/metal/silver--600.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/silver.svg',
    bg: '#181A20',
  },
  PLATINUM: {
    web: 'https://s3-symbol-logo.tradingview.com/metal/platinum--600.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/platinum.svg',
    bg: '#181A20',
  },
  PALLADIUM: {
    web: 'https://s3-symbol-logo.tradingview.com/metal/palladium--600.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/palladium.svg',
    bg: '#181A20',
  },
  NICKEL: {
    web: 'https://s3-symbol-logo.tradingview.com/metal/nickel--600.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/nickel.svg',
    bg: '#181A20',
  },
  COPPER: {
    web: 'https://s3-symbol-logo.tradingview.com/metal/copper--600.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/copper.svg',
    bg: '#181A20',
  },
  ALUMINUM: {
    web: 'https://s3-symbol-logo.tradingview.com/metal/aluminum--600.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/aluminum.svg',
    bg: '#181A20',
  },
  ZINC: {
    web: 'https://s3-symbol-logo.tradingview.com/metal/zinc--600.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/zinc.svg',
    bg: '#181A20',
  },
  LEAD: {
    web: 'https://s3-symbol-logo.tradingview.com/metal/lead--600.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/lead.svg',
    bg: '#181A20',
  },
  TIN: {
    web: 'https://s3-symbol-logo.tradingview.com/metal/tin--600.png',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/tin.svg',
    bg: '#181A20',
  },
  BRENT: {
    web: 'https://s3-symbol-logo.tradingview.com/crude-oil--big.svg',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/crude-oil.svg',
    bg: '#181A20',
  },
  WTI: {
    web: 'https://s3-symbol-logo.tradingview.com/crude-oil--big.svg',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/crude-oil.svg',
    bg: '#181A20',
  },
  NATURALGAS: {
    web: 'https://s3-symbol-logo.tradingview.com/natural-gas--big.svg',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/natural-gas.svg',
    bg: '#181A20',
  },
  WHEAT: {
    web: 'https://s3-symbol-logo.tradingview.com/wheat--big.svg',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/wheat.svg',
    bg: '#181A20',
  },
  COFFEE: {
    web: 'https://s3-symbol-logo.tradingview.com/coffee--big.svg',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/coffee.svg',
    bg: '#181A20',
  },
  COCOA: {
    web: 'https://s3-symbol-logo.tradingview.com/cocoa--big.svg',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/cocoa.svg',
    bg: '#181A20',
  },
  SUGAR: {
    web: 'https://s3-symbol-logo.tradingview.com/sugar--big.svg',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/sugar.svg',
    bg: '#181A20',
  },
  CORN: {
    web: 'https://s3-symbol-logo.tradingview.com/corn--big.svg',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/corn.svg',
    bg: '#181A20',
  },
  COTTON: {
    web: 'https://s3-symbol-logo.tradingview.com/cotton--big.svg',
    secondary: 'https://s3-symbol-logo.tradingview.com/metal/cotton.svg',
    bg: '#181A20',
  },
};

export const WebAssetBadge: React.FC<{
  size: number;
  url: string;
  secondaryUrl?: string;
  alt: string;
  bg?: string;
  className?: string;
}> = React.memo(({ size, url, secondaryUrl, alt, bg = '#181A20', className = '' }) => {
  const [src, setSrc] = React.useState(url);
  const [failed, setFailed] = React.useState(() => MEMORY_FAILED_URLS.has(url) && (!secondaryUrl || MEMORY_FAILED_URLS.has(secondaryUrl)));
  const [loaded, setLoaded] = React.useState(() => MEMORY_SUCCESS_URLS.has(url));

  React.useEffect(() => {
    if (MEMORY_SUCCESS_URLS.has(url)) {
      setSrc(url);
      setLoaded(true);
      setFailed(false);
      return;
    }
    setSrc(url);
    setFailed(false);
  }, [url, secondaryUrl]);

  const handleLoad = () => {
    MEMORY_SUCCESS_URLS.add(src);
    setLoaded(true);
  };

  const handleError = () => {
    MEMORY_FAILED_URLS.add(src);
    if (secondaryUrl && src !== secondaryUrl && !MEMORY_FAILED_URLS.has(secondaryUrl)) {
      setSrc(secondaryUrl);
    } else {
      setFailed(true);
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none overflow-hidden aspect-square bg-transparent ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: 'transparent',
      }}
    >
      {!loaded && !failed && (
        <div className="absolute inset-0 bg-transparent animate-pulse" />
      )}
      {!failed ? (
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          className={`w-full h-full object-contain shrink-0 transition-opacity duration-150 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        renderFallbackLogo(alt)
      )}
    </div>
  );
});

const AssetLogoComponent: React.FC<AssetLogoProps> = ({ symbol, name = '', className = '', size = 32 }) => {
  const s = (symbol || '').toUpperCase().trim();
  const n = (name || '').toLowerCase().trim();

  // ==========================================
  // 1. CHECK USER-EDITED CUSTOM LOGOS FIRST (Strictly PRESERVED)
  // ==========================================
  const customConfig = matchCustomLogo(s, n);
  if (customConfig) {
    return (
      <CustomIconBadge
        size={size}
        config={customConfig}
        alt={s}
        className={className}
      />
    );
  }

  // ==========================================
  // 2. FOREX CURRENCY PAIRS -> DUAL OVERLAPPING FLAGS (Olymp Trade Style)
  // ==========================================
  const forex = extractForexCurrencies(s, n);
  if (forex) {
    return (
      <DualFlagBadge
        baseCurrency={forex.base}
        quoteCurrency={forex.quote}
        size={size}
        className={className}
      />
    );
  }

  // ==========================================
  // 3. COMPOSITE INDICES & SPECIALLY BRANDED ASSETS
  // ==========================================

  // Stable Tick Index
  if (s === 'STABLETICK' || n.includes('stable tick')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#5856D6">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <rect x="3" y="13" width="8.5" height="4.5" rx="2.25" fill="#FFFFFF" />
          <rect x="12.5" y="6.5" width="8.5" height="4.5" rx="2.25" fill="#FFFFFF" />
        </svg>
      </PremiumBadge>
    );
  }

  // Cricket Composite Index
  if (s === 'CRICKET' || n.includes('cricket')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#FFFFFF" border="border border-slate-200">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6">
          <line x1="4" y1="20" x2="18" y2="4" stroke="#854D0E" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="15" y1="7" x2="19" y2="3" stroke="#15803D" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="20" y1="20" x2="6" y2="4" stroke="#854D0E" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="9" y1="7" x2="5" y2="3" stroke="#DC2626" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="12" cy="15" r="3.2" fill="#DC2626" />
          <path d="M10 14c1 1 3 1 4 0" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" fill="none" />
        </svg>
      </PremiumBadge>
    );
  }

  // Maha Jantar Index
  if (s === 'MAHAJANTAR' || n.includes('maha jantar') || s === 'MAHA') {
    return (
      <PremiumBadge size={size} className={className} bgColor="#FFFFFF" border="border border-slate-200">
        <svg viewBox="0 0 24 24" className="w-full h-full rounded-[6px] overflow-hidden">
          <rect width="24" height="8" fill="#FF9933" />
          <rect y="8" width="24" height="8" fill="#FFFFFF" />
          <rect y="16" width="24" height="8" fill="#138808" />
          <circle cx="12" cy="12" r="3" fill="none" stroke="#000080" strokeWidth="0.8" />
          <circle cx="12" cy="12" r="0.8" fill="#000080" />
        </svg>
      </PremiumBadge>
    );
  }

  // Moonch Index
  if (s === 'MOONCH' || n.includes('moonch')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#18181B">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <path
            d="M3 13c1.5-2.5 4-4 7-2 1 .7 1.5 1.5 2 1.5s1-.8 2-1.5c3-2 5.5-.5 7 2-1.5 1-3.5 1-5 0-1-.7-1.5-1.5-2-1.5s-1 .8-2 1.5c-1.5 1-3.5 1-5 0"
            fill="#FFFFFF"
          />
        </svg>
      </PremiumBadge>
    );
  }

  // Astro Index
  if (s === 'ASTRO' || n.includes('astro index') || s === 'ASTROIDX') {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#0F172A" gradientTo="#0B1536">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <ellipse cx="12" cy="12" rx="9" ry="4.5" stroke="#38BDF8" strokeWidth="1.2" transform="rotate(-25 12 12)" strokeDasharray="1.5 1.5" />
          <path d="M12 4L13.5 10.5L20 12L13.5 13.5L12 20L10.5 13.5L4 12L10.5 10.5Z" fill="#FBBF24" />
          <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
        </svg>
      </PremiumBadge>
    );
  }

  // Basic Dollar Index
  if (s === 'BDI' || n.includes('basic dollar') || s === 'DXY' || s === 'DOLLARIDX') {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#00C078" gradientTo="#009A52">
        <span className="text-[17px] font-black text-white font-mono leading-none drop-shadow-xs">$</span>
      </PremiumBadge>
    );
  }

  // ==========================================
  // 4. COMMODITIES & PRECIOUS METALS (Web-Loaded Trading Platform CDN Icons)
  // Evaluated BEFORE general fallback so Gold, Silver, Platinum, Nickel, Oil never get mismatched!
  // ==========================================
  if (s === 'XAU' || s === 'XAUEUR' || n.includes('gold')) {
    const cfg = COMMODITY_WEB_LOGOS.GOLD;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Gold" bg={cfg.bg} className={className} />;
  }
  if (s === 'XAG' || s === 'XAGEUR' || n.includes('silver')) {
    const cfg = COMMODITY_WEB_LOGOS.SILVER;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Silver" bg={cfg.bg} className={className} />;
  }
  if (s === 'XPT' || n.includes('platinum')) {
    const cfg = COMMODITY_WEB_LOGOS.PLATINUM;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Platinum" bg={cfg.bg} className={className} />;
  }
  if (s === 'XPD' || n.includes('palladium')) {
    const cfg = COMMODITY_WEB_LOGOS.PALLADIUM;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Palladium" bg={cfg.bg} className={className} />;
  }
  if (s === 'NIC' || n.includes('nickel')) {
    const cfg = COMMODITY_WEB_LOGOS.NICKEL;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Nickel" bg={cfg.bg} className={className} />;
  }
  if (s === 'HG' || n.includes('copper')) {
    const cfg = COMMODITY_WEB_LOGOS.COPPER;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Copper" bg={cfg.bg} className={className} />;
  }
  if (s === 'ALU' || n.includes('aluminum') || n.includes('aluminium')) {
    const cfg = COMMODITY_WEB_LOGOS.ALUMINUM;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Aluminum" bg={cfg.bg} className={className} />;
  }
  if (s === 'ZNC' || n.includes('zinc')) {
    const cfg = COMMODITY_WEB_LOGOS.ZINC;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Zinc" bg={cfg.bg} className={className} />;
  }
  if (s === 'LED' || s === 'PB' || n.includes('lead')) {
    const cfg = COMMODITY_WEB_LOGOS.LEAD;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Lead" bg={cfg.bg} className={className} />;
  }
  if (s === 'TIN' || s === 'SN' || n.includes('tin')) {
    const cfg = COMMODITY_WEB_LOGOS.TIN;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Tin" bg={cfg.bg} className={className} />;
  }
  if (s === 'BRENT' || n.includes('brent')) {
    const cfg = COMMODITY_WEB_LOGOS.BRENT;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Brent Crude Oil" bg={cfg.bg} className={className} />;
  }
  if (s === 'WTI' || (n.includes('oil') && n.includes('wti')) || (n.includes('crude') && !n.includes('brent'))) {
    const cfg = COMMODITY_WEB_LOGOS.WTI;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="WTI Crude Oil" bg={cfg.bg} className={className} />;
  }
  if (s === 'NG' || n.includes('natural gas') || n.includes('gasoline') || n.includes('gas')) {
    const cfg = COMMODITY_WEB_LOGOS.NATURALGAS;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Natural Gas" bg={cfg.bg} className={className} />;
  }
  if (s === 'WHEAT' || n.includes('wheat')) {
    const cfg = COMMODITY_WEB_LOGOS.WHEAT;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Wheat" bg={cfg.bg} className={className} />;
  }
  if (s === 'COFFEE' || n.includes('coffee')) {
    const cfg = COMMODITY_WEB_LOGOS.COFFEE;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Coffee" bg={cfg.bg} className={className} />;
  }
  if (s === 'COCOA' || n.includes('cocoa')) {
    const cfg = COMMODITY_WEB_LOGOS.COCOA;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Cocoa" bg={cfg.bg} className={className} />;
  }
  if (s === 'SUGAR' || n.includes('sugar')) {
    const cfg = COMMODITY_WEB_LOGOS.SUGAR;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Sugar" bg={cfg.bg} className={className} />;
  }
  if (s === 'CORN' || n.includes('corn')) {
    const cfg = COMMODITY_WEB_LOGOS.CORN;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Corn" bg={cfg.bg} className={className} />;
  }
  if (s === 'COTTON' || n.includes('cotton')) {
    const cfg = COMMODITY_WEB_LOGOS.COTTON;
    return <WebAssetBadge size={size} url={cfg.web} secondaryUrl={cfg.secondary} alt="Cotton" bg={cfg.bg} className={className} />;
  }

  // ==========================================
  // 5. REAL GLOBAL ASSET LOGOS (Equities, Crypto, Global Benchmarks)
  // Loaded directly from official & global CDN dataset (Clearbit, CoinCap, CoinGecko, Unavatar)
  // ==========================================
  const realConfig = matchRealAssetImage(s, n);
  if (realConfig) {
    return (
      <RealAssetBadge
        size={size}
        config={realConfig}
        symbol={s}
        className={className}
      />
    );
  }

  // ==========================================
  // 5. INDIAN MARKETS & LEADING INDIAN EQUITIES (High Fidelity Fallback)
  // ==========================================

  // NIFTY 50
  if (s === 'NIFTY' || s === 'NIFTY50' || n.includes('nifty 50') || n.includes('nifty')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#0B132B" gradientTo="#1C2541">
        <div className="flex flex-col items-center justify-center leading-none">
          <span className="text-[7.5px] font-black tracking-widest text-[#FF9933] uppercase">NIFTY</span>
          <span className="text-[11px] font-black text-white font-mono tracking-tight mt-0.5">50</span>
        </div>
      </PremiumBadge>
    );
  }

  // BANK NIFTY
  if (s === 'BANKNIFTY' || n.includes('bank nifty') || n.includes('banknifty')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#064E3B" gradientTo="#022C22">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <path d="M4 10h16M4 14h16M3 19h18M12 3l9 5H3l9-5z" stroke="#34D399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10v4M10 10v4M14 10v4M18 10v4" stroke="#A7F3D0" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </PremiumBadge>
    );
  }

  // SENSEX
  if (s === 'SENSEX' || n.includes('sensex')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#1E40AF" gradientTo="#1E1B4B">
        <div className="flex flex-col items-center justify-center leading-none">
          <span className="text-[7px] font-black tracking-wider text-[#60A5FA] uppercase">SENSEX</span>
          <span className="text-[11px] font-black text-white font-mono tracking-tight mt-0.5">30</span>
        </div>
      </PremiumBadge>
    );
  }

  // Reliance Industries (RELIANCE)
  if (s === 'RELIANCE' || n.includes('reliance')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#002B49">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <polygon points="12,3 20,8 20,16 12,21 4,16 4,8" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4.5" fill="#EF4444" />
          <path d="M12 9v6M9 12h6" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </PremiumBadge>
    );
  }

  // TCS (Tata Consultancy Services)
  if (s === 'TCS' || n.includes('tcs') || n.includes('tata consultancy')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#002D62" gradientTo="#001428">
        <div className="flex flex-col items-center justify-center leading-none">
          <span className="text-[11px] font-black text-white tracking-widest font-mono">TCS</span>
          <span className="text-[6.5px] font-bold text-[#38BDF8] tracking-widest uppercase mt-0.5">TATA</span>
        </div>
      </PremiumBadge>
    );
  }

  // HDFC Bank
  if (s === 'HDFCBANK' || s === 'HDFC' || n.includes('hdfc')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#004C8F">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <rect x="4" y="4" width="16" height="16" fill="#ED1C24" rx="2" />
          <rect x="7" y="7" width="10" height="10" fill="#004C8F" />
          <rect x="9.5" y="9.5" width="5" height="5" fill="#FFFFFF" />
        </svg>
      </PremiumBadge>
    );
  }

  // Infosys
  if (s === 'INFY' || n.includes('infosys')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#007CC3">
        <span className="text-[10px] font-black text-white italic tracking-tight font-serif">Infosys</span>
      </PremiumBadge>
    );
  }

  // ICICI Bank
  if (s === 'ICICIBANK' || s === 'ICICI' || n.includes('icici')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#AF231C" gradientTo="#7B1410">
        <span className="text-[10.5px] font-black text-[#F37021] tracking-tighter">ICICI</span>
      </PremiumBadge>
    );
  }

  // Tata Motors
  if (s === 'TATAMOTORS' || n.includes('tata motors')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#005A9C" gradientTo="#002D4E">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <ellipse cx="12" cy="12" rx="9" ry="5.5" stroke="#E2E8F0" strokeWidth="1.6" />
          <path d="M7 10h10M12 10v6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </PremiumBadge>
    );
  }

  // SBI / State Bank of India
  if (s === 'SBIN' || s === 'SBI' || n.includes('state bank') || n.includes('sbi')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#280071">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <circle cx="12" cy="12" r="8" fill="#00A5EC" />
          <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
          <rect x="11" y="12" width="2" height="6" fill="#FFFFFF" />
        </svg>
      </PremiumBadge>
    );
  }

  // Bharti Airtel
  if (s === 'BHARTIARTL' || s === 'AIRTEL' || n.includes('airtel')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#E40000">
        <span className="text-[10px] font-black text-white italic tracking-tight font-sans">airtel</span>
      </PremiumBadge>
    );
  }

  // ITC
  if (s === 'ITC' || n.includes('itc')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#002F6C">
        <span className="text-[11px] font-black text-amber-300 tracking-widest font-serif">ITC</span>
      </PremiumBadge>
    );
  }

  // Larsen & Toubro (LT)
  if (s === 'LT' || n.includes('larsen') || n.includes('toubro') || n.includes('l&t')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#003366">
        <span className="text-[11px] font-black text-white font-mono">L&T</span>
      </PremiumBadge>
    );
  }

  // Axis Bank
  if (s === 'AXISBANK' || s === 'AXIS' || n.includes('axis bank')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#861F41">
        <span className="text-[9.5px] font-black text-white tracking-tight">AXIS</span>
      </PremiumBadge>
    );
  }

  // Kotak Bank
  if (s === 'KOTAKBANK' || s === 'KOTAK' || n.includes('kotak')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#ED1C24">
        <span className="text-[9.5px] font-black text-white tracking-tight">KOTAK</span>
      </PremiumBadge>
    );
  }

  // Maruti Suzuki
  if (s === 'MARUTI' || n.includes('maruti')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#002D62">
        <span className="text-[9.5px] font-black text-white tracking-tight">MARUTI</span>
      </PremiumBadge>
    );
  }

  // Sun Pharma
  if (s === 'SUNPHARMA' || n.includes('sun pharma')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#E65100">
        <span className="text-[9px] font-black text-white tracking-tight">SUN</span>
      </PremiumBadge>
    );
  }

  // Bajaj Finance
  if (s === 'BAJFINANCE' || n.includes('bajaj')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#004A99">
        <span className="text-[9px] font-black text-white tracking-tight">BAJAJ</span>
      </PremiumBadge>
    );
  }

  // Wipro
  if (s === 'WIPRO' || n.includes('wipro')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#3B5998">
        <span className="text-[9.5px] font-black text-white italic tracking-tight">wipro</span>
      </PremiumBadge>
    );
  }

  // Tata Steel
  if (s === 'TATASTEEL' || n.includes('tata steel')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#002D62">
        <span className="text-[8.5px] font-black text-white tracking-tight uppercase">TATA STL</span>
      </PremiumBadge>
    );
  }

  // Titan
  if (s === 'TITAN' || n.includes('titan')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#18181B">
        <span className="text-[10px] font-black text-amber-400 tracking-widest font-serif">TITAN</span>
      </PremiumBadge>
    );
  }

  // Adani Enterprises / Ports
  if (s === 'ADANIENT' || s === 'ADANIPORTS' || n.includes('adani')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#004B87" gradientTo="#008080">
        <span className="text-[9.5px] font-black text-white tracking-wider">ADANI</span>
      </PremiumBadge>
    );
  }

  // NTPC
  if (s === 'NTPC' || n.includes('ntpc')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#006699">
        <span className="text-[10px] font-black text-white tracking-widest">NTPC</span>
      </PremiumBadge>
    );
  }

  // ONGC
  if (s === 'ONGC' || n.includes('ongc')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#A81C1D">
        <span className="text-[10px] font-black text-yellow-400 tracking-widest">ONGC</span>
      </PremiumBadge>
    );
  }


  // ==========================================
  // 6. GLOBAL INDICES & BENCHMARKS (US Flags & National Badges)
  // ==========================================

  // US Benchmark Indices: S&P 500, Dow Jones, NASDAQ, Russell 2000, VIX
  if (
    s === 'SPX' || s === 'US500' || n.includes('s&p 500') ||
    s === 'DJI' || s === 'US30' || n.includes('dow jones') ||
    s === 'NDX' || s === 'US100' || n.includes('nasdaq') ||
    s === 'RUT' || n.includes('russell')
  ) {
    return (
      <div
        className={`relative rounded-[7px] overflow-hidden shadow-xs border border-black/20 shrink-0 select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <USFlag className="w-full h-full object-cover" />
      </div>
    );
  }

  // VIX
  if (s === 'VIX' || n.includes('volatility') || n.includes('vix')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#EA580C" gradientTo="#9A3412">
        <div className="flex flex-col items-center justify-center leading-none">
          <span className="text-[10.5px] font-black text-white font-mono tracking-widest">VIX</span>
        </div>
      </PremiumBadge>
    );
  }

  // German DAX (GER40 / DAX)
  if (s === 'GER40' || s === 'GER30' || s === 'DAX' || n.includes('dax')) {
    return (
      <div
        className={`relative rounded-[7px] overflow-hidden shadow-xs border border-black/20 shrink-0 select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <GermanyFlag className="w-full h-full object-cover" />
      </div>
    );
  }

  // French CAC 40
  if (s === 'CAC40' || s === 'CAC' || n.includes('cac 40')) {
    return (
      <div
        className={`relative rounded-[7px] overflow-hidden shadow-xs border border-black/20 shrink-0 select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <FranceFlag className="w-full h-full object-cover" />
      </div>
    );
  }

  // UK 100 / FTSE 100
  if (s === 'UK100' || s === 'FTSE' || n.includes('ftse') || n.includes('uk100')) {
    return (
      <div
        className={`relative rounded-[7px] overflow-hidden shadow-xs border border-black/20 shrink-0 select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <UKFlag className="w-full h-full object-cover" />
      </div>
    );
  }

  // Nikkei 225 (JP225)
  if (s === 'JP225' || s === 'N225' || n.includes('nikkei')) {
    return (
      <div
        className={`relative rounded-[7px] overflow-hidden shadow-xs border border-slate-200 shrink-0 select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <JapanFlag className="w-full h-full object-cover" />
      </div>
    );
  }

  // Euro Stoxx 50
  if (s === 'SX5E' || n.includes('euro stoxx') || s === 'STOXX') {
    return (
      <div
        className={`relative rounded-[7px] overflow-hidden shadow-xs border border-black/20 shrink-0 select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <EUFlag className="w-full h-full object-cover" />
      </div>
    );
  }

  // Hang Seng (HSI / HK50)
  if (s === 'HSI' || s === 'HK50' || n.includes('hang seng')) {
    return (
      <div
        className={`relative rounded-[7px] overflow-hidden shadow-xs border border-black/20 shrink-0 select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <HKFlag className="w-full h-full object-cover" />
      </div>
    );
  }

  // ETFs: MSCI Brazil 2x (BRZU)
  if (s === 'BRZU' || n.includes('brazil 2x')) {
    return (
      <div
        className={`relative rounded-[7px] overflow-hidden shadow-xs border border-black/15 shrink-0 select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <BrazilFlag className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 bg-[#15803D] px-1 py-0.2 rounded-tr-[3px] text-[6.5px] font-black text-white font-mono leading-none">
          BRZU
        </div>
      </div>
    );
  }

  // ETFs: SPDR S&P 500 ETF Trust (SPY)
  if (s === 'SPY' || n.includes('spdr')) {
    return (
      <div
        className={`relative rounded-[7px] overflow-hidden shadow-xs border border-black/15 shrink-0 select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <USFlag className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 bg-[#008850] px-1 py-0.2 rounded-tr-[3px] text-[7px] font-black text-white font-mono leading-none">
          SPY
        </div>
      </div>
    );
  }

  // ETFs: QID / UVXY / IYR / ASX200 / IBEX35 / KOSPI
  if (s === 'QID' || s === 'UVXY' || s === 'IYR' || s === 'ASX200' || s === 'IBEX35' || s === 'KOSPI') {
    const badgeBg = s === 'UVXY' ? 'bg-[#0284C7]' : s === 'IYR' ? 'bg-[#059669]' : s === 'ASX200' ? 'bg-[#0369A1]' : 'bg-[#1E293B]';
    return (
      <div
        className={`relative rounded-[7px] overflow-hidden shadow-xs border border-black/15 shrink-0 select-none ${className}`}
        style={{ width: size, height: size }}
      >
        <USFlag className="w-full h-full object-cover" />
        <div className={`absolute bottom-0 left-0 ${badgeBg} px-1 py-0.2 rounded-tr-[3px] text-[6.5px] font-black text-white font-mono leading-none`}>
          {s.slice(0, 4)}
        </div>
      </div>
    );
  }

  // ==========================================
  // 7. GLOBAL STOCKS (Pure Instant Vector Badges)
  // ==========================================

  // Apple (AAPL)
  if (s === 'AAPL' || n.includes('apple')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#000000">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="#FFFFFF">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.07.64-2.73 1.41-.58.67-.97 1.74-.92 2.81 1.07.08 2.03-.6 2.64-1.35z" />
        </svg>
      </PremiumBadge>
    );
  }

  // Google / Alphabet (GOOGL / GOOG)
  if (s === 'GOOGL' || s === 'GOOG' || n.includes('google') || n.includes('alphabet')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#FFFFFF" border="border border-slate-200">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
        </svg>
      </PremiumBadge>
    );
  }

  // Tesla (TSLA)
  if (s === 'TSLA' || n.includes('tesla')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#E82127">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="#FFFFFF">
          <path d="M12 5.5c2.6 0 5.1.7 7.2 2l.8-1.5C17.5 4.5 14.8 3.8 12 3.8S6.5 4.5 4 6l.8 1.5c2.1-1.3 4.6-2 7.2-2zm0 3c-1.4 0-2.8.2-4.1.7l-.6-1.2C8.7 7.5 10.3 7.2 12 7.2s3.3.3 4.7.8l-.6 1.2c-1.3-.5-2.7-.7-4.1-.7zm0 2.5c-.8 0-1.4.6-1.4 1.4v7.6h2.8v-7.6c0-.8-.6-1.4-1.4-1.4z" />
        </svg>
      </PremiumBadge>
    );
  }

  // Amazon (AMZN)
  if (s === 'AMZN' || n.includes('amazon')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#131921">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <text x="12" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif">
            a
          </text>
          <path d="M5 16.5C8 19.5 16 19.5 19 16.5" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" />
          <path d="M17.5 15l2 1.5-1.5 2" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </PremiumBadge>
    );
  }

  // Microsoft (MSFT)
  if (s === 'MSFT' || n.includes('microsoft')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#1E293B">
        <div className="grid grid-cols-2 gap-1 w-4/5 h-4/5 p-0.5">
          <div className="bg-[#F25022] rounded-[1px]" />
          <div className="bg-[#7FBA00] rounded-[1px]" />
          <div className="bg-[#00A4EF] rounded-[1px]" />
          <div className="bg-[#FFB900] rounded-[1px]" />
        </div>
      </PremiumBadge>
    );
  }

  // Netflix (NFLX)
  if (s === 'NFLX' || n.includes('netflix')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#141414">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <path d="M6 3h3.5v18H6z" fill="#B81D24" />
          <path d="M14.5 3H18v18h-3.5z" fill="#B81D24" />
          <path d="M6 3l12 18h-3.5L6 3z" fill="#E50914" />
        </svg>
      </PremiumBadge>
    );
  }

  // McDonald's (MCD)
  if (s === 'MCD' || n.includes('mcdonald')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#DA291C">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <path d="M5 20V11c0-4 2.5-6 4.5-6s4.5 2 4.5 6v9" stroke="#FFC72C" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M10 20V11c0-4 2.5-6 4.5-6s4.5 2 4.5 6v9" stroke="#FFC72C" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      </PremiumBadge>
    );
  }

  // Starbucks (SBUX)
  if (s === 'SBUX' || n.includes('starbucks')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#00704A">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="6.5" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1 1" />
          <path d="M12 6l1 2.5h2.5l-2 1.5 1 2.5-2.5-1.5-2.5 1.5 1-2.5-2-1.5H11z" fill="#FFFFFF" />
          <path d="M10 14c1 1 3 1 4 0" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </PremiumBadge>
    );
  }

  // MasterCard (MA)
  if (s === 'MA' || n.includes('mastercard')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#1A1A1A">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6">
          <circle cx="9" cy="12" r="6" fill="#EB001B" />
          <circle cx="15" cy="12" r="6" fill="#F79E1B" fillOpacity="0.9" />
        </svg>
      </PremiumBadge>
    );
  }

  // Visa (V)
  if (s === 'V' || n.includes('visa')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#1A1F71">
        <span className="text-[11px] font-black italic tracking-tighter text-white font-sans">
          <span className="text-[#F7B600]">V</span>ISA
        </span>
      </PremiumBadge>
    );
  }

  // IBM (IBM)
  if (s === 'IBM' || n.includes('ibm')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#006699">
        <span className="text-[10px] font-black text-white font-mono tracking-widest">IBM</span>
      </PremiumBadge>
    );
  }

  // BMW (BMW)
  if (s === 'BMW' || n.includes('bmw')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#18181B">
        <div className="w-5/6 h-5/6 rounded-full border border-slate-400 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#0066B1]" />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#FFFFFF]" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#FFFFFF]" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#0066B1]" />
        </div>
      </PremiumBadge>
    );
  }

  // Boeing (BA)
  if (s === 'BA' || n.includes('boeing')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#0039A6">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M4 12h16M12 4c3 3 5 8 5 8s-4 4-9 4" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      </PremiumBadge>
    );
  }

  // Disney (DIS)
  if (s === 'DIS' || n.includes('disney')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#001439">
        <span className="text-[13px] font-black text-white font-serif italic">D</span>
      </PremiumBadge>
    );
  }

  // Intel (INTC)
  if (s === 'INTC' || n.includes('intel')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#0068B5">
        <span className="text-[10px] font-black text-white tracking-tight lowercase font-sans">intel</span>
      </PremiumBadge>
    );
  }

  // Walmart (WMT)
  if (s === 'WMT' || n.includes('walmart')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#0071CE">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="#FFC220">
          <path d="M12 2v6M12 16v6M3.3 7l5.2 3M15.5 14l5.2 3M3.3 17l5.2-3M15.5 10l5.2-3" stroke="#FFC220" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </PremiumBadge>
    );
  }

  // Nike (NKE)
  if (s === 'NKE' || n.includes('nike')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#18181B">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="#FFFFFF">
          <path d="M21.7 7.5c-4.2 3.8-10.7 8.3-14.8 9.5-2 .6-4.4.2-5.4-1.2-.8-1.1-.6-2.6.5-3.8 2.2-2.3 6.6-2.5 10.6-1.5l1.6.4c-4.4-.3-8.8.8-10.4 2.8-.7.9-.5 1.7.3 2.1.8.4 2.2.3 3.6-.2 3.6-1.2 9.5-5.2 14-8.1z" />
        </svg>
      </PremiumBadge>
    );
  }

  // Spotify (SPOT)
  if (s === 'SPOT' || n.includes('spotify')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#1ED760">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="#000000">
          <path d="M17.9 15.2c-.2.3-.6.4-.9.2-2.4-1.5-5.5-1.8-9.1-1-.4.1-.7-.2-.8-.5s.2-.7.5-.8c3.9-.9 7.4-.5 10.1 1.1.3.3.4.7.2 1zm1.2-2.7c-.3.4-.8.5-1.2.3-2.8-1.7-7-2.2-10.2-1.2-.4.1-.9-.1-1-.5s.1-.9.5-1c3.7-1.1 8.4-.6 11.6 1.4.4.1.5.7.3 1zm.1-2.8C15.8 7.7 10.3 7.5 7.1 8.5c-.5.2-1.1-.1-1.2-.6-.2-.5.1-1.1.6-1.2 3.7-1.1 9.8-.9 13.9 1.5.5.3.6.9.3 1.4-.2.5-.8.7-1.5.1z" />
        </svg>
      </PremiumBadge>
    );
  }

  // Uber (UBER)
  if (s === 'UBER' || n.includes('uber')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#000000">
        <span className="text-[9.5px] font-black text-white tracking-tighter">Uber</span>
      </PremiumBadge>
    );
  }

  // Airbnb (ABNB)
  if (s === 'ABNB' || n.includes('airbnb')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#FF5A5F">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c-3 0-6 4-6 9 0 4 3 7 6 7s6-3 6-7c0-5-3-9-6-9z" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      </PremiumBadge>
    );
  }

  // Adobe (ADBE)
  if (s === 'ADBE' || n.includes('adobe')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#FA0F00">
        <span className="text-[13px] font-black text-white font-sans">A</span>
      </PremiumBadge>
    );
  }

  // Palantir (PLTR)
  if (s === 'PLTR' || n.includes('palantir')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#18181B">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <circle cx="12" cy="12" r="7" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M12 5v14M5 12h14" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      </PremiumBadge>
    );
  }

  // Coinbase (COIN)
  if (s === 'COIN' || n.includes('coinbase')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#0052FF">
        <div className="w-5/6 h-5/6 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-[11px] font-black text-white font-mono leading-none">C</span>
        </div>
      </PremiumBadge>
    );
  }

  // PepsiCo (PEP)
  if (s === 'PEP' || n.includes('pepsi')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#004B93">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6">
          <circle cx="12" cy="12" r="8.5" fill="#FFFFFF" />
          <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8c-3-2-6 1-8 0s-5-2-8 0z" fill="#E32934" />
          <path d="M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8c-3 2-6-1-8 0s-5 2-8 0z" fill="#004B93" />
        </svg>
      </PremiumBadge>
    );
  }

  // Oracle (ORCL)
  if (s === 'ORCL' || n.includes('oracle')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#F80000">
        <span className="text-[10px] font-black text-white font-sans tracking-tighter">ORCL</span>
      </PremiumBadge>
    );
  }

  // Broadcom (AVGO)
  if (s === 'AVGO' || n.includes('broadcom')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#CC092F">
        <span className="text-[9.5px] font-black text-white font-mono">AVGO</span>
      </PremiumBadge>
    );
  }

  // Eli Lilly (LLY)
  if (s === 'LLY' || n.includes('lilly')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#D52B1E">
        <span className="text-[11px] font-black text-white italic font-serif">Lilly</span>
      </PremiumBadge>
    );
  }

  // Exxon Mobil (XOM)
  if (s === 'XOM' || n.includes('exxon')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#ED1B2D">
        <span className="text-[10px] font-black text-white font-mono tracking-tight">XOM</span>
      </PremiumBadge>
    );
  }

  // Costco (COST)
  if (s === 'COST' || n.includes('costco')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#005DAA">
        <span className="text-[9.5px] font-black text-white font-sans tracking-tight">COST</span>
      </PremiumBadge>
    );
  }

  // TSMC (TSM)
  if (s === 'TSM' || n.includes('tsmc')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#002D62">
        <span className="text-[10px] font-black text-white font-mono tracking-widest">TSMC</span>
      </PremiumBadge>
    );
  }

  // Berkshire (BRK)
  if (s === 'BRK' || n.includes('berkshire')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#1E293B">
        <span className="text-[10.5px] font-black text-white font-serif">BRK</span>
      </PremiumBadge>
    );
  }

  // JPMorgan (JPM)
  if (s === 'JPM' || n.includes('jpmorgan')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#11253E">
        <span className="text-[10px] font-black text-white font-sans tracking-wider">JPM</span>
      </PremiumBadge>
    );
  }

  // Salesforce (CRM)
  if (s === 'CRM' || n.includes('salesforce')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#00A1E0">
        <span className="text-[10px] font-black text-white font-mono">CRM</span>
      </PremiumBadge>
    );
  }

  // Chevron (CVX)
  if (s === 'CVX' || n.includes('chevron')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#0054A6">
        <span className="text-[10px] font-black text-white font-mono">CVX</span>
      </PremiumBadge>
    );
  }

  // Bank of America (BAC)
  if (s === 'BAC' || n.includes('bank of america')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#012169">
        <span className="text-[10px] font-black text-white font-mono">BAC</span>
      </PremiumBadge>
    );
  }

  // Home Depot (HD)
  if (s === 'HD' || n.includes('home depot')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#F96302">
        <span className="text-[11px] font-black text-white font-mono">HD</span>
      </PremiumBadge>
    );
  }

  // Johnson & Johnson (JNJ)
  if (s === 'JNJ' || n.includes('johnson')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#D51900">
        <span className="text-[10px] font-black text-white italic font-serif">J&J</span>
      </PremiumBadge>
    );
  }

  // Procter & Gamble (PG)
  if (s === 'PG' || n.includes('procter') || n.includes('p&g')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#003CAE">
        <span className="text-[11px] font-black text-white italic font-serif">P&G</span>
      </PremiumBadge>
    );
  }

  // Cisco (CSCO)
  if (s === 'CSCO' || n.includes('cisco')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#049FD9">
        <span className="text-[9.5px] font-black text-white font-sans">CISCO</span>
      </PremiumBadge>
    );
  }

  // Qualcomm (QCOM)
  if (s === 'QCOM' || n.includes('qualcomm')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#3253DC">
        <span className="text-[9px] font-black text-white font-mono">QCOM</span>
      </PremiumBadge>
    );
  }

  // ARM Holdings (ARM)
  if (s === 'ARM' || n.includes('arm holdings')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#0091BD">
        <span className="text-[10.5px] font-black text-white font-mono">arm</span>
      </PremiumBadge>
    );
  }

  // Sony (SONY)
  if (s === 'SONY' || n.includes('sony')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#000000">
        <span className="text-[9.5px] font-black text-white font-mono tracking-wider">SONY</span>
      </PremiumBadge>
    );
  }

  // ==========================================
  // 8. CRYPTOCURRENCY ASSETS (Pure Instant Vector Badges)
  // ==========================================

  // Ethereum (ETH)
  if (s === 'ETH' || n.includes('ethereum')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#454A75" gradientTo="#2B2F4C">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <path d="M12 2.5L5.5 12.5L12 16.2L18.5 12.5L12 2.5Z" fill="#8A92B2" />
          <path d="M12 2.5L12 16.2L18.5 12.5L12 2.5Z" fill="#C0C5E0" />
          <path d="M12 17.2L5.5 13.5L12 22.5L18.5 13.5L12 17.2Z" fill="#62688F" />
          <path d="M12 17.2L18.5 13.5L12 22.5L12 17.2Z" fill="#8A92B2" />
        </svg>
      </PremiumBadge>
    );
  }

  // Solana (SOL)
  if (s === 'SOL' || n.includes('solana')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#000000">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <path d="M4 6.5C4.2 6.1 4.5 5.8 5 5.8H18.5C18.8 5.8 19.1 6.1 19 6.5L17.5 8.5C17.3 8.9 17 9.2 16.5 9.2H3C2.7 9.2 2.4 8.9 2.5 8.5L4 6.5Z" fill="url(#sol-v)" />
          <path d="M6 10.5C6.2 10.1 6.5 9.8 7 9.8H20.5C20.8 9.8 21.1 10.1 21 10.5L19.5 12.5C19.3 12.9 19 13.2 18.5 13.2H5C4.7 13.2 4.4 12.9 4.5 12.5L6 10.5Z" fill="url(#sol-m)" />
          <path d="M4 14.5C4.2 14.1 4.5 13.8 5 13.8H18.5C18.8 13.8 19.1 14.1 19 14.5L17.5 16.5C17.3 16.9 17 17.2 16.5 17.2H3C2.7 17.2 2.4 16.9 2.5 16.5L4 14.5Z" fill="url(#sol-c)" />
          <defs>
            <linearGradient id="sol-v" x1="4" y1="7" x2="19" y2="7" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9945FF" />
              <stop offset="1" stopColor="#14F195" />
            </linearGradient>
            <linearGradient id="sol-m" x1="6" y1="11" x2="21" y2="11" gradientUnits="userSpaceOnUse">
              <stop stopColor="#14F195" />
              <stop offset="1" stopColor="#9945FF" />
            </linearGradient>
            <linearGradient id="sol-c" x1="4" y1="15" x2="19" y2="15" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9945FF" />
              <stop offset="1" stopColor="#14F195" />
            </linearGradient>
          </defs>
        </svg>
      </PremiumBadge>
    );
  }

  // Ripple (XRP)
  if (s === 'XRP' || n.includes('ripple')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#1A1C20">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <path d="M19 4L14.5 8.5C13.1 9.9 10.9 9.9 9.5 8.5L5 4H2l5.5 5.5C9.7 11.7 14.3 11.7 16.5 9.5L22 4H19Z" fill="#FFFFFF" />
          <path d="M19 20L14.5 15.5C13.1 14.1 10.9 14.1 9.5 15.5L5 20H2l5.5-5.5C9.7 12.3 14.3 12.3 16.5 14.5L22 20H19Z" fill="#FFFFFF" />
        </svg>
      </PremiumBadge>
    );
  }

  // Dogecoin (DOGE)
  if (s === 'DOGE' || n.includes('doge')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#D8B132" gradientTo="#A68213">
        <div className="w-5/6 h-5/6 rounded-full border-2 border-[#FEF08A] flex items-center justify-center bg-gradient-to-b from-[#EAB308] to-[#CA8A04] shadow-inner">
          <span className="text-[13px] font-black text-white font-serif leading-none drop-shadow-xs">Ð</span>
        </div>
      </PremiumBadge>
    );
  }

  // Litecoin (LTC)
  if (s === 'LTC' || n.includes('litecoin')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#385D9A" gradientTo="#213E6B">
        <div className="w-5/6 h-5/6 rounded-full border-2 border-[#93C5FD] flex items-center justify-center bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] shadow-inner">
          <span className="text-[13px] font-black text-white font-mono leading-none drop-shadow-xs">Ł</span>
        </div>
      </PremiumBadge>
    );
  }

  // Polkadot (DOT)
  if (s === 'DOT' || n.includes('polkadot')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#E6007A" gradientTo="#7A0041">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <circle cx="12" cy="7" r="3.2" fill="#FFFFFF" />
          <circle cx="12" cy="17" r="3.2" fill="#FFFFFF" />
          <circle cx="6.5" cy="12" r="2.2" fill="#FFFFFF" />
          <circle cx="17.5" cy="12" r="2.2" fill="#FFFFFF" />
        </svg>
      </PremiumBadge>
    );
  }

  // Cardano (ADA)
  if (s === 'ADA' || n.includes('cardano')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#0033AD">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <circle cx="12" cy="12" r="3.5" fill="#FFFFFF" />
          <circle cx="12" cy="5" r="1.5" fill="#38BDF8" />
          <circle cx="12" cy="19" r="1.5" fill="#38BDF8" />
          <circle cx="5" cy="12" r="1.5" fill="#38BDF8" />
          <circle cx="19" cy="12" r="1.5" fill="#38BDF8" />
          <circle cx="7" cy="7" r="1.2" fill="#93C5FD" />
          <circle cx="17" cy="17" r="1.2" fill="#93C5FD" />
          <circle cx="17" cy="7" r="1.2" fill="#93C5FD" />
          <circle cx="7" cy="17" r="1.2" fill="#93C5FD" />
        </svg>
      </PremiumBadge>
    );
  }

  // Polygon (MATIC / POL)
  if (s === 'MATIC' || s === 'POL' || n.includes('polygon')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#8247E5" gradientTo="#5622B0">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <path d="M12 4L6 7.5V14.5L12 18L18 14.5V7.5L12 4Z" stroke="#FFFFFF" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M12 4V11L18 7.5M12 11L6 7.5M12 11V18" stroke="#FFFFFF" strokeWidth="1.8" />
        </svg>
      </PremiumBadge>
    );
  }

  // Chainlink (LINK)
  if (s === 'LINK' || n.includes('chainlink')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#375BD2">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" stroke="#FFFFFF" strokeWidth="2" fill="none" />
          <polygon points="12,7 16,9.5 16,14.5 12,17 8,14.5 8,9.5" fill="#FFFFFF" />
        </svg>
      </PremiumBadge>
    );
  }

  // Shiba Inu (SHIB)
  if (s === 'SHIB' || n.includes('shiba')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#FFA409" gradientTo="#E55302">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <circle cx="12" cy="12" r="9" fill="#FFA409" />
          <polygon points="5,6 8,11 3,11" fill="#FFFFFF" />
          <polygon points="19,6 16,11 21,11" fill="#FFFFFF" />
          <ellipse cx="12" cy="14" rx="4" ry="3" fill="#FFFFFF" />
          <circle cx="12" cy="13.5" r="1.5" fill="#18181B" />
        </svg>
      </PremiumBadge>
    );
  }

  // NEAR Protocol
  if (s === 'NEAR' || n.includes('near')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#000000">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <path d="M5 19L19 5M5 19V5M19 5v14" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </PremiumBadge>
    );
  }

  // Sui Network (SUI)
  if (s === 'SUI' || n.includes('sui')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#2A82E4" gradientTo="#165FB4">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <path d="M12 3c-4.5 5.5-6 9.5-6 13a6 6 0 0 0 12 0c0-3.5-1.5-7.5-6-13z" fill="#FFFFFF" />
        </svg>
      </PremiumBadge>
    );
  }

  // Aptos (APT)
  if (s === 'APT' || n.includes('aptos')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#18181B">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <path d="M4 18h16M6 13h12M8 8h8M12 3l8 15H4L12 3z" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </PremiumBadge>
    );
  }

  // Arbitrum (ARB)
  if (s === 'ARB' || n.includes('arbitrum')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#28A0F0" gradientTo="#1256A0">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <polygon points="12,3 20,8 20,16 12,21 4,16 4,8" stroke="#FFFFFF" strokeWidth="1.8" />
          <path d="M7 16l5-9 5 9M9.5 12h5" stroke="#FFFFFF" strokeWidth="1.8" />
        </svg>
      </PremiumBadge>
    );
  }

  // Optimism (OP)
  if (s === 'OP' || n.includes('optimism')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#FF0420">
        <span className="text-[11px] font-black text-white font-mono tracking-tight">OP</span>
      </PremiumBadge>
    );
  }

  // Celestia (TIA)
  if (s === 'TIA' || n.includes('celestia')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#7B2BF9" gradientTo="#C73BFB">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#FFFFFF" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="4" fill="#FFFFFF" />
        </svg>
      </PremiumBadge>
    );
  }

  // Injective (INJ)
  if (s === 'INJ' || n.includes('injective')) {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#00D2FF" gradientTo="#0072FF">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <path d="M6 18c4-12 8-12 12 0" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2.5" fill="#FFFFFF" />
        </svg>
      </PremiumBadge>
    );
  }

  // Stellar (XLM)
  if (s === 'XLM' || n.includes('stellar')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#000000">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#FFFFFF" strokeWidth="1.6" />
          <path d="M4 14l16-4M4 10l16 4" stroke="#FFFFFF" strokeWidth="1.6" />
        </svg>
      </PremiumBadge>
    );
  }

  // Monero (XMR)
  if (s === 'XMR' || n.includes('monero')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#FF6600">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#FFFFFF" strokeWidth="1.8" />
          <path d="M6 17V8l6 5 6-5v9" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </PremiumBadge>
    );
  }

  // Render Network (RENDER / RNDR)
  if (s === 'RENDER' || s === 'RNDR' || n.includes('render')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#E50914">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" fill="#FFFFFF" />
        </svg>
      </PremiumBadge>
    );
  }

  // Artificial Superintelligence Alliance (FET)
  if (s === 'FET' || s === 'ASI' || n.includes('fetch') || n.includes('artificial superintelligence')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#18181B">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#38BDF8" strokeWidth="1.8" />
          <path d="M8 12h8M12 8v8" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </PremiumBadge>
    );
  }

  // Bittensor (TAO)
  if (s === 'TAO' || n.includes('bittensor')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#000000">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
        </svg>
      </PremiumBadge>
    );
  }

  // Uniswap (UNI)
  if (s === 'UNI' || n.includes('uniswap')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#FF007A">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <path d="M12 4l3 7h-6l3-7z" fill="#FFFFFF" />
          <circle cx="12" cy="15" r="4" fill="#FFFFFF" />
        </svg>
      </PremiumBadge>
    );
  }

  // Bitcoin Cash (BCH)
  if (s === 'BCH' || n.includes('bitcoin cash')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#0AC18E">
        <span className="text-[13px] font-black text-white font-mono leading-none">₿</span>
      </PremiumBadge>
    );
  }

  // Cosmos (ATOM)
  if (s === 'ATOM' || n.includes('cosmos')) {
    return (
      <PremiumBadge size={size} className={className} bgColor="#2E3148">
        <svg viewBox="0 0 24 24" className="w-5/6 h-5/6" fill="none">
          <ellipse cx="12" cy="12" rx="8" ry="3.5" stroke="#FFFFFF" strokeWidth="1.2" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="8" ry="3.5" stroke="#FFFFFF" strokeWidth="1.2" transform="rotate(-30 12 12)" />
          <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
        </svg>
      </PremiumBadge>
    );
  }

  // Filecoin (FIL) / Internet Computer (ICP) / Ethereum Classic (ETC)
  if (s === 'FIL' || s === 'ICP' || s === 'ETC' || s === 'ALGO' || s === 'VET' || s === 'AAVE') {
    return (
      <PremiumBadge size={size} className={className} gradientFrom="#3B82F6" gradientTo="#1D4ED8">
        <span className="text-[10px] font-black text-white font-mono">{s}</span>
      </PremiumBadge>
    );
  }

  // ==========================================
  // 9. DEFAULT / FALLBACK (Clean Instant Branded Gradient Badge)
  // ==========================================
  const colors = [
    '#3B82F6', '#10B981', '#6366F1', '#EC4899', 
    '#8B5CF6', '#F59E0B', '#06B6D4', '#EF4444'
  ];
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = colors[Math.abs(hash) % colors.length];
  const displayLetters = s.length <= 4 ? s : s.substring(0, 3);

  return (
    <PremiumBadge size={size} className={className} bgColor={color}>
      <span className="text-[11px] font-bold text-white tracking-tight">
        {displayLetters}
      </span>
    </PremiumBadge>
  );
};

export const AssetLogo = React.memo(AssetLogoComponent);
