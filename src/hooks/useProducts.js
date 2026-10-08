import { useEffect, useState } from "react";
import { fetchProducts } from "../lib/products";

// remembered between page visits, so going back to the shop is instant
let cache = null;

export default function useProducts() {
  const [state, setState] = useState({
    products: cache ?? [],
    loading: !cache,
    error: null,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchProducts()
      .then((products) => {
        cache = products;
        if (!cancelled) setState({ products, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error }));
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    setAttempt((a) => a + 1);
  };

  return { ...state, retry };
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