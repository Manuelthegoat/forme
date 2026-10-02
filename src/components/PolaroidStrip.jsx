import Placeholder from "./Placeholder";
import Reveal from "./Reveal";
import { polaroids } from "../data/polaroids";
import "./PolaroidStrip.css";

export default function PolaroidStrip() {
  return (
    <section className="polas section">
      <div className="wrap">
        <div className="polas__head">
          <h2 className="display polas__title">no face, no case.</h2>
          <p className="mono polas__sub">
            Anonymous by design. The body is the campaign.
          </p>
        </div>

        <div className="polas__row">
          {polaroids.map((p, i) => (
            <Reveal key={p.id} delay={i * 140} style={{ marginTop: p.drop }}>
              <figure
                className="pol"
                style={{ "--rotate": `${p.rotate}deg` }}
              >
                <i className="pol__pin" aria-hidden="true" />
                <div className="pol__photo">
                  {p.image ? (
                    <img src={p.image} alt="" loading="lazy" />
                  ) : (
                    <Placeholder bg={p.bg} fg={p.fg} />
                  )}
                </div>
                <figcaption className="hand pol__caption">
                  {p.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}