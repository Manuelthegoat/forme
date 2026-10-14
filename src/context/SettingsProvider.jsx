import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SettingsContext } from "./settingsContext";
import { supabase } from "../lib/supabase";
import { getExchangeRate } from "../lib/exchangeRates";
import { setDisplayCurrency, setStoreCurrency, STORE_COUNTRIES } from "../lib/currency";

const DEFAULTS = {
  currency: "USD",
  freeShippingCents: 15000,
  flatShippingCents: 1200,
};
const COUNTRY_KEY = "forme-country";

const fromRow = (row) => ({
  currency: row.currency,
  freeShippingCents: row.free_shipping_cents,
  flatShippingCents: row.flat_shipping_cents,
});

function readCountry(fallbackCurrency = "USD") {
  try {
    const saved = localStorage.getItem(COUNTRY_KEY);
    return STORE_COUNTRIES.find((country) => country.code === saved)?.code ?? STORE_COUNTRIES.find((country) => country.currency === fallbackCurrency)?.code ?? "US";
  } catch {
    return "US";
  }
}

export default function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [country, setCountry] = useState(readCountry);
  const [currencyError, setCurrencyError] = useState("");
  const [pendingCountry, setPendingCountry] = useState(null);
  const selectionId = useRef(0);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    const next = !error && data ? fromRow(data) : DEFAULTS;
    const destination = STORE_COUNTRIES.find((item) => item.code === readCountry(next.currency)) ?? STORE_COUNTRIES[0];
    setStoreCurrency(next.currency);
    try {
      const rate = await getExchangeRate(next.currency, destination.currency);
      setDisplayCurrency(destination, rate);
      setCountry(destination.code);
      setCurrencyError("");
    } catch {
      const fallback = STORE_COUNTRIES.find((item) => item.currency === next.currency) ?? STORE_COUNTRIES[0];
      setDisplayCurrency(fallback, 1);
      setCountry(fallback.code);
      setCurrencyError("Exchange rates are unavailable. Showing store currency.");
    }
    setSettings(next);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selectCountry = useCallback(async (code) => {
    const destination = STORE_COUNTRIES.find((item) => item.code === code);
    if (!destination || !settings) return false;
    const requestId = ++selectionId.current;
    setPendingCountry(code);
    setCurrencyError("");
    try {
      const rate = await getExchangeRate(settings.currency, destination.currency);
      if (requestId !== selectionId.current) return false;
      setDisplayCurrency(destination, rate);
      setCountry(destination.code);
      try { localStorage.setItem(COUNTRY_KEY, destination.code); } catch { /* storage unavailable */ }
      setPendingCountry(null);
      return true;
    } catch {
      if (requestId === selectionId.current) {
        setPendingCountry(null);
        setCurrencyError("Couldn't update currency. Please try again.");
      }
      return false;
    }
  }, [settings]);

  const value = useMemo(
    () => settings ? {
      ...settings,
      country,
      pendingCountry,
      displayCurrency: STORE_COUNTRIES.find((item) => item.code === country)?.currency ?? settings.currency,
      currencyError,
      selectCountry,
      refresh: load,
    } : null,
    [settings, country, pendingCountry, currencyError, selectCountry, load],
  );

  if (!value) return <div style={{ minHeight: "100svh" }} aria-busy="true" />;

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}