import { shopFilters, sortOptions } from "../data/categories";
import "./FilterBar.css";

export default function FilterBar({ category, sort, onCategory, onSort }) {
  return (
    <div className="filters">
      <div className="filters__chips" role="group" aria-label="Filter by category">
        {shopFilters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`chip mono ${category === f.id ? "chip--on" : ""}`}
            aria-pressed={category === f.id}
            onClick={() => onCategory(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <label className="filters__sort mono">
        Sort
        <select value={sort} onChange={(e) => onSort(e.target.value)}>
          {sortOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}