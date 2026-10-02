import "./Marquee.css";

const DEFAULT_ITEMS = [
  "Body-conscious",
  "Sculptural",
  "Faceless",
  "Unapologetic",
];

export default function Marquee({ items = DEFAULT_ITEMS }) {
  // two identical halves so the loop is seamless
  const row = [...items, ...items, ...items, ...items];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track mono">
        {[0, 1].map((half) => (
          <div className="marquee__half" key={half}>
            {row.map((text, i) => (
              <span key={`${half}-${i}`}>
                {text}
                <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}