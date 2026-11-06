// Currency conversion and formatting utility (USD Primary + Live USD/INR FX Rate)

let cachedExchangeRate = 83.45;
let lastFetchTime = 0;

// Fetch live USD to INR exchange rate from free public FX rate API with smart fallback
export const fetchLiveUsdInrRate = async (): Promise<number> => {
  const now = Date.now();
  if (now - lastFetchTime < 300000 && cachedExchangeRate > 50) {
    return cachedExchangeRate;
  }
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data && data.rates && data.rates.INR) {
      cachedExchangeRate = Number(data.rates.INR);
      lastFetchTime = now;
      return cachedExchangeRate;
    }
  } catch (err) {
    console.warn("Live FX rate fetch fallback:", err);
  }
  return cachedExchangeRate;
};

export const getCachedUsdInrRate = (): number => {
  return cachedExchangeRate;
};

// Format amount in USD ($)
export const formatUSD = (amount: number, minimumFractionDigits = 2): string => {
  const num = Number(amount || 0);
  return `$${num.toLocaleString('en-US', { minimumFractionDigits, maximumFractionDigits: minimumFractionDigits })}`;
};

// Convert USD to INR for UPI payment gateway
export const convertUsdToInr = (usdAmount: number, rate = cachedExchangeRate): number => {
  const num = Number(usdAmount || 0);
  return Math.round((num * rate) * 100) / 100;
};
