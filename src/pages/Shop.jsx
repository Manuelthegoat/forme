import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import ProductGrid from "../components/ProductGrid";
import GridSkeleton from "../components/GridSkeleton";
import Button from "../components/Button";
import useCart from "../hooks/useCart";
import useProducts from "../hooks/useProducts";
import { firstInStockSize } from "../lib/products";
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
  const { products, loading, error, retry } = useProducts();

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
  }, [products, category, sort]);

  // temporary: adds the first size that's in stock (Step E adds a size picker)
  const quickAdd = (p) => {
    const size = firstInStockSize(p);
    if (size) addItem(p, size);
  };

  const heading = shopFilters.find((f) => f.id === category)?.label ?? "All";

  let content;
  if (loading) {
    content = <GridSkeleton />;
  } else if (error) {
    content = (
      <div className="shop__empty">
        <p className="hand">couldn't load the shop.</p>
        <Button variant="outline" onClick={retry}>
          Try again
        </Button>
      </div>
    );
  } else if (visible.length === 0) {
    content = (
      <div className="shop__empty">
        <p className="hand">nothing here yet.</p>
        <Button
          variant="outline"
          onClick={() => update("category", "all", "all")}
        >
          View all
        </Button>
      </div>
    );
  } else {
    content = <ProductGrid products={visible} onQuickAdd={quickAdd} />;
  }

  return (
    <section className="wrap shop">
      <header className="shop__head">
        <h1 className="display shop__title">
          {category === "all" ? "shop all" : heading.toLowerCase()}
        </h1>
        <p className="mono shop__count">
          {loading
            ? "Loading"
            : `${visible.length} ${visible.length === 1 ? "piece" : "pieces"}`}
        </p>
      </header>

      <FilterBar
        category={category}
        sort={sort}
        onCategory={(id) => update("category", id, "all")}
        onSort={(id) => update("sort", id, "featured")}
      />

      {content}
    </section>
  );
}