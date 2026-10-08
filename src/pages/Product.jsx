import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductGallery from "../components/ProductGallery";
import SizeSelector from "../components/SizeSelector";
import Button from "../components/Button";
import useProduct from "../hooks/useProduct";
import useCart from "../hooks/useCart";
import { formatPrice } from "../lib/products";
import "./Product.css";
import useSettings from "../hooks/useSettings";

function ProductView({ product }) {
  const { addItem } = useCart();
  const { freeShippingCents } = useSettings();
  const [size, setSize] = useState(null);

  const left = size ? product.stock?.[size] ?? 0 : null;

  useEffect(() => {
    const prev = document.title;
    document.title = `${product.name} — FORME`;
    return () => {
      document.title = prev;
    };
  }, [product.name]);

  let label = "Select a size";
  if (product.soldOut) label = "Sold out";
  else if (size) label = "Add to bag";

  return (
    <section className="wrap pdp">
      <div className="pdp__gallery">
        <ProductGallery
          images={product.images}
          name={product.name}
          colors={product.colors}
        />
      </div>

      <div className="pdp__info">
        <Link to="/shop" className="mono pdp__back">
          ← Shop
        </Link>

        {product.tag && <span className="pdp__tag mono">{product.tag}</span>}

        <h1 className="display pdp__name">{product.name}</h1>
        <p className="mono pdp__price">{formatPrice(product.price)}</p>

        {product.description && (
          <p className="pdp__desc">{product.description}</p>
        )}

        {!product.soldOut && (
          <div className="pdp__sizes">
            <p className="mono pdp__label">Size</p>
            <SizeSelector
              stock={product.stock}
              value={size}
              onChange={setSize}
            />
            {left !== null && left <= 3 && (
              <p className="mono pdp__left" role="status">
                Only {left} left
              </p>
            )}
          </div>
        )}

        <Button
          variant="chrome"
          className="pdp__add"
          disabled={product.soldOut || !size}
          onClick={() => addItem(product, size)}
        >
          {label}
        </Button>

        <div className="pdp__details">
          <details>
            <summary className="mono">Shipping &amp; returns</summary>
            <p>
              {freeShippingCents > 0
                ? `Free shipping over ${formatPrice(freeShippingCents / 100)}.`
                : "Free shipping on all orders."}{" "}
              Taxes and shipping are calculated at checkout. Returns within 14 days,
              unworn with tags attached.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}

export default function Product() {
  const { slug } = useParams();
  const { product, loading, error, retry } = useProduct(slug);

  if (loading) {
    return (
      <section className="wrap pdp">
        <div className="pdp__gallery">
          <div className="skeleton skeleton--img" />
        </div>
        <div className="pdp__info" aria-busy="true">
          <div className="skeleton skeleton--line" />
          <div className="skeleton skeleton--line" />
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="wrap pdp pdp--empty">
        <p className="hand">
          {error ? "couldn't load this piece." : "we couldn't find that piece."}
        </p>
        {error ? (
          <Button variant="outline" onClick={retry}>
            Try again
          </Button>
        ) : (
          <Button to="/shop" variant="outline">
            Back to shop
          </Button>
        )}
      </section>
    );
  }

  // key resets the size choice when you move to a different product
  return <ProductView key={product.slug} product={product} />;
}