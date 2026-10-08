import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
const db = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// ---- edit these ----
const SITE_URL = (Deno.env.get("SITE_URL") ?? "http://localhost:5173").replace(/\/$/, "");

const COUNTRIES = ["US", "GB", "CA", "AU", "DE", "FR", "NG"] as const; // where FORME ships
// --------------------

const SIZES = ["XS", "S", "M", "L", "XL"];

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const raw = Array.isArray(body?.items) ? body.items : [];
  if (raw.length === 0 || raw.length > 30) {
    return json({ error: "Your bag is empty." }, 400);
  }

  // validate the input and merge duplicate lines
  const wanted = new Map<string, { id: number; size: string; qty: number }>();
  for (const r of raw) {
    const id = Number(r?.id);
    const qty = Number(r?.qty);
    const size = String(r?.size);
    if (
      !Number.isInteger(id) ||
      !Number.isInteger(qty) ||
      qty < 1 ||
      qty > 10 ||
      !SIZES.includes(size)
    ) {
      return json({ error: "Something in your bag isn't valid." }, 400);
    }
    const key = `${id}-${size}`;
    wanted.set(key, { id, size, qty: (wanted.get(key)?.qty ?? 0) + qty });
  }
  const lines = [...wanted.values()];

  // prices and stock come from the database, never from the browser
  const { data: products, error: pErr } = await db
    .from("products")
    .select("id, name, price_cents, stock, published")
    .in("id", [...new Set(lines.map((l) => l.id))]);

  if (pErr || !products) {
    console.error(pErr);
    return json({ error: "Couldn't check your bag. Please try again." }, 500);
  }

  const byId = new Map(products.map((p) => [p.id, p]));
  const checked = [];

  for (const l of lines) {
    const p = byId.get(l.id);
    if (!p || !p.published) {
      return json({ error: "An item in your bag is no longer available." }, 409);
    }
    const have = Number(p.stock?.[l.size] ?? 0);
    if (have < l.qty) {
      return json(
        {
          error:
            have <= 0
              ? `${p.name} (${l.size}) just sold out.`
              : `Only ${have} of ${p.name} (${l.size}) left.`,
        },
        409,
      );
    }
    checked.push({ ...l, name: p.name as string, price: p.price_cents as number });
  }

  const { data: settings, error: sErr } = await db
  .from("settings")
  .select("currency, free_shipping_cents, flat_shipping_cents")
  .eq("id", 1)
  .single();

if (sErr || !settings) {
  console.error(sErr);
  return json({ error: "Couldn't start checkout. Please try again." }, 500);
}

const CURRENCY = String(settings.currency).toLowerCase();
const subtotal = checked.reduce((n, l) => n + l.price * l.qty, 0);
const shipping =
  subtotal >= settings.free_shipping_cents ? 0 : settings.flat_shipping_cents;

  // pending order
  const { data: order, error: oErr } = await db
    .from("orders")
    .insert({
      subtotal_cents: subtotal,
      shipping_cents: shipping,
      total_cents: subtotal + shipping,
      currency: CURRENCY,
    })
    .select("id")
    .single();

  if (oErr || !order) {
    console.error(oErr);
    return json({ error: "Couldn't start checkout. Please try again." }, 500);
  }

  const { error: iErr } = await db.from("order_items").insert(
    checked.map((l) => ({
      order_id: order.id,
      product_id: l.id,
      name: l.name,
      size: l.size,
      unit_price_cents: l.price,
      qty: l.qty,
    })),
  );

  if (iErr) {
    console.error(iErr);
    await db.from("orders").delete().eq("id", order.id);
    return json({ error: "Couldn't start checkout. Please try again." }, 500);
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: checked.map((l) => ({
        quantity: l.qty,
        price_data: {
          currency: CURRENCY,
          unit_amount: l.price,
          product_data: { name: `${l.name} — ${l.size}` },
        },
      })),
      shipping_address_collection: { allowed_countries: [...COUNTRIES] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: shipping, currency: CURRENCY },
            display_name: shipping === 0 ? "Free shipping" : "Standard shipping",
          },
        },
      ],
      metadata: { order_id: order.id },
      client_reference_id: order.id,
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/shop`,
    });

    await db
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return json({ url: session.url });
  } catch (err) {
    console.error(err);
    await db.from("orders").delete().eq("id", order.id);
    return json({ error: "Couldn't start payment. Please try again." }, 500);
  }
});