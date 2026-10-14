import { Link } from "react-router-dom";
import useSettings from "../hooks/useSettings";
import { formatPrice, STORE_COUNTRIES } from "../lib/currency";
import "./ShippingReturns.css";



export default function ShippingReturns() {
  const { freeShippingCents, flatShippingCents } = useSettings();

  return (
    <main className="shipping-page wrap">
      <header className="shipping-hero">
        <div className="shipping-hero__meta mono">
          <span>FORME BY PRINCESS</span>
          <span>THE PRACTICALS / 01</span>
        </div>
        <p className="mono shipping-hero__eyebrow">GOOD TO KNOW BEFORE YOU GO</p>
        <h1 className="display shipping-hero__title">shipping<br /><span>&amp; returns.</span></h1>
        <p className="shipping-hero__intro">
          The useful details, all in one place. If something is still unclear,
          <Link to="/contact"> get in touch ↗</Link>
        </p>
      </header>

      <section id="shipping" className="shipping-section" aria-labelledby="shipping-title">
        <div className="shipping-section__heading">
          <p className="mono">01 / DELIVERY</p>
          <h2 id="shipping-title" className="display">shipping.</h2>
        </div>
        <div className="shipping-section__body">
          <p className="shipping-lead">
            Shipping is available to the countries listed below. The available rate
            for your order is shown at checkout before you pay.
          </p>
          <div className="shipping-facts">
            <article className="shipping-fact">
              <span className="mono">STANDARD SHIPPING</span>
              <p>
                {freeShippingCents > 0
                  ? `${formatPrice(flatShippingCents / 100)} standard shipping; free on orders over ${formatPrice(freeShippingCents / 100)}.`
                  : "Free shipping on all orders."}
              </p>
            </article>
            <article className="shipping-fact">
              <span className="mono">DESTINATIONS</span>
              <p>{STORE_COUNTRIES.map((item) => item.name).join(" · ")}</p>
            </article>
            <article className="shipping-fact">
              <span className="mono">DELIVERY COST</span>
              <p>Final shipping and any applicable taxes are calculated at checkout.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="returns" className="shipping-section shipping-section--returns" aria-labelledby="returns-title">
        <div className="shipping-section__heading">
          <p className="mono">02 / FIND YOUR FIT</p>
          <h2 id="returns-title" className="display">returns.</h2>
        </div>
        <div className="shipping-section__body">
          <p className="shipping-lead">A little time to make sure it feels right.</p>
          <div className="shipping-return-note">
            <span className="shipping-return-note__number display">14</span>
            <div>
              <h3 className="mono">DAYS TO REQUEST A RETURN</h3>
              <p>
                Returns are accepted within 14 days. Items must be unworn and have
                their tags attached.
              </p>
            </div>
          </div>
          <p className="shipping-return-help">
            To ask about returning an item, <Link to="/contact">contact us</Link>
            with your order number and we’ll help with the next steps.
          </p>
        </div>
      </section>

      <div className="shipping-bottom mono">
        <span>NEED A HAND?</span>
        <Link to="/contact">Contact FORME <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}
