import { useState } from "react";
import Placeholder from "./Placeholder";
import "./ProductGallery.css";

export default function ProductGallery({ images, name, colors }) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div className="gallery">
      <div className="gallery__main">
        {current ? (
          <img
            key={current}
            src={current}
            alt={name}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
          />
        ) : (
          <Placeholder bg={colors.bg} fg={colors.fg} />
        )}
      </div>

      {images.length > 1 && (
        <ul className="gallery__thumbs" aria-label="Product photos">
          {images.map((url, i) => (
            <li key={url}>
              <button
                type="button"
                className={`gallery__thumb ${i === index ? "gallery__thumb--on" : ""}`}
                aria-label={`Show photo ${i + 1}`}
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
              >
                <img src={url} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}