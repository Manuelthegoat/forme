import Logo from "./Logo";
import Button from "./Button";
import "./Hero.css";

const RING_COUNT = 7;

export default function Hero() {
  return (
    <section className="hero">
      {/* binder strip */}
      <div className="hero__binder" aria-hidden="true">
        {Array.from({ length: RING_COUNT }).map((_, i) => (
          <i
            key={i}
            className="hero__ring"
            style={{ top: `${6 + i * 13}%` }}
          />
        ))}
      </div>

      {/* copy */}
      <div className="hero__copy">
        <p className="hand hero__note">forme / fm26 — the first edit</p>

        <h1 className="display hero__title">
          made for the
          <br />
          body in
          <br />
          motion.
        </h1>

        <p className="mono hero__affirm">
          Affirm it, visualize it, and it will actualize itself.
        </p>

        <Button to="/shop">Shop the edit</Button>
      </div>

      {/* stage */}
      <div className="hero__stage">
        <div className="hero__logo">
          <Logo size={300} />
        </div>
        <span className="mono hero__credit">
          Forme
          <br />
          by Princess
        </span>
      </div>
    </section>
  );
}