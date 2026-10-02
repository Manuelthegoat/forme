import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import useScrolled from "../hooks/useScrolled";
import "./Navbar.css";

export default function Navbar({ bagCount = 2, onBagClick }) {
  const scrolled = useScrolled();

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <nav className="nav__side nav__side--left" aria-label="Main">
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/lookbook">Lookbook</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>

      <Link to="/" className="nav__logo" aria-label="FORME home">
        <Logo size={34} />
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