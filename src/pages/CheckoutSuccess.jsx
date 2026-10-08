import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Logo from "../components/Logo";
import useCart from "../hooks/useCart";

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) clearCart();
  }, [sessionId, clearCart]);

  if (!sessionId) return <Navigate to="/shop" replace />;

  return (
    <section
      className="wrap"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 20,
        minHeight: "60vh",
        padding: "clamp(40px, 8vw, 100px) 0",
      }}
    >
      <Logo size={56} />
      <h1 className="display" style={{ fontSize: "clamp(44px, 8vw, 120px)" }}>
        thank you.
      </h1>
      <p className="hand">your order is confirmed.</p>
      <p style={{ maxWidth: 420 }}>
        We're getting your pieces ready. A receipt and shipping update will
        follow by email.
      </p>
      <Button to="/shop" variant="outline">
        Keep shopping
      </Button>
    </section>
  );
}