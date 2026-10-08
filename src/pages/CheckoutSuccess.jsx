import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import useCart from "../hooks/useCart";
import "./CheckoutSuccess.css";

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) clearCart();
  }, [sessionId, clearCart]);

  if (!sessionId) return <Navigate to="/shop" replace />;

  return (
    <section className="checkout-success wrap">
      <div className="checkout-success__topline mono">
        <span>FORME / CHECKOUT</span>
        <span>ORDER COMPLETE</span>
      </div>
      <div className="checkout-success__body">
        <div className="checkout-success__message">
          <div className="checkout-success__stamp mono">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19.5 6.5" /></svg>
            <span>Payment received</span>
          </div>
          <p className="checkout-success__eyebrow mono">GOOD CHOICE.</p>
          <h1 className="checkout-success__title display">it’s<br /><span>yours<span className="checkout-success__period">.</span></span></h1>
          <p className="checkout-success__note">Your order is confirmed. We’re getting your pieces ready; your receipt and shipping updates are on their way by email.</p>
          <Button to="/shop" variant="chrome" className="checkout-success__button">Back to the good stuff <span aria-hidden="true">↗</span></Button>
        </div>
        <aside className="checkout-success__art" aria-label="Order confirmed">
          <div className="checkout-success__art-top mono"><span>FORME STUDIO</span><span>EST. 2024</span></div>
          <div className="checkout-success__orbit checkout-success__orbit--outer" />
          <div className="checkout-success__orbit checkout-success__orbit--inner" />
          <div className="checkout-success__check" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="m24 52 17 17 36-39" /></svg></div>
          <span className="checkout-success__spark checkout-success__spark--one">✳</span>
          <span className="checkout-success__spark checkout-success__spark--two">✳</span>
          <p className="checkout-success__art-caption hand">made for you.</p>
          <div className="checkout-success__art-bottom mono"><span>THANK YOU FOR SHOPPING FORME</span><span>♥</span></div>
        </aside>
      </div>
    </section>
  );
}
