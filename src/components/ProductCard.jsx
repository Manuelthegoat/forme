import { Link } from "react-router-dom";
import Placeholder from "./Placeholder";
import { formatPrice } from "../lib/products";
import "./ProductCard.css";

export default function ProductCard({ product, onQuickAdd = () => {} }) {
  const { slug, name, price, tag, colors, images, soldOut } = product;
  const [main, hover] = images;

  return (
    <article className="card">
      <div className="card__media">
        <Link
          to={`/product/${slug}`}
          className="card__link"
          aria-label={name}
          tabIndex={-1}
        >
          {main ? (
            <>
              <img className="card__img" src={main} alt={name} loading="lazy" />
              {hover && (
                <img
                  className="card__img card__img--hover"
                  src={hover}
                  alt=""
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <Placeholder bg={colors.bg} fg={colors.fg} />
          )}
        </Link>

        {tag && <span className="card__tag mono">{tag}</span>}

        {!soldOut && (
          <button
            type="button"
            className="card__quick mono"
            onClick={() => onQuickAdd(product)}
          >
            Quick add
          </button>
        )}
      </div>

      <Link to={`/product/${slug}`} className="card__info">
        <span>{name}</span>
        <span className="mono">{formatPrice(price)}</span>
      </Link>
    </article>
  );
}