// 1. Put your photo in src/assets/hero/
// 2. Uncomment the imports and set image / imageMobile below.
//
import heroImg from "../assets/hero/heroimg.jpg";
// import heroMobile from "../assets/hero/hero-mobile.jpg"; // optional portrait crop

export const hero = {
  image: heroImg, // null
  imageMobile: null, // heroMobile (optional, used under 700px wide)
  alt: "FORME fm26",

  // which part of the photo stays visible when it's cropped: "x% y%"
  focus: "50% 30%",

  // "light" = white text (dark photo), "dark" = dark text (light photo)
  tone: "light",

  eyebrow: "fm26 — the first edit",
  title: "made for the body.",
  cta: { label: "Shop the edit", to: "/shop" },

  // placeholder colours, only used while image is null
  bg: "#8a8178",
  fg: "#a39a90",
};