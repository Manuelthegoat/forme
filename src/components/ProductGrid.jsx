import ProductCard from "./ProductCard";
import "./ProductGrid.css";

export default function ProductGrid({ products, onQuickAdd }) {
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onQuickAdd={onQuickAdd} />
      ))}
    </div>
  );
}