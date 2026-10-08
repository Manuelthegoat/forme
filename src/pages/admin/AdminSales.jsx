import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { formatDate, money, shortId } from "../../lib/orders";
import "./Sales.css";

const PERIODS = [
  { id: "7d", label: "7 days", days: 7, unit: "day" },
  { id: "30d", label: "30 days", days: 30, unit: "day" },
  { id: "90d", label: "90 days", days: 90, unit: "week" },
  { id: "12m", label: "12 months", days: 365, unit: "month" },
];
const PAGE_SIZE = 1000;

function periodStart(period, now = new Date()) {
  if (period.unit === "month") return new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - period.days + 1);
  return start;
}

function makeBuckets(period, start) {
  const count = period.unit === "month" ? 12 : period.unit === "week" ? 13 : period.days;
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(start);
    if (period.unit === "month") date.setMonth(date.getMonth() + i);
    else if (period.unit === "week") date.setDate(date.getDate() + i * 7);
    else date.setDate(date.getDate() + i);
    return {
      date,
      label: date.toLocaleDateString("en-US", { month: "short", ...(period.unit === "month" ? {} : { day: "numeric" }) }),
      value: 0,
      orders: 0,
    };
  });
}

function Chart({ buckets, currency }) {
  const width = 800, height = 280, left = 58, right = 18, top = 22, bottom = 46;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const max = Math.max(1, ...buckets.map((bucket) => bucket.value));
  const points = buckets.map((bucket, i) => ({
    x: left + (buckets.length === 1 ? chartWidth / 2 : (i / (buckets.length - 1)) * chartWidth),
    y: top + chartHeight - (bucket.value / max) * chartHeight,
  }));
  const line = points.map((point, i) => `${i === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const area = `${line} L${points[points.length - 1]?.x ?? left},${top + chartHeight} L${points[0]?.x ?? left},${top + chartHeight} Z`;
  const labelEvery = buckets.length <= 7 ? 1 : buckets.length <= 13 ? 3 : 2;
  const axis = [0, 0.5, 1].map((part) => ({ y: top + chartHeight - part * chartHeight, value: max * part }));
  const tickMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase(), notation: "compact", maximumFractionDigits: 1 });

  return (
    <div className="sales-chart__scroll">
      <svg className="sales-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Sales revenue trend">
        <defs><linearGradient id="sales-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--red)" stopOpacity=".2" /><stop offset="100%" stopColor="var(--red)" stopOpacity="0" /></linearGradient></defs>
        {axis.map((tick) => <g key={tick.y}><line x1={left} x2={width - right} y1={tick.y} y2={tick.y} className="sales-chart__grid" /><text x={left - 10} y={tick.y + 4} textAnchor="end" className="sales-chart__axis">{tickMoney.format(tick.value / 100)}</text></g>)}
        <path d={area} className="sales-chart__area" />
        <path d={line} className="sales-chart__line" />
        {points.map((point, i) => <g key={buckets[i].date.toISOString()} className="sales-chart__point"><circle cx={point.x} cy={point.y} r="4" /><title>{`${buckets[i].label}: ${money(buckets[i].value, currency)} sales, ${buckets[i].orders} orders`}</title></g>)}
        {buckets.map((bucket, i) => (i % labelEvery === 0 || i === buckets.length - 1) && <text key={bucket.date.toISOString()} x={points[i].x} y={height - 15} textAnchor="middle" className="sales-chart__axis">{bucket.label}</text>)}
      </svg>
    </div>
  );
}

export default function AdminSales() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [periodId, setPeriodId] = useState("30d");
  const [now] = useState(() => new Date());
  const period = PERIODS.find((item) => item.id === periodId) ?? PERIODS[1];
  const currency = orders?.[0]?.currency ?? "usd";

  useEffect(() => {
    let cancelled = false;
    async function loadSales() {
      setError("");
      const start = periodStart(PERIODS[3], new Date());
      const all = [];
      let from = 0;
      try {
        while (!cancelled) {
          const { data, error: queryError } = await supabase
            .from("orders")
            .select("id, status, paid_at, total_cents, currency, order_items(name, qty, unit_price_cents)")
            .eq("status", "paid")
            .not("paid_at", "is", null)
            .gte("paid_at", start.toISOString())
            .order("paid_at", { ascending: true })
            .range(from, from + PAGE_SIZE - 1);
          if (queryError) throw queryError;
          all.push(...(data ?? []));
          if (!data || data.length < PAGE_SIZE) break;
          from += PAGE_SIZE;
        }
        if (!cancelled) setOrders(all);
      } catch (queryError) {
        if (!cancelled) setError(queryError.message || "Could not load sales data.");
      }
    }
    loadSales();
    return () => { cancelled = true; };
  }, []);

  const report = useMemo(() => {
    const start = periodStart(period, now);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const visible = (orders ?? []).filter((order) => {
      const date = new Date(order.paid_at);
      return date >= start && date <= end;
    });
    const buckets = makeBuckets(period, start);
    const bestSellers = new Map();
    visible.forEach((order) => {
      const paidDate = new Date(order.paid_at);
      let index;
      if (period.unit === "month") index = (paidDate.getFullYear() - start.getFullYear()) * 12 + paidDate.getMonth() - start.getMonth();
      else if (period.unit === "week") index = Math.floor((paidDate - start) / (7 * 24 * 60 * 60 * 1000));
      else {
        const day = new Date(paidDate.getFullYear(), paidDate.getMonth(), paidDate.getDate());
        index = Math.round((day - start) / (24 * 60 * 60 * 1000));
      }
      if (buckets[index]) { buckets[index].value += Number(order.total_cents || 0); buckets[index].orders += 1; }
      (order.order_items ?? []).forEach((item) => {
        const current = bestSellers.get(item.name) ?? { name: item.name, units: 0, revenue: 0 };
        current.units += Number(item.qty || 0);
        current.revenue += Number(item.unit_price_cents || 0) * Number(item.qty || 0);
        bestSellers.set(item.name, current);
      });
    });
    const sales = visible.reduce((sum, order) => sum + Number(order.total_cents || 0), 0);
    const units = visible.reduce((sum, order) => sum + (order.order_items ?? []).reduce((count, item) => count + Number(item.qty || 0), 0), 0);
    return {
      visible, buckets, sales, units, orderCount: visible.length,
      average: visible.length ? Math.round(sales / visible.length) : 0,
      bestSellers: [...bestSellers.values()].sort((a, b) => b.units - a.units).slice(0, 5),
    };
  }, [orders, period, now]);

  const maxProductUnits = Math.max(1, ...report.bestSellers.map((item) => item.units));

  return (
    <div className="sales-page">
      <div className="sales-head">
        <div>
          <p className="mono sales-kicker">STORE PERFORMANCE / OVERVIEW</p>
          <h1 className="display admin-title">sales</h1>
          <p className="mono admin-sub">Revenue and orders from completed payments.</p>
        </div>
        <div className="sales-periods" role="group" aria-label="Sales date range">
          {PERIODS.map((item) => <button key={item.id} type="button" className={`sales-period ${periodId === item.id ? "sales-period--active" : ""}`} aria-pressed={periodId === item.id} onClick={() => setPeriodId(item.id)}>{item.label}</button>)}
        </div>
      </div>
      {error && <p className="sales-error mono" role="alert">{error}</p>}
      {!orders && !error && <p className="sales-loading mono" aria-live="polite">Loading sales...</p>}
      {orders && <>
        <section className="sales-metrics" aria-label="Sales summary">
          <article className="sales-metric sales-metric--primary"><p className="mono">Total sales</p><strong>{money(report.sales, currency)}</strong><span className="mono">INCLUDING SHIPPING</span></article>
          <article className="sales-metric"><p className="mono">Orders</p><strong>{report.orderCount.toLocaleString("en-US")}</strong><span className="mono">PAID ORDERS</span></article>
          <article className="sales-metric"><p className="mono">Average order</p><strong>{money(report.average, currency)}</strong><span className="mono">PER PAID ORDER</span></article>
          <article className="sales-metric"><p className="mono">Items sold</p><strong>{report.units.toLocaleString("en-US")}</strong><span className="mono">UNITS IN THIS PERIOD</span></article>
        </section>
        <div className="sales-panels">
          <section className="sales-panel sales-panel--trend">
            <div className="sales-panel__head"><div><p className="mono">PAID ORDER TOTALS</p><h2 className="display">sales over time</h2></div><span className="sales-panel__period mono">{period.label}</span></div>
            {report.orderCount ? <Chart buckets={report.buckets} currency={currency} /> : <p className="sales-empty">No sales in this period yet.</p>}
          </section>
          <section className="sales-panel sales-panel--products">
            <div className="sales-panel__head"><div><p className="mono">BY UNITS SOLD</p><h2 className="display">best sellers</h2></div></div>
            {report.bestSellers.length ? <ol className="sales-best-list">{report.bestSellers.map((item, index) => <li key={item.name}><span className="sales-best-list__rank mono">0{index + 1}</span><div className="sales-best-list__body"><div className="sales-best-list__label"><span>{item.name}</span><span className="mono">{item.units} sold</span></div><div className="sales-best-list__track"><span style={{ width: `${(item.units / maxProductUnits) * 100}%` }} /></div></div></li>)}</ol> : <p className="sales-empty">Product sales will appear here.</p>}
          </section>
        </div>
        <section className="sales-recent">
          <div className="sales-recent__head"><div><p className="mono">LATEST COMPLETED PAYMENTS</p><h2 className="display">recent sales</h2></div><Link to="/admin/orders?show=paid" className="mono">All orders</Link></div>
          {report.visible.length ? <div className="table-wrap"><table className="table"><thead><tr><th>Order</th><th>Date paid</th><th>Items</th><th>Total</th><th></th></tr></thead><tbody>{[...report.visible].sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at)).slice(0, 5).map((order) => <tr key={order.id}><td className="mono">{shortId(order.id)}</td><td className="mono">{formatDate(order.paid_at)}</td><td className="mono">{(order.order_items ?? []).reduce((sum, item) => sum + Number(item.qty || 0), 0)}</td><td className="mono">{money(order.total_cents, order.currency)}</td><td><Link className="mono" to={`/admin/orders/${order.id}`}>View</Link></td></tr>)}</tbody></table></div> : <p className="sales-empty">No completed orders for this range.</p>}
        </section>
      </>}
    </div>
  );
}
