import Placeholder from "./Placeholder";
import Button from "./Button";
import { hero } from "../data/hero";
import "./HeroImage.css";

export default function HeroImage() {
  const { image, imageMobile, alt, focus, tone, eyebrow, title, cta, bg, fg } =
    hero;

  return (
    <section className="hero-img" data-tone={tone} style={{ "--focus": focus }}>
      <div className="hero-img__media">
        {image ? (
          <picture>
            {imageMobile && (
              <source media="(max-width: 700px)" srcSet={imageMobile} />
            )}
            <img src={image} alt={alt} fetchPriority="high" decoding="async" />
          </picture>
        ) : (
          <Placeholder bg={bg} fg={fg} />
        )}
      </div>

      <div className="hero-img__copy">
        <p className="hand hero-img__eyebrow">{eyebrow}</p>
        <h1 className="display hero-img__title">{title}</h1>
        <Button to={cta.to} variant={tone === "light" ? "light" : "outline"}>
          {cta.label}
        </Button>
      </div>
    </section>
  );
}