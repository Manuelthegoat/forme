import { supabase } from "./supabase";

export async function startCheckout(items) {
  const { data, error } = await supabase.functions.invoke("create-checkout", {
    body: {
      items: items.map((i) => ({ id: i.id, size: i.size, qty: i.qty })),
    },
  });

  if (error) {
    let message = "Couldn't start checkout. Please try again.";
    try {
      const body = await error.context.json();
      if (body?.error) message = body.error;
    } catch {
      /* keep the default message */
    }
    throw new Error(message);
  }

  if (!data?.url) throw new Error("Couldn't start checkout. Please try again.");
  return data.url;
}