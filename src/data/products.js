// Swap this file for a real API later. Components only read from here.
// images: [] shows a placeholder. When you have photos, import them
// (e.g. import top1 from "../assets/products/top-1.jpg") and put
// [top1, top1Hover] in the array. First = default, second = hover.

export const products = [
    {
        id: 1,
        slug: "slate-bodysuit",
        name: "Slate bodysuit",
        price: 68,
        category: "bodysuits",
        tag: "New",
        colors: { bg: "#d9d3c9", fg: "#6d6a66" },
        images: [],
    },
    {
        id: 2,
        slug: "zebra-halter-top",
        name: "Zebra halter top",
        price: 54,
        category: "tops",
        tag: null,
        colors: { bg: "#e9e4de", fg: "#a7714f" },
        images: [],
    },
    {
        id: 3,
        slug: "gloss-column-dress",
        name: "Gloss column dress",
        price: 112,
        category: "dresses",
        tag: null,
        colors: { bg: "#c4c7cc", fg: "#16161a" },
        images: [],
    },
    {
        id: 4,
        slug: "ribbed-leg-warmer-set",
        name: "Ribbed leg warmers set",
        price: 42,
       category: "co-ords",
        tag: "Low stock",
        colors: { bg: "#e6d6dc", fg: "#f7f3ee" },
        images: [],
    },
    {
        id: 5,
        slug: "sheer-mesh-skirt",
        name: "Sheer mesh skirt",
        price: 58,
        category: "bottoms",
        tag: null,
        colors: { bg: "#2c2c32", fg: "#4b4b55" },
        images: [],
    },
    {
        id: 6,
        slug: "red-room-slip",
        name: "Red room slip",
        price: 96,
        category: "dresses",
        tag: "New",
        colors: { bg: "#8a2a3a", fg: "#b4485a" },
        images: [],
    },
    {
        id: 7,
        slug: "seamless-brief-set",
        name: "Seamless brief set",
        price: 36,
        category: "bottoms",
        tag: null,
        colors: { bg: "#e5c9ae", fg: "#fff" },
        images: [],
    },
    {
        id: 8,
        slug: "mask-knit-top",
        name: "Mask knit top",
        price: 62,
        category: "tops",
        tag: null,
        colors: { bg: "#a98f7c", fg: "#c9b09b" },
        images: [],
    },
];

export const formatPrice = (n) => `$${n}`;