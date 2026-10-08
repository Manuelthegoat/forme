import { SIZE_ORDER } from "../lib/products";
import "./SizeSelector.css";

export default function SizeSelector({ stock, value, onChange }) {
  return (
    <div className="sizes" role="group" aria-label="Size">
      {SIZE_ORDER.map((s) => {
        const out = (stock?.[s] ?? 0) <= 0;
        return (
          <button
            key={s}
            type="button"
            disabled={out}
            aria-pressed={value === s}
            title={out ? "Sold out" : undefined}
            className={`size mono ${value === s ? "size--on" : ""} ${
              out ? "size--out" : ""
            }`}
            onClick={() => onChange(s)}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}