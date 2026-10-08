import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Preloader from "./Preloader";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";
import Footer from "./Footer";
import useCart from "../hooks/useCart";

const KEY = "forme-preloaded";

export default function StorefrontLayout() {
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

      <AnnouncementBar />
      <Navbar bagCount={count} onBagClick={openCart} />
      <CartDrawer />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}