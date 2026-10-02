import { useState } from "react";
import Reveal from "./Reveal";
import "./Newsletter.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | done | error

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = /^\S+@\S+\.\S+$/.test(email.trim());
    if (!valid) {
      setStatus("error");
      return;
    }
    // TODO: send to your email provider (Mailchimp, Klaviyo, etc.)
    console.log("subscribe:", email);
    setStatus("done");
    setEmail("");
  };

  return (
    <section className="news section">
      <Reveal className="wrap news__inner">
        <h2 className="display news__title">join the list</h2>
        <p className="hand news__note">first access to every drop</p>

        {status === "done" ? (
          <p className="mono news__done" role="status">
            You're on the list.
          </p>
        ) : (
          <form className="news__form" onSubmit={handleSubmit} noValidate>
            <label className="visually-hidden" htmlFor="news-email">
              Email address
            </label>
            <input
              id="news-email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              aria-invalid={status === "error"}
              autoComplete="email"
            />
            <button type="submit" className="mono">
              Join
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mono news__error" role="alert">
            Enter a valid email address.
          </p>
        )}
      </Reveal>
    </section>
  );
}