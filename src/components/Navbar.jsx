import { Link, NavLink, useLocation } from "react-router-dom";
import logoBlack from "../assets/logo/forme_circle_icon_black.png";
import logoWhite from "../assets/logo/forme_circle_icon_white.png";
import useScrolled from "../hooks/useScrolled";
import { hero } from "../data/hero";
import "./Navbar.css";

export default function Navbar({ bagCount = 0, onBagClick }) {
  const scrolled = useScrolled();
  const { pathname } = useLocation();

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
        <button type="button">Search</button>
        <button type="button" onClick={onBagClick}>
          Bag ({bagCount})
        </button>
      </div>
    </header>
  );
}