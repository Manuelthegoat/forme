import Button from "../components/Button";
import Placeholder from "../components/Placeholder";
import "./About.css";

const principles = [
  { number: "01", title: "The fit", text: "Body-conscious shapes with a clean, considered line." },
  { number: "02", title: "The feeling", text: "Pieces that let you take up space and feel like yourself." },
  { number: "03", title: "The movement", text: "An everyday point of view with a little after-hours energy." },
];

export default function About() {
  return (
    <div className="about-page">
      <section className="about-intro wrap">
        <div className="about-intro__meta mono">
          <span>FORME BY PRINCESS</span>
          <span>THE LABEL / 01</span>
        </div>
        <div className="about-intro__grid">
          <div className="about-intro__copy">
            <p className="about-intro__eyebrow mono">A POINT OF VIEW ON GETTING DRESSED</p>
            <h1 className="display about-intro__title">made for<br />the body<br /><span>in motion.</span></h1>
            <div className="about-intro__bottom">
              <p className="about-intro__note hand">feel good in your own form.</p>
              <p className="about-intro__description">
                FORME makes elevated, body-conscious pieces with a minimal edge.
                Y2K and streetwear references meet clean lines made to follow the
                body, never hide it.
              </p>
              <Button to="/shop" variant="chrome">Shop the edit</Button>
            </div>
          </div>
          <figure className="about-intro__image">
            <Placeholder bg="#a99c8e" fg="#ded8cf" />
            <figcaption className="about-intro__image-caption mono">
              <span>FORME / FM26</span>
              <span>01 / 03</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="about-viewpoint">
        <div className="wrap about-viewpoint__inner">
          <p className="mono about-viewpoint__label">THE FORME FIT / OUR POINT OF VIEW</p>
          <h2 className="display about-viewpoint__title">cut close.<br /><span>built to move.</span></h2>
          <p className="about-viewpoint__text">
            Getting dressed should feel like coming into your own. We keep the
            silhouettes confident and the details considered, so the clothes
            support your presence instead of competing with it.
          </p>
          <span className="about-viewpoint__mark hand" aria-hidden="true">forme.</span>
        </div>
      </section>

      <section className="about-principles wrap" aria-labelledby="about-principles-title">
        <div className="about-principles__heading">
          <p className="mono">A FEW THINGS WE BELIEVE</p>
          <h2 id="about-principles-title" className="display">the feeling<br />comes first.</h2>
        </div>
        <div className="about-principles__list">
          {principles.map((item) => (
            <article className="about-principle" key={item.number}>
              <span className="about-principle__number mono">{item.number}</span>
              <div>
                <h3 className="display">{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <span className="about-principle__arrow" aria-hidden="true">+</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
