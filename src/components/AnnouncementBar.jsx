import useSettings from "../hooks/useSettings";
import { formatPrice } from "../lib/products";
import "./AnnouncementBar.css";

export default function AnnouncementBar() {
  const { freeShippingCents } = useSettings();

  const shipping =
    freeShippingCents > 0
      ? `Free shipping over ${formatPrice(freeShippingCents / 100)}`
      : "Free shipping on all orders";

  return (
    <div className="announce mono">{shipping} ✦ SS26 first edit is live</div>
  );
}