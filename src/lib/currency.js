// Supported currencies and locales for the FORME shipping destinations.
export const CURRENCIES = [
  { code: "USD", label: "US dollar ($)", locale: "en-US" },
  { code: "GBP", label: "British pound (£)", locale: "en-GB" },
  { code: "EUR", label: "Euro (€)", locale: "en-IE" },
  { code: "CAD", label: "Canadian dollar", locale: "en-CA" },
  { code: "AUD", label: "Australian dollar", locale: "en-AU" },
  { code: "NGN", label: "Nigerian naira (₦)", locale: "en-NG" },
];

export const STORE_COUNTRIES = [
  { code: "US", name: "United States", currency: "USD", locale: "en-US" },
  { code: "GB", name: "United Kingdom", currency: "GBP", locale: "en-GB" },
  { code: "CA", name: "Canada", currency: "CAD", locale: "en-CA" },
  { code: "AU", name: "Australia", currency: "AUD", locale: "en-AU" },
  { code: "DE", name: "Germany", currency: "EUR", locale: "de-DE" },
  { code: "FR", name: "France", currency: "EUR", locale: "fr-FR" },
  { code: "NG", name: "Nigeria", currency: "NGN", locale: "en-NG" },
];

const localeFor = (code) => CURRENCIES.find((item) => item.code === code)?.locale ?? "en-US";

let storeCurrency = "USD";
let displayCurrency = "USD";
let displayLocale = "en-US";
let exchangeRate = 1;

export const setStoreCurrency = (code) => {
  storeCurrency = code;
  displayCurrency = code;
  displayLocale = localeFor(code);
  exchangeRate = 1;
};

export const setDisplayCurrency = (country, rate) => {
  displayCurrency = country.currency;
  displayLocale = country.locale;
  exchangeRate = rate;
};

export const getStoreCurrency = () => storeCurrency;
export const getDisplayCurrency = () => displayCurrency;

export function formatPrice(amount, currency = displayCurrency, locale = displayLocale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount * exchangeRate);
}

export function formatBasePrice(amount) {
  return new Intl.NumberFormat(localeFor(storeCurrency), {
    style: "currency",
    currency: storeCurrency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function currencySymbol(code = storeCurrency) {
  const part = new Intl.NumberFormat(localeFor(code), {
    style: "currency",
    currency: code,
  }).formatToParts(0).find((item) => item.type === "currency");
  return part?.value ?? code;
}