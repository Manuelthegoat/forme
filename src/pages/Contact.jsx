import { useState } from "react";
import Button from "../components/Button";
import "./Contact.css";

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL;

export default function Contact() {
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!CONTACT_EMAIL) {
      setStatus("Our contact address is not set up yet. Please check back soon.");
      return;
    }

    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`FORME enquiry — ${data.get("topic")}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="contact-page wrap">
      <header className="contact-hero">
        <div className="contact-hero__meta mono">
          <span>FORME BY PRINCESS</span>
          <span>HERE TO HELP / 01</span>
        </div>
        <p className="mono contact-hero__eyebrow">QUESTIONS, IDEAS, OR JUST SAYING HI</p>
        <h1 className="display contact-hero__title">let’s<br /><span>talk.</span></h1>
        <p className="contact-hero__intro">
          Need a hand with an order or have a question about a piece? Send us a note
          and we’ll help you find your way.
        </p>
      </header>

      <section className="contact-layout" aria-label="Contact FORME">
        <aside className="contact-aside">
          <p className="mono contact-aside__label">THE DETAILS</p>
          <div className="contact-aside__item">
            <span className="mono">ORDER SUPPORT</span>
            <p>For an order question, include your order number so we can help faster.</p>
          </div>
          <div className="contact-aside__item">
            <span className="mono">FIT &amp; PRODUCT</span>
            <p>Tell us what you’re looking at and what you’d like to know.</p>
          </div>
          <div className="contact-aside__note hand">we’re listening.</div>
          <Button to="/shop" variant="outline">Explore the shop <span aria-hidden="true">↗</span></Button>
        </aside>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            <span className="mono">YOUR NAME</span>
            <input name="name" type="text" autoComplete="name" required placeholder="Name" />
          </label>
          <label>
            <span className="mono">EMAIL ADDRESS</span>
            <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          </label>
          <label>
            <span className="mono">WHAT CAN WE HELP WITH?</span>
            <select name="topic" defaultValue="Order support">
              <option>Order support</option>
              <option>Product &amp; fit</option>
              <option>Something else</option>
            </select>
          </label>
          <label>
            <span className="mono">YOUR MESSAGE</span>
            <textarea name="message" rows="5" required placeholder="Write your message here…" />
          </label>
          <div className="contact-form__submit">
            <Button type="submit">Prepare message <span aria-hidden="true">↗</span></Button>
            {status && <p className="contact-form__status" role="status">{status}</p>}
          </div>
        </form>
      </section>
    </main>
  );
}
