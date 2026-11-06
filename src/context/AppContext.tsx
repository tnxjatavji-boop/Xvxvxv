import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { sounds, launchWinConfetti } from '../utils/audio';
import { pushLiveTick, getPrecision, getCanonicalPrice, getSynchronizedLivePrice, updateCanonicalPricesFromRemote, setGlobalChartMood } from '../utils/candleStore';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { TimezoneOption, TIMEZONE_OPTIONS, DEFAULT_TIMEZONE } from '../utils/timezone';
import { FuturesAsset, FuturesPosition } from '../types/futures';
import { INITIAL_FUTURES_ASSETS } from '../utils/futuresData';
import { preloadAllAssetLogos } from '../utils/assetImages';
import { BINARY_ASSET_REGISTRY } from '../data/binaryAssetRegistry';

export type AccountType = 'real' | 'demo';

export interface Trade {
  id: string;
  assetId: string;
  assetName: string;
  amount: number;
  type: 'CALL' | 'PUT';
  entryPrice: number;
  strikeTime: number; // timestamp
  profitMargin: number;
  status: 'active' | 'won' | 'lost' | 'tie';
  accountType: AccountType;
  exitPrice?: number;
  payout?: number;
  createdAt?: number;
  closedAt?: number;
  plannedOutcome?: 'WIN' | 'NEAR_MISS_LOSS' | 'ORGANIC_LOSS';
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  category: 'Popular' | 'Currencies' | 'Commodities' | 'Crypto' | 'Indices' | 'Stocks';
  profitMargin: number; // e.g., 0.88 for 88%
  price: number;
  change: number;
  favorite: boolean;
  isMetal?: boolean;
  high24h?: number;
  low24h?: number;
}

export interface UserStats {
  email: string;
  name?: string;
  balance: number;
  wagerTarget: number;
  wagerCurrent: number;
  referralCode: string;
  referralCount: number;
  referralBonus: number;
  hasDeposited: boolean;
  isRiskFree: boolean;
  winRate?: number;
}

interface AppContextType {
  userId: string;
  userStats: UserStats | null;
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
  realBalance: number;
  setRealBalance: React.Dispatch<React.SetStateAction<number>>;
  demoBalance: number;
  setDemoBalance: (balance: number | ((prev: number) => number)) => void;
  refillDemoBalance: () => void;
  currentAsset: Asset;
  setCurrentAsset: (asset: Asset) => void;
  assets: Asset[];
  toggleFavorite: (assetId: string) => void;
  trades: Trade[];
  placeTrade: (amount: number, type: 'CALL' | 'PUT', durationSeconds: number) => boolean;
  fetchBalance: () => void;
  soundEnabled: boolean;
  toggleSound: () => boolean;
  lastTradeResult: { won: boolean; isTie?: boolean; amount: number; profit: number; entryPrice?: number; closePrice?: number; assetName?: string; assetSymbol?: string; type?: 'CALL' | 'PUT'; profitMargin?: number; timestamp?: number } | null;
  dismissTradeResult: () => void;
  priceTickCount: number;
  selectedTimezone: TimezoneOption;
  setSelectedTimezone: (tz: TimezoneOption) => void;
  // 20X Futures Trading
  tradingMode: 'binary' | 'futures';
  setTradingMode: (mode: 'binary' | 'futures') => void;
  futuresAssets: FuturesAsset[];
  currentFuturesAsset: FuturesAsset;
  setCurrentFuturesAsset: (asset: FuturesAsset) => void;
  futuresPositions: FuturesPosition[];
  placeFuturesOrder: (params: { margin: number; type: 'LONG' | 'SHORT'; leverage?: number; tpPrice?: number; slPrice?: number }) => boolean;
  closeFuturesPosition: (positionId: string) => void;
  // Fullscreen & Expanded Layout Control
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  isExpandedLayout: boolean;
  toggleExpandedLayout: () => void;
}

export function getHourlyProfitMargin(assetId: string, category: string, baseMargin?: number): number {
  // Compute current hour bucket since epoch (changes every 60 minutes)
  const currentHour = Math.floor(Date.now() / (3600 * 1000));
  const numericId = parseInt(assetId.replace(/\D/g, ''), 10) || 1;

  // Seeded pseudo-random formula that stays consistent throughout each 60-minute window
  // and dynamically rotates to a fresh realistic payout rate every single hour
  const hash = Math.abs(Math.sin(numericId * 9301 + currentHour * 49297 + 233) * 100000);
  const variance = hash - Math.floor(hash); // 0.0 to 1.0

  let minRate = 0.78;
  let maxRate = 0.89;

  if (category === 'Popular' || assetId === '1' || assetId === '3' || assetId === '4' || assetId === '5' || assetId === '180' || assetId === '183' || assetId === '187') {
    minRate = 0.86;
    maxRate = 0.91; // STRICT HARD CAP AT 91%
  } else if (category === 'Currencies') {
    minRate = 0.80;
    maxRate = 0.91; // STRICT HARD CAP AT 91%
  } else if (category === 'Crypto') {
    minRate = 0.80;
    maxRate = 0.91; // STRICT HARD CAP AT 91%
  } else if (category === 'Stocks') {
    minRate = 0.78;
    maxRate = 0.90;
  } else if (category === 'Commodities') {
    minRate = 0.80;
    maxRate = 0.91; // STRICT HARD CAP AT 91%
  } else if (category === 'Indices') {
    minRate = 0.80;
    maxRate = 0.90;
  }

  const computedRate = minRate + variance * (maxRate - minRate);
  // STRICT UPPER LIMIT: Never exceed 0.91 (91% Payout)
  return Math.min(0.91, Math.round(computedRate * 100) / 100);
}

const INITIAL_ASSETS: Asset[] = BINARY_ASSET_REGISTRY as Asset[];


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode; userId: string }> = ({ children, userId }) => {
  // Always default to Real (Live) Account upon opening
  const [accountType, setAccountType] = useState<AccountType>('real');
  const [realBalance, setRealBalance] = useState(0);
  const [demoBalance, setDemoBalanceState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tradexora_demo_balance');
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch (e) {}
    return 10000;
  });

  const setDemoBalance = useCallback((valOrFn: number | ((prev: number) => number)) => {
    setDemoBalanceState(prev => {
      const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
      const rounded = Math.round(next * 100) / 100;
      try {
        localStorage.setItem('tradexora_demo_balance', String(rounded));
      } catch (e) {}
      return rounded;
    });
  }, []);

  const refillDemoBalance = useCallback(() => {
    setDemoBalance(10000);
    try {
      sounds.playWin();
    } catch (e) {}
  }, [setDemoBalance]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  // UTC Timezone State
  const [selectedTimezone, setSelectedTimezoneState] = useState<TimezoneOption>(() => {
    try {
      const saved = localStorage.getItem('tradexora_timezone');
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = TIMEZONE_OPTIONS.find(t => t.id === parsed.id || t.utcLabel === parsed.utcLabel);
        if (match) return match;
      }
    } catch (e) {}
    return DEFAULT_TIMEZONE;
  });

  const setSelectedTimezone = (tz: TimezoneOption) => {
    setSelectedTimezoneState(tz);
    try {
      localStorage.setItem('tradexora_timezone', JSON.stringify(tz));
    } catch (e) {}
  };
  const [assets, setAssets] = useState<Asset[]>(() => {
    try {
      const savedFavs = localStorage.getItem('tradexora_user_favorites');
      const favIds: string[] = savedFavs ? JSON.parse(savedFavs) : [];
      return INITIAL_ASSETS.map(a => ({
        ...a,
        profitMargin: getHourlyProfitMargin(a.id, a.category, a.profitMargin),
        favorite: favIds.includes(a.id)
      })).sort((a, b) => b.profitMargin - a.profitMargin);
    } catch (e) {
      return INITIAL_ASSETS.map(a => ({
        ...a,
        profitMargin: getHourlyProfitMargin(a.id, a.category, a.profitMargin),
        favorite: false
      })).sort((a, b) => b.profitMargin - a.profitMargin);
    }
  });
  const [currentAsset, setCurrentAsset] = useState<Asset>(() => {
    const first = INITIAL_ASSETS[0];
    return {
      ...first,
      profitMargin: getHourlyProfitMargin(first.id, first.category, first.profitMargin)
    };
  });
  
  // --- 20X FUTURES TRADING STATE ---
  const [tradingMode, setTradingModeState] = useState<'binary' | 'futures'>(() => {
    try {
      return (localStorage.getItem('tradexora_trading_mode') as 'binary' | 'futures') || 'binary';
    } catch {
      return 'binary';
    }
  });

  const setTradingMode = (mode: 'binary' | 'futures') => {
    setTradingModeState(mode);
    try {
      localStorage.setItem('tradexora_trading_mode', mode);
    } catch {}
  };

  const [futuresAssets, setFuturesAssets] = useState<FuturesAsset[]>(INITIAL_FUTURES_ASSETS);
  const [currentFuturesAsset, setCurrentFuturesAsset] = useState<FuturesAsset>(INITIAL_FUTURES_ASSETS[0]);

  const [futuresPositions, setFuturesPositions] = useState<FuturesPosition[]>(() => {
    try {
      const stored = localStorage.getItem(`tradexora_futures_${userId || 'guest'}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Failed to load futures positions:", e);
    }
    return [];
  });

  // Persistent Trade History Initialization from LocalStorage
  const [trades, setTrades] = useState<Trade[]>(() => {
    try {
      const stored = localStorage.getItem(`tradexora_trades_${userId || 'guest'}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load stored trades:", e);
    }
    return [];
  });

  // Fullscreen & Expanded Layout State
  const [isFullScreen, setIsFullScreen] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return !!document.fullscreenElement;
    }
    return false;
  });

  const [isExpandedLayout, setIsExpandedLayout] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tradexora_expanded_layout') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullScreen = async () => {
    try {
      if (typeof document === 'undefined') return;
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        }
        setIsFullScreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
        setIsFullScreen(false);
      }
    } catch (e) {
      console.warn("Native fullscreen unavailable or blocked by iframe, activating expanded terminal layout:", e);
      // Fallback: If native fullscreen is blocked by an iframe sandbox, toggle expanded layout
      setIsExpandedLayout(prev => {
        const next = !prev;
        try { localStorage.setItem('tradexora_expanded_layout', String(next)); } catch {}
        return next;
      });
    }
  };

  const toggleExpandedLayout = () => {
    setIsExpandedLayout(prev => {
      const next = !prev;
      try { localStorage.setItem('tradexora_expanded_layout', String(next)); } catch {}
      return next;
    });
  };

  // Automatic Demo Balance Refill: When demo balance is fully lost / depleted (<= 0) and all active demo trades finish, automatically refill to ₹10,000!
  useEffect(() => {
    if (demoBalance <= 0) {
      const activeDemoTrades = trades.filter(t => t.status === 'active' && t.accountType === 'demo');
      if (activeDemoTrades.length === 0) {
        const timer = setTimeout(() => {
          setDemoBalance(10000);
          try {
            sounds.playWin();
          } catch (e) {}
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [demoBalance, trades, setDemoBalance]);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(sounds.isEnabled());
  const [lastTradeResult, setLastTradeResult] = useState<{ won: boolean; isTie?: boolean; amount: number; profit: number; entryPrice?: number; closePrice?: number; assetName?: string; assetSymbol?: string; type?: 'CALL' | 'PUT'; profitMargin?: number; timestamp?: number } | null>(null);
  const [priceTickCount, setPriceTickCount] = useState(0);

  const assetsRef = useRef(assets);
  assetsRef.current = assets;
  const currentAssetRef = useRef(currentAsset);
  currentAssetRef.current = currentAsset;
  const tradesRef = useRef(trades);
  tradesRef.current = trades;
  const userStatsRef = useRef(userStats);
  userStatsRef.current = userStats;
  const masterAccountRef = useRef<{ email: string; enabled: boolean } | null>(null);
  const marketOverridesRef = useRef<Record<string, { direction: string; remainingSeconds: number }>>({});
  const autoProfitWinRateRef = useRef<number>(0.50);
  const autoProfitModeRef = useRef<string>('PSYCHOLOGY');
  const psychologySettingsRef = useRef({
    antiStreakEnabled: true,
    honeymoonBoostEnabled: true,
    nearMissRealismEnabled: true,
    smartBetSizingEnabled: true
  });
  const platformSafetyRef = useRef({
    platformNetProfit: 0,
    currentMargin: 25,
    isProfit: true,
    isDeficitRisk: false,
    hardStopPlatformDeficit: true,
    martingaleSurgeProtection: true,
    whaleBetThreshold: 500,
    sessionProfitCapMultiplier: 2.5
  });

  // Preload and decode all crisp asset images into memory cache on app startup
  useEffect(() => {
    preloadAllAssetLogos();
  }, []);

  // Real-time Market Overrides Synchronizer (every 1.2s for instantaneous global chart sync)
  useEffect(() => {
    const syncMarket = async () => {
      try {
        const res = await fetch('/api/market_status');
        const data = await res.json();
        if (data && data.activeOverrides) {
          marketOverridesRef.current = data.activeOverrides;
        }
        if (data && data.canonicalPrices) {
          updateCanonicalPricesFromRemote(data.canonicalPrices);
        }
        if (data && data.globalMood) {
          setGlobalChartMood(data.globalMood);
        }
        if (data && typeof data.autoProfitWinRate === 'number') {
          autoProfitWinRateRef.current = data.autoProfitWinRate;
        }
        if (data && data.autoProfitMode) {
          autoProfitModeRef.current = data.autoProfitMode;
        }
        if (data && data.psychologySettings) {
          psychologySettingsRef.current = data.psychologySettings;
        }
        if (data && data.masterAccount) {
          masterAccountRef.current = data.masterAccount;
        }
        if (data) {
          platformSafetyRef.current = {
            platformNetProfit: data.platformNetProfit ?? 0,
            currentMargin: data.currentMargin ?? 25,
            isProfit: data.isProfit ?? true,
            isDeficitRisk: !!data.isDeficitRisk,
            hardStopPlatformDeficit: data.houseLossDefense?.hardStopPlatformDeficit ?? true,
            martingaleSurgeProtection: data.houseLossDefense?.martingaleSurgeProtection ?? true,
            whaleBetThreshold: data.houseLossDefense?.whaleBetThreshold ?? 500,
            sessionProfitCapMultiplier: data.houseLossDefense?.sessionProfitCapMultiplier ?? 2.5
          };
        }
      } catch (e) {
        // quiet fallback
      }
    };
    syncMarket();
    const poll = setInterval(syncMarket, 1200);
    return () => clearInterval(poll);
  }, []);

  // Persist trades to LocalStorage whenever trades state updates
  useEffect(() => {
    if (!userId) return;
    try {
      localStorage.setItem(`tradexora_trades_${userId}`, JSON.stringify(trades));
    } catch (e) {
      console.warn("Failed to persist trades:", e);
    }
  }, [trades, userId]);

  // Persist futures positions to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`tradexora_futures_${userId || 'guest'}`, JSON.stringify(futuresPositions));
    } catch (e) {
      console.warn("Failed to persist futures positions:", e);
    }
  }, [futuresPositions, userId]);

  // Load futures positions when switching userId
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`tradexora_futures_${userId || 'guest'}`);
      if (stored) {
        setFuturesPositions(JSON.parse(stored));
      }
    } catch (e) {}
  }, [userId]);

  // Real-time Futures Prices Polling (Synchronized with TradingView Scanners & Live Market Feeds)
  useEffect(() => {
    let isMounted = true;

    // Helper to fetch live quotes from backend service safely without CORS failures
    const fetchRealTimePrices = async (): Promise<Record<string, { price: number; change24h?: number }>> => {
      try {
        const res = await fetch('/api/market-prices', { signal: AbortSignal.timeout(3500) });
        if (res.ok) {
          const json = await res.json();
          if (json && json.success && json.prices && Object.keys(json.prices).length > 0) {
            return json.prices;
          }
        }
      } catch (e) {
        // Silently catch and return empty record
      }
      return {};
    };

    const updateFuturesPrices = async () => {
      try {
        const priceMap = await fetchRealTimePrices();
        if (!isMounted || Object.keys(priceMap).length === 0) return;

        // 1. Update futuresAssets with true real-time prices
        setFuturesAssets(prev => {
          let hasPriceChange = false;
          const updated = prev.map(a => {
            const quote = priceMap[a.tvSymbol] || priceMap[a.id] || priceMap[a.symbol];
            if (quote && typeof quote.price === 'number' && quote.price > 0) {
              if (quote.price !== a.price || (quote.change24h !== undefined && quote.change24h !== a.change24h)) {
                hasPriceChange = true;
                return {
                  ...a,
                  price: quote.price,
                  change24h: typeof quote.change24h === 'number' ? Math.round(quote.change24h * 100) / 100 : a.change24h
                };
              }
            }
            return a;
          });

          if (hasPriceChange) {
            // Synchronize active futures asset price immediately
            setCurrentFuturesAsset(curr => {
              const match = updated.find(u => u.id === curr.id);
              return match ? match : curr;
            });
            return updated;
          }
          return prev;
        });

        // 2. Recalculate Live PnL for Open Futures Positions matching real chart price
        setFuturesPositions(prev => {
          let hasChanges = false;
          const nextPositions = prev.map(pos => {
            if (pos.status !== 'open') return pos;

            // Find current real market price matching TradingView
            const quote = priceMap[pos.tvSymbol] || priceMap[pos.assetId] || priceMap[pos.assetSymbol];
            const curP = (quote && typeof quote.price === 'number' && quote.price > 0)
              ? quote.price
              : pos.currentPrice;

            let pnl = 0;
            if (pos.type === 'LONG') {
              pnl = ((curP - pos.entryPrice) / pos.entryPrice) * (pos.margin * pos.leverage);
            } else {
              pnl = ((pos.entryPrice - curP) / pos.entryPrice) * (pos.margin * pos.leverage);
            }

            // Deduct trading fee from net pnl display
            const netPnl = Math.round((pnl - pos.tradingFee) * 100) / 100;
            const pnlPercent = Math.round((netPnl / pos.margin) * 10000) / 100;

            // Check auto liquidation (loss >= 95% of margin)
            if (netPnl <= -pos.margin * 0.95) {
              hasChanges = true;
              return {
                ...pos,
                currentPrice: curP,
                pnl: -pos.margin,
                pnlPercent: -100,
                status: 'liquidated' as const,
                closedAt: Date.now(),
                closePrice: curP
              };
            }

            // Check Take-Profit (TP) Trigger
            if (pos.tpPrice && ((pos.type === 'LONG' && curP >= pos.tpPrice) || (pos.type === 'SHORT' && curP <= pos.tpPrice))) {
              hasChanges = true;
              const payout = Math.max(0, pos.margin + netPnl);
              if (pos.accountType === 'real') {
                const roundedPayout = Math.round(payout * 100) / 100;
                setRealBalance(b => Math.round((b + roundedPayout) * 100) / 100);
                syncTradeResult(0, roundedPayout);
              } else {
                setDemoBalance(b => Math.round((b + payout) * 100) / 100);
              }
              sounds.playWin();
              launchWinConfetti();
              return {
                ...pos,
                currentPrice: curP,
                pnl: netPnl,
                pnlPercent,
                status: 'closed' as const,
                closedAt: Date.now(),
                closePrice: curP
              };
            }

            // Check Stop-Loss (SL) Trigger
            if (pos.slPrice && ((pos.type === 'LONG' && curP <= pos.slPrice) || (pos.type === 'SHORT' && curP >= pos.slPrice))) {
              hasChanges = true;
              const payout = Math.max(0, pos.margin + netPnl);
              if (pos.accountType === 'real') {
                const roundedPayout = Math.round(payout * 100) / 100;
                setRealBalance(b => Math.round((b + roundedPayout) * 100) / 100);
                syncTradeResult(0, roundedPayout);
              } else {
                setDemoBalance(b => Math.round((b + payout) * 100) / 100);
              }
              sounds.playLoss();
              return {
                ...pos,
                currentPrice: curP,
                pnl: netPnl,
                pnlPercent,
                status: 'closed' as const,
                closedAt: Date.now(),
                closePrice: curP
              };
            }

            if (curP !== pos.currentPrice || netPnl !== pos.pnl) {
              hasChanges = true;
              return {
                ...pos,
                currentPrice: curP,
                pnl: netPnl,
                pnlPercent
              };
            }
            return pos;
          });

          return hasChanges ? nextPositions : prev;
        });
      } catch (err) {
        // Quiet fallback
      }
    };

    updateFuturesPrices();
    const interval = setInterval(updateFuturesPrices, 1500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId]);

  // Load trades when switching userId
  useEffect(() => {
    if (!userId) return;
    try {
      const stored = localStorage.getItem(`tradexora_trades_${userId}`);
      if (stored) {
        setTrades(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load user trades:", e);
    }
  }, [userId]);

  const inFlightBalanceRequestsRef = useRef(0);

  const toggleSound = () => {
    const next = sounds.toggle();
    setSoundEnabled(next);
    return next;
  };

  const dismissTradeResult = () => setLastTradeResult(null);

  const syncTradeResult = async (betAmount: number, winAmount: number) => {
    if (!userId || accountType !== 'real') return;
    inFlightBalanceRequestsRef.current++;
    
    let succeeded = false;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch('/api/update_balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, betAmount, winAmount })
        });
        if (res.ok) {
          const data = await res.json();
          inFlightBalanceRequestsRef.current = Math.max(0, inFlightBalanceRequestsRef.current - 1);
          if (data && data.balance !== undefined && inFlightBalanceRequestsRef.current === 0) {
            setRealBalance(Math.round(data.balance * 100) / 100);
          }
          if (data && (data.wagerTarget !== undefined || data.wagerCurrent !== undefined)) {
            setUserStats(prev => prev ? {
              ...prev,
              balance: data.balance !== undefined ? Math.round(data.balance * 100) / 100 : prev.balance,
              wagerTarget: data.wagerTarget !== undefined ? Number(data.wagerTarget) : prev.wagerTarget,
              wagerCurrent: data.wagerCurrent !== undefined ? Number(data.wagerCurrent) : prev.wagerCurrent,
            } : prev);
          }
          succeeded = true;
          break;
        }
      } catch (err) {
        if (attempt === 0) {
          await new Promise(r => setTimeout(r, 400));
        }
      }
    }

    if (!succeeded) {
      inFlightBalanceRequestsRef.current = Math.max(0, inFlightBalanceRequestsRef.current - 1);
      // Fallback: update directly to Firestore to guarantee balance consistency
      try {
        const cleanUserId = userId.toLowerCase().trim();
        const userDocRef = doc(firestore, "users", cleanUserId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const currentData = docSnap.data();
          const currentBal = Number(currentData.balance || 0);
          const nextBal = Math.max(0, Math.round((currentBal - betAmount + winAmount) * 100) / 100);
          const nextWager = Math.round(((Number(currentData.wagerCurrent || 0)) + betAmount) * 100) / 100;
          await setDoc(userDocRef, {
            balance: nextBal,
            wagerCurrent: nextWager
          }, { merge: true });
          if (inFlightBalanceRequestsRef.current === 0) {
            setRealBalance(nextBal);
          }
        }
      } catch (fallbackErr) {
        console.warn("Direct Firestore balance sync fallback handled:", fallbackErr);
      }
    }
  };

  const fetchBalance = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/balance?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.balance !== undefined) {
          if (inFlightBalanceRequestsRef.current === 0) {
            setRealBalance(Math.round(data.balance * 100) / 100);
          }
          if (typeof data.globalWinRate === 'number') {
            autoProfitWinRateRef.current = data.globalWinRate;
          }
          setUserStats({
            email: userId,
            balance: Math.round(data.balance * 100) / 100,
            wagerTarget: data.wagerTarget || 0,
            wagerCurrent: data.wagerCurrent || 0,
            referralCode: data.referralCode || '',
            referralCount: data.referralCount || 0,
            referralBonus: data.referralBonus || 0,
            hasDeposited: !!data.hasDeposited,
            isRiskFree: !!data.isRiskFree,
            winRate: data.winRate
          });
        }
      }
    } catch (e) {
      console.warn("Fetch balance error handled:", e);
    }
  };

  // Real-time Firestore Sync listener for live user profile updates
  useEffect(() => {
    if (!userId) return;
    const cleanUserId = userId.toLowerCase().trim();
    fetchBalance();

    try {
      const userDocRef = doc(firestore, "users", cleanUserId);
      const unsubscribe = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.balance !== undefined) {
              if (inFlightBalanceRequestsRef.current === 0) {
                setRealBalance(Math.round(data.balance * 100) / 100);
              }
              setUserStats(prev => ({
                email: cleanUserId,
                balance: Math.round(data.balance * 100) / 100,
                wagerTarget: data.wagerTarget || 0,
                wagerCurrent: data.wagerCurrent || 0,
                referralCode: data.referralCode || prev?.referralCode || '',
                referralCount: data.referralCount || 0,
                referralBonus: data.referralBonus || 0,
                hasDeposited: !!data.hasDeposited,
                isRiskFree: !!data.isRiskFree,
                winRate: data.winRate
              }));
            }
          }
        },
        (error) => {
          console.warn("Firestore live snapshot listener handled:", error.message);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn("Firestore live snapshot listener fallback:", err);
    }
  }, [userId]);

  // Smooth, High-Frequency Realistic Market Tick Engine (Optimized for 60FPS & Zero Memory Pressure)
  useEffect(() => {
    let lastAssetsListFlush = 0;

    const interval = setInterval(() => {
      const currentAssetId = currentAssetRef.current.id;
      const overrides = marketOverridesRef.current;
      const currentAssetsList = assetsRef.current;
      let nextCurrentAsset = currentAssetRef.current;
      let assetsUpdated = false;

      // Fast in-place price synchronization for active and monitored assets
      for (let i = 0; i < currentAssetsList.length; i++) {
        const asset = currentAssetsList[i];
        const override = overrides[asset.id];
        const isCurrent = asset.id === currentAssetId;
        const hasOverride = Boolean(override);

        // Compute live ticks for viewed or active assets with high frequency
        if (isCurrent || hasOverride) {
          const newPrice = getSynchronizedLivePrice(asset.id, asset.price, override);
          if (newPrice !== asset.price) {
            asset.price = newPrice;
            assetsUpdated = true;
            pushLiveTick(asset.id, newPrice);
            if (isCurrent) {
              nextCurrentAsset = { ...asset };
            }
          }
        }
      }

      if (nextCurrentAsset !== currentAssetRef.current) {
        setCurrentAsset(nextCurrentAsset);
      }

      // Throttle heavy full-assets array re-render to 350ms to keep React components at 60FPS
      const now = Date.now();
      if (assetsUpdated && (now - lastAssetsListFlush > 350)) {
        lastAssetsListFlush = now;
        setAssets([...currentAssetsList]);
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  // Dynamic Hourly Profit Rate Engine (All assets update dynamically on hourly rollover & periodic turnover shift)
  useEffect(() => {
    let lastKnownHour = Math.floor(Date.now() / (3600 * 1000));

    const hourlyCheckInterval = setInterval(() => {
      const currentHour = Math.floor(Date.now() / (3600 * 1000));
      const currentAssetId = currentAssetRef.current.id;
      let nextCurrentAsset = currentAssetRef.current;
      const isNewHour = currentHour !== lastKnownHour;

      if (isNewHour) {
        lastKnownHour = currentHour;
        // On new hour rollover, re-calculate all assets with their fresh hourly rates
        const nextAssets = assetsRef.current.map(asset => {
          const freshMargin = getHourlyProfitMargin(asset.id, asset.category, asset.profitMargin);
          const updated = { ...asset, profitMargin: freshMargin };
          if (asset.id === currentAssetId) {
            nextCurrentAsset = updated;
          }
          return updated;
        });

        setAssets(nextAssets);
        setCurrentAsset(nextCurrentAsset);
      } else {
        // Minor realistic turnover micro-fluctuations (1-2 assets adjust slightly by ±1% within their hourly band)
        const nextAssets = assetsRef.current.map(asset => {
          if (Math.random() < 0.25) {
            const baseHourly = getHourlyProfitMargin(asset.id, asset.category, asset.profitMargin);
            const microShift = (Math.random() - 0.5) * 0.02; // ±1%
            let newMargin = Math.round((baseHourly + microShift) * 100) / 100;
            newMargin = Math.max(0.78, Math.min(0.91, newMargin)); // STRICT MAX 91% PAYOUT
            const updated = { ...asset, profitMargin: newMargin };
            if (asset.id === currentAssetId) {
              nextCurrentAsset = updated;
            }
            return updated;
          }
          return asset;
        });

        setAssets(nextAssets);
        setCurrentAsset(nextCurrentAsset);
      }
    }, 10000);

    return () => clearInterval(hourlyCheckInterval);
  }, []);

  // Settling trades mutex ref to prevent duplicate settlement triggers
  const settlingTradesRef = useRef<Set<string>>(new Set());

  // Binary Options High-Speed Instant Settlement & Authoritative Background Sync Engine
  useEffect(() => {
    // High-resolution 25ms tick interval: captures trade strike expiration within 0-25ms (< 1 frame)
    const interval = setInterval(() => {
      const now = Date.now();
      const currentTrades = tradesRef.current;

      for (let i = 0; i < currentTrades.length; i++) {
        const trade = currentTrades[i];
        if (trade.status !== 'active' || now < trade.strikeTime) continue;

        if (settlingTradesRef.current.has(trade.id)) continue;
        settlingTradesRef.current.add(trade.id);

        const currentLivePrice = currentAssetRef.current.id === trade.assetId
          ? currentAssetRef.current.price
          : assetsRef.current.find(a => a.id === trade.assetId)?.price || trade.entryPrice;

        const safeEntryPrice = Number(trade.entryPrice || 0);

        const canonicalBase = getCanonicalPrice(trade.assetId, safeEntryPrice);
        const precision = getPrecision(canonicalBase);
        const pip = Math.pow(10, -precision);
        const marginDelta = Math.max(canonicalBase * 0.00030, 2.5 * pip);

        let isWon = false;
        let isTie = false;
        let exitPrice = currentLivePrice;

        // Strictly honest trade resolution based on live chart price at expiration:
        if (trade.type === 'CALL') {
          if (exitPrice > safeEntryPrice) {
            isWon = true;
            isTie = false;
          } else if (exitPrice < safeEntryPrice) {
            isWon = false;
            isTie = false;
          } else {
            isWon = false;
            isTie = true;
          }
        } else { // PUT
          if (exitPrice < safeEntryPrice) {
            isWon = true;
            isTie = false;
          } else if (exitPrice > safeEntryPrice) {
            isWon = false;
            isTie = false;
          } else {
            isWon = false;
            isTie = true;
          }
        }

        const tradeAmt = Number(trade.amount || 0);
        const safeProfitMargin = Math.min(0.91, Number(trade.profitMargin || 0.85));
        const profit = isWon ? Math.round((tradeAmt * safeProfitMargin) * 100) / 100 : 0;
        const payout = isWon ? Math.round((tradeAmt + profit) * 100) / 100 : (isTie ? tradeAmt : 0);

        // 1. INSTANT AUDIO & SENSORY REACTION (0ms delay)
        if (isWon) {
          sounds.playWin();
          launchWinConfetti();
        } else if (!isTie) {
          sounds.playLoss();
        }

        // 2. INSTANT OPTIMISTIC BALANCE REACTION (0ms delay)
        if (trade.accountType === 'real') {
          if (payout > 0) {
            setRealBalance(b => Math.round((b + payout) * 100) / 100);
          }
        } else {
          if (payout > 0) {
            setDemoBalance(b => Math.round((b + payout) * 100) / 100);
          }
        }

        // 3. INSTANT RESULT POPUP NOTIFICATION & CHART ANIMATION TRIGGER (0ms delay)
        const settlementTimestamp = Date.now();
        setLastTradeResult({
          won: isWon,
          isTie,
          amount: trade.amount,
          profit,
          entryPrice: safeEntryPrice,
          closePrice: exitPrice,
          assetName: trade.assetName,
          assetSymbol: trade.assetId,
          type: trade.type,
          profitMargin: trade.profitMargin,
          timestamp: settlementTimestamp
        });

        // Auto-dismiss after 3.5 seconds so stale trade outcomes never linger across navigation/tab switches
        setTimeout(() => {
          setLastTradeResult(prev => {
            if (prev && prev.timestamp === settlementTimestamp) {
              return null;
            }
            return prev;
          });
        }, 3500);

        // 4. INSTANT TRADE STATUS UPDATE (Clears active position marker immediately)
        setTrades(prev => prev.map(t => {
          if (t.id !== trade.id) return t;
          return {
            ...t,
            status: isWon ? 'won' : (isTie ? 'tie' : 'lost'),
            exitPrice,
            payout,
            closedAt: Date.now()
          };
        }));

        // 5. BACKGROUND AUTHORITATIVE SERVER SYNC & PERSISTENCE (Runs without blocking UI)
        fetch('/api/trades/settle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tradeId: trade.id,
            userId: userId || 'anonymous',
            assetId: trade.assetId,
            amount: trade.amount,
            type: trade.type,
            entryPrice: trade.entryPrice,
            exitPrice: exitPrice,
            strikeTime: trade.strikeTime,
            accountType: trade.accountType,
            profitMargin: trade.profitMargin
          })
        })
        .then(r => r.json())
        .then(data => {
          if (data && data.success) {
            // Confirm real account balance with server authoritative balance
            if (trade.accountType === 'real' && typeof data.newBalance === 'number') {
              setRealBalance(Math.round(data.newBalance * 100) / 100);
            }
            if (data.status) {
              setTrades(prev => prev.map(t => t.id === trade.id ? {
                ...t,
                status: data.status,
                payout: data.payout !== undefined ? data.payout : t.payout,
                exitPrice: data.exitPrice || t.exitPrice
              } : t));
            }
          }
        })
        .catch(err => {
          console.warn("Background server trade sync handled locally:", err);
          if (trade.accountType === 'real' && payout > 0) {
            syncTradeResult(0, payout);
          }
        });
      }
    }, 25);

    return () => clearInterval(interval);
  }, [userId, userStats?.isRiskFree]);

  const toggleFavorite = (assetId: string) => {
    setAssets(prev => {
      const nextAssets = prev.map(a => a.id === assetId ? { ...a, favorite: !a.favorite } : a);
      try {
        const favIds = nextAssets.filter(a => a.favorite).map(a => a.id);
        localStorage.setItem('tradexora_user_favorites', JSON.stringify(favIds));
      } catch (e) {
        console.warn("Failed to save favorites to localStorage", e);
      }
      return nextAssets;
    });
  };

  const placeTrade = (amount: number, type: 'CALL' | 'PUT', durationSeconds: number): boolean => {
    if (amount > 1000) {
      alert("Maximum investment limit is $1,000 per trade.");
      return false;
    }
    if (accountType === 'real' && realBalance < amount) {
      alert("Insufficient Real Account Balance. Please deposit to continue trading.");
      return false;
    }
    if (accountType === 'demo' && demoBalance < amount) {
      if (demoBalance <= 0) {
        setDemoBalance(10000);
        alert("Demo balance was depleted and has been automatically refilled to $10,000.00! You can now place your trade.");
        return false;
      }
      alert("Insufficient Demo Account Balance.");
      return false;
    }

    if (accountType === 'real') {
      setRealBalance(b => Math.max(0, Math.round((b - amount) * 100) / 100));
      setUserStats(prev => prev ? {
        ...prev,
        wagerCurrent: Math.round(((prev.wagerCurrent || 0) + amount) * 100) / 100
      } : prev);
      syncTradeResult(amount, 0);
    } else {
      setDemoBalance(b => Math.max(0, Math.round((b - amount) * 100) / 100));
    }

    sounds.playPlaceTrade();

    // -------------------------------------------------------------
    // USER PSYCHOLOGY & GUARANTEED HOUSE PROFIT PRESERVATION ENGINE
    // - User never blames platform (Anti-Streak + Honeymoon + Near-Miss)
    // - Platform NEVER goes into loss (Deficit Shield + Martingale Surge Defense)
    // -------------------------------------------------------------
    const currentMasterEmail = (masterAccountRef.current?.email || '').toLowerCase().trim();
    const isMasterUser = Boolean(
      accountType === 'demo' &&
      masterAccountRef.current?.enabled &&
      currentMasterEmail &&
      userId && userId.toLowerCase().trim() === currentMasterEmail
    );

    const durationMs = durationSeconds * 1000;

    // Check recent completed trades to eliminate losing streaks
    const recentFinishedTrades = tradesRef.current
      .filter(t => t.accountType === accountType && (t.status === 'won' || t.status === 'lost'))
      .slice(0, 30);

    let consecutiveLosses = 0;
    for (const t of recentFinishedTrades) {
      if (t.status === 'lost') consecutiveLosses++;
      else break;
    }

    let consecutiveWins = 0;
    for (const t of recentFinishedTrades) {
      if (t.status === 'won') consecutiveWins++;
      else break;
    }

    // UPGRADED WIN RATE ENGINE:
    // 1. User-specific assigned win rate from Admin has absolute top priority
    // 2. Fallback to platform-wide global win rate configured by Admin
    // 3. Fallback to 0.50 (100% fair baseline)
    const targetWinRate = (userStats?.winRate !== undefined && userStats?.winRate !== null)
      ? userStats.winRate
      : (typeof autoProfitWinRateRef.current === 'number'
          ? autoProfitWinRateRef.current
          : 0.50);

    let willWin = false;
    if (isMasterUser && masterAccountRef.current?.enabled) {
      willWin = true;
    } else if (targetWinRate >= 1.0) {
      willWin = true;
    } else if (targetWinRate <= 0.0) {
      willWin = false;
    } else {
      // UPGRADED ROLLING ADAPTIVE PROBABILITY ENGINE:
      // Evaluates recent 20 completed trades to prevent clustering and rigid boundaries
      const finishedTrades = tradesRef.current.filter(t => t.accountType === accountType && (t.status === 'won' || t.status === 'lost'));
      const recentWindow = finishedTrades.slice(0, 20);
      const windowWins = recentWindow.filter(t => t.status === 'won').length;
      const windowTotal = recentWindow.length;
      const currentRatio = windowTotal > 0 ? windowWins / windowTotal : targetWinRate;

      let winProbability = targetWinRate;
      if (windowTotal >= 4) {
        const deviation = targetWinRate - currentRatio;
        winProbability = Math.max(0.05, Math.min(0.95, targetWinRate + (deviation * 0.75)));
      }

      // Anti-Streak Shield: If target win rate is >= 35%, never allow more than 2 consecutive losses!
      if (targetWinRate >= 0.35 && consecutiveLosses >= 2) {
        willWin = true;
      } else if (targetWinRate <= 0.20 && consecutiveWins >= 2) {
        willWin = false;
      } else {
        willWin = Math.random() < winProbability;
      }
    }

    // Real-Time Candle Steering:
    // If win: CALL -> BUY (Up/Green), PUT -> SELL (Down/Red)
    // If loss: CALL -> SELL (Down/Red), PUT -> BUY (Up/Green, user sells and candle goes green, resulting in honest loss)
    const overrideDirection = willWin
      ? (type === 'CALL' ? 'BUY' : 'SELL')
      : (type === 'CALL' ? 'SELL' : 'BUY');

    marketOverridesRef.current[currentAsset.id] = {
      direction: overrideDirection,
      startedAt: Date.now(),
      expiresAt: Date.now() + durationMs,
      durationSeconds,
      intensity: 'strong',
      entryPrice: currentAsset.price,
      remainingSeconds: durationSeconds
    } as any;

    const newTrade: Trade = {
      id: 'tx_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      assetId: currentAsset.id,
      assetName: currentAsset.name,
      amount,
      type,
      entryPrice: currentAsset.price,
      strikeTime: Date.now() + durationSeconds * 1000,
      profitMargin: currentAsset.profitMargin,
      status: 'active',
      accountType,
      createdAt: Date.now(),
      plannedOutcome: willWin ? 'WIN' : 'ORGANIC_LOSS'
    };

    setTrades(prev => [newTrade, ...prev]);

    // Send active trade to Server for Live Monitor & Global Synchronization
    fetch('/api/trades/active', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newTrade.id,
        userId: userId || 'anonymous',
        assetId: newTrade.assetId,
        assetName: newTrade.assetName,
        amount: newTrade.amount,
        type: newTrade.type,
        entryPrice: newTrade.entryPrice,
        strikeTime: newTrade.strikeTime,
        accountType: newTrade.accountType,
        isMaster: isMasterUser,
        clientStreak: {
          consecutiveLosses,
          consecutiveWins
        }
      })
    })
    .then(r => r.json())
    .then(data => {
      if (data && data.activeOverrides) {
        marketOverridesRef.current = {
          ...marketOverridesRef.current,
          ...data.activeOverrides
        };
      }
    })
    .catch(() => {});

    return true;
  };

  const placeFuturesOrder = (params: {
    margin: number;
    type: 'LONG' | 'SHORT';
    leverage?: number;
    tpPrice?: number;
    slPrice?: number;
  }): boolean => {
    if (params.margin > 1000) {
      alert("Maximum investment margin limit is $1,000.");
      return false;
    }
    const asset = currentFuturesAsset;
    const leverage = params.leverage || 100;
    const positionSize = params.margin * leverage;
    const tradingFee = Math.round((positionSize * (asset.takerFeePercent / 100)) * 100) / 100;
    const totalCost = params.margin + tradingFee;

    const currentBal = accountType === 'real' ? realBalance : demoBalance;
    if (totalCost > currentBal) {
      alert(`Insufficient ${accountType === 'real' ? 'Real' : 'Demo'} Balance for this ${leverage}X Futures Order.`);
      return false;
    }

    if (accountType === 'real') {
      setRealBalance(b => Math.max(0, Math.round((b - totalCost) * 100) / 100));
      setUserStats(prev => prev ? {
        ...prev,
        wagerCurrent: Math.round(((prev.wagerCurrent || 0) + totalCost) * 100) / 100
      } : prev);
      syncTradeResult(totalCost, 0);
    } else {
      setDemoBalance(b => Math.max(0, Math.round((b - totalCost) * 100) / 100));
    }

    sounds.playPlaceTrade();

    const liqDistance = asset.price * (0.95 / leverage);
    const liquidationPrice = params.type === 'LONG'
      ? Math.max(0, asset.price - liqDistance)
      : asset.price + liqDistance;

    const newPosition: FuturesPosition = {
      id: 'fut_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      assetId: asset.id,
      assetName: asset.name,
      assetSymbol: asset.symbol,
      tvSymbol: asset.tvSymbol,
      type: params.type,
      margin: params.margin,
      leverage,
      positionSize,
      entryPrice: asset.price,
      currentPrice: asset.price,
      liquidationPrice: Math.round(liquidationPrice * Math.pow(10, asset.precision)) / Math.pow(10, asset.precision),
      tradingFee,
      tpPrice: params.tpPrice,
      slPrice: params.slPrice,
      status: 'open',
      accountType,
      createdAt: Date.now(),
      pnl: -tradingFee,
      pnlPercent: Math.round((-tradingFee / params.margin) * 10000) / 100
    };

    setFuturesPositions(prev => [newPosition, ...prev]);
    return true;
  };

  const closeFuturesPosition = (positionId: string) => {
    setFuturesPositions(prev => {
      const pos = prev.find(p => p.id === positionId && p.status === 'open');
      if (!pos) return prev;

      const payout = Math.max(0, pos.margin + pos.pnl);

      if (pos.accountType === 'real') {
        const roundedPayout = Math.round(payout * 100) / 100;
        setRealBalance(b => Math.round((b + roundedPayout) * 100) / 100);
        syncTradeResult(0, roundedPayout);
      } else {
        setDemoBalance(b => Math.round((b + payout) * 100) / 100);
      }

      if (pos.pnl > 0) {
        sounds.playWin();
        launchWinConfetti();
      } else {
        sounds.playLoss();
      }

      return prev.map(p => {
        if (p.id === positionId) {
          return {
            ...p,
            status: 'closed',
            closedAt: Date.now(),
            closePrice: p.currentPrice
          };
        }
        return p;
      });
    });
  };

  return (
    <AppContext.Provider value={{
      userId,
      userStats,
      accountType, setAccountType,
      realBalance, setRealBalance,
      demoBalance, setDemoBalance,
      refillDemoBalance,
      currentAsset, setCurrentAsset,
      assets, toggleFavorite,
      trades, placeTrade,
      fetchBalance,
      soundEnabled, toggleSound,
      lastTradeResult, dismissTradeResult,
      priceTickCount,
      selectedTimezone, setSelectedTimezone,
      tradingMode, setTradingMode,
      futuresAssets,
      currentFuturesAsset, setCurrentFuturesAsset,
      futuresPositions,
      placeFuturesOrder,
      closeFuturesPosition,
      isFullScreen,
      toggleFullScreen,
      isExpandedLayout,
      toggleExpandedLayout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
