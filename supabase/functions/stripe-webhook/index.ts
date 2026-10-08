import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
const cryptoProvider = Stripe.createSubtleCryptoProvider();
const db = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature ?? "",
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
      undefined,
      cryptoProvider,
    );
  } catch (err) {
    console.error("Bad signature", err);
    return new Response("Bad signature", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handlePaid(event.data.object as Stripe.Checkout.Session);
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;
      if (orderId) {
        await db
          .from("orders")
          .update({ status: "expired" })
          .eq("id", orderId)
          .eq("status", "pending");
      }
    }
  } catch (err) {
    console.error(err);
    // a 500 makes Stripe retry later
    return new Response("Handler error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
});

async function handlePaid(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const orderId = session.metadata?.order_id;
  if (!orderId) return;

  // newer Stripe API versions move shipping_details under collected_information
  // deno-lint-ignore no-explicit-any
  const s = session as any;
  const shipping = s.collected_information?.shipping_details ?? s.shipping_details;
  const details = session.customer_details;

  // only the first delivery of this event gets a row back,
  // so a retry can't reduce stock twice
  const { data: updated, error } = await db
    .from("orders")
    .update({
      status: "paid",
      email: details?.email ?? null,
      customer_name: shipping?.name ?? details?.name ?? null,
      shipping_address: shipping?.address ?? null,
      total_cents: session.amount_total ?? 0,
      shipping_cents: session.total_details?.amount_shipping ?? 0,
      stripe_payment_intent:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      paid_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .eq("status", "pending")
    .select("id");

  if (error) throw error;
  if (!updated || updated.length === 0) return; // already handled

  const { data: items, error: iErr } = await db
    .from("order_items")
    .select("product_id, size, qty")
    .eq("order_id", orderId);

  if (iErr) throw iErr;

  for (const item of items ?? []) {
    if (item.product_id == null) continue;
    const { error: rErr } = await db.rpc("decrement_stock", {
      p_product_id: item.product_id,
      p_size: item.size,
      p_qty: item.qty,
    });
    if (rErr) throw rErr;
  }
}