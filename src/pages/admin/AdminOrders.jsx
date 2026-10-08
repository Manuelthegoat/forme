import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  money,
  shortId,
  formatDate,
  FULFILLMENT_LABELS,
} from "../../lib/orders";
import "../../components/FilterBar.css"; // reuses the chip styles

const FILTERS = [
  {
    id: "to-ship",
    label: "To ship",
    test: (o) => o.status === "paid" && o.fulfillment === "unfulfilled",
  },
  {
    id: "shipped",
    label: "Shipped",
    test: (o) => o.status === "paid" && o.fulfillment === "shipped",
  },
  {
    id: "delivered",
    label: "Delivered",
    test: (o) => o.status === "paid" && o.fulfillment === "delivered",
  },
  { id: "paid", label: "All paid", test: (o) => o.status === "paid" },
  { id: "unpaid", label: "Unpaid", test: (o) => o.status !== "paid" },
];

const itemCount = (o) =>
  (o.order_items ?? []).reduce((n, i) => n + i.qty, 0);

export default function AdminOrders() {
  const [params, setParams] = useSearchParams();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  const requested = params.get("show");
  const filter = FILTERS.find((f) => f.id === requested) ?? FILTERS[0];

  useEffect(() => {
    supabase
      .from("orders")
      .select(
        "id, status, fulfillment, email, customer_name, total_cents, currency, created_at, paid_at, order_items(qty)"
      )
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setOrders(data);
      });
  }, []);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map((f) => [f.id, orders ? orders.filter(f.test).length : 0])
      ),
    [orders]
  );

  const visible = useMemo(
    () => (orders ? orders.filter(filter.test) : []),
    [orders, filter]
  );

  return (
    <>
      <h1 className="display admin-title">orders</h1>
      <p className="mono admin-sub">
        {orders ? `${counts["to-ship"]} waiting to ship` : "Loading…"}
      </p>

      <div className="filters__chips admin-chips" role="group" aria-label="Filter orders">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`chip mono ${f.id === filter.id ? "chip--on" : ""}`}
            aria-pressed={f.id === filter.id}
            onClick={() => setParams({ show: f.id }, { replace: true })}
          >
            {f.label}
            {orders && ` (${counts[f.id]})`}
          </button>
        ))}
      </div>

      {error && <p className="mono">{error}</p>}

      {orders && visible.length === 0 && (
        <p className="hand">nothing here.</p>
      )}

      {visible.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((o) => (
                <tr key={o.id}>
                  <td className="mono">{shortId(o.id)}</td>
                  <td className="mono">{formatDate(o.paid_at ?? o.created_at)}</td>
                  <td>
                    {o.customer_name || o.email || "—"}
                    {o.customer_name && o.email && (
                      <span className="admin-muted"> · {o.email}</span>
                    )}
                  </td>
                  <td className="mono">{itemCount(o)}</td>
                  <td className="mono">{money(o.total_cents, o.currency)}</td>
                  <td>
                    <StatusBadge order={o} />
                  </td>
                  <td>
                    <Link className="mono" to={`/admin/orders/${o.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {orders && orders.length >= 200 && (
        <p className="mono admin-sub" style={{ marginTop: 16 }}>
          Showing the 200 most recent orders.
        </p>
      )}
    </>
  );
}

export function StatusBadge({ order }) {
  if (order.status !== "paid") {
    return <span className="badge mono">{order.status}</span>;
  }
  const cls =
    order.fulfillment === "unfulfilled"
      ? "badge--warn"
      : order.fulfillment === "delivered"
      ? "badge--on"
      : "";
  return (
    <span className={`badge mono ${cls}`}>
      {FULFILLMENT_LABELS[order.fulfillment]}
    </span>
  );
}