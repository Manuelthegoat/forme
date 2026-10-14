import { Link, NavLink, useLocation } from "react-router-dom";
import logoBlack from "../assets/logo/forme_circle_icon_black.png";
import logoWhite from "../assets/logo/forme_circle_icon_white.png";
import useScrolled from "../hooks/useScrolled";
import useSettings from "../hooks/useSettings";
import { STORE_COUNTRIES } from "../lib/currency";
import { hero } from "../data/hero";
import "./Navbar.css";

export default function Navbar({ bagCount = 0, onBagClick }) {
  const scrolled = useScrolled();
  const { pathname } = useLocation();
  const { country, pendingCountry, selectCountry, currencyError } = useSettings();

  // transparent over the hero on the home page, until you scroll
  const over = pathname === "/" && !scrolled;

  const cls = [
    "nav",
    scrolled && "nav--scrolled",
    over && "nav--over",
    over && hero.tone === "light" && "nav--light",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={cls}>
      <nav className="nav__side nav__side--left" aria-label="Main">
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/lookbook">Lookbook</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>

      <Link to="/" className="nav__logo" aria-label="FORME home">
        <img
          src={over && hero.tone === "light" ? logoWhite : logoBlack}
          width="34"
          height="34"
          alt=""
          draggable="false"
        />
      </Link>

      <div className="nav__side nav__side--right">
        <label className="nav__country">
          <span className="visually-hidden">Shipping country and currency</span>
          <select
            aria-label="Shipping country and currency"
            value={pendingCountry ?? country}
            disabled={Boolean(pendingCountry)}
            onChange={(event) => selectCountry(event.target.value)}
            title={currencyError || "Choose your country and currency"}
          >
            {STORE_COUNTRIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} · {item.currency}
              </option>
            ))}
          </select>
        </label>
        {currencyError && <span className="visually-hidden" role="status">{currencyError}</span>}
        <button type="button">Search</button>
        <button type="button" onClick={onBagClick}>
          Bag ({bagCount})
        </button>
      </div>
    </header>
  );
}