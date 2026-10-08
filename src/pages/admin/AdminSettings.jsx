import { useState } from "react";
import { supabase } from "../../lib/supabase";
import useSettings from "../../hooks/useSettings";
import { CURRENCIES, formatPrice } from "../../lib/currency";

export default function AdminSettings() {
  const { currency, freeShippingCents, flatShippingCents, refresh } =
    useSettings();

  const [form, setForm] = useState(() => ({
    currency,
    free: String(freeShippingCents / 100),
    flat: String(flatShippingCents / 100),
  }));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const set = (key, value) => {
    setMsg(null);
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const free = Number(form.free);
    const flat = Number(form.flat);
    if (
      form.free === "" ||
      form.flat === "" ||
      Number.isNaN(free) ||
      Number.isNaN(flat) ||
      free < 0 ||
      flat < 0
    ) {
      setMsg({ type: "error", text: "Shipping amounts must be 0 or more." });
      return;
    }

    if (
      form.currency !== currency &&
      !window.confirm(
        `Switch the store from ${currency} to ${form.currency}?\n\n` +
          "Product prices are NOT converted. A price of 68 stays 68, just in the new currency. " +
          "Update your prices afterwards."
      )
    ) {
      return;
    }

    setSaving(true);
    setMsg(null);

    const { data, error } = await supabase
      .from("settings")
      .update({
        currency: form.currency,
        free_shipping_cents: Math.round(free * 100),
        flat_shipping_cents: Math.round(flat * 100),
      })
      .eq("id", 1)
      .select("id");

    if (error || !data?.length) {
      setMsg({
        type: "error",
        text: error?.message ?? "Couldn't save. Check you're logged in as admin.",
      });
      setSaving(false);
      return;
    }

    await refresh();
    setMsg({ type: "ok", text: "Saved." });
    setSaving(false);
  };

  return (
    <>
      <h1 className="display admin-title">settings</h1>
      <p className="mono admin-sub">
        Store currency is {currency}. Free shipping starts at{" "}
        {formatPrice(freeShippingCents / 100)}.
      </p>

      <form className="settings-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="mono" htmlFor="s-currency">
            Currency
          </label>
          <select
            id="s-currency"
            value={form.currency}
            onChange={(e) => set("currency", e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="admin-muted settings-note">
            Changing this doesn't convert product prices, so update them after.
            Past orders keep the currency they were paid in.
          </p>
        </div>

        <div className="field">
          <label className="mono" htmlFor="s-free">
            Free shipping over (0 = always free)
          </label>
          <input
            id="s-free"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={form.free}
            onChange={(e) => set("free", e.target.value)}
          />
        </div>

        <div className="field">
          <label className="mono" htmlFor="s-flat">
            Flat shipping rate
          </label>
          <input
            id="s-flat"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={form.flat}
            onChange={(e) => set("flat", e.target.value)}
          />
        </div>

        {msg && (
          <p
            className={`mono ${msg.type === "error" ? "login__error" : ""}`}
            role={msg.type === "error" ? "alert" : "status"}
          >
            {msg.text}
          </p>
        )}

        <button type="submit" className="btn" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </>
  );
}