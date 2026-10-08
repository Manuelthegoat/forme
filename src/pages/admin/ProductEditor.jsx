import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import ProductForm from "./ProductForm";

export default function ProductEditor() {
  const { id } = useParams();
  const isNew = !id;

  const [state, setState] = useState({ product: null, loading: !isNew, error: "" });

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;

    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        setState({
          product: data,
          loading: false,
          error: error ? error.message : data ? "" : "Product not found.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  return (
    <>
      <Link to="/admin/products" className="mono admin-sub">
        ← All products
      </Link>
      <h1 className="display admin-title">
        {isNew ? "new product" : "edit product"}
      </h1>

      {state.loading && <p className="mono">Loading…</p>}
      {state.error && <p className="mono">{state.error}</p>}

      {/* key makes the form reset when you switch products */}
      {!state.loading && !state.error && (
        <ProductForm key={id ?? "new"} product={state.product} />
      )}
    </>
  );
}