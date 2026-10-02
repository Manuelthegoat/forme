import { useEffect, useState } from "react";
import "./Preloader.css";

const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const MIN_MS = reduced ? 500 : 2200; // minimum time the animation runs
const EXIT_MS = 900; // matches the CSS slide-up

export default function Preloader({ onDone }) {
  const [progress, setProgress] = useState(0); // 0 -> 1
  const [leaving, setLeaving] = useState(false);

  // lock scroll while the preloader is up
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // drive the fill
  useEffect(() => {
    let raf;
    let loaded = document.readyState === "complete";
    let fontsReady = false;
    const start = performance.now();

    const onLoad = () => (loaded = true);
    if (!loaded) window.addEventListener("load", onLoad);

    document.fonts?.ready.then(() => (fontsReady = true));
    if (!document.fonts) fontsReady = true;

    const tick = (now) => {
      const t = Math.min((now - start) / MIN_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out
      const ready = loaded && fontsReady;
      // hold at 92% until the page is actually ready
      const value = ready ? eased : Math.min(eased, 0.92);

      setProgress(value);

      if (value >= 1) {
        setLeaving(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  // after the slide-up, tell the app we're done
  useEffect(() => {
    if (!leaving) return;
    const id = setTimeout(onDone, EXIT_MS);
    return () => clearTimeout(id);
  }, [leaving, onDone]);

  const percent = Math.round(progress * 100);

  return (
    <div
      className={`preloader ${leaving ? "preloader--leaving" : ""}`}
      role="status"
      aria-label="Loading"
    >
      <div className="preloader__logo">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            {/* the F shape, used as a mask for the fill */}
            <mask id="pl-mask">
              <g
                fill="none"
                stroke="#fff"
                strokeWidth="17"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M30 88V42Q30 24 48 22L84 14" />
                <path d="M33 55L76 48" />
              </g>
            </mask>

            {/* red leading edge that settles into ink */}
            <linearGradient id="pl-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c4121f" />
              <stop offset="0.06" stopColor="#16161a" />
              <stop offset="1" stopColor="#16161a" />
            </linearGradient>
          </defs>

          {/* silver base F */}
          <g
            fill="none"
            stroke="#cfd2d6"
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M30 88V42Q30 24 48 22L84 14" />
            <path d="M33 55L76 48" />
          </g>

          {/* rising fill, clipped to the F */}
          <g mask="url(#pl-mask)">
            <rect
              x="0"
              y={100 - progress * 100}
              width="100"
              height="100"
              fill="url(#pl-fill)"
            />
          </g>
        </svg>
      </div>

      <span className="mono preloader__count">
        {String(percent).padStart(3, "0")}
      </span>
    </div>
  );
}