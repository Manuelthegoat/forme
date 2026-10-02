import Placeholder from "./Placeholder";
import Reveal from "./Reveal";
import Button from "./Button";
import "./EditorialSplit.css";

// image: pass an imported photo to replace the placeholder
export default function EditorialSplit({ image }) {
  return (
    <section className="split">
      <div className="split__media">
        {image ? (
          <img src={image} alt="" loading="lazy" />
        ) : (
          <Placeholder bg="#e5c9ae" fg="#ffffff" />
        )}
      </div>

      <Reveal className="split__copy">
        <p className="hand">the forme fit</p>
        <h2 className="display split__title">
          cut close.
          <br />
          built to move.
        </h2>
        <p className="split__text">
          Elevated, body-conscious pieces with a minimal edge. Y2K and
          streetwear references, kept clean and refined. Made to follow the
          body, not hide it.
        </p>
        <Button to="/about" variant="outline">
          About forme
        </Button>
      </Reveal>
    </section>
  );
}