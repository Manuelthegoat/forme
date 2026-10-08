import { supabase } from "./supabase";

export const SIZE_ORDER = ["XS", "S", "M", "L", "XL"];

// placeholder colours, used only when a product has no photos yet
const PALETTES = [
  { bg: "#d9d3c9", fg: "#6d6a66" },
  { bg: "#e9e4de", fg: "#a7714f" },
  { bg: "#c4c7cc", fg: "#16161a" },
  { bg: "#e6d6dc", fg: "#f7f3ee" },
  { bg: "#2c2c32", fg: "#4b4b55" },
  { bg: "#8a2a3a", fg: "#b4485a" },
  { bg: "#e5c9ae", fg: "#ffffff" },
  { bg: "#a98f7c", fg: "#c9b09b" },
];

// database row -> the shape the components already use
export function mapProduct(row) {
  const stock = row.stock ?? {};
  const soldOut = !SIZE_ORDER.some((s) => (stock[s] ?? 0) > 0);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price_cents / 100,
    priceCents: row.price_cents,
    category: row.category,
    tag: soldOut ? "Sold out" : row.tag,
    images: row.images ?? [],
    stock,
    soldOut,
    published: row.published,
    colors: PALETTES[row.id % PALETTES.length],
  };
}

export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("id");

  if (error) throw error;
  return data.map(mapProduct);
}

export async function fetchProductBySlug(slug) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapProduct(data) : null;
}

export const firstInStockSize = (product) =>
  SIZE_ORDER.find((s) => (product.stock?.[s] ?? 0) > 0) ?? null;

export const formatPrice = (n) =>
  Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;