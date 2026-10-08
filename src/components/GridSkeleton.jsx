import "./ProductGrid.css";
import "./GridSkeleton.css";

export default function GridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton skeleton--img" />
          <div className="skeleton skeleton--line" />
        </div>
      ))}
    </div>
  );
}