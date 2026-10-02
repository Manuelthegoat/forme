import { useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import Preloader from "./components/Preloader";
import ScrollToTop from "./components/ScrollToTop";
import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import useCart from "./hooks/useCart";

const KEY = "forme-preloaded";

export default function App() {
  const { count, openCart } = useCart();

  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem(KEY);
    } catch {
      return true;
    }
  });

  const handleDone = useCallback(() => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* storage unavailable, fine */
    }
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <Preloader onDone={handleDone} />}
      <ScrollToTop />

      <AnnouncementBar />
      <Navbar bagCount={count} onBagClick={openCart} />
      <CartDrawer />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}