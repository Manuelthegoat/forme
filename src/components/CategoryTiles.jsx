import { Link } from "react-router-dom";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";
import { categories } from "../data/categories";
import "./CategoryTiles.css";

export default function CategoryTiles() {
  return (
    <div className="tiles">
      {categories.map((c, i) => (
        <Reveal key={c.id} delay={i * 120}>
          <Link to={`/shop?category=${c.id}`} className="tile">
            <Placeholder bg={c.bg} fg={c.fg} />
            <span className="display tile__label">{c.label}</span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}