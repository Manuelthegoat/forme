import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import ProductGrid from "../components/ProductGrid";
import Button from "../components/Button";
import useCart from "../hooks/useCart";
import { products } from "../data/products";
import { shopFilters, sortOptions } from "../data/categories";
import "./Shop.css";

const SORTERS = {
  new: (a, b) => Number(b.tag === "New") - Number(a.tag === "New"),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
};

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const { addItem } = useCart();

  // read from the URL, falling back to safe defaults for bad values
  const rawCategory = params.get("category");
  const rawSort = params.get("sort");
  const category = shopFilters.some((f) => f.id === rawCategory)
    ? rawCategory
    : "all";
  const sort = sortOptions.some((o) => o.id === rawSort) ? rawSort : "featured";

  const update = (key, value, defaultValue) => {
    const next = new URLSearchParams(params);
    if (value === defaultValue) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const visible = useMemo(() => {
    const list =
      category === "all"
        ? products
        : products.filter((p) => p.category === category);
    const sorter = SORTERS[sort];
    return sorter ? [...list].sort(sorter) : list;
  }, [category, sort]);

  const heading = shopFilters.find((f) => f.id === category)?.label ?? "All";

  return (
    <section className="wrap shop">
      <header className="shop__head">
        <h1 className="display shop__title">
          {category === "all" ? "shop all" : heading.toLowerCase()}
        </h1>
        <p className="mono shop__count">
          {visible.length} {visible.length === 1 ? "piece" : "pieces"}
        </p>
      </header>

      <FilterBar
        category={category}
        sort={sort}
        onCategory={(id) => update("category", id, "all")}
        onSort={(id) => update("sort", id, "featured")}
      />

      {visible.length > 0 ? (
        <ProductGrid products={visible} onQuickAdd={(p) => addItem(p)} />
      ) : (
        <div className="shop__empty">
          <p className="hand">nothing here yet.</p>
          <Button variant="outline" onClick={() => update("category", "all", "all")}>
            View all
          </Button>
        </div>
      )}
    </section>
  );
}