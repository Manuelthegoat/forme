// Two-decimal currencies only. Zero-decimal ones (JPY, KRW...) are priced
// differently in Stripe and would need extra handling.
export const CURRENCIES = [
  { code: "USD", label: "US dollar ($)", locale: "en-US" },
  { code: "GBP", label: "British pound (£)", locale: "en-GB" },
  { code: "EUR", label: "Euro (€)", locale: "en-IE" },
  { code: "CAD", label: "Canadian dollar", locale: "en-CA" },
  { code: "AUD", label: "Australian dollar", locale: "en-AU" },
  { code: "NGN", label: "Nigerian naira (₦)", locale: "en-NG" },
];

const localeFor = (code) =>
  CURRENCIES.find((c) => c.code === code)?.locale ?? "en-US";

// set once when the settings load, before the pages render
let currency = "USD";
export const setStoreCurrency = (code) => {
  currency = code;
};
export const getStoreCurrency = () => currency;

export function formatPrice(n) {
  const whole = Number.isInteger(n);
  return new Intl.NumberFormat(localeFor(currency), {
    style: "currency",
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function currencySymbol(code = currency) {
  const part = new Intl.NumberFormat(localeFor(code), {
    style: "currency",
    currency: code,
  })
    .formatToParts(0)
    .find((p) => p.type === "currency");
  return part?.value ?? code;
}