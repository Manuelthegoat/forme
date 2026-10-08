export const money = (cents, currency = "usd") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format((cents ?? 0) / 100);

export const shortId = (id) => `#${id.slice(0, 8).toUpperCase()}`;

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

// Stripe's address object -> lines of text
export function addressLines(a) {
  if (!a) return [];
  return [
    a.line1,
    a.line2,
    [a.postal_code, a.city].filter(Boolean).join(" "),
    a.state,
    a.country,
  ].filter(Boolean);
}

export const FULFILLMENT_LABELS = {
  unfulfilled: "To ship",
  shipped: "Shipped",
  delivered: "Delivered",
};