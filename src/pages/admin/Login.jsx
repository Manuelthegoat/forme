import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Logo from "../../components/Logo";
import "./admin.css";

export default function Login() {
  const { user, isAdmin, loading, signIn, signOut } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const from = location.state?.from?.pathname ?? "/admin";

  if (!loading && user && isAdmin) {
    return <Navigate to={from} replace />;
  }

  const notAdmin = !loading && user && !isAdmin;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    const { error: err } = await signIn(email.trim(), password);
    if (err) setError("Wrong email or password.");

    setBusy(false);
  };

  return (
    <div className="admin-center">
      <div className="login">
        <Logo size={44} />
        <h1 className="display login__title">admin</h1>

        {notAdmin ? (
          <>
            <p className="login__error" role="alert">
              {user.email} isn't an admin account.
            </p>
            <button type="button" className="btn" onClick={signOut}>
              Sign out
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="login" noValidate>
            <div className="field">
              <label className="mono" htmlFor="admin-email">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="mono" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="login__error mono" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn" disabled={busy || loading}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}