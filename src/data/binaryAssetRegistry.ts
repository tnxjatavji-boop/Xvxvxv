// Centralized Master Binary Asset Registry for TradeXora
// Defines the complete, verified 187-asset catalog with zero duplicates,
// verified market symbols, accurate categories, canonical baseline prices, and subcategories.

export interface BinaryAssetRegistryItem {
  id: string;
  name: string;
  symbol: string;
  category: "Currencies" | "Crypto" | "Stocks" | "Commodities" | "Indices";
  profitMargin: number;
  price: number;
  change: number;
  favorite?: boolean;
  isMetal?: boolean;
}

export const TOTAL_BINARY_ASSETS_COUNT = 187;

export const METAL_SYMBOLS = new Set([
  "XAU", "XAG", "XPT", "XPD", "HG", "ALU", "ZNC", "NIC", "XAUEUR", "XAGEUR", "LED", "TIN"
]);

export const isMetalAsset = (asset: { category?: string; symbol?: string; name?: string }): boolean => {
  if (!asset) return false;
  if (asset.symbol && METAL_SYMBOLS.has(asset.symbol.toUpperCase())) return true;
  const n = (asset.name || "").toLowerCase();
  return (
    n.includes("gold") ||
    n.includes("silver") ||
    n.includes("platinum") ||
    n.includes("palladium") ||
    n.includes("copper") ||
    n.includes("aluminum") ||
    n.includes("zinc") ||
    n.includes("nickel") ||
    n.includes("lead") ||
    n.includes("tin")
  );
};

export const BINARY_ASSET_REGISTRY: BinaryAssetRegistryItem[] = [
  {
    "id": "2",
    "name": "Bitcoin (Live)",
    "symbol": "BTC",
    "category": "Crypto",
    "profitMargin": 0.9,
    "price": 78370,
    "change": -0.92,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "3",
    "name": "EUR/USD (OTC)",
    "symbol": "EURUSD",
    "category": "Currencies",
    "profitMargin": 0.91,
    "price": 1.16235,
    "change": 0.01,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "4",
    "name": "Gold (OTC)",
    "symbol": "XAU",
    "category": "Commodities",
    "profitMargin": 0.91,
    "price": 4400.5,
    "change": -0.66,
    "favorite": false,
    "isMetal": true
  },
  {
    "id": "5",
    "name": "USD/INR (OTC)",
    "symbol": "USDINR",
    "category": "Currencies",
    "profitMargin": 0.91,
    "price": 94.808,
    "change": 0.35,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "6",
    "name": "Tesla (OTC)",
    "symbol": "TSLA",
    "category": "Stocks",
    "profitMargin": 0.9,
    "price": 354.08,
    "change": -5.92,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "8",
    "name": "Meta (OTC)",
    "symbol": "META",
    "category": "Stocks",
    "profitMargin": 0.89,
    "price": 616.77,
    "change": 1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "9",
    "name": "GBP/USD (OTC)",
    "symbol": "GBPUSD",
    "category": "Currencies",
    "profitMargin": 0.88,
    "price": 1.3556,
    "change": 0.11,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "10",
    "name": "USD/JPY (OTC)",
    "symbol": "USDJPY",
    "category": "Currencies",
    "profitMargin": 0.87,
    "price": 153.8,
    "change": -0.34,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "11",
    "name": "AUD/USD (OTC)",
    "symbol": "AUDUSD",
    "category": "Currencies",
    "profitMargin": 0.85,
    "price": 0.7227,
    "change": 0.12,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "12",
    "name": "USD/CAD (OTC)",
    "symbol": "USDCAD",
    "category": "Currencies",
    "profitMargin": 0.86,
    "price": 1.3725,
    "change": 0.12,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "13",
    "name": "EUR/GBP (OTC)",
    "symbol": "EURGBP",
    "category": "Currencies",
    "profitMargin": 0.86,
    "price": 0.854,
    "change": 0.08,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "14",
    "name": "EUR/THB (OTC)",
    "symbol": "EURTHB",
    "category": "Currencies",
    "profitMargin": 0.88,
    "price": 37.79,
    "change": 0.06,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "15",
    "name": "USD/BRL (OTC)",
    "symbol": "USDBRL",
    "category": "Currencies",
    "profitMargin": 0.91,
    "price": 5.482,
    "change": 0.45,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "16",
    "name": "USD/MXN (OTC)",
    "symbol": "USDMXN",
    "category": "Currencies",
    "profitMargin": 0.84,
    "price": 18.254,
    "change": -0.22,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "17",
    "name": "USD/CHF (OTC)",
    "symbol": "USDCHF",
    "category": "Currencies",
    "profitMargin": 0.83,
    "price": 0.895,
    "change": -0.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "18",
    "name": "NZD/USD (OTC)",
    "symbol": "NZDUSD",
    "category": "Currencies",
    "profitMargin": 0.84,
    "price": 0.612,
    "change": 0.35,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "19",
    "name": "GBP/JPY (OTC)",
    "symbol": "GBPJPY",
    "category": "Currencies",
    "profitMargin": 0.88,
    "price": 208.52,
    "change": -0.22,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "20",
    "name": "EUR/JPY (OTC)",
    "symbol": "EURJPY",
    "category": "Currencies",
    "profitMargin": 0.86,
    "price": 164.8,
    "change": 0.15,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "21",
    "name": "AUD/JPY (OTC)",
    "symbol": "AUDJPY",
    "category": "Currencies",
    "profitMargin": 0.85,
    "price": 101.45,
    "change": 0.19,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "22",
    "name": "CAD/JPY (OTC)",
    "symbol": "CADJPY",
    "category": "Currencies",
    "profitMargin": 0.84,
    "price": 112.35,
    "change": -0.08,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "73",
    "name": "EUR/CHF (OTC)",
    "symbol": "EURCHF",
    "category": "Currencies",
    "profitMargin": 0.85,
    "price": 0.942,
    "change": 0.05,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "74",
    "name": "GBP/CAD (OTC)",
    "symbol": "GBPCAD",
    "category": "Currencies",
    "profitMargin": 0.86,
    "price": 1.765,
    "change": -0.12,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "75",
    "name": "AUD/CAD (OTC)",
    "symbol": "AUDCAD",
    "category": "Currencies",
    "profitMargin": 0.84,
    "price": 0.903,
    "change": 0.14,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "76",
    "name": "EUR/AUD (OTC)",
    "symbol": "EURAUD",
    "category": "Currencies",
    "profitMargin": 0.85,
    "price": 1.632,
    "change": -0.09,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "23",
    "name": "Ethereum",
    "symbol": "ETH",
    "category": "Crypto",
    "profitMargin": 0.89,
    "price": 2470.5,
    "change": -0.78,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "24",
    "name": "Solana (Live)",
    "symbol": "SOL",
    "category": "Crypto",
    "profitMargin": 0.91,
    "price": 102.85,
    "change": -0.9,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "25",
    "name": "Binance Coin",
    "symbol": "BNB",
    "category": "Crypto",
    "profitMargin": 0.86,
    "price": 751.2,
    "change": 1.5,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "26",
    "name": "Ripple (Live)",
    "symbol": "XRP",
    "category": "Crypto",
    "profitMargin": 0.9,
    "price": 1.3995,
    "change": 0.08,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "27",
    "name": "Dogecoin",
    "symbol": "DOGE",
    "category": "Crypto",
    "profitMargin": 0.85,
    "price": 0.08935,
    "change": -1.25,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "28",
    "name": "Toncoin",
    "symbol": "TON",
    "category": "Crypto",
    "profitMargin": 0.88,
    "price": 6.85,
    "change": 3.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "29",
    "name": "Shiba Inu (OTC)",
    "symbol": "SHIB",
    "category": "Crypto",
    "profitMargin": 0.87,
    "price": 0.0000185,
    "change": 4.25,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "30",
    "name": "Polygon",
    "symbol": "POL",
    "category": "Crypto",
    "profitMargin": 0.86,
    "price": 0.524,
    "change": 1.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "31",
    "name": "Chainlink",
    "symbol": "LINK",
    "category": "Crypto",
    "profitMargin": 0.85,
    "price": 12.45,
    "change": 2.3,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "32",
    "name": "Litecoin",
    "symbol": "LTC",
    "category": "Crypto",
    "profitMargin": 0.84,
    "price": 74.2,
    "change": 0.65,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "33",
    "name": "Polkadot",
    "symbol": "DOT",
    "category": "Crypto",
    "profitMargin": 0.83,
    "price": 5.15,
    "change": -0.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "34",
    "name": "TRON (Live)",
    "symbol": "TRX",
    "category": "Crypto",
    "profitMargin": 0.87,
    "price": 0.162,
    "change": 1.15,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "35",
    "name": "Cardano",
    "symbol": "ADA",
    "category": "Crypto",
    "profitMargin": 0.84,
    "price": 0.2187,
    "change": -0.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "36",
    "name": "Avalanche",
    "symbol": "AVAX",
    "category": "Crypto",
    "profitMargin": 0.86,
    "price": 28.9,
    "change": 2.7,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "37",
    "name": "Pepe (OTC)",
    "symbol": "PEPE",
    "category": "Crypto",
    "profitMargin": 0.88,
    "price": 0.0000098,
    "change": 6.5,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "77",
    "name": "NEAR Protocol",
    "symbol": "NEAR",
    "category": "Crypto",
    "profitMargin": 0.87,
    "price": 5.42,
    "change": 3.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "78",
    "name": "Sui Network",
    "symbol": "SUI",
    "category": "Crypto",
    "profitMargin": 0.88,
    "price": 2.18,
    "change": 4.6,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "79",
    "name": "Aptos",
    "symbol": "APT",
    "category": "Crypto",
    "profitMargin": 0.86,
    "price": 9.85,
    "change": 2.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "80",
    "name": "Render Network",
    "symbol": "RENDER",
    "category": "Crypto",
    "profitMargin": 0.87,
    "price": 6.45,
    "change": 5.2,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "81",
    "name": "Uniswap",
    "symbol": "UNI",
    "category": "Crypto",
    "profitMargin": 0.85,
    "price": 8.9,
    "change": 1.5,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "82",
    "name": "Cosmos",
    "symbol": "ATOM",
    "category": "Crypto",
    "profitMargin": 0.84,
    "price": 6.75,
    "change": -0.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "83",
    "name": "Arbitrum",
    "symbol": "ARB",
    "category": "Crypto",
    "profitMargin": 0.85,
    "price": 0.85,
    "change": 1.9,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "84",
    "name": "Injective",
    "symbol": "INJ",
    "category": "Crypto",
    "profitMargin": 0.87,
    "price": 22.4,
    "change": 3.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "38",
    "name": "Apple (OTC)",
    "symbol": "AAPL",
    "category": "Stocks",
    "profitMargin": 0.9,
    "price": 317.79,
    "change": -0.23,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "39",
    "name": "Nvidia (OTC)",
    "symbol": "NVDA",
    "category": "Stocks",
    "profitMargin": 0.91,
    "price": 128.45,
    "change": 3.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "40",
    "name": "Microsoft (OTC)",
    "symbol": "MSFT",
    "category": "Stocks",
    "profitMargin": 0.88,
    "price": 448.2,
    "change": 0.45,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "41",
    "name": "Amazon (OTC)",
    "symbol": "AMZN",
    "category": "Stocks",
    "profitMargin": 0.89,
    "price": 186.75,
    "change": 1.2,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "42",
    "name": "Alphabet / Google",
    "symbol": "GOOGL",
    "category": "Stocks",
    "profitMargin": 0.87,
    "price": 179.3,
    "change": -0.3,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "43",
    "name": "AMD (OTC)",
    "symbol": "AMD",
    "category": "Stocks",
    "profitMargin": 0.89,
    "price": 154.6,
    "change": 2.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "44",
    "name": "Intel (OTC)",
    "symbol": "INTC",
    "category": "Stocks",
    "profitMargin": 0.85,
    "price": 24.15,
    "change": -1.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "45",
    "name": "Alibaba (OTC)",
    "symbol": "BABA",
    "category": "Stocks",
    "profitMargin": 0.87,
    "price": 84.3,
    "change": 1.95,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "46",
    "name": "Coca-Cola (OTC)",
    "symbol": "KO",
    "category": "Stocks",
    "profitMargin": 0.86,
    "price": 68.4,
    "change": 0.35,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "47",
    "name": "Walt Disney (OTC)",
    "symbol": "DIS",
    "category": "Stocks",
    "profitMargin": 0.86,
    "price": 96.2,
    "change": 0.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "48",
    "name": "Visa (OTC)",
    "symbol": "V",
    "category": "Stocks",
    "profitMargin": 0.88,
    "price": 278.5,
    "change": 0.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "49",
    "name": "Mastercard (OTC)",
    "symbol": "MA",
    "category": "Stocks",
    "profitMargin": 0.87,
    "price": 462.8,
    "change": 0.55,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "50",
    "name": "Netflix (OTC)",
    "symbol": "NFLX",
    "category": "Stocks",
    "profitMargin": 0.87,
    "price": 672.1,
    "change": 1.85,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "51",
    "name": "Baidu ADR (OTC)",
    "symbol": "BIDU",
    "category": "Stocks",
    "profitMargin": 0.85,
    "price": 108.26,
    "change": -1.84,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "85",
    "name": "Taiwan Semi (TSMC)",
    "symbol": "TSM",
    "category": "Stocks",
    "profitMargin": 0.9,
    "price": 198.5,
    "change": 2.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "86",
    "name": "Berkshire Hathaway",
    "symbol": "BRK",
    "category": "Stocks",
    "profitMargin": 0.86,
    "price": 462.1,
    "change": 0.3,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "87",
    "name": "JPMorgan Chase",
    "symbol": "JPM",
    "category": "Stocks",
    "profitMargin": 0.87,
    "price": 224.3,
    "change": 0.65,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "88",
    "name": "Walmart Inc.",
    "symbol": "WMT",
    "category": "Stocks",
    "profitMargin": 0.86,
    "price": 82.4,
    "change": 0.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "89",
    "name": "Oracle (OTC)",
    "symbol": "ORCL",
    "category": "Stocks",
    "profitMargin": 0.88,
    "price": 172.9,
    "change": 1.75,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "90",
    "name": "Broadcom (OTC)",
    "symbol": "AVGO",
    "category": "Stocks",
    "profitMargin": 0.89,
    "price": 178.6,
    "change": 2.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "91",
    "name": "Eli Lilly (OTC)",
    "symbol": "LLY",
    "category": "Stocks",
    "profitMargin": 0.88,
    "price": 945.2,
    "change": 1.25,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "92",
    "name": "Exxon Mobil",
    "symbol": "XOM",
    "category": "Stocks",
    "profitMargin": 0.85,
    "price": 118.4,
    "change": -0.45,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "93",
    "name": "Costco Wholesale",
    "symbol": "COST",
    "category": "Stocks",
    "profitMargin": 0.87,
    "price": 912.8,
    "change": 0.85,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "94",
    "name": "Nike (OTC)",
    "symbol": "NKE",
    "category": "Stocks",
    "profitMargin": 0.86,
    "price": 86.5,
    "change": 0.95,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "95",
    "name": "Adobe Inc.",
    "symbol": "ADBE",
    "category": "Stocks",
    "profitMargin": 0.88,
    "price": 532.7,
    "change": 1.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "96",
    "name": "Palantir (OTC)",
    "symbol": "PLTR",
    "category": "Stocks",
    "profitMargin": 0.91,
    "price": 42.8,
    "change": 4.6,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "97",
    "name": "Coinbase Global",
    "symbol": "COIN",
    "category": "Stocks",
    "profitMargin": 0.9,
    "price": 218.4,
    "change": 3.9,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "98",
    "name": "Spotify (OTC)",
    "symbol": "SPOT",
    "category": "Stocks",
    "profitMargin": 0.87,
    "price": 375.6,
    "change": 1.6,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "99",
    "name": "Uber Technologies",
    "symbol": "UBER",
    "category": "Stocks",
    "profitMargin": 0.88,
    "price": 74.3,
    "change": 1.3,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "57",
    "name": "Silver (OTC)",
    "symbol": "XAG",
    "category": "Commodities",
    "profitMargin": 0.88,
    "price": 29.45,
    "change": 1.1,
    "favorite": false,
    "isMetal": true
  },
  {
    "id": "58",
    "name": "Platinum (OTC)",
    "symbol": "XPT",
    "category": "Commodities",
    "profitMargin": 0.86,
    "price": 955.4,
    "change": 0.65,
    "favorite": false,
    "isMetal": true
  },
  {
    "id": "59",
    "name": "Palladium (OTC)",
    "symbol": "XPD",
    "category": "Commodities",
    "profitMargin": 0.85,
    "price": 980.2,
    "change": -0.4,
    "favorite": false,
    "isMetal": true
  },
  {
    "id": "60",
    "name": "Crude Oil Brent",
    "symbol": "BRENT",
    "category": "Commodities",
    "profitMargin": 0.88,
    "price": 84.6,
    "change": -0.75,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "61",
    "name": "Crude Oil WTI",
    "symbol": "WTI",
    "category": "Commodities",
    "profitMargin": 0.86,
    "price": 80.25,
    "change": -0.6,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "62",
    "name": "Natural Gas",
    "symbol": "NG",
    "category": "Commodities",
    "profitMargin": 0.83,
    "price": 2.15,
    "change": 1.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "63",
    "name": "Copper (Live)",
    "symbol": "HG",
    "category": "Commodities",
    "profitMargin": 0.84,
    "price": 4.45,
    "change": 0.5,
    "favorite": false,
    "isMetal": true
  },
  {
    "id": "100",
    "name": "Gold in EUR (OTC)",
    "symbol": "XAUEUR",
    "category": "Commodities",
    "profitMargin": 0.89,
    "price": 2150.8,
    "change": 0.35,
    "favorite": false,
    "isMetal": true
  },
  {
    "id": "101",
    "name": "Silver in EUR (OTC)",
    "symbol": "XAGEUR",
    "category": "Commodities",
    "profitMargin": 0.87,
    "price": 27.15,
    "change": 0.8,
    "favorite": false,
    "isMetal": true
  },
  {
    "id": "64",
    "name": "NASDAQ 100",
    "symbol": "NDX",
    "category": "Indices",
    "profitMargin": 0.89,
    "price": 19850,
    "change": 0.95,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "65",
    "name": "S&P 500",
    "symbol": "SPX",
    "category": "Indices",
    "profitMargin": 0.88,
    "price": 5540.2,
    "change": 0.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "66",
    "name": "Dow Jones 30",
    "symbol": "DJI",
    "category": "Indices",
    "profitMargin": 0.87,
    "price": 40280,
    "change": 0.25,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "69",
    "name": "DAX 40 Germany",
    "symbol": "GER40",
    "category": "Indices",
    "profitMargin": 0.86,
    "price": 18650,
    "change": 0.15,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "70",
    "name": "FTSE 100 UK",
    "symbol": "UK100",
    "category": "Indices",
    "profitMargin": 0.85,
    "price": 8240,
    "change": -0.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "71",
    "name": "Nikkei 225 Japan",
    "symbol": "JP225",
    "category": "Indices",
    "profitMargin": 0.87,
    "price": 38250,
    "change": 0.6,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "72",
    "name": "Hang Seng (OTC)",
    "symbol": "HSI",
    "category": "Indices",
    "profitMargin": 0.88,
    "price": 17650,
    "change": -0.35,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "102",
    "name": "CAC 40 France",
    "symbol": "CAC40",
    "category": "Indices",
    "profitMargin": 0.86,
    "price": 7540,
    "change": 0.2,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "103",
    "name": "Euro Stoxx 50",
    "symbol": "SX5E",
    "category": "Indices",
    "profitMargin": 0.87,
    "price": 4920,
    "change": 0.15,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "104",
    "name": "ASX 200 Australia",
    "symbol": "ASX200",
    "category": "Indices",
    "profitMargin": 0.85,
    "price": 8120,
    "change": 0.3,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "105",
    "name": "IBEX 35 Spain",
    "symbol": "IBEX35",
    "category": "Indices",
    "profitMargin": 0.86,
    "price": 11650,
    "change": -0.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "106",
    "name": "Nifty 50 (OTC)",
    "symbol": "NIFTY50",
    "category": "Indices",
    "profitMargin": 0.88,
    "price": 24500,
    "change": 0.45,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "107",
    "name": "Bank Nifty (OTC)",
    "symbol": "BANKNIFTY",
    "category": "Indices",
    "profitMargin": 0.89,
    "price": 51200,
    "change": 0.6,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "108",
    "name": "Sensex (OTC)",
    "symbol": "SENSEX",
    "category": "Indices",
    "profitMargin": 0.87,
    "price": 80500,
    "change": 0.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "109",
    "name": "VIX Volatility",
    "symbol": "VIX",
    "category": "Indices",
    "profitMargin": 0.84,
    "price": 14.5,
    "change": -2.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "110",
    "name": "Russell 2000",
    "symbol": "RUT",
    "category": "Indices",
    "profitMargin": 0.86,
    "price": 2150,
    "change": 1.15,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "111",
    "name": "PepsiCo (OTC)",
    "symbol": "PEP",
    "category": "Stocks",
    "profitMargin": 0.86,
    "price": 165.2,
    "change": -0.15,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "112",
    "name": "McDonald's (OTC)",
    "symbol": "MCD",
    "category": "Stocks",
    "profitMargin": 0.87,
    "price": 280.4,
    "change": 0.25,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "113",
    "name": "Salesforce (OTC)",
    "symbol": "CRM",
    "category": "Stocks",
    "profitMargin": 0.88,
    "price": 260.15,
    "change": 1.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "114",
    "name": "Chevron (OTC)",
    "symbol": "CVX",
    "category": "Stocks",
    "profitMargin": 0.85,
    "price": 158.3,
    "change": -0.45,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "115",
    "name": "Bank of America (OTC)",
    "symbol": "BAC",
    "category": "Stocks",
    "profitMargin": 0.86,
    "price": 39.5,
    "change": 0.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "116",
    "name": "Home Depot (OTC)",
    "symbol": "HD",
    "category": "Stocks",
    "profitMargin": 0.87,
    "price": 345.6,
    "change": 0.55,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "117",
    "name": "Johnson & Johnson",
    "symbol": "JNJ",
    "category": "Stocks",
    "profitMargin": 0.85,
    "price": 148.9,
    "change": 0.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "118",
    "name": "Procter & Gamble",
    "symbol": "PG",
    "category": "Stocks",
    "profitMargin": 0.86,
    "price": 162.3,
    "change": 0.2,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "119",
    "name": "Cisco (OTC)",
    "symbol": "CSCO",
    "category": "Stocks",
    "profitMargin": 0.85,
    "price": 48.2,
    "change": -0.3,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "120",
    "name": "Verizon (OTC)",
    "symbol": "VZ",
    "category": "Stocks",
    "profitMargin": 0.84,
    "price": 41.5,
    "change": 0.6,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "121",
    "name": "AT&T (OTC)",
    "symbol": "T",
    "category": "Stocks",
    "profitMargin": 0.84,
    "price": 18.2,
    "change": 0.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "122",
    "name": "Pfizer (OTC)",
    "symbol": "PFE",
    "category": "Stocks",
    "profitMargin": 0.85,
    "price": 28.4,
    "change": -0.15,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "123",
    "name": "Boeing (OTC)",
    "symbol": "BA",
    "category": "Stocks",
    "profitMargin": 0.87,
    "price": 185.6,
    "change": 1.2,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "124",
    "name": "Qualcomm (OTC)",
    "symbol": "QCOM",
    "category": "Stocks",
    "profitMargin": 0.89,
    "price": 205.4,
    "change": 2.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "125",
    "name": "ARM Holdings (OTC)",
    "symbol": "ARM",
    "category": "Stocks",
    "profitMargin": 0.9,
    "price": 145.8,
    "change": 3.5,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "126",
    "name": "Super Micro (OTC)",
    "symbol": "SMCI",
    "category": "Stocks",
    "profitMargin": 0.91,
    "price": 890.5,
    "change": 4.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "127",
    "name": "Moderna (OTC)",
    "symbol": "MRNA",
    "category": "Stocks",
    "profitMargin": 0.88,
    "price": 124.3,
    "change": -1.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "128",
    "name": "Airbnb (OTC)",
    "symbol": "ABNB",
    "category": "Stocks",
    "profitMargin": 0.87,
    "price": 156.2,
    "change": 1.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "129",
    "name": "Shopify (OTC)",
    "symbol": "SHOP",
    "category": "Stocks",
    "profitMargin": 0.88,
    "price": 72.4,
    "change": 2.3,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "130",
    "name": "Square (OTC)",
    "symbol": "SQ",
    "category": "Stocks",
    "profitMargin": 0.87,
    "price": 68.9,
    "change": 1.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "131",
    "name": "PayPal (OTC)",
    "symbol": "PYPL",
    "category": "Stocks",
    "profitMargin": 0.86,
    "price": 64.5,
    "change": 0.7,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "132",
    "name": "Stellar",
    "symbol": "XLM",
    "category": "Crypto",
    "profitMargin": 0.84,
    "price": 0.105,
    "change": 1.2,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "133",
    "name": "Internet Computer",
    "symbol": "ICP",
    "category": "Crypto",
    "profitMargin": 0.85,
    "price": 9.4,
    "change": -0.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "134",
    "name": "Filecoin",
    "symbol": "FIL",
    "category": "Crypto",
    "profitMargin": 0.84,
    "price": 4.5,
    "change": 0.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "135",
    "name": "VeChain",
    "symbol": "VET",
    "category": "Crypto",
    "profitMargin": 0.83,
    "price": 0.034,
    "change": 1.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "136",
    "name": "Monero",
    "symbol": "XMR",
    "category": "Crypto",
    "profitMargin": 0.86,
    "price": 165.2,
    "change": 0.5,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "137",
    "name": "Aave",
    "symbol": "AAVE",
    "category": "Crypto",
    "profitMargin": 0.87,
    "price": 102.4,
    "change": 2.5,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "138",
    "name": "Algorand",
    "symbol": "ALGO",
    "category": "Crypto",
    "profitMargin": 0.84,
    "price": 0.152,
    "change": -0.3,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "139",
    "name": "Theta Network",
    "symbol": "THETA",
    "category": "Crypto",
    "profitMargin": 0.85,
    "price": 1.65,
    "change": 1.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "140",
    "name": "Elrond (MultiversX)",
    "symbol": "EGLD",
    "category": "Crypto",
    "profitMargin": 0.86,
    "price": 34.2,
    "change": 0.9,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "141",
    "name": "The Sandbox",
    "symbol": "SAND",
    "category": "Crypto",
    "profitMargin": 0.85,
    "price": 0.354,
    "change": -1.2,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "142",
    "name": "Decentraland",
    "symbol": "MANA",
    "category": "Crypto",
    "profitMargin": 0.84,
    "price": 0.342,
    "change": 0.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "143",
    "name": "Axie Infinity",
    "symbol": "AXS",
    "category": "Crypto",
    "profitMargin": 0.85,
    "price": 6.2,
    "change": 2.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "144",
    "name": "Gala",
    "symbol": "GALA",
    "category": "Crypto",
    "profitMargin": 0.84,
    "price": 0.028,
    "change": 1.5,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "145",
    "name": "Quant",
    "symbol": "QNT",
    "category": "Crypto",
    "profitMargin": 0.87,
    "price": 82.4,
    "change": -0.6,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "146",
    "name": "Fantom",
    "symbol": "FTM",
    "category": "Crypto",
    "profitMargin": 0.86,
    "price": 0.542,
    "change": 3.2,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "147",
    "name": "Helium",
    "symbol": "HNT",
    "category": "Crypto",
    "profitMargin": 0.85,
    "price": 4.8,
    "change": 0.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "148",
    "name": "Maker",
    "symbol": "MKR",
    "category": "Crypto",
    "profitMargin": 0.88,
    "price": 2840,
    "change": 1.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "149",
    "name": "Stacks",
    "symbol": "STX",
    "category": "Crypto",
    "profitMargin": 0.87,
    "price": 1.85,
    "change": 4.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "150",
    "name": "Aluminum (OTC)",
    "symbol": "ALU",
    "category": "Commodities",
    "profitMargin": 0.84,
    "price": 2450,
    "change": -0.3,
    "favorite": false,
    "isMetal": true
  },
  {
    "id": "151",
    "name": "Zinc (OTC)",
    "symbol": "ZNC",
    "category": "Commodities",
    "profitMargin": 0.83,
    "price": 2850,
    "change": 0.2,
    "favorite": false,
    "isMetal": true
  },
  {
    "id": "152",
    "name": "Nickel (OTC)",
    "symbol": "NIC",
    "category": "Commodities",
    "profitMargin": 0.85,
    "price": 18200,
    "change": 1.1,
    "favorite": false,
    "isMetal": true
  },
  {
    "id": "153",
    "name": "Cocoa (OTC)",
    "symbol": "COCOA",
    "category": "Commodities",
    "profitMargin": 0.89,
    "price": 9240,
    "change": -1.5,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "154",
    "name": "Coffee (OTC)",
    "symbol": "COFFEE",
    "category": "Commodities",
    "profitMargin": 0.86,
    "price": 235.4,
    "change": 2.3,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "155",
    "name": "Wheat (OTC)",
    "symbol": "WHEAT",
    "category": "Commodities",
    "profitMargin": 0.84,
    "price": 580.2,
    "change": 0.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "156",
    "name": "GBP/CHF (OTC)",
    "symbol": "GBPCHF",
    "category": "Currencies",
    "profitMargin": 0.86,
    "price": 1.142,
    "change": 0.15,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "157",
    "name": "AUD/NZD (OTC)",
    "symbol": "AUDNZD",
    "category": "Currencies",
    "profitMargin": 0.84,
    "price": 1.084,
    "change": -0.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "158",
    "name": "NZD/JPY (OTC)",
    "symbol": "NZDJPY",
    "category": "Currencies",
    "profitMargin": 0.85,
    "price": 94.2,
    "change": 0.25,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "159",
    "name": "CHF/JPY (OTC)",
    "symbol": "CHFJPY",
    "category": "Currencies",
    "profitMargin": 0.87,
    "price": 172.4,
    "change": -0.3,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "160",
    "name": "CAD/CHF (OTC)",
    "symbol": "CADCHF",
    "category": "Currencies",
    "profitMargin": 0.85,
    "price": 0.652,
    "change": 0.05,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "161",
    "name": "USD/NOK (OTC)",
    "symbol": "USDNOK",
    "category": "Currencies",
    "profitMargin": 0.83,
    "price": 10.65,
    "change": 0.2,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "162",
    "name": "USD/SGD (OTC)",
    "symbol": "USDSGD",
    "category": "Currencies",
    "profitMargin": 0.84,
    "price": 1.325,
    "change": 0.05,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "163",
    "name": "NZD/CHF (OTC)",
    "symbol": "NZDCHF",
    "category": "Currencies",
    "profitMargin": 0.84,
    "price": 0.548,
    "change": -0.15,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "164",
    "name": "KOSPI 200 Index",
    "symbol": "KOSPI",
    "category": "Indices",
    "profitMargin": 0.86,
    "price": 365.4,
    "change": 1.25,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "165",
    "name": "HDFC Bank (OTC)",
    "symbol": "HDFCBANK",
    "category": "Stocks",
    "profitMargin": 0.89,
    "price": 1650.2,
    "change": 0.85,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "166",
    "name": "Reliance Ind (OTC)",
    "symbol": "RELIANCE",
    "category": "Stocks",
    "profitMargin": 0.9,
    "price": 2980.5,
    "change": -0.45,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "167",
    "name": "Tata Motors (OTC)",
    "symbol": "TATAMOTORS",
    "category": "Stocks",
    "profitMargin": 0.89,
    "price": 985.4,
    "change": 2.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "168",
    "name": "Sony Group (OTC)",
    "symbol": "SONY",
    "category": "Stocks",
    "profitMargin": 0.88,
    "price": 92.6,
    "change": -1.15,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "169",
    "name": "US Dollar Index",
    "symbol": "DXY",
    "category": "Indices",
    "profitMargin": 0.87,
    "price": 104.35,
    "change": 0.15,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "170",
    "name": "ETF MSCI Brazil 2x",
    "symbol": "BRZU",
    "category": "Indices",
    "profitMargin": 0.82,
    "price": 45.2,
    "change": 2.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "171",
    "name": "ETF NASDAQ Reversal 2x",
    "symbol": "QID",
    "category": "Indices",
    "profitMargin": 0.82,
    "price": 12.8,
    "change": -1.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "172",
    "name": "ETF S&P500 Volatility 1.5x",
    "symbol": "UVXY",
    "category": "Indices",
    "profitMargin": 0.82,
    "price": 18.5,
    "change": 3.2,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "173",
    "name": "ETF U.S. Real Estate",
    "symbol": "IYR",
    "category": "Indices",
    "profitMargin": 0.82,
    "price": 98.4,
    "change": 0.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "174",
    "name": "SPDR S&P 500 ETF Trust",
    "symbol": "SPY",
    "category": "Indices",
    "profitMargin": 0.85,
    "price": 560.2,
    "change": 0.5,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "175",
    "name": "Starbucks (OTC)",
    "symbol": "SBUX",
    "category": "Stocks",
    "profitMargin": 0.86,
    "price": 92.4,
    "change": 0.65,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "176",
    "name": "BMW (OTC)",
    "symbol": "BMW",
    "category": "Stocks",
    "profitMargin": 0.86,
    "price": 88.5,
    "change": 1.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "177",
    "name": "Lead (OTC)",
    "symbol": "LED",
    "category": "Commodities",
    "profitMargin": 0.84,
    "price": 2050,
    "change": 0.15,
    "favorite": false,
    "isMetal": true
  },
  {
    "id": "178",
    "name": "Tin (OTC)",
    "symbol": "TIN",
    "category": "Commodities",
    "profitMargin": 0.85,
    "price": 31250,
    "change": 0.8,
    "favorite": false,
    "isMetal": true
  },
  {
    "id": "179",
    "name": "Corn (OTC)",
    "symbol": "CORN",
    "category": "Commodities",
    "profitMargin": 0.84,
    "price": 415.5,
    "change": -0.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "180",
    "name": "Sugar (OTC)",
    "symbol": "SUGAR",
    "category": "Commodities",
    "profitMargin": 0.85,
    "price": 19.45,
    "change": 0.6,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "181",
    "name": "Cotton (OTC)",
    "symbol": "COTTON",
    "category": "Commodities",
    "profitMargin": 0.84,
    "price": 72.8,
    "change": -0.2,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "182",
    "name": "Soybeans (OTC)",
    "symbol": "SOYB",
    "category": "Commodities",
    "profitMargin": 0.85,
    "price": 1025,
    "change": 0.45,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "183",
    "name": "Bittensor",
    "symbol": "TAO",
    "category": "Crypto",
    "profitMargin": 0.87,
    "price": 542.5,
    "change": 4.2,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "184",
    "name": "Artificial Superintelligence",
    "symbol": "FET",
    "category": "Crypto",
    "profitMargin": 0.86,
    "price": 1.38,
    "change": 3.5,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "185",
    "name": "Celestia",
    "symbol": "TIA",
    "category": "Crypto",
    "profitMargin": 0.86,
    "price": 5.85,
    "change": 2.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "186",
    "name": "Optimism",
    "symbol": "OP",
    "category": "Crypto",
    "profitMargin": 0.86,
    "price": 1.68,
    "change": 1.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "187",
    "name": "Tata Consultancy Services (OTC)",
    "symbol": "TCS",
    "category": "Stocks",
    "profitMargin": 0.9,
    "price": 4150,
    "change": 1.1,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "188",
    "name": "State Bank of India (OTC)",
    "symbol": "SBIN",
    "category": "Stocks",
    "profitMargin": 0.89,
    "price": 815.5,
    "change": 0.75,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "189",
    "name": "ICICI Bank (OTC)",
    "symbol": "ICICIBANK",
    "category": "Stocks",
    "profitMargin": 0.89,
    "price": 1245,
    "change": 0.95,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "190",
    "name": "Bharti Airtel (OTC)",
    "symbol": "BHARTIARTL",
    "category": "Stocks",
    "profitMargin": 0.88,
    "price": 1680,
    "change": 1.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "191",
    "name": "Larsen & Toubro (OTC)",
    "symbol": "LT",
    "category": "Stocks",
    "profitMargin": 0.88,
    "price": 3620,
    "change": 0.5,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "192",
    "name": "Infosys (OTC)",
    "symbol": "INFY",
    "category": "Stocks",
    "profitMargin": 0.89,
    "price": 1865,
    "change": 0.65,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "193",
    "name": "ITC Limited (OTC)",
    "symbol": "ITC",
    "category": "Stocks",
    "profitMargin": 0.87,
    "price": 485.2,
    "change": 0.3,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "194",
    "name": "Maruti Suzuki (OTC)",
    "symbol": "MARUTI",
    "category": "Stocks",
    "profitMargin": 0.89,
    "price": 12450,
    "change": 1.8,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "195",
    "name": "Sun Pharma (OTC)",
    "symbol": "SUNPHARMA",
    "category": "Stocks",
    "profitMargin": 0.88,
    "price": 1780,
    "change": 0.4,
    "favorite": false,
    "isMetal": false
  },
  {
    "id": "196",
    "name": "Bajaj Finance (OTC)",
    "symbol": "BAJFINANCE",
    "category": "Stocks",
    "profitMargin": 0.89,
    "price": 7250,
    "change": 1.25,
    "favorite": false,
    "isMetal": false
  }
];

export const BINARY_ASSETS_BY_ID = new Map<string, BinaryAssetRegistryItem>(
  BINARY_ASSET_REGISTRY.map(a => [a.id, a])
);

export const BINARY_ASSETS_BY_SYMBOL = new Map<string, BinaryAssetRegistryItem>(
  BINARY_ASSET_REGISTRY.map(a => [a.symbol.toUpperCase(), a])
);

export const getBinaryAssetById = (id: string): BinaryAssetRegistryItem | undefined => {
  return BINARY_ASSETS_BY_ID.get(id);
};

export const getBinaryAssetBySymbol = (symbol: string): BinaryAssetRegistryItem | undefined => {
  return BINARY_ASSETS_BY_SYMBOL.get(symbol.toUpperCase());
};
