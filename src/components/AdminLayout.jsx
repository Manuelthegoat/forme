import { Link, NavLink, Outlet } from "react-router-dom";
import Logo from "./Logo";
import useAuth from "../hooks/useAuth";
import "../pages/admin/admin.css";

export default function AdminLayout() {
  const { user, signOut } = useAuth();

  return (
    <div className="admin">
      <header className="admin-bar">
        <Link to="/admin" className="admin-bar__brand" aria-label="Admin home">
          <Logo size={28} />
          <span className="mono">Admin</span>
        </Link>

        <nav className="admin-bar__nav" aria-label="Admin">
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/sales">Sales</NavLink>
          <NavLink to="/admin/settings">Settings</NavLink>
        </nav>

        <div className="admin-bar__right mono">
          <Link to="/">View store</Link>
          <span className="admin-bar__user">{user?.email}</span>
          <button type="button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}