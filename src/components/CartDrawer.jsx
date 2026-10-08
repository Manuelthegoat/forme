import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import Placeholder from "./Placeholder";
import Button from "./Button";
import { formatPrice } from "../lib/products";
import "./CartDrawer.css";
import { startCheckout } from "../lib/checkout";

const FREE_SHIPPING_AT = 150;

export default function CartDrawer() {
  const { items, count, subtotal, isOpen, closeCart, setQty, removeItem } =
    useCart();
  const closeRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setBusy(true);
    setError("");
    try {
      const url = await startCheckout(items);
      window.location.assign(url);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  // escape to close + lock scroll + focus the close button
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, closeCart]);

  const remaining = Math.max(FREE_SHIPPING_AT - subtotal, 0);
  const progress = Math.min(subtotal / FREE_SHIPPING_AT, 1);

  return (
    <div className={`cart ${isOpen ? "cart--open" : ""}`}>
      <div className="cart__overlay" onClick={closeCart} aria-hidden="true" />

      <aside
        className="cart__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <header className="cart__head">
          <h2 className="display cart__title">bag ({count})</h2>
          <button
            ref={closeRef}
            type="button"
            className="mono cart__close"
            onClick={closeCart}
          >
            Close
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart__empty">
            <p className="hand">nothing here yet.</p>
            <Button to="/shop" variant="outline" onClick={closeCart}>
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            {/* free shipping bar */}
            <div className="cart__ship">
              <p className="mono">
                {remaining > 0
                  ? `${formatPrice(remaining)} away from free shipping`
                  : "You've unlocked free shipping"}
              </p>
              <div className="cart__bar" aria-hidden="true">
                <span style={{ transform: `scaleX(${progress})` }} />
              </div>
            </div>

            {/* lines */}
            <ul className="cart__lines">
              {items.map((item) => (
                <li key={item.key} className="line">
                  <Link
                    to={`/product/${item.slug}`}
                    className="line__thumb"
                    onClick={closeCart}
                    aria-label={item.name}
                  >
                    {item.image ? (
                      <img src={item.image} alt="" />
                    ) : (
                      <Placeholder bg={item.colors.bg} fg={item.colors.fg} />
                    )}
                  </Link>

                  <div className="line__body">
                    <div className="line__top">
                      <span className="line__name">{item.name}</span>
                      <span className="mono">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                    <span className="mono line__size">Size {item.size}</span>

                    <div className="line__actions">
                      <div className="qty">
                        <button
                          type="button"
                          onClick={() => setQty(item.key, item.qty - 1)}
                          aria-label={`Decrease ${item.name}`}
                        >
                          −
                        </button>
                        <span className="mono" aria-live="polite">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(item.key, item.qty + 1)}
                          disabled={item.qty >= (item.maxQty ?? 10)}
                          aria-label={`Increase ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="mono line__remove"
                        onClick={() => removeItem(item.key)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* footer */}
            <footer className="cart__foot">
              <div className="cart__sub">
                <span>Subtotal</span>
                <span className="mono">{formatPrice(subtotal)}</span>
              </div>
              <p className="cart__note">
                Taxes and shipping calculated at checkout.
              </p>

              <Button
                variant="chrome"
                className="cart__checkout"
                disabled={busy}
                onClick={handleCheckout}
              >
                {busy ? "Redirecting…" : "Check out"}
              </Button>

              {error && (
                <p className="cart__error mono" role="alert">
                  {error}
                </p>
              )}

              <p className="cart__note">
                Pay in instalments with Klarna or Clearpay.
                <br />
                We cover duties and taxes on international orders.
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}