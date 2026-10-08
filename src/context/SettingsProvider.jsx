import { useCallback, useEffect, useMemo, useState } from "react";
import { SettingsContext } from "./settingsContext";
import { supabase } from "../lib/supabase";
import { setStoreCurrency } from "../lib/currency";

const DEFAULTS = {
  currency: "USD",
  freeShippingCents: 15000,
  flatShippingCents: 1200,
};

const fromRow = (row) => ({
  currency: row.currency,
  freeShippingCents: row.free_shipping_cents,
  flatShippingCents: row.flat_shipping_cents,
});

export default function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    const next = !error && data ? fromRow(data) : DEFAULTS;
    setStoreCurrency(next.currency); // before anything renders prices
    setSettings(next);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => (settings ? { ...settings, refresh: load } : null),
    [settings, load]
  );

  // wait a moment so no price is ever shown in the wrong currency
  if (!value) return <div style={{ minHeight: "100svh" }} aria-busy="true" />;

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}