import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  money,
  shortId,
  formatDate,
  addressLines,
  FULFILLMENT_LABELS,
} from "../../lib/orders";
import { StatusBadge } from "./AdminOrders";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) setError(err.message);
        else if (!data) setError("Order not found.");
        else setOrder(data);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const setFulfillment = async (next) => {
    const prev = order.fulfillment;
    setOrder((o) => ({ ...o, fulfillment: next })); // instant
    setSaving(true);
    setError("");

    const { data, error: err } = await supabase
      .from("orders")
      .update({ fulfillment: next })
      .eq("id", order.id)
      .select("id");

    // a blocked update returns no rows instead of an error
    if (err || !data?.length) {
      setOrder((o) => ({ ...o, fulfillment: prev }));
      setError(err?.message ?? "Couldn't update this order.");
    }
    setSaving(false);
  };

  const copyAddress = async () => {
    const text = [order.customer_name, ...addressLines(order.shipping_address)]
      .filter(Boolean)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Couldn't copy. Select the address and copy it by hand.");
    }
  };

  if (loading) return <p className="mono">Loading…</p>;

  if (!order) {
    return (
      <>
        <Link to="/admin/orders" className="mono admin-sub">
          ← All orders
        </Link>
        <p className="mono">{error}</p>
      </>
    );
  }

  const lines = addressLines(order.shipping_address);
  const paid = order.status === "paid";

  return (
    <>
      <Link to="/admin/orders" className="mono admin-sub">
        ← All orders
      </Link>

      <div className="admin-head">
        <div>
          <h1 className="display admin-title">{shortId(order.id).toLowerCase()}</h1>
          <p className="mono admin-sub">
            {formatDate(order.paid_at ?? order.created_at)}
          </p>
        </div>
        <StatusBadge order={order} />
      </div>

      {error && (
        <p className="login__error mono" role="alert">
          {error}
        </p>
      )}

      <div className="order-grid">
        {/* items */}
        <div className="card-box">
          <h2 className="mono">Items</h2>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Size</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td className="mono">{i.size}</td>
                    <td className="mono">{i.qty}</td>
                    <td className="mono">
                      {money(i.unit_price_cents, order.currency)}
                    </td>
                    <td className="mono">
                      {money(i.unit_price_cents * i.qty, order.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <dl className="totals mono">
            <div>
              <dt>Subtotal</dt>
              <dd>{money(order.subtotal_cents, order.currency)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>{money(order.shipping_cents, order.currency)}</dd>
            </div>
            <div className="totals__sum">
              <dt>Total</dt>
              <dd>{money(order.total_cents, order.currency)}</dd>
            </div>
          </dl>
        </div>

        {/* customer + fulfillment */}
        <div className="order-side">
          <div className="card-box">
            <h2 className="mono">Fulfillment</h2>
            {paid ? (
              <div className="field">
                <label className="visually-hidden" htmlFor="fulfillment">
                  Fulfillment status
                </label>
                <select
                  id="fulfillment"
                  value={order.fulfillment}
                  disabled={saving}
                  onChange={(e) => setFulfillment(e.target.value)}
                >
                  {Object.entries(FULFILLMENT_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="admin-muted">
                This order hasn't been paid, so there's nothing to ship.
              </p>
            )}
          </div>

          <div className="card-box">
            <h2 className="mono">Customer</h2>
            <p>{order.customer_name || "—"}</p>
            {order.email && (
              <a className="admin-link" href={`mailto:${order.email}`}>
                {order.email}
              </a>
            )}
          </div>

          <div className="card-box">
            <h2 className="mono">Ship to</h2>
            {lines.length > 0 ? (
              <>
                <address className="addr">
                  {lines.map((l) => (
                    <span key={l}>
                      {l}
                      <br />
                    </span>
                  ))}
                </address>
                <button type="button" className="pform__link mono" onClick={copyAddress}>
                  {copied ? "Copied" : "Copy address"}
                </button>
              </>
            ) : (
              <p className="admin-muted">No address on file.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}