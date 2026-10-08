// Swap this file for a real API later. Components only read from here.
// images: [] shows a placeholder. When you have photos, import them
// (e.g. import top1 from "../assets/products/top-1.jpg") and put
// [top1, top1Hover] in the array. First = default, second = hover.
import bodysuit from "../assets/products/bodysuit.jpg";
import dress from "../assets/products/dress.jpg";
import coord from "../assets/products/coord.jpg";
import tops from "../assets/products/tops.jpg";

export const products = [
    {
        id: 1,
        slug: "slate-bodysuit",
        name: "Slate bodysuit",
        price: 68,
        category: "bodysuits",
        tag: "New",
        colors: { bg: "#d9d3c9", fg: "#6d6a66" },
        images: [bodysuit],
    },
    {
        id: 3,
        slug: "gloss-column-dress",
        name: "Gloss column dress",
        price: 112,
        category: "dresses",
        tag: null,
        colors: { bg: "#c4c7cc", fg: "#16161a" },
        images: [dress],
    },
    {
        id: 4,
        slug: "ribbed-leg-warmer-set",
        name: "Ribbed leg warmers set",
        price: 42,
       category: "co-ords",
        tag: "Low stock",
        colors: { bg: "#e6d6dc", fg: "#f7f3ee" },
        images: [coord],
    },
 
    {
        id: 8,
        slug: "mask-knit-top",
        name: "Mask knit top",
        price: 62,
        category: "tops",
        tag: null,
        colors: { bg: "#a98f7c", fg: "#c9b09b" },
        images: [tops],
    },
];

export const formatPrice = (n) => `$${n}`;