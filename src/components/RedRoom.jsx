import Reveal from "./Reveal";
import Button from "./Button";
import "./RedRoom.css";

// video: pass an imported .mp4 (or a URL) to replace the placeholder
export default function RedRoom({ video }) {
  return (
    <section className="red section" id="film">
      <div className="wrap red__inner">
        <Reveal className="red__copy">
          <h2 className="display red__title">
            the red room.
            <br />
            <em className="hand red__em">forme 2k26</em>
          </h2>
          <p className="red__text">
            Our roll-out film: dark, heels, one pole, no faces. Arriving with
            the fm26 drop.
          </p>
          <Button href="#" variant="light">
            Watch the teaser
          </Button>
        </Reveal>

        <div className="red__frame">
          {video ? (
            <video
              src={video}
              autoPlay
              muted
              loop
              playsInline
              aria-label="FORME 2K26 teaser"
            />
          ) : (
            <svg
              viewBox="0 0 300 375"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <rect x="146" y="0" width="8" height="375" fill="#e8e8ee" opacity=".85" />
              <path
                d="M60 300C110 210 150 180 240 250"
                stroke="#fff"
                strokeWidth="26"
                fill="none"
                strokeLinecap="round"
                opacity=".18"
              />
              <g transform="translate(95 60) scale(.37)" fill="#fff" opacity=".28">
                <path d="M120 -10C122 40 112 70 98 105C84 150 104 175 108 215C112 260 70 310 62 410H238C230 310 188 260 192 215C196 175 216 150 202 105C188 70 178 40 180 -10Z" />
              </g>
            </svg>
          )}
          <span className="mono red__rec">REC 00:14</span>
        </div>
      </div>
    </section>
  );
}