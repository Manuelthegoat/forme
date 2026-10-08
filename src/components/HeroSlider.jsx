import { useCallback, useState } from "react";
import Placeholder from "./Placeholder";
import Button from "./Button";
import { slides } from "../data/slides";
import "./HeroSlider.css";

const SLIDE_MS = 6000;
const total = slides.length;
const pad = (n) => String(n).padStart(2, "0");

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchX, setTouchX] = useState(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % total), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), []);

  const onTouchEnd = (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    setTouchX(null);
  };

  return (
    <section
      className={`slider ${paused ? "slider--paused" : ""}`}
      data-tone={slides[index].tone}
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <article
            key={s.id}
            className={`slide ${active ? "slide--on" : ""}`}
            data-tone={s.tone}
            aria-hidden={!active}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}`}
          >
            <div className="slide__media">
              {s.image ? (
                <img src={s.image} alt="" />
              ) : (
                <Placeholder bg={s.bg} fg={s.fg} />
              )}
            </div>

            <div className="slide__copy">
              <p className="hand slide__eyebrow">{s.eyebrow}</p>
              <h1 className="display slide__title">{s.title}</h1>
              <Button
                to={s.cta.to}
                variant={s.tone === "light" ? "light" : "outline"}
                tabIndex={active ? 0 : -1}
              >
                {s.cta.label}
              </Button>
            </div>
          </article>
        );
      })}

      {/* controls */}
      <div className="slider__controls">
        <div className="slider__dots" role="group" aria-label="Choose slide">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`dot ${i === index ? "dot--on" : ""}`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            >
              <span
                style={{ animationDuration: `${SLIDE_MS}ms` }}
                onAnimationEnd={i === index ? next : undefined}
              />
            </button>
          ))}
        </div>

        <div className="slider__nav mono">
          <span aria-hidden="true">
            {pad(index + 1)} / {pad(total)}
          </span>
          <button type="button" onClick={prev}>
            Prev
          </button>
          <button type="button" onClick={next}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}