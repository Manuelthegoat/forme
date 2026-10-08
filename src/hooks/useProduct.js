import { useEffect, useState } from "react";
import { fetchProductBySlug } from "../lib/products";

export default function useProduct(slug) {
  const [state, setState] = useState({ slug: null, product: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchProductBySlug(slug)
      .then((product) => {
        if (!cancelled) setState({ slug, product, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ slug, product: null, error });
      });

    return () => {
      cancelled = true;
    };
  }, [slug, attempt]);

  const retry = () => {
    setState((s) => ({ ...s, slug: null }));
    setAttempt((a) => a + 1);
  };

  return {
    product: state.product,
    error: state.error,
    loading: state.slug !== slug,
    retry,
  };
}