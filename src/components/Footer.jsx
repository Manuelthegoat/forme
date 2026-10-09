import { Link } from "react-router-dom";
import "./Footer.css";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "New in", to: "/shop" },
      { label: "Tops", to: "/shop?category=tops" },
      { label: "Bottoms", to: "/shop?category=bottoms" },
      { label: "Dresses", to: "/shop?category=dresses" },
    ],
  },
  {
    title: "Brand",
    links: [
      { label: "About", to: "/about" },
      { label: "Lookbook", to: "/lookbook" },
      { label: "The red room", to: "/lookbook#film" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping", to: "/" },
      { label: "Returns", to: "/" },
      { label: "Contact", to: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__cols">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mono footer__heading">{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Social">
            <h3 className="mono footer__heading">Social</h3>
            <ul>
              <li>
                <a href="#" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noreferrer">
                  TikTok
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer__base mono">
          <span>© {new Date().getFullYear()} Forme</span>
          <span>Forme by Princess</span>
        </div>
      </div>

      <img
        className="footer__word"
        src="/src/assets/logo/forme_wordmark_black.png"
        alt=""
        aria-hidden="true"
      />
    </footer>
  );
}