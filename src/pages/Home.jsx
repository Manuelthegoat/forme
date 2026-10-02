import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import SectionHead from "../components/SectionHead";
import ProductGrid from "../components/ProductGrid";
import EditorialSplit from "../components/EditorialSplit";
import PolaroidStrip from "../components/PolaroidStrip";
import RedRoom from "../components/RedRoom";
import CategoryTiles from "../components/CategoryTiles";
import Newsletter from "../components/Newsletter";
import { products } from "../data/products";
import useCart from "../hooks/useCart";

export default function Home() {
    const newIn = products.slice(0, 4);
    const { addItem } = useCart();

    return (
        <>
            <Hero />
            <Marquee />

            <section className="wrap section" id="new">
                <SectionHead
                    title="new in"
                    note="the first edit"
                    action={{ to: "/shop", label: "View all" }}
                />
                <ProductGrid products={newIn} onQuickAdd={(p) => addItem(p)} />
            </section>

            <EditorialSplit />
            <PolaroidStrip />
            <RedRoom />

            <section className="wrap section">
                <SectionHead title="shop by shape" note="tops · bottoms · dresses" />
                <CategoryTiles />
            </section>

            <Newsletter />
        </>
    );
}