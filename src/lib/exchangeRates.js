const FX_API = "https://api.frankfurter.dev/v2/rate";
const cache = new Map();

export async function getExchangeRate(base, quote) {
  if (base === quote) return 1;
  const key = `${base}:${quote}`;
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.rate;

  const response = await fetch(`${FX_API}/${base.toLowerCase()}/${quote.toLowerCase()}`);
  if (!response.ok) throw new Error("Couldn't load the latest exchange rate.");
  const data = await response.json();
  const rate = Number(data.rate);
  if (data.base?.toUpperCase() !== base || data.quote?.toUpperCase() !== quote || !Number.isFinite(rate) || rate <= 0) {
    throw new Error("The exchange rate response was invalid.");
  }
  cache.set(key, { rate, expiresAt: Date.now() + 6 * 60 * 60 * 1000 });
  return rate;
}